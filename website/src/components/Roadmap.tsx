"use client";

const phases = [
  {
    phase: "Phase 1",
    title: "MVP Launch",
    timeline: "Months 1–3",
    status: "active",
    color: "#009E73",
    features: [
      "Disease detection (offline-capable)",
      "Farm registration system",
      "Basic SMS alerts",
      "Treatment recommendations",
      "Beta with 50 farmers in Kassanda",
    ],
    target: "100 users / 50 farms",
  },
  {
    phase: "Phase 2",
    title: "Smart Farming",
    timeline: "Months 4–6",
    status: "upcoming",
    color: "#0072B2",
    features: [
      "IoT soil sensor integration",
      "Real-time sensor dashboard",
      "Weather API + forecasts",
      "Personalised SMS advisories",
      "Satellite NDVI analysis",
    ],
    target: "1,000 users / 200 sensors",
  },
  {
    phase: "Phase 3",
    title: "Scale & Monetise",
    timeline: "Months 7–12",
    status: "planned",
    color: "#E69F00",
    features: [
      "Cooperative dashboards",
      "Subscription payment system",
      "Advanced yield analytics",
      "USSD for feature phones",
      "Regional expansion",
    ],
    target: "10,000 users / 1,000 sensors",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(0, 158, 115, 0.08)", color: "#009E73" }}
          >
            Development Plan
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Product <span className="gradient-text">Roadmap</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From MVP with 50 pilot farmers to serving 100,000+ across Africa.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />

          <div className="space-y-12">
            {phases.map((phase, i) => (
              <div
                key={phase.phase}
                className={`relative md:flex items-start gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot on timeline */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-white shadow-lg"
                    style={{ background: phase.color }}
                  >
                    {i + 1}
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`md:w-[calc(50%-3rem)] ${
                    i % 2 === 0 ? "md:text-right md:pr-4" : "md:text-left md:pl-4"
                  }`}
                >
                  <div
                    className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                    style={{
                      borderTop: `3px solid ${phase.color}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: phase.color }}
                      >
                        {phase.phase}
                      </span>
                      <span className="text-sm text-gray-400">
                        {phase.timeline}
                      </span>
                      {phase.status === "active" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">
                          CURRENT
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {phase.title}
                    </h3>

                    <ul
                      className={`space-y-2 mb-4 ${
                        i % 2 === 0 ? "md:text-left" : ""
                      }`}
                    >
                      {phase.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2 text-sm text-gray-500"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <circle
                              cx="7"
                              cy="7"
                              r="7"
                              fill={`${phase.color}18`}
                            />
                            <path
                              d="M4 7l2 2 4-4"
                              stroke={phase.color}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <div
                      className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        background: `${phase.color}10`,
                        color: phase.color,
                      }}
                    >
                      Target: {phase.target}
                    </div>
                  </div>
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
