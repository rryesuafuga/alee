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

const treatmentData: Record<string, {
  severity: string;
  immediate: string[];
  chemical: { product: string; dosage: string; frequency: string } | null;
  organic: string[];
  environmental: string[];
  prevention: string[];
  costEstimate: string;
}> = {
  "Healthy": {
    severity: "None",
    immediate: ["No action required"],
    chemical: null,
    organic: ["Continue current practices"],
    environmental: ["Maintain proper spacing (3m between plants)", "Ensure good drainage"],
    prevention: ["Regular monitoring every 2 weeks", "Maintain soil health with mulching"],
    costEstimate: "UGX 0",
  },
  "Black Sigatoka": {
    severity: "Moderate",
    immediate: ["Remove severely affected leaves immediately", "Improve air circulation by pruning surrounding vegetation"],
    chemical: { product: "Mancozeb 80% WP", dosage: "2.5g per litre of water", frequency: "Spray every 14 days during rainy season" },
    organic: ["Apply neem oil solution (5ml/litre)", "Use Trichoderma-based bio-fungicide"],
    environmental: ["Avoid overhead irrigation — water at base only", "Ensure adequate sunlight reaches all leaves", "Space plants at least 3m apart"],
    prevention: ["Plant resistant varieties (e.g., FHIA-17)", "Regular de-leafing of old leaves", "Proper field sanitation"],
    costEstimate: "UGX 15,000–30,000 per treatment cycle",
  },
  "Banana Bacterial Wilt": {
    severity: "Critical",
    immediate: ["Remove and destroy entire infected plant immediately", "Sterilize all cutting tools with fire or 10% bleach", "Do NOT cut the male bud — this spreads BXW"],
    chemical: null,
    organic: ["No chemical treatment available for BXW", "Focus on complete removal and sanitation"],
    environmental: ["Remove infected plant including the corm (underground stem)", "Do not replant in the same spot for 6 months", "Control insect vectors — especially stingless bees"],
    prevention: ["Remove male buds early using forked stick (NOT a knife)", "Quarantine new planting materials for 2 weeks", "Report to local extension officer immediately"],
    costEstimate: "UGX 5,000 (tools sterilization supplies)",
  },
  "Fusarium Wilt": {
    severity: "Critical",
    immediate: ["Remove and burn entire infected plant", "Do not move soil from infected area", "Quarantine the affected plot"],
    chemical: null,
    organic: ["Apply Trichoderma harzianum to surrounding soil", "Incorporate organic matter to boost beneficial microbes"],
    environmental: ["Improve soil drainage — Fusarium thrives in waterlogged soil", "Raise soil pH to 6.5–7.0 with agricultural lime", "Ensure clean planting material from certified nurseries"],
    prevention: ["Plant resistant varieties (Kayinja, Kisansa)", "Rotate with non-host crops for 3+ years", "Never share tools between infected and healthy plots"],
    costEstimate: "UGX 50,000+ (replanting costs)",
  },
  "Bunchy Top Virus": {
    severity: "High",
    immediate: ["Uproot and destroy infected plant immediately", "Check all plants within 20m radius"],
    chemical: { product: "Imidacloprid 200 SL (for aphid control)", dosage: "0.5ml per litre of water", frequency: "Apply to surrounding healthy plants once" },
    organic: ["Spray neem-based insecticide to control banana aphids", "Introduce ladybird beetles as natural aphid predators"],
    environmental: ["Ensure adequate sunlight — aphids prefer shaded conditions", "Remove weeds that harbour aphids"],
    prevention: ["Use certified virus-free planting material only", "Control banana aphid (Pentalonia nigronervosa) populations", "Regular field inspections every 1–2 weeks"],
    costEstimate: "UGX 20,000–40,000 (aphid control + replanting)",
  },
  "Weevil Damage": {
    severity: "Moderate",
    immediate: ["Set up pheromone traps around affected plants", "Apply pseudostem traps (split old stems on ground)"],
    chemical: { product: "Fipronil 5% GR or Beauveria bassiana", dosage: "20g granules per mat", frequency: "Apply once at planting, repeat every 6 months" },
    organic: ["Use split pseudostem traps — check and destroy weevils weekly", "Apply entomopathogenic fungi (Beauveria bassiana)"],
    environmental: ["Keep fields clean — remove old pseudostems after harvest", "Practice crop sanitation by chopping and spreading pseudostem residues to dry"],
    prevention: ["Use clean planting material (peel and inspect corms)", "Hot water treatment of suckers (52°C for 20 minutes)", "Regularly inspect corms for tunneling damage"],
    costEstimate: "UGX 10,000–25,000 per treatment",
  },
  "Nutrient Deficiency": {
    severity: "Low",
    immediate: ["Identify which nutrient is deficient from leaf symptoms", "Apply appropriate fertiliser within 1 week"],
    chemical: { product: "NPK 17-17-17 balanced fertiliser", dosage: "200g per plant per application", frequency: "Apply every 3 months during growing season" },
    organic: ["Apply well-decomposed farmyard manure (15kg per mat)", "Add banana peelings and kitchen waste as mulch around base"],
    environmental: ["Ensure soil pH is between 5.5–7.0 for optimal nutrient uptake", "Ensure adequate sunlight — minimum 6 hours direct sun daily", "Maintain consistent watering — 25mm per week minimum"],
    prevention: ["Soil testing every season to track nutrient levels", "Mulch heavily with organic matter to maintain nutrients", "Intercrop with nitrogen-fixing legumes (beans, groundnuts)"],
    costEstimate: "UGX 8,000–15,000 per application",
  },
};

