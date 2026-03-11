"use client";

const modules = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    title: "AI Disease Scout",
    description:
      "Point your camera at any plantain leaf and get instant disease diagnosis. Works 100% offline with on-device AI, detecting 7 major diseases in under 3 seconds.",
    features: [
      "On-device ML (TFLite)",
      "7 disease classes",
      "Treatment guides",
      "Outbreak alerts",
    ],
    color: "#009E73",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <polyline points="6 8 10 12 14 8 18 12" />
      </svg>
    ),
    title: "Smart Farm Advisor",
    description:
      "IoT sensors continuously monitor your soil health. Combined with satellite imagery and weather data, you receive personalised SMS advice to maximise yields.",
    features: [
      "Soil sensors (NPK, pH, moisture)",
      "Satellite NDVI analysis",
      "Weather integration",
      "SMS advisories",
    ],
    color: "#0072B2",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(0, 158, 115, 0.08)",
              color: "#009E73",
            }}
          >
            The Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Two Powerful Modules,{" "}
            <span className="gradient-text">One Platform</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Alee combines computer vision AI with IoT precision farming to
            deliver a complete solution for smallholder farmers across Africa.
          </p>
        </div>

        {/* Modules */}
        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((mod) => (
            <div
              key={mod.title}
              className="group relative p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${mod.color}08, ${mod.color}03)`,
                }}
              />
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: `${mod.color}12`,
                    color: mod.color,
                  }}
                >
                  {mod.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {mod.title}
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {mod.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {mod.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="8" fill={`${mod.color}18`} />
                        <path
                          d="M5 8l2 2 4-4"
                          stroke={mod.color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact numbers */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              value: "87K+",
              label: "Training Images",
              desc: "PlantVillage & field data",
            },
            {
              value: "7",
              label: "Disease Classes",
              desc: "Including critical BXW",
            },
            {
              value: "6MB",
              label: "Model Size",
              desc: "Optimised for mobile",
            },
            {
              value: "<200ms",
              label: "Inference Time",
              desc: "On mid-range phones",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-6 rounded-xl bg-gray-50"
            >
              <div className="text-3xl font-extrabold gradient-text mb-1">
                {item.value}
              </div>
              <div className="text-sm font-semibold text-gray-800">
                {item.label}
              </div>
              <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
