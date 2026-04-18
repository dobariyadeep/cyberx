import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield, ChevronDown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/simulation", label: "Simulations" },
  { href: "/tools", label: "Tools" },
];

const threatLinks = [
  { href: "/malware", label: "Malware", desc: "Viruses, trojans & ransomware" },
  { href: "/phishing", label: "Phishing", desc: "Social engineering attacks" },
  { href: "/ddos", label: "DDoS", desc: "Traffic flood attacks" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThreatsOpen, setIsThreatsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsThreatsOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isThreatActive = ["/malware", "/phishing", "/ddos"].includes(location);

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(6, 9, 18, 0.92)"
          : "rgba(6, 9, 18, 0.6)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: scrolled
          ? "1px solid rgba(0,255,255,0.14)"
          : "1px solid rgba(0,255,255,0.06)",
        boxShadow: scrolled
          ? "0 4px 32px rgba(0,0,0,0.5)"
          : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="relative">
              <Shield
                className="w-8 h-8 text-primary transition-all duration-300 group-hover:text-accent"
                style={{ filter: "drop-shadow(0 0 8px rgba(0,255,255,0.7))" }}
              />
              <div className="status-dot absolute -top-0.5 -right-0.5" />
            </div>
            <span
              className="font-bold text-lg tracking-wide text-white uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.06em" }}
            >
              Cyber<span className="text-primary text-glow-sm">Shield</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location === "/"
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              Home
            </Link>

            {/* Threats Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsThreatsOpen(true)}
              onMouseLeave={() => setIsThreatsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isThreatActive
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                Threats
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isThreatsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isThreatsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl overflow-hidden py-1.5"
                    style={{
                      background: "rgba(8, 12, 22, 0.96)",
                      border: "1px solid rgba(0,255,255,0.15)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,255,0.05) inset",
                    }}
                  >
                    {threatLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex flex-col px-4 py-3 hover:bg-white/4 transition-colors group"
                      >
                        <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                          {link.label}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">{link.desc}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/simulation"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location === "/simulation"
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              Simulations
            </Link>
            <Link
              href="/tools"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location === "/tools"
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              Tools
            </Link>
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/simulation"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold btn-primary-glow"
            >
              <Zap className="w-3.5 h-3.5" />
              Try Demo
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-muted-foreground hover:text-white transition-colors p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(0,255,255,0.1)" }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <Link href="/" className={`px-3 py-2.5 rounded-lg text-sm font-medium ${location === "/" ? "text-primary bg-primary/8" : "text-muted-foreground"}`}>Home</Link>
              <div className="px-3 py-2">
                <p className="text-xs uppercase font-mono text-muted-foreground tracking-widest mb-2">Threats</p>
                <div className="flex flex-col gap-1 pl-2 border-l border-primary/20">
                  {threatLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={`py-1.5 text-sm ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/simulation" className={`px-3 py-2.5 rounded-lg text-sm font-medium ${location === "/simulation" ? "text-primary bg-primary/8" : "text-muted-foreground"}`}>Simulations</Link>
              <Link href="/tools" className={`px-3 py-2.5 rounded-lg text-sm font-medium ${location === "/tools" ? "text-primary bg-primary/8" : "text-muted-foreground"}`}>Tools</Link>
              <Link href="/simulation" className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold btn-primary-glow">
                <Zap className="w-4 h-4" />
                Try Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