// Plant part scanning guidance
const scanParts = [
  {
    id: "leaves",
    label: "Leaves",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    instruction: "Capture close-up of affected leaf surface (top and bottom)",
    details: "Hold camera 15-20cm away. Include both healthy and affected areas for comparison.",
  },
  {
    id: "stem",
    label: "Stem / Pseudostem",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="20" rx="2" />
        <path d="M4 12h4" /><path d="M16 12h4" />
      </svg>
    ),
    instruction: "Photograph any discoloration, splitting, or damage on the pseudostem",
    details: "Capture from multiple angles. For weevil damage, photograph the base where tunnels are visible.",
  },
  {
    id: "base",
    label: "Base / Corm Area",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V8" /><path d="m5 12 7-4 7 4" />
        <ellipse cx="12" cy="20" rx="8" ry="3" />
      </svg>
    ),
    instruction: "Capture where the plant emerges from the soil — check for rot, ooze, or insect entry",
    details: "Gently clear soil 5cm around base. BXW bacterial ooze is often visible here.",
  },
  {
    id: "fruit",
    label: "Fruit / Bunch",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 21a4.5 4.5 0 0 1 3.5-4.4" /><path d="M12 3C8.5 3 5 5.5 5 10c0 1 .2 2 .5 3" />
        <path d="M17 21a4.5 4.5 0 0 0-3.5-4.4" /><path d="M12 3c3.5 0 7 2.5 7 7 0 1-.2 2-.5 3" />
        <circle cx="12" cy="11" r="1" />
      </svg>
    ),
    instruction: "Photograph premature ripening, discoloration, or abnormal bunch development",
    details: "BXW causes uneven ripening. Bunchy Top causes small, bunched leaves at the top.",
  },
];

const stages = [
  { name: "Select Plant Part", icon: "select", desc: "Choose the affected area to scan" },
  { name: "Capture Image", icon: "camera", desc: "Take a close-up photo of the affected area" },
  { name: "AI Analysis", icon: "brain", desc: "On-device ML model processes the image" },
  { name: "Classification", icon: "chart", desc: "Disease probabilities computed" },
  { name: "Diagnosis & Treatment", icon: "check", desc: "Results with actionable solutions" },
];

