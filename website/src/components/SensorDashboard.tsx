"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

interface SensorReading {
  timestamp: number;
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
}

const OPTIMAL_RANGES: Record<string, { low: number; high: number; unit: string; label: string }> = {
  moisture: { low: 40, high: 70, unit: "%", label: "Soil Moisture" },
  ph: { low: 5.5, high: 7.0, unit: "", label: "Soil pH" },
  nitrogen: { low: 100, high: 200, unit: " mg/kg", label: "Nitrogen (N)" },
  phosphorus: { low: 30, high: 80, unit: " mg/kg", label: "Phosphorus (P)" },
  potassium: { low: 150, high: 250, unit: " mg/kg", label: "Potassium (K)" },
  temperature: { low: 20, high: 30, unit: "°C", label: "Temperature" },
};

const COLORS = ["#0072B2", "#E69F00", "#009E73", "#CC79A7", "#D55E00", "#56B4E9"];

function generateReading(prev?: SensorReading): SensorReading {
  const now = prev ? prev.timestamp + 1 : 0;
  const drift = (base: number, range: number) =>
    prev
      ? Math.max(0, Math.min(range, base + (Math.random() - 0.5) * range * 0.08))
      : base;

  return {
    timestamp: now,
    moisture: drift(prev?.moisture ?? 48, 100),
    ph: drift(prev?.ph ?? 6.3, 9),
    nitrogen: drift(prev?.nitrogen ?? 140, 350),
    phosphorus: drift(prev?.phosphorus ?? 50, 120),
    potassium: drift(prev?.potassium ?? 190, 350),
    temperature: drift(prev?.temperature ?? 27, 45),
  };
}

function getStatus(key: string, value: number): "optimal" | "warning" | "alert" {
  const range = OPTIMAL_RANGES[key];
  if (!range) return "optimal";
  if (value >= range.low && value <= range.high) return "optimal";
  const marginLow = range.low * 0.85;
  const marginHigh = range.high * 1.15;
  if (value >= marginLow && value <= marginHigh) return "warning";
  return "alert";
}

const statusColors = {
  optimal: "#009E73",
  warning: "#E69F00",
  alert: "#D55E00",
};

const sensorHardware = [
  {
    name: "Capacitive Soil Moisture Sensor v2.0",
    measures: "Soil Moisture",
    how: "A capacitive probe is inserted 15–30cm into the soil near the plant roots. It measures the dielectric constant of the soil — wetter soil conducts electricity differently than dry soil. Readings are taken every 15 minutes automatically.",
    specs: "Range: 0–100%, Accuracy: ±3%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v6" /><path d="M12 22v-6" /><circle cx="12" cy="12" r="4" />
        <path d="M6 12H2" /><path d="M22 12h-4" />
      </svg>
    ),
    color: "#0072B2",
  },
  {
    name: "SEN0161-V2 pH Sensor",
    measures: "Soil pH",
    how: "A pH electrode is placed in a soil-water mixture or directly into moist soil. It measures the concentration of hydrogen ions to determine if soil is acidic or alkaline. Plantain/gonja grows best in slightly acidic soil (pH 5.5–7.0).",
    specs: "Range: 3.5–9.0 pH, Accuracy: ±0.1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 2v7.31" /><path d="M14 9.3V1.99" />
        <path d="M8.5 2h7" /><rect x="7" y="9" width="10" height="13" rx="5" />
      </svg>
    ),
    color: "#E69F00",
  },
  {
    name: "RS485 NPK Sensor",
    measures: "Nitrogen, Phosphorus, Potassium",
    how: "Three metal electrodes are inserted 10–20cm into the soil. They send small electrical signals and measure soil conductivity for each nutrient. The device tells you exactly which nutrients your soil lacks so you know which fertiliser to apply.",
    specs: "N/P/K: 0–1999 mg/kg, Accuracy: ±2%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v18" /><path d="M8 7l4-4 4 4" />
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 15h2" /><path d="M11 15h2" /><path d="M15 15h2" />
      </svg>
    ),
    color: "#009E73",
  },
  {
    name: "ESP32-S3 + LoRa SX1276",
    measures: "Data Transmission",
    how: "All sensors connect to a small microcontroller (ESP32) powered by a solar panel and battery. This device wirelessly transmits readings using LoRaWAN radio — which can reach up to 10km — to a gateway that sends data to the cloud via cellular network.",
    specs: "Range: up to 10km, Battery: 3–6 months, Solar-charged",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" />
      </svg>
    ),
    color: "#CC79A7",
  },
];

