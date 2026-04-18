import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  ShieldAlert, MailWarning, Network, ShieldCheck, Lock,
  Activity, ArrowRight, Zap, Eye, Database, Server, AlertTriangle,
  ChevronRight, Globe, Users, TrendingUp
} from "lucide-react";

function AnimatedCounter({ end, suffix = "", duration = 2.5 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function RevealSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const marqueeTerms = [
  "Zero-Day Exploit", "Threat Intelligence", "SIEM", "SOC Operations", "Endpoint Detection",
  "Penetration Testing", "Zero Trust Architecture", "CVE Analysis", "Incident Response",
  "Threat Hunting", "OSINT", "Lateral Movement", "Privilege Escalation", "Data Exfiltration",
  "Vulnerability Assessment", "Red Team", "Blue Team", "Purple Team", "Firewall Rules",
];

const threatCards = [
  {
    href: "/malware",
    icon: ShieldAlert,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    borderColor: "hover:border-red-500/40",
    glowColor: "rgba(239,68,68,0.15)",
    title: "Malware",
    desc: "Viruses, trojans, ransomware and spyware designed to infiltrate, corrupt, and compromise systems.",
    tag: "High Severity",
    tagColor: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  {
    href: "/phishing",
    icon: MailWarning,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    borderColor: "hover:border-amber-500/40",
    glowColor: "rgba(245,158,11,0.15)",
    title: "Phishing",
    desc: "Social engineering attacks that deceive users into revealing credentials and sensitive information.",
    tag: "Most Common",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    href: "/ddos",
    icon: Network,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    borderColor: "hover:border-blue-500/40",
    glowColor: "rgba(59,130,246,0.15)",
    title: "DDoS",
    desc: "Distributed traffic floods overwhelm servers, disrupting services and causing massive operational impact.",
    tag: "Infrastructure",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
];

const stats = [
  { icon: Globe, value: 6, suffix: "T+", label: "Annual cybercrime cost (USD)", color: "text-primary" },
  { icon: AlertTriangle, value: 2244, suffix: "", label: "Attacks per day worldwide", color: "text-amber-400" },
  { icon: Users, value: 95, suffix: "%", label: "Breaches caused by human error", color: "text-red-400" },
  { icon: TrendingUp, value: 78, suffix: "%", label: "Rise in ransomware last year", color: "text-purple-400" },
];

const howItWorks = [
  { step: "01", title: "Learn the Threats", desc: "Explore in-depth modules covering the anatomy, tactics, and real-world impact of modern cyber attacks.", icon: Eye },
  { step: "02", title: "Experience Simulations", desc: "Interact with live attack simulations in a safe environment to understand how attackers operate.", icon: Zap },
  { step: "03", title: "Apply the Tools", desc: "Use our security utilities to evaluate URLs, test passwords, and strengthen your security posture.", icon: ShieldCheck },
];

export default function Home() {
  const [liveCount, setLiveCount] = useState(14502);

  useEffect(() => {
    const iv = setInterval(() => setLiveCount((p) => p + Math.floor(Math.random() * 4) + 1), 1100);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* ── AURORA BACKGROUND BLOBS ─────────────────────────────────────── */}
      <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
        <div className="aurora-1 absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,200,255,0.12) 0%, transparent 70%)" }} />
        <div className="aurora-2 absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(100,50,255,0.08) 0%, transparent 70%)" }} />
        <div className="aurora-3 absolute bottom-[10%] left-[30%] w-[700px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,150,255,0.07) 0%, transparent 70%)" }} />
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-4 cyber-grid pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 mb-10"
          >
            <div className="section-label">
              <span className="status-dot" />
              Live Threat Monitoring Active
            </div>
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none tracking-tight select-none">
            <span
              className="block text-white"
              style={{ textShadow: "0 0 60px rgba(255,255,255,0.1)" }}
            >
              Cyber
            </span>
            <span
              className="block text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, hsl(192,100%,60%), hsl(200,100%,70%), hsl(192,100%,50%))",
                filter: "drop-shadow(0 0 30px rgba(0,255,255,0.4))",
              }}
            >
              Shield
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl font-light mb-14 tracking-wide"
            style={{ color: "rgba(180,210,240,0.8)" }}
          >
            Understand.{" "}
            <span className="text-primary font-medium text-glow-sm">Detect.</span>{" "}
            Prevent.
          </motion.p>

          {/* Live counter card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="gradient-border-card inline-block p-6 px-10 mb-14 relative overflow-hidden group cursor-default"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.04), transparent)" }} />
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Global Attacks Prevented</p>
            <div
              className="text-4xl md:text-5xl font-black font-mono tabular-nums text-glow"
              style={{ color: "hsl(192,100%,55%)" }}
            >
              {liveCount.toLocaleString()}
            </div>
            <p className="text-xs text-primary/60 mt-1 font-mono">↑ updating in real-time</p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => document.getElementById("threats")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary-glow flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            >
              Explore Threats <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/simulation"
              className="btn-outline-glow flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            >
              <Zap className="w-4 h-4" />
              Run Simulations
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-mono uppercase tracking-widest">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronRight className="w-4 h-4 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="py-4 border-y border-primary/10 overflow-hidden relative"
        style={{ background: "rgba(0,255,255,0.02)" }}>
        <div className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(222,47%,4%), transparent)" }} />
        <div className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(222,47%,4%), transparent)" }} />
        <div className="marquee-track">
          {[...marqueeTerms, ...marqueeTerms].map((term, i) => (
            <span key={i} className="mx-8 text-xs font-mono uppercase tracking-widest whitespace-nowrap"
              style={{ color: "rgba(0,255,255,0.35)" }}>
              <span className="text-primary/40 mr-3">//</span>{term}
            </span>
          ))}
        </div>
      </div>

      {/* ── THREAT CARDS ─────────────────────────────────────────────────── */}
      <section id="threats" className="py-28 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-16">
            <div className="section-label mb-6 mx-auto">Active Threat Vectors</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Know Your <span className="text-primary text-glow-sm">Adversaries</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Analyze the anatomy of modern cyber attacks and learn how to fortify your defenses before the breach occurs.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {threatCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <RevealSection key={card.href} delay={i * 0.1}>
                  <Link href={card.href}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.01 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={`gradient-border-card p-8 h-full flex flex-col cursor-pointer transition-all duration-300 group ${card.borderColor}`}
                      style={{ minHeight: 280 }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center border border-current/10 transition-all duration-300 group-hover:scale-110`}
                          style={{ boxShadow: `0 0 20px ${card.glowColor}` }}>
                          <Icon className={`w-6 h-6 ${card.iconColor}`} />
                        </div>
                        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border ${card.tagColor}`}>
                          {card.tag}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{card.desc}</p>
                      <div className="mt-8 flex items-center text-sm font-mono text-primary/70 group-hover:text-primary transition-all duration-200">
                        Analyze Vector
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-200" />
                      </div>
                    </motion.div>
                  </Link>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="glow-divider mb-24 mx-auto max-w-7xl" />
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-16">
            <div className="section-label mb-6 mx-auto">Platform Overview</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              How CyberShield <span className="text-primary text-glow-sm">Works</span>
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)" }} />

            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealSection key={i} delay={i * 0.12} className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center gradient-border-card mx-auto"
                        style={{ boxShadow: "0 0 30px rgba(0,255,255,0.12)" }}>
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <span className="absolute -top-3 -right-3 text-xs font-mono font-bold text-primary/40 bg-background px-1">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Visual */}
            <RevealSection>
              <div className="relative flex items-center justify-center">
                <div className="w-72 h-72 relative">
                  {/* Rings */}
                  <div className="absolute inset-0 rounded-full border border-primary/10 animate-[spin_25s_linear_infinite]" />
                  <div className="absolute inset-6 rounded-full border border-primary/15 animate-[spin_20s_linear_infinite_reverse]" />
                  <div className="absolute inset-12 rounded-full border border-primary/25 border-dashed animate-[spin_15s_linear_infinite]" />
                  <div className="absolute inset-20 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(0,255,255,0.08), transparent)", border: "1px solid rgba(0,255,255,0.2)" }} />
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-20 h-20 text-primary" style={{ filter: "drop-shadow(0 0 20px rgba(0,255,255,0.5))" }} />
                  </div>
                  {/* Orbit dots */}
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <div key={i}
                      className="absolute w-2.5 h-2.5 rounded-full bg-primary"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${deg}deg) translateX(120px) translateY(-50%)`,
                        boxShadow: "0 0 8px rgba(0,255,255,0.8)",
                        opacity: 0.6 + i * 0.08,
                      }}
                    />
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Content */}
            <RevealSection delay={0.15}>
              <div className="section-label mb-8">Why It Matters</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                The Cost of Being{" "}
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, hsl(0,84%,70%), hsl(0,84%,55%))" }}>
                  Unprepared
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                In an interconnected world, a single unpatched vulnerability can compromise entire organizations, 
                expose millions of users, and cause irreparable reputational damage.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Lock, title: "Data Protection", desc: "Safeguard intellectual property, financial data, and personal records from unauthorized access and exfiltration." },
                  { icon: Server, title: "System Availability", desc: "Ensure critical infrastructure remains operational against DDoS, ransomware, and insider threats." },
                  { icon: Database, title: "Regulatory Compliance", desc: "Meet GDPR, HIPAA, and SOC2 requirements by understanding and mitigating your attack surface." },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-white/2 group cursor-default"
                    >
                      <div className="mt-0.5 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                        <Icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 relative z-10">
        <div className="glow-divider mb-20 mx-auto max-w-7xl" />
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-14">
            <div className="section-label mb-5 mx-auto">Threat Landscape</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              The Numbers Don't Lie
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <RevealSection key={i} delay={i * 0.08}>
                  <div className="gradient-border-card p-8 text-center h-full group hover:scale-[1.02] transition-transform duration-300 cursor-default"
                    style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                    <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-4 opacity-70`} />
                    <div className={`text-4xl font-black font-mono mb-2 ${stat.color}`}
                      style={{ textShadow: stat.color.includes("primary") ? "0 0 20px rgba(0,255,255,0.4)" : "" }}>
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <div className="gradient-border-card p-12 md:p-16 text-center relative overflow-hidden"
              style={{ boxShadow: "0 0 80px rgba(0,255,255,0.08), 0 32px 80px rgba(0,0,0,0.5)" }}>
              <div className="absolute inset-0 cyber-dots opacity-30" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)" }} />
              <div className="relative z-10">
                <div className="section-label mb-6 mx-auto">Start Now</div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Ready to Strengthen Your Defenses?
                </h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                  Explore interactive modules, test yourself with real attack simulations, and use professional security tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/simulation" className="btn-primary-glow flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold">
                    <Zap className="w-4 h-4" />
                    Launch Simulator
                  </Link>
                  <Link href="/malware" className="btn-outline-glow flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold">
                    Browse Modules <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
