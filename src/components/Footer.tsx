import { Shield, GitBranch, Globe, Mail, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const modules = [
  { href: "/malware", label: "Malware Analysis" },
  { href: "/phishing", label: "Phishing Tactics" },
  { href: "/ddos", label: "DDoS Explained" },
  { href: "/simulation", label: "Attack Simulations" },
  { href: "/tools", label: "Security Tools" },
];

const resources = [
  { label: "NIST Cybersecurity Framework", href: "https://www.nist.gov/cyberframework" },
  { label: "OWASP Top 10", href: "https://owasp.org/www-project-top-ten/" },
  { label: "CVE Database", href: "https://cve.mitre.org" },
  { label: "Krebs on Security", href: "https://krebsonsecurity.com" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-primary/10 mt-16" style={{ background: "rgba(4, 7, 14, 0.9)" }}>
      {/* Top glow line */}
      <div className="glow-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-5 select-none">
              <Shield
                className="w-7 h-7 text-primary transition-colors group-hover:text-accent"
                style={{ filter: "drop-shadow(0 0 8px rgba(0,255,255,0.6))" }}
              />
              <span className="font-bold text-lg tracking-wide text-white uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.06em" }}>
                Cyber<span className="text-primary">Shield</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              An interactive cybersecurity awareness platform designed to educate and empower individuals against modern cyber threats.
            </p>
            <div className="flex gap-3">
              {[
                { icon: GitBranch, href: "#" },
                { icon: Globe, href: "#" },
                { icon: ExternalLink, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 hover:bg-primary/10 border border-border hover:border-primary/30">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 font-mono">
              Modules
            </h3>
            <ul className="space-y-3">
              {modules.map((m) => (
                <li key={m.href}>
                  <Link href={m.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group">
                    <span className="text-primary/30 group-hover:text-primary/60 transition-colors text-xs">›</span>
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External Resources */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 font-mono">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((r) => (
                <li key={r.href}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group">
                    <span className="text-primary/30 group-hover:text-primary/60 transition-colors text-xs">›</span>
                    {r.label}
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Disclaimer */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 font-mono">
              Disclaimer
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              CyberShield is strictly for educational purposes. All simulations are sandboxed and no real credentials are stored or transmitted.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 text-primary/50" />
              <span>edu@cybershield.dev</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-primary/8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CyberShield. For educational use only.</p>
          <div className="flex items-center gap-2">
            <span className="status-dot" />
            <span className="font-mono">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
