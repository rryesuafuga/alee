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

export default function SensorDashboard() {
  const chartRef = useRef<SVGSVGElement>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [activeMetric, setActiveMetric] = useState("moisture");
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize data
  useEffect(() => {
    const initial: SensorReading[] = [];
    for (let i = 0; i < 30; i++) {
      initial.push(generateReading(initial[initial.length - 1]));
    }
    setReadings(initial);
  }, []);

  // Live update
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

    const y = d3
      .scaleLinear()
      .domain([yMin - yPadding, yMax + yPadding])
      .range([innerH, 0]);

    const range = OPTIMAL_RANGES[activeMetric];

    // Optimal range band
    if (range) {
      g.append("rect")
        .attr("x", 0)
        .attr("width", innerW)
        .attr("y", y(Math.min(range.high, yMax + yPadding)))
        .attr("height", Math.abs(y(range.high) - y(range.low)))
        .attr("fill", "#009E73")
        .attr("opacity", 0.08)
        .attr("rx", 4);

      // Optimal range labels
      g.append("text")
        .attr("x", innerW - 4)
        .attr("y", y(range.high) - 4)
        .attr("text-anchor", "end")
        .attr("fill", "#009E73")
        .attr("font-size", "9px")
        .attr("font-weight", "600")
        .text("Optimal");
    }

    // Grid lines
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

    // Line
    const colorIdx = Object.keys(OPTIMAL_RANGES).indexOf(activeMetric);
    const color = COLORS[colorIdx] || COLORS[0];

    const line = d3
      .line<SensorReading>()
      .x((d) => x(d.timestamp))
      .y((d) => y(d[key] as number))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Gradient area
    const area = d3
      .area<SensorReading>()
      .x((d) => x(d.timestamp))
      .y0(innerH)
      .y1((d) => y(d[key] as number))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", 1);
    gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.2);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.02);

    g.append("path").datum(readings).attr("d", area).attr("fill", "url(#area-gradient)");

    const path = g
      .append("path")
      .datum(readings)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5)
      .attr("stroke-linecap", "round");

    // Animate line drawing
    const totalLength = (path.node() as SVGPathElement)?.getTotalLength() ?? 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(800)
      .ease(d3.easeQuadOut)
      .attr("stroke-dashoffset", 0);

    // Latest value dot
    const latest = readings[readings.length - 1];
    g.append("circle")
      .attr("cx", x(latest.timestamp))
      .attr("cy", y(latest[key] as number))
      .attr("r", 5)
      .attr("fill", color)
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerH / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("fill", "#718096")
      .attr("font-size", "11px")
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
            Live Simulation
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            IoT Sensor <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Real-time soil and environmental monitoring. Toggle live mode to watch
            sensor data stream in as it would from LoRaWAN-connected field sensors.
          </p>
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
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: statusColors[status] }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {range.label}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {value.toFixed(key === "ph" ? 1 : 0)}
                    <span className="text-xs text-gray-400 font-normal">
                      {range.unit}
                    </span>
                  </div>
                  <div
                    className="text-[10px] font-semibold mt-1"
                    style={{ color: statusColors[status] }}
                  >
                    {status === "optimal"
                      ? "Optimal"
                      : status === "warning"
                      ? "Warning"
                      : "Alert"}
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
                Optimal range:{" "}
                {OPTIMAL_RANGES[activeMetric]?.low}–
                {OPTIMAL_RANGES[activeMetric]?.high}
                {OPTIMAL_RANGES[activeMetric]?.unit}
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
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive ? "bg-red-500 animate-pulse" : "bg-[var(--color-primary)]"
                }`}
              />
              {isLive ? "Stop" : "Go Live"}
            </button>
          </div>
          <svg ref={chartRef} className="w-full" />
        </div>

        {/* Accessibility note */}
        <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs text-gray-500">
            <strong>Accessibility:</strong> All visualizations use the Wong
            (2011) color-blind safe palette. Status indicators combine color with
            text labels. Optimal ranges are shown with shaded bands in charts.
            Each metric uses a distinct label alongside its color.
          </p>
        </div>
      </div>
    </section>
  );
}
