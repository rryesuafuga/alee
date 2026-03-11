export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-dark)] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg"
                style={{
                  background: "linear-gradient(135deg, #009E73, #0072B2)",
                }}
              >
                A
              </div>
              <span className="text-xl font-bold text-white">Alee</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              AI-powered agricultural technology platform transforming plantain
              farming in Uganda and across Africa.
            </p>
            <div className="flex gap-4">
              {["X", "Li", "Gh"].map((icon) => (
                <div
                  key={icon}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-all cursor-pointer"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "AI Disease Scout",
                "Smart Farm Advisor",
                "IoT Sensors",
                "SMS Gateway",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#features"
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {["About Us", "Team", "Careers", "Blog"].map((item) => (
                <li key={item}>
                  <a
                    href="#about"
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>Kassanda District, Central Uganda</li>
              <li>
                <a
                  href="mailto:info@alee.farm"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  info@alee.farm
                </a>
              </li>
              <li>
                <a
                  href="tel:+256700000000"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  +256 700 000 000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Alee AgriTech. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <a
              href="#"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
