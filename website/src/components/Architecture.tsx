"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface ArchNode {
  id: string;
  label: string;
  group: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface ArchLink {
  source: string;
  target: string;
  label: string;
}

const nodes: ArchNode[] = [
  // Mobile
  { id: "app", label: "Android App", group: "mobile" },
  { id: "tflite", label: "TFLite Model", group: "mobile" },
  { id: "offline", label: "Offline Cache", group: "mobile" },
  // Cloud
  { id: "gateway", label: "API Gateway", group: "cloud" },
  { id: "auth", label: "Auth Service", group: "cloud" },
  { id: "farm", label: "Farm Service", group: "cloud" },
  { id: "ml", label: "ML Service", group: "cloud" },
  { id: "iot", label: "IoT Service", group: "cloud" },
  { id: "alert", label: "Alert Service", group: "cloud" },
  { id: "analytics", label: "Analytics", group: "cloud" },
  // Database
  { id: "firestore", label: "Firestore", group: "database" },
  { id: "bigquery", label: "BigQuery", group: "database" },
  { id: "storage", label: "Cloud Storage", group: "database" },
  // IoT
  { id: "sensors", label: "Soil Sensors", group: "iot" },
  { id: "weather", label: "Weather Station", group: "iot" },
  { id: "lorawan", label: "LoRaWAN Gateway", group: "iot" },
  // External
  { id: "sms", label: "SMS Gateway", group: "external" },
  { id: "satellite", label: "Satellite Data", group: "external" },
  { id: "weatherapi", label: "Weather API", group: "external" },
];

const links: ArchLink[] = [
  { source: "app", target: "gateway", label: "HTTPS" },
  { source: "app", target: "tflite", label: "On-device" },
  { source: "app", target: "offline", label: "SQLite" },
  { source: "gateway", target: "auth", label: "JWT" },
  { source: "gateway", target: "farm", label: "REST" },
  { source: "gateway", target: "ml", label: "gRPC" },
  { source: "gateway", target: "iot", label: "REST" },
  { source: "gateway", target: "alert", label: "REST" },
  { source: "gateway", target: "analytics", label: "REST" },
  { source: "auth", target: "firestore", label: "" },
  { source: "farm", target: "firestore", label: "" },
  { source: "ml", target: "storage", label: "Models" },
  { source: "analytics", target: "bigquery", label: "" },
  { source: "iot", target: "firestore", label: "" },
  { source: "sensors", target: "lorawan", label: "LoRa" },
  { source: "weather", target: "lorawan", label: "LoRa" },
  { source: "lorawan", target: "iot", label: "MQTT" },
  { source: "alert", target: "sms", label: "API" },
  { source: "ml", target: "satellite", label: "NDVI" },
  { source: "farm", target: "weatherapi", label: "API" },
];

const groupConfig: Record<string, { color: string; label: string }> = {
  mobile: { color: "#009E73", label: "Mobile Layer" },
  cloud: { color: "#0072B2", label: "Cloud Services" },
  database: { color: "#E69F00", label: "Data Layer" },
  iot: { color: "#CC79A7", label: "IoT Layer" },
  external: { color: "#D55E00", label: "External APIs" },
};

