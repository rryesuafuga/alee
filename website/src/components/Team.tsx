"use client";

const teamMembers = [
  {
    name: "Paul Mubiri",
    role: "Founder & CEO",
    focus: "Business strategy, farmer relationships, partnerships, fundraising",
    initial: "PM",
    color: "#009E73",
  },
  {
    name: "Raymond Wayesu",
    role: "CTO",
    focus:
      "Technical architecture, team leadership, ML strategy, Google accelerator liaison",
    initial: "RW",
    color: "#0072B2",
  },
  {
    name: "Backend Developer",
    role: "Backend Engineer",
    focus: "API development, database management, IoT integration",
    initial: "BE",
    color: "#E69F00",
    hiring: true,
  },
  {
    name: "Mobile Developer",
    role: "Mobile Engineer",
    focus: "Flutter app development, offline functionality, UI/UX",
    initial: "ME",
    color: "#CC79A7",
    hiring: true,
  },
  {
    name: "ML Engineer",
    role: "ML Engineer (Part-time)",
    focus: "Model training, optimization, continuous improvement",
    initial: "ML",
    color: "#D55E00",
    hiring: true,
  },
  {
    name: "Field Agents",
    role: "Field Operations (x2)",
    focus: "Farmer training, sensor installation, feedback collection",
    initial: "FA",
    color: "#56B4E9",
    hiring: true,
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(0, 158, 115, 0.08)",
              color: "#009E73",
            }}
          >
            Our People
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            The <span className="gradient-text">Team</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A dedicated team combining agricultural expertise with cutting-edge
            technology, based in Uganda.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.initial}
              className="group relative p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all"
            >
              {member.hiring && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                  HIRING
                </div>
              )}

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white mb-4"
                style={{ background: member.color }}
              >
                {member.initial}
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                {member.name}
              </h3>
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: member.color }}
              >
                {member.role}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {member.focus}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
