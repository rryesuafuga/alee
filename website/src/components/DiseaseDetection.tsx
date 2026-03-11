"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

const diseases = [
  { id: 0, name: "Healthy", confidence: 0.05, color: "#009E73", symbol: "circle" },
  { id: 1, name: "Black Sigatoka", confidence: 0.87, color: "#E69F00", symbol: "diamond" },
  { id: 2, name: "Banana Bacterial Wilt", confidence: 0.03, color: "#D55E00", symbol: "cross" },
  { id: 3, name: "Fusarium Wilt", confidence: 0.02, color: "#CC79A7", symbol: "square" },
  { id: 4, name: "Bunchy Top Virus", confidence: 0.015, color: "#0072B2", symbol: "triangle" },
  { id: 5, name: "Weevil Damage", confidence: 0.01, color: "#56B4E9", symbol: "star" },
  { id: 6, name: "Nutrient Deficiency", confidence: 0.005, color: "#F0E442", symbol: "wye" },
];

const stages = [
  { name: "Capture", icon: "camera", desc: "Photo captured" },
  { name: "Preprocess", icon: "resize", desc: "Resize to 224x224 RGB" },
  { name: "Inference", icon: "brain", desc: "TFLite model inference" },
  { name: "Classify", icon: "chart", desc: "Softmax probabilities" },
  { name: "Result", icon: "check", desc: "Disease identified" },
];