export default function Architecture() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    text: string;
  }>({ show: false, x: 0, y: 0, text: "" });

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 560;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");

    // Arrow marker
    defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 24)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L10,0L0,4")
      .attr("fill", "#CBD5E0");

    // Create the simulation
    const simNodes = nodes.map((d) => ({ ...d }));
    const simLinks = links.map((d) => ({ ...d }));

    // Position nodes by group
    const groupPositions: Record<string, { x: number; y: number }> = {
      mobile: { x: 120, y: 120 },
      cloud: { x: 450, y: 280 },
      database: { x: 780, y: 400 },
      iot: { x: 120, y: 440 },
      external: { x: 780, y: 120 },
    };

    simNodes.forEach((n) => {
      const pos = groupPositions[n.group] || { x: 450, y: 280 };
      n.x = pos.x + (Math.random() - 0.5) * 100;
      n.y = pos.y + (Math.random() - 0.5) * 80;
    });

    const simulation = d3
      .forceSimulation(simNodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(simLinks as unknown as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
          .id((d: unknown) => (d as ArchNode).id)
          .distance(80)
          .strength(0.3)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40))
      .force(
        "x",
        d3.forceX((d: unknown) => groupPositions[(d as ArchNode).group]?.x || width / 2).strength(0.2)
      )
      .force(
        "y",
        d3.forceY((d: unknown) => groupPositions[(d as ArchNode).group]?.y || height / 2).strength(0.2)
      )
      .alpha(0.8)
      .alphaDecay(0.02);

    const g = svg.append("g");

    // Links
    const link = g
      .selectAll(".link")
      .data(simLinks)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#CBD5E0")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => (d.label === "LoRa" ? "4,3" : "none"))
      .attr("marker-end", "url(#arrowhead)")
      .attr("opacity", 0.6);

    // Node groups
    const node = g
      .selectAll(".node")
      .data(simNodes)
      .join("g")
      .attr("class", "node")
      .attr("cursor", "pointer")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(
        d3.drag<any, any>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // Node circles
    node
      .append("circle")
      .attr("r", 18)
      .attr("fill", (d) => groupConfig[d.group]?.color || "#718096")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("opacity", 0.9);

    // Node symbols (first letter)
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text((d) => d.label.charAt(0));

    // Node labels
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 32)
      .attr("fill", "#4A5568")
      .attr("font-size", "9px")
      .attr("font-weight", "500")
      .text((d) => d.label);

    // Hover
    node.on("mouseenter", function (event, d) {
      d3.select(this).select("circle").transition().duration(200).attr("r", 22);
      setTooltip({
        show: true,
        x: event.offsetX,
        y: event.offsetY - 40,
        text: `${d.label} (${groupConfig[d.group]?.label})`,
      });
    });

    node.on("mouseleave", function () {
      d3.select(this).select("circle").transition().duration(200).attr("r", 18);
      setTooltip((prev) => ({ ...prev, show: false }));
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => ((d.source as unknown as ArchNode).x ?? 0))
        .attr("y1", (d) => ((d.source as unknown as ArchNode).y ?? 0))
        .attr("x2", (d) => ((d.target as unknown as ArchNode).x ?? 0))
        .attr("y2", (d) => ((d.target as unknown as ArchNode).y ?? 0));

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Filter by group
    if (activeGroup) {
      node
        .transition()
        .duration(300)
        .attr("opacity", (d) => (d.group === activeGroup ? 1 : 0.15));
      link.transition().duration(300).attr("opacity", (d) => {
        const src = (d.source as unknown as ArchNode).group;
        const tgt = (d.target as unknown as ArchNode).group;
        return src === activeGroup || tgt === activeGroup ? 0.6 : 0.05;
      });
    } else {
      node.transition().duration(300).attr("opacity", 1);
      link.transition().duration(300).attr("opacity", 0.6);
    }

    return () => {
      simulation.stop();
    };
  }, [activeGroup]);

  return (
    <section id="technology" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(0, 114, 178, 0.08)", color: "#0072B2" }}
          >
            System Design
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Platform <span className="gradient-text">Architecture</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Interactive force-directed graph of our microservices architecture.
            Click layer buttons to highlight components. Drag nodes to explore
            connections.
          </p>
        </div>

        {/* Layer filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveGroup(null)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              !activeGroup
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Layers
          </button>
          {Object.entries(groupConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveGroup(activeGroup === key ? null : key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeGroup === key
                  ? "text-white shadow-md"
                  : "bg-white text-gray-600 hover:shadow-sm"
              }`}
              style={
                activeGroup === key
                  ? { background: cfg.color }
                  : { borderLeft: `3px solid ${cfg.color}` }
              }
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: activeGroup === key ? "white" : cfg.color,
                }}
              />
              {cfg.label}
            </button>
          ))}
        </div>

        {/* D3 graph */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <svg ref={svgRef} className="w-full" />
          {tooltip.show && (
            <div
              className="d3-tooltip"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {tooltip.text}
            </div>
          )}
        </div>

        {/* Tech stack cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Mobile & Edge",
              color: "#009E73",
              items: [
                "Flutter (Dart)",
                "TensorFlow Lite",
                "SQLite + Hive",
                "Firebase SDK",
              ],
            },
            {
              title: "Cloud & Backend",
              color: "#0072B2",
              items: [
                "Google Cloud (Cloud Run)",
                "NestJS + TypeScript",
                "Firestore + BigQuery",
                "Vertex AI",
              ],
            },
            {
              title: "IoT & External",
              color: "#E69F00",
              items: [
                "LoRaWAN + MQTT",
                "ESP32-S3 MCUs",
                "Africa's Talking SMS",
                "Sentinel Hub Satellite",
              ],
            },
          ].map((stack) => (
            <div
              key={stack.title}
              className="p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: stack.color }}
                />
                <h4 className="font-bold text-gray-900">{stack.title}</h4>
              </div>
              <ul className="space-y-2">
                {stack.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-gray-500 flex items-center gap-2"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: stack.color, opacity: 0.5 }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