export default function DiseaseDetection() {
  const chartRef = useRef<SVGSVGElement>(null);
  const [activeStage, setActiveStage] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDiseases, setCurrentDiseases] = useState(diseases);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [showTreatment, setShowTreatment] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runSimulation = useCallback(() => {
    if (!selectedPart) return;

    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setIsRunning(true);
    setActiveStage(0);
    setShowTreatment(false);

    // Stage 0 already shown (part selected), advance through rest
    const primary = Math.floor(Math.random() * diseases.length);
    const newDiseases = diseases.map((d, i) => {
      if (i === primary) return { ...d, confidence: 0.75 + Math.random() * 0.2 };
      return { ...d, confidence: Math.random() * 0.08 };
    });
    const total = newDiseases.reduce((s, d) => s + d.confidence, 0);
    const normalized = newDiseases.map((d) => ({
      ...d,
      confidence: d.confidence / total,
    }));
    normalized.sort((a, b) => b.confidence - a.confidence);

    [1, 2, 3, 4].forEach((stageIdx, i) => {
      const tid = setTimeout(() => {
        setActiveStage(stageIdx);
        if (stageIdx === 3) setCurrentDiseases(normalized);
        if (stageIdx === 4) {
          const endTid = setTimeout(() => {
            setIsRunning(false);
            setShowTreatment(true);
          }, 600);
          timeoutRefs.current.push(endTid);
        }
      }, (i + 1) * 700);
      timeoutRefs.current.push(tid);
    });
  }, [selectedPart]);

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

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const sorted = [...currentDiseases].sort((a, b) => b.confidence - a.confidence);

    const y = d3.scaleBand().domain(sorted.map((d) => d.name)).range([0, innerH]).padding(0.35);
    const x = d3.scaleLinear().domain([0, 1]).range([0, innerW]);

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

  const topDisease = [...currentDiseases].sort((a, b) => b.confidence - a.confidence)[0];
  const treatment = treatmentData[topDisease.name] ?? treatmentData["Healthy"];
  const confidenceLabel = topDisease.confidence > 0.9 ? "Confirmed" : topDisease.confidence > 0.7 ? "Likely" : "Possible";

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(0, 158, 115, 0.08)", color: "#009E73" }}
          >
            Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Disease Detection <span className="gradient-text">Simulation</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            See how our AI identifies diseases from specific plant parts — leaves, stems,
            base, or fruit — and provides actionable treatment recommendations.
          </p>
        </div>

        {/* Step 1: How to Scan — Plant Part Selector */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Step 1: Which Part of the Plant Is Affected?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Select the specific area showing symptoms. Our AI analyses each plant part differently
            for more accurate diagnosis. You do not photograph the whole plant — focus on the
            affected area.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scanParts.map((part) => (
              <button
                key={part.id}
                onClick={() => { setSelectedPart(part.id); setActiveStage(-1); setShowTreatment(false); }}
                className={`p-5 rounded-xl text-left transition-all border-2 ${
                  selectedPart === part.id
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-md"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                    selectedPart === part.id
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {part.icon}
                </div>
                <div className="font-semibold text-gray-800 text-sm mb-1">{part.label}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{part.instruction}</div>
                {selectedPart === part.id && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-primary)]/20 text-xs text-[var(--color-primary)] font-medium">
                    {part.details}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Pipeline visualization */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Step 2: AI Detection Pipeline
            </h3>

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
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 9l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{stage.name}</div>
                    <div className="text-xs text-gray-400">{stage.desc}</div>
                  </div>
                  {activeStage === i && isRunning && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunning || !selectedPart}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isRunning || !selectedPart
                  ? "#718096"
                  : "linear-gradient(135deg, #009E73, #007856)",
                boxShadow: isRunning || !selectedPart
                  ? "none"
                  : "0 4px 20px rgba(0, 158, 115, 0.3)",
              }}
            >
              {!selectedPart ? "Select a Plant Part First" : isRunning ? "Analysing..." : `Scan ${scanParts.find((p) => p.id === selectedPart)?.label ?? "Plant"}`}
            </button>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Diagnosis Results
              </h3>
              {activeStage >= 4 && (
                <div className="flex items-center gap-2">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${topDisease.color}18`, color: topDisease.color }}
                  >
                    {confidenceLabel.toUpperCase()}
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: treatment.severity === "Critical" ? "#D55E0018" : treatment.severity === "High" ? "#E69F0018" : treatment.severity === "Moderate" ? "#0072B218" : "#009E7318",
                      color: treatment.severity === "Critical" ? "#D55E00" : treatment.severity === "High" ? "#E69F00" : treatment.severity === "Moderate" ? "#0072B2" : "#009E73",
                    }}
                  >
                    {treatment.severity === "None" ? "HEALTHY" : `${treatment.severity.toUpperCase()} SEVERITY`}
                  </div>
                </div>
              )}
            </div>

            <svg ref={chartRef} className="w-full" />

            {/* Clear diagnosis card */}
            {activeStage >= 4 && (
              <div
                className="mt-6 p-5 rounded-xl"
                style={{
                  background: `${topDisease.color}06`,
                  border: `2px solid ${topDisease.color}30`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${topDisease.color}20` }}>
                    <div className="w-4 h-4 rounded-full" style={{ background: topDisease.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{topDisease.name}</div>
                    <div className="text-xs text-gray-500">
                      {confidenceLabel} diagnosis ({(topDisease.confidence * 100).toFixed(0)}% confidence)
                      {selectedPart && ` — scanned from ${scanParts.find((p) => p.id === selectedPart)?.label.toLowerCase()}`}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {topDisease.name === "Healthy"
                    ? "No disease detected. Your plant appears healthy. Continue regular monitoring every 2 weeks."
                    : `Your plant is ${confidenceLabel === "Confirmed" ? "confirmed to have" : confidenceLabel === "Likely" ? "likely suffering from" : "possibly affected by"} ${topDisease.name}. See treatment recommendations below.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Treatment Recommendations — addresses Paul's feedback #4 */}
        {showTreatment && topDisease.name !== "Healthy" && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${topDisease.color}15` }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={topDisease.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v4" /><path d="M16 2v4" /><path d="M12 14v4" /><path d="M10 18h4" />
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Treatment Plan for {topDisease.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Severity: <span className="font-semibold" style={{ color: topDisease.color }}>{treatment.severity}</span>
                  {" — "}Estimated cost: <span className="font-semibold">{treatment.costEstimate}</span>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Immediate Actions */}
              <div className="p-5 rounded-xl bg-red-50/50 border border-red-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[#D55E00] text-white flex items-center justify-center text-xs font-bold">!</div>
                  <h4 className="font-bold text-gray-800 text-sm">Immediate Actions</h4>
                </div>
                <ul className="space-y-2">
                  {treatment.immediate.map((action, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-[#D55E00] font-bold mt-0.5">&#8226;</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatment */}
              <div className="p-5 rounded-xl bg-orange-50/50 border border-orange-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[#E69F00] text-white flex items-center justify-center text-xs font-bold">C</div>
                  <h4 className="font-bold text-gray-800 text-sm">Chemical Treatment</h4>
                </div>
                {treatment.chemical ? (
                  <div className="space-y-2 text-xs text-gray-600">
                    <div><span className="font-semibold text-gray-800">Product:</span> {treatment.chemical.product}</div>
                    <div><span className="font-semibold text-gray-800">Dosage:</span> {treatment.chemical.dosage}</div>
                    <div><span className="font-semibold text-gray-800">Frequency:</span> {treatment.chemical.frequency}</div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No chemical treatment available. Focus on removal and prevention measures.</p>
                )}
              </div>

              {/* Organic / Natural */}
              <div className="p-5 rounded-xl bg-green-50/50 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[#009E73] text-white flex items-center justify-center text-xs font-bold">O</div>
                  <h4 className="font-bold text-gray-800 text-sm">Organic Alternatives</h4>
                </div>
                <ul className="space-y-2">
                  {treatment.organic.map((action, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-[#009E73] font-bold mt-0.5">&#8226;</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Environmental Fixes */}
              <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[#0072B2] text-white flex items-center justify-center text-xs font-bold">E</div>
                  <h4 className="font-bold text-gray-800 text-sm">Environmental Fixes</h4>
                </div>
                <ul className="space-y-2">
                  {treatment.environmental.map((action, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-[#0072B2] font-bold mt-0.5">&#8226;</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention */}
              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[#CC79A7] text-white flex items-center justify-center text-xs font-bold">P</div>
                  <h4 className="font-bold text-gray-800 text-sm">Prevention Tips</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  {treatment.prevention.map((action, i) => (
                    <div key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-[#CC79A7] font-bold mt-0.5">&#8226;</span>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Healthy result — positive feedback */}
        {showTreatment && topDisease.name === "Healthy" && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border-2 border-[#009E73]/20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#009E73]/10 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#009E73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Plant is Healthy!</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No diseases detected. Continue regular monitoring every 2 weeks, maintain soil health
                with mulching, and ensure proper plant spacing for optimal air circulation.
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 p-5 rounded-xl bg-white border border-gray-100">
          <p className="text-xs text-gray-400 mb-3 font-medium">
            Color-blind accessible legend — each disease uses a distinct colour from the Wong (2011) palette:
          </p>
          <div className="flex flex-wrap gap-4">
            {diseases.map((d) => (
              <div key={d.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ background: d.color }} />
                <span className="text-xs text-gray-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
