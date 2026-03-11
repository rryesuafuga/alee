"use client";

export default function CTA() {
  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0D1B2A 0%, #1B2D45 40%, #0D3B2A 100%)",
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #009E73, transparent)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #0072B2, transparent)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
          style={{
            background: "rgba(0, 158, 115, 0.15)",
            border: "1px solid rgba(0, 158, 115, 0.3)",
            color: "#56C4A4",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#009E73" }}
          />
          Now Accepting Pilot Partners
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Ready to Transform
          <br />
          <span className="gradient-text">Your Farm?</span>
        </h2>

        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
          Join our pilot programme in Kassanda District. Get free access to AI
          disease detection, IoT sensors, and personalised farming advisories.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:info@alee.farm"
            className="px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #009E73, #007856)",
              boxShadow: "0 4px 20px rgba(0, 158, 115, 0.4)",
            }}
          >
            Join the Pilot
          </a>
          <a
            href="mailto:careers@alee.farm"
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
            style={{
              border: "2px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              background: "rgba(255, 255, 255, 0.05)",
            }}
          >
            Join Our Team
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 items-center">
          {[
            "Google for Startups Accelerator",
            "Powered by GCP",
            "TensorFlow",
          ].map((badge) => (
            <div
              key={badge}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