export default function SensorDashboard() {
  const chartRef = useRef<SVGSVGElement>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [activeMetric, setActiveMetric] = useState("moisture");
  const [isLive, setIsLive] = useState(false);
  const [showHardware, setShowHardware] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const initial: SensorReading[] = [];
    for (let i = 0; i < 30; i++) {
      initial.push(generateReading(initial[initial.length - 1]));
    }
    setReadings(initial);
  }, []);

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(() => {
        setReadings((prev) => {
          const next = [...prev, generateReading(prev[prev.length - 1])];
          return next.slice(-60);
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive]);

  // D3 line chart
  useEffect(() => {
    if (!chartRef.current || readings.length < 2) return;
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 55 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(readings, (d) => d.timestamp) as [number, number])
      .range([0, innerW]);

    const key = activeMetric as keyof SensorReading;
    const values = readings.map((r) => r[key] as number);
    const yMin = d3.min(values) as number;
    const yMax = d3.max(values) as number;
    const yPadding = (yMax - yMin) * 0.2 || 5;

    const y = d3.scaleLinear().domain([yMin - yPadding, yMax + yPadding]).range([innerH, 0]);

    const range = OPTIMAL_RANGES[activeMetric];

    if (range) {
      g.append("rect")
        .attr("x", 0).attr("width", innerW)
        .attr("y", y(Math.min(range.high, yMax + yPadding)))
        .attr("height", Math.abs(y(range.high) - y(range.low)))
        .attr("fill", "#009E73").attr("opacity", 0.08).attr("rx", 4);

      g.append("text")
        .attr("x", innerW - 4).attr("y", y(range.high) - 4)
        .attr("text-anchor", "end").attr("fill", "#009E73")
        .attr("font-size", "9px").attr("font-weight", "600").text("Optimal");
    }

    const yAxis = d3.axisLeft(y).ticks(5).tickSize(-innerW);
    const yAxisG = g.append("g").call(yAxis);
    yAxisG.selectAll("line").attr("stroke", "#E2E8F0").attr("stroke-dasharray", "3,3");
    yAxisG.selectAll("text").attr("fill", "#718096").attr("font-size", "10px");
    yAxisG.select(".domain").remove();

    const xAxis = d3.axisBottom(x).ticks(6).tickFormat((d) => `${d}s`);
    const xAxisG = g.append("g").attr("transform", `translate(0,${innerH})`).call(xAxis);
    xAxisG.selectAll("text").attr("fill", "#718096").attr("font-size", "10px");
    xAxisG.selectAll("line").attr("stroke", "#E2E8F0");
    xAxisG.select(".domain").attr("stroke", "#E2E8F0");

    const colorIdx = Object.keys(OPTIMAL_RANGES).indexOf(activeMetric);
    const color = COLORS[colorIdx] || COLORS[0];

    const line = d3.line<SensorReading>()
      .x((d) => x(d.timestamp))
      .y((d) => y(d[key] as number))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const area = d3.area<SensorReading>()
      .x((d) => x(d.timestamp)).y0(innerH)
      .y1((d) => y(d[key] as number))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "area-gradient").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 1);
    gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.2);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.02);

    g.append("path").datum(readings).attr("d", area).attr("fill", "url(#area-gradient)");

    const path = g.append("path").datum(readings).attr("d", line)
      .attr("fill", "none").attr("stroke", color).attr("stroke-width", 2.5).attr("stroke-linecap", "round");

    const totalLength = (path.node() as SVGPathElement)?.getTotalLength() ?? 0;
    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition().duration(800).ease(d3.easeQuadOut).attr("stroke-dashoffset", 0);

    const latest = readings[readings.length - 1];
    g.append("circle").attr("cx", x(latest.timestamp)).attr("cy", y(latest[key] as number))
      .attr("r", 5).attr("fill", color).attr("stroke", "white").attr("stroke-width", 2);

    g.append("text").attr("transform", "rotate(-90)")
      .attr("x", -innerH / 2).attr("y", -40).attr("text-anchor", "middle")
      .attr("fill", "#718096").attr("font-size", "11px")
      .text(range ? `${range.label} (${range.unit.trim() || "pH"})` : activeMetric);
  }, [readings, activeMetric]);

  const latest = readings[readings.length - 1];
  const toggleLive = useCallback(() => setIsLive((prev) => !prev), []);

  return (
    <section id="dashboard" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(0, 114, 178, 0.08)", color: "#0072B2" }}
          >
            Smart Farm Monitoring
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            IoT Sensor <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Physical sensors are inserted directly into your farm soil to continuously measure
            moisture, pH, and nutrient levels. Data streams wirelessly to your phone via our
            LoRaWAN network.
          </p>
        </div>

        {/* How It Works — Addresses Paul's feedback about HOW soil is measured */}
        <div className="mb-12">
          <button
            onClick={() => setShowHardware(!showHardware)}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0072B2]/10 text-[#0072B2] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v4" /><path d="M12 19v4" />
                  <path d="M4.22 4.22l2.83 2.83" /><path d="M16.95 16.95l2.83 2.83" />
                  <path d="M1 12h4" /><path d="M19 12h4" />
                  <path d="M4.22 19.78l2.83-2.83" /><path d="M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">How Are Soil Measurements Taken?</div>
                <div className="text-sm text-gray-500">
                  {showHardware ? "Click to collapse" : "Learn about the physical sensors and how they work in the field"}
                </div>
              </div>
            </div>
            <svg
              width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#718096" strokeWidth="2"
              className={`transition-transform ${showHardware ? "rotate-180" : ""}`}
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </button>

          {showHardware && (
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {sensorHardware.map((sensor) => (
                <div
                  key={sensor.name}
                  className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${sensor.color}15`, color: sensor.color }}
                    >
                      {sensor.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{sensor.name}</div>
                      <div className="text-xs text-gray-400">Measures: {sensor.measures}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{sensor.how}</p>
                  <div className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-md">
                    {sensor.specs}
                  </div>
                </div>
              ))}

              {/* Data flow diagram */}
              <div className="md:col-span-2 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-100">
                <h4 className="font-bold text-gray-800 text-sm mb-4">How Data Flows from Soil to Your Phone</h4>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {[
                    { label: "Sensor Probes", sub: "In soil 15-30cm deep", color: "#0072B2" },
                    { label: "ESP32 Controller", sub: "Solar-powered box", color: "#E69F00" },
                    { label: "LoRaWAN Radio", sub: "Up to 10km range", color: "#009E73" },
                    { label: "Gateway", sub: "Cellular to cloud", color: "#CC79A7" },
                    { label: "Google Cloud", sub: "Processing & alerts", color: "#D55E00" },
                    { label: "Your Phone / SMS", sub: "Real-time dashboard", color: "#56B4E9" },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-center gap-3">
                      <div className="text-center">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-1 text-white font-bold text-sm"
                          style={{ background: step.color }}
                        >
                          {i + 1}
                        </div>
                        <div className="text-xs font-semibold text-gray-700">{step.label}</div>
                        <div className="text-[10px] text-gray-400">{step.sub}</div>
                      </div>
                      {i < 5 && (
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="text-gray-300 hidden md:block">
                          <path d="M0 6h20M16 1l5 5-5 5" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-white border border-gray-100">
                  <p className="text-xs text-gray-500">
                    <strong>Cost per sensor node:</strong> Approximately UGX 205,000 (~$55 USD) including
                    moisture, pH, and NPK sensors, microcontroller, LoRa radio, solar panel, battery, and
                    weatherproof enclosure. One node covers 0.5–1 acre. Readings are taken every 15 minutes
                    and transmitted wirelessly — no cables or internet connection needed at the farm.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metric selector cards */}
        {latest && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {Object.entries(OPTIMAL_RANGES).map(([key, range], i) => {
              const value = latest[key as keyof SensorReading] as number;
              const status = getStatus(key, value);
              const isActive = activeMetric === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveMetric(key)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    isActive
                      ? "ring-2 shadow-md bg-white"
                      : "bg-gray-50 hover:bg-white hover:shadow-sm"
                  }`}
                  style={isActive ? { outlineColor: COLORS[i], outlineWidth: "2px", outlineStyle: "solid", outlineOffset: "-2px", borderRadius: "0.75rem" } : {}}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColors[status] }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {range.label}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {value.toFixed(key === "ph" ? 1 : 0)}
                    <span className="text-xs text-gray-400 font-normal">{range.unit}</span>
                  </div>
                  <div className="text-[10px] font-semibold mt-1" style={{ color: statusColors[status] }}>
                    {status === "optimal" ? "Optimal" : status === "warning" ? "Warning" : "Alert"}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {OPTIMAL_RANGES[activeMetric]?.label ?? activeMetric}
              </h3>
              <p className="text-xs text-gray-400">
                Optimal range: {OPTIMAL_RANGES[activeMetric]?.low}–{OPTIMAL_RANGES[activeMetric]?.high}{OPTIMAL_RANGES[activeMetric]?.unit}
              </p>
            </div>
            <button
              onClick={toggleLive}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLive
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-[var(--color-primary)]"}`} />
              {isLive ? "Stop" : "Go Live"}
            </button>
          </div>
          <svg ref={chartRef} className="w-full" />
        </div>

        {/* What the readings mean — advisory */}
        {latest && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
              <h4 className="font-bold text-gray-800 text-sm mb-3">What Do These Readings Mean?</h4>
              <div className="space-y-3 text-xs text-gray-600">
                {(() => {
                  const moistureStatus = getStatus("moisture", latest.moisture);
                  const phStatus = getStatus("ph", latest.ph);
                  const advisories = [];
                  if (moistureStatus === "alert") {
                    advisories.push(
                      latest.moisture < 30
                        ? `Soil moisture is critically low (${latest.moisture.toFixed(0)}%). Water your plants immediately — plantains need 40–70% moisture.`
                        : `Soil moisture is too high (${latest.moisture.toFixed(0)}%). Check drainage to prevent root rot.`
                    );
                  } else if (moistureStatus === "warning") {
                    advisories.push(`Soil moisture (${latest.moisture.toFixed(0)}%) is approaching suboptimal levels. Monitor closely.`);
                  } else {
                    advisories.push(`Soil moisture (${latest.moisture.toFixed(0)}%) is in the optimal range. No action needed.`);
                  }
                  if (phStatus !== "optimal") {
                    advisories.push(
                      latest.ph < 5.5
                        ? `Soil pH is too acidic (${latest.ph.toFixed(1)}). Apply agricultural lime to raise pH.`
                        : `Soil pH is too alkaline (${latest.ph.toFixed(1)}). Add organic matter or sulphur to lower pH.`
                    );
                  }
                  return advisories.map((a, i) => <p key={i}>{a}</p>);
                })()}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
              <h4 className="font-bold text-gray-800 text-sm mb-3">SMS Advisory Example</h4>
              <div className="bg-white rounded-lg p-4 border border-gray-200 font-mono text-xs text-gray-700">
                <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">Incoming SMS from Alee</div>
                {latest.moisture < 40
                  ? `[Alee] Water your south plot today. Soil moisture is ${latest.moisture.toFixed(0)}%. Next rain expected in 3 days. Apply 15L per plant.`
                  : `[Alee] Farm looking good! Moisture ${latest.moisture.toFixed(0)}%, pH ${latest.ph.toFixed(1)}. Next check: apply ${latest.potassium < 150 ? "2kg muriate of potash per plant" : "no fertiliser needed"}.`}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Farmers without smartphones receive personalised advisories via SMS automatically.
              </p>
            </div>
          </div>
        )}

        {/* Accessibility note */}
        <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs text-gray-500">
            <strong>Accessibility:</strong> All visualizations use the Wong (2011) color-blind safe palette.
            Status indicators combine colour with text labels. Optimal ranges are shown with shaded bands in charts.
          </p>
        </div>
      </div>
    </section>
  );
}