export default function DiseaseDetection() {
  const chartRef = useRef<SVGSVGElement>(null);
  const [activeStage, setActiveStage] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDiseases, setCurrentDiseases] = useState(diseases);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runSimulation = useCallback(() => {
    // Clear any existing timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setIsRunning(true);
    setActiveStage(-1);

    // Randomize disease confidences
    const primary = Math.floor(Math.random() * diseases.length);
    const newDiseases = diseases.map((d, i) => {
      if (i === primary) return { ...d, confidence: 0.75 + Math.random() * 0.2 };
      return { ...d, confidence: Math.random() * 0.08 };
    });
    // Normalize
    const total = newDiseases.reduce((s, d) => s + d.confidence, 0);
    const normalized = newDiseases.map((d) => ({
      ...d,
      confidence: d.confidence / total,
    }));
    normalized.sort((a, b) => b.confidence - a.confidence);

    stages.forEach((_, i) => {
      const tid = setTimeout(() => {
        setActiveStage(i);
        if (i === 3) setCurrentDiseases(normalized);
        if (i === stages.length - 1) {
          const endTid = setTimeout(() => setIsRunning(false), 800);
          timeoutRefs.current.push(endTid);
        }
      }, (i + 1) * 600);
      timeoutRefs.current.push(tid);
    });
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  // D3 bar chart
  useEffect(() => {
    if (!chartRef.current) return;
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 260;
    const margin = { top: 10, right: 60, bottom: 10, left: 140 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const sorted = [...currentDiseases].sort(
      (a, b) => b.confidence - a.confidence
    );

    const y = d3
      .scaleBand()
      .domain(sorted.map((d) => d.name))
      .range([0, innerH])
      .padding(0.35);

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerW]);

    // Labels
    g.selectAll(".label")
      .data(sorted)
      .join("text")
      .attr("class", "label")
      .attr("x", -8)
      .attr("y", (d) => (y(d.name) ?? 0) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#4A5568")
      .attr("font-size", "11px")
      .attr("font-weight", (d) => (d.confidence > 0.5 ? "bold" : "normal"))
      .text((d) => d.name);

    // Pattern definitions for accessibility
    const defs = svg.append("defs");
    sorted.forEach((d, i) => {
      const pattern = defs
        .append("pattern")
        .attr("id", `pattern-${i}`)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 6)
        .attr("height", 6);
      pattern
        .append("rect")
        .attr("width", 6)
        .attr("height", 6)
        .attr("fill", d.color);
      if (i % 2 === 1) {
        pattern
          .append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 6)
          .attr("y2", 6)
          .attr("stroke", "rgba(0,0,0,0.15)")
          .attr("stroke-width", 1);
      }
      if (i % 3 === 2) {
        pattern
          .append("circle")
          .attr("cx", 3)
          .attr("cy", 3)
          .attr("r", 1)
          .attr("fill", "rgba(0,0,0,0.15)");
      }
    });

    // Bars with animation
    g.selectAll(".bar")
      .data(sorted)
      .join("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.name) ?? 0)
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("fill", (d) => d.color)
      .attr("x", 0)
      .attr("width", 0)
      .transition()
      .duration(600)
      .delay((_, i) => i * 80)
      .attr("width", (d) => x(d.confidence));

    // Percentage labels
    g.selectAll(".pct")
      .data(sorted)
      .join("text")
      .attr("class", "pct")
      .attr("y", (d) => (y(d.name) ?? 0) + y.bandwidth() / 2)
      .attr("dominant-baseline", "middle")
      .attr("fill", "#4A5568")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("x", (d) => x(d.confidence) + 6)
      .attr("opacity", 0)
      .transition()
      .duration(400)
      .delay((_, i) => i * 80 + 400)
      .attr("opacity", 1)
      .text((d) => `${(d.confidence * 100).toFixed(1)}%`);
  }, [currentDiseases]);

  const topDisease = [...currentDiseases].sort(
    (a, b) => b.confidence - a.confidence
  )[0];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(0, 158, 115, 0.08)",
              color: "#009E73",
            }}
          >
            Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Disease Detection{" "}
            <span className="gradient-text">Simulation</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            See how our on-device AI pipeline processes leaf images in real-time.
            Click &ldquo;Run Detection&rdquo; to simulate the full pipeline.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Pipeline visualization */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Detection Pipeline
            </h3>

            {/* Stages */}
            <div className="space-y-3 mb-8">
              {stages.map((stage, i) => (
                <div
                  key={stage.name}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    activeStage === i
                      ? "bg-[var(--color-primary)]/10 ring-2 ring-[var(--color-primary)]/30"
                      : activeStage > i
                      ? "bg-green-50"
                      : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                      activeStage > i
                        ? "bg-[var(--color-primary)] text-white"
                        : activeStage === i
                        ? "bg-[var(--color-primary)] text-white animate-pulse"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {activeStage > i ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M4 9l3 3 7-7"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {stage.name}
                    </div>
                    <div className="text-xs text-gray-400">{stage.desc}</div>
                  </div>
                  {activeStage === i && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isRunning
                  ? "#718096"
                  : "linear-gradient(135deg, #009E73, #007856)",
                boxShadow: isRunning
                  ? "none"
                  : "0 4px 20px rgba(0, 158, 115, 0.3)",
              }}
            >
              {isRunning ? "Processing..." : "Run Detection"}
            </button>
          </div>

          {/* Results chart */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Classification Results
              </h3>
              {activeStage >= 4 && (
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: `${topDisease.color}18`,
                    color: topDisease.color,
                  }}
                >
                  {topDisease.confidence > 0.8 ? "HIGH CONFIDENCE" : "MODERATE"}
                </div>
              )}
            </div>

            <svg ref={chartRef} className="w-full" />

            {activeStage >= 4 && (
              <div
                className="mt-6 p-4 rounded-xl"
                style={{
                  background: `${topDisease.color}08`,
                  border: `1px solid ${topDisease.color}25`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: topDisease.color }}
                  />
                  <span className="font-bold text-gray-800">
                    {topDisease.name}
                  </span>
                  <span
                    className="ml-auto font-mono text-sm font-bold"
                    style={{ color: topDisease.color }}
                  >
                    {(topDisease.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {topDisease.name === "Healthy"
                    ? "No disease detected. Your plant looks healthy!"
                    : `Disease detected with ${topDisease.confidence > 0.8 ? "high" : "moderate"} confidence. Tap for treatment recommendations.`}
                </p>
              </div>
            )}

            {/* Legend with patterns for accessibility */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3 font-medium">
                Color-blind accessible legend (colors + distinct labels):
              </p>
              <div className="flex flex-wrap gap-3">
                {diseases.slice(0, 4).map((d) => (
                  <div key={d.id} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ background: d.color }}
                    />
                    <span className="text-xs text-gray-500">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
