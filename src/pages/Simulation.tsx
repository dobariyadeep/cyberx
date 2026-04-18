import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  AlertTriangle, X, ShieldCheck, Eye, EyeOff, Lock,
  Mail, ArrowRight, CheckCircle2, ChevronRight, Globe,
  Wifi, Clock, Server, AlertCircle, Info
} from "lucide-react";

function RevealSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

const redFlags = [
  {
    icon: Globe,
    title: "Spoofed Domain",
    desc: "The URL reads securevau1t-login.com — the 'l' in vault is replaced by a '1'. Attackers register near-identical domains to fool victims.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: Lock,
    title: "No HTTPS Certificate",
    desc: "The padlock icon appears but the SSL certificate is self-signed, not issued by a trusted CA. Legitimate banks use EV certificates.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Mail,
    title: "Unsolicited Email Link",
    desc: "You were directed here via an urgent email claiming your account was compromised. Real banks never send direct login links.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: Clock,
    title: "Artificial Urgency",
    desc: "The page creates pressure with a countdown timer and 'immediate action required' language — classic social engineering tactics.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: Server,
    title: "Credential Exfiltration",
    desc: "On submission, credentials would be POSTed to an attacker-controlled server before redirecting you to the real site so you don't notice.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: Wifi,
    title: "Man-in-the-Middle Risk",
    desc: "Often deployed on public Wi-Fi networks, enabling attackers to intercept traffic and harvest credentials in real-time.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const protectionSteps = [
  "Always check the full URL in the address bar before entering credentials",
  "Look for the padlock AND verify the certificate issuer (click the lock)",
  "Never follow login links from emails — navigate directly to the site",
  "Enable two-factor authentication on all accounts",
  "Use a password manager — it won't autofill on fake domains",
  "Report phishing emails to your security team or email provider",
];

export default function Simulation() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [simComplete, setSimComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 1200);
  };

  const handleAcknowledge = () => {
    setShowModal(false);
    setSimComplete(true);
    setEmail("");
    setPassword("");
    setTimeout(() => {
      document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background aurora */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="aurora-1 absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)" }} />
        <div className="aurora-2 absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,150,255,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <RevealSection className="text-center mb-16">
          <div className="section-label mb-6 mx-auto">Interactive Module</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white leading-none">
            Phishing{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(192,100%,60%), hsl(200,100%,70%))" }}>
              Simulation
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience a real phishing attack in a completely safe environment. This simulation replicates 
            the exact tactics attackers use — enter any fake credentials to see what happens.
          </p>
        </RevealSection>

        {/* Main Simulation Area */}
        <RevealSection delay={0.1} className="mb-6">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "rgb(248,113,113)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              CONTROLLED ENVIRONMENT — NO DATA IS STORED
            </div>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Fake Phishing Page — LEFT (wider) */}
          <div className="lg:col-span-3">
            <RevealSection delay={0.15}>
              {/* Browser chrome mockup */}
              <div className="rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}>
                {/* Browser bar */}
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{ background: "rgba(20,28,45,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  </div>
                  {/* URL bar */}
                  <div className="flex-grow flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Lock className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span className="text-muted-foreground">https://</span>
                    <span className="text-white">securevau</span>
                    <span className="text-red-400 font-bold bg-red-500/15 px-0.5 rounded">1</span>
                    <span className="text-white">t-login.com/auth</span>
                    <AlertCircle className="w-3 h-3 text-red-400 ml-auto flex-shrink-0" />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono hidden sm:block">
                    <span className="text-amber-400">!</span> Unverified
                  </div>
                </div>

                {/* Page body — realistic bank login */}
                <div className="relative" style={{ background: "#f5f7fa" }}>
                  {/* Fake bank page header */}
                  <div className="flex items-center justify-between px-6 py-4"
                    style={{ background: "#1a3a5c", borderBottom: "3px solid #e8a020" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                        style={{ background: "#e8a020" }}>SV</div>
                      <div>
                        <div className="text-white font-bold text-sm tracking-wide">SecureVault</div>
                        <div className="text-white/60 text-[10px] uppercase tracking-widest">Private Banking</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-white/50 font-mono hidden sm:block">Customer Portal v4.1</div>
                  </div>

                  {/* Urgency banner */}
                  <div className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium"
                    style={{ background: "#fff3cd", borderBottom: "1px solid #ffc107", color: "#856404" }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs">
                      <strong>Security Alert:</strong> Unusual activity detected on your account. Please verify your identity immediately.
                    </span>
                  </div>

                  {/* Login form */}
                  <div className="flex justify-center px-6 py-10">
                    <div className="w-full max-w-sm">
                      <div className="bg-white rounded-xl shadow-lg p-8" style={{ border: "1px solid #e2e8f0" }}>
                        <div className="text-center mb-7">
                          <h2 className="text-xl font-bold text-gray-800 mb-1">Secure Sign In</h2>
                          <p className="text-xs text-gray-500">Verify your identity to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                          {/* Email field */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField(null)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm text-gray-800 bg-white outline-none transition-all"
                                style={{
                                  border: focusedField === "email" ? "2px solid #1a3a5c" : "1.5px solid #e2e8f0",
                                  boxShadow: focusedField === "email" ? "0 0 0 3px rgba(26,58,92,0.12)" : "none",
                                }}
                                data-testid="input-phishing-email"
                              />
                            </div>
                          </div>

                          {/* Password field */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
                              <a href="#" className="text-xs font-medium" style={{ color: "#1a3a5c" }}
                                onClick={(e) => e.preventDefault()}>Forgot?</a>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedField("password")}
                                onBlur={() => setFocusedField(null)}
                                className="w-full pl-10 pr-10 py-3 rounded-lg text-sm text-gray-800 bg-white outline-none transition-all"
                                style={{
                                  border: focusedField === "password" ? "2px solid #1a3a5c" : "1.5px solid #e2e8f0",
                                  boxShadow: focusedField === "password" ? "0 0 0 3px rgba(26,58,92,0.12)" : "none",
                                }}
                                data-testid="input-phishing-password"
                              />
                              <button type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Remember me */}
                          <div className="flex items-center gap-2 py-1">
                            <input type="checkbox" id="remember" className="rounded"
                              style={{ accentColor: "#1a3a5c" }} />
                            <label htmlFor="remember" className="text-xs text-gray-600">Keep me signed in</label>
                          </div>

                          {/* Submit button */}
                          <button
                            type="submit"
                            disabled={isLoading || !email || !password}
                            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                            style={{
                              background: email && password ? "#1a3a5c" : "#94a3b8",
                              cursor: email && password ? "pointer" : "not-allowed",
                              boxShadow: email && password ? "0 4px 12px rgba(26,58,92,0.3)" : "none",
                            }}
                            data-testid="button-phishing-submit"
                          >
                            {isLoading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                />
                                Verifying...
                              </>
                            ) : (
                              <>
                                Sign In Securely <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </form>

                        {/* Footer badges */}
                        <div className="mt-6 pt-5 flex items-center justify-center gap-4"
                          style={{ borderTop: "1px solid #f1f5f9" }}>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Lock className="w-3 h-3" /> 256-bit SSL
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <ShieldCheck className="w-3 h-3" /> FDIC Insured
                          </div>
                        </div>
                      </div>

                      {/* Explanation text below form */}
                      <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed px-2">
                        By signing in you agree to our Terms of Service and Privacy Policy. 
                        For help, contact support@securevau1t.com
                      </p>
                    </div>
                  </div>

                  {/* Page footer */}
                  <div className="px-6 py-4 text-center border-t"
                    style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                    <p className="text-[10px] text-gray-400">
                      &copy; 2024 SecureVault Financial, N.A. | Member FDIC | Equal Housing Lender
                    </p>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>

          {/* Right panel — indicators */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Instruction card */}
            <RevealSection delay={0.2}>
              <div className="gradient-border-card p-6">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  How This Works
                </h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-mono text-primary/60 font-bold text-xs mt-0.5 flex-shrink-0">01</span>
                    <span>The page on the left is a realistic phishing replica designed to harvest banking credentials.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-primary/60 font-bold text-xs mt-0.5 flex-shrink-0">02</span>
                    <span>Enter any fake email and password — the simulation is completely safe and stores nothing.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-primary/60 font-bold text-xs mt-0.5 flex-shrink-0">03</span>
                    <span>After submitting, a warning will explain what a real attacker would have done with your data.</span>
                  </li>
                </ol>
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-semibold">Tip:</span> Can you spot the red flags in the fake page before submitting?
                  </p>
                </div>
              </div>
            </RevealSection>

            {/* Spot the red flags */}
            <RevealSection delay={0.25}>
              <div className="gradient-border-card p-6 flex-grow">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Red Flags in This Page
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "URL uses '1' instead of 'l' in vault", found: true },
                    { label: "Urgency banner pressuring immediate action", found: true },
                    { label: "SSL badge present but domain unverified", found: true },
                    { label: "Support email uses same spoofed domain", found: true },
                    { label: "No 2FA or account verification step", found: true },
                  ].map((flag, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.07 }}
                      className="flex items-start gap-3 text-xs text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-2.5 h-2.5 text-red-400" />
                      </div>
                      <span>{flag.label}</span>
                    </motion.div>
                  ))}
                </div>

                {simComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-3 rounded-xl flex items-center gap-2.5"
                    style={{ background: "rgba(0,200,100,0.08)", border: "1px solid rgba(0,200,100,0.2)" }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-xs text-green-300 font-medium">Simulation complete. See analysis below.</p>
                  </motion.div>
                )}
              </div>
            </RevealSection>
          </div>
        </div>

        {/* Analysis Section — reveals after sim */}
        <AnimatePresence>
          {simComplete && (
            <motion.div
              id="analysis"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16"
            >
              <div className="glow-divider mb-16" />

              <div className="text-center mb-12">
                <div className="section-label mb-5 mx-auto" style={{ borderColor: "rgba(0,200,100,0.3)", color: "hsl(145,80%,55%)", background: "rgba(0,200,100,0.06)" }}>
                  Simulation Complete
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                  Attack <span className="text-primary text-glow-sm">Analysis</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Here's exactly how this phishing attack works and what an attacker would have done with your credentials.
                </p>
              </div>

              {/* Red flag grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
                {redFlags.map((flag, i) => {
                  const Icon = flag.icon;
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="gradient-border-card p-6"
                    >
                      <div className={`w-10 h-10 rounded-xl ${flag.bg} flex items-center justify-center mb-4 border ${flag.border}`}>
                        <Icon className={`w-5 h-5 ${flag.color}`} />
                      </div>
                      <h4 className="text-white font-bold mb-2 text-sm">{flag.title}</h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">{flag.desc}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Protection checklist */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="gradient-border-card p-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 cyber-dots opacity-15 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    <h3 className="text-xl font-bold text-white">How to Protect Yourself</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {protectionSteps.map((step, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.07 }}
                        className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-white/2 cursor-default"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── WARNING MODAL ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && handleAcknowledge()}
          >
            <motion.div
              initial={{ scale: 0.88, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="w-full max-w-lg rounded-2xl overflow-hidden relative"
              style={{
                background: "rgba(8, 12, 22, 0.98)",
                border: "1px solid rgba(239,68,68,0.3)",
                boxShadow: "0 0 80px rgba(239,68,68,0.15), 0 40px 100px rgba(0,0,0,0.8)",
              }}
            >
              {/* Red top stripe */}
              <div className="h-1 w-full"
                style={{ background: "linear-gradient(90deg, hsl(0,84%,50%), hsl(0,84%,65%), hsl(0,84%,50%))" }} />

              {/* Animated alert icon area */}
              <div className="pt-10 pb-6 px-8 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
                  className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center relative"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
                >
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                  <div className="absolute inset-0 rounded-2xl animate-ping"
                    style={{ background: "rgba(239,68,68,0.08)", animationDuration: "2s" }} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-2xl font-black text-white mb-2 tracking-tight"
                >
                  This Was a Phishing Simulation!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground leading-relaxed text-sm max-w-sm mx-auto"
                >
                  Never enter your credentials on unknown websites. You were just targeted by a simulated social engineering attack.
                </motion.p>
              </div>

              {/* What just happened */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mx-8 mb-6 rounded-xl overflow-hidden"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
              >
                <div className="px-4 py-2.5 border-b border-red-500/15">
                  <p className="text-xs font-mono text-red-400/80 uppercase tracking-widest">What Just Happened</p>
                </div>
                <div className="p-4 font-mono text-xs space-y-1.5">
                  <p className="text-muted-foreground">
                    <span className="text-red-400">01.</span> You landed on a spoofed banking login page
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-red-400">02.</span> You entered your credentials into a fake form
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-red-400">03.</span> In a real attack, credentials would be{" "}
                    <span className="text-red-300">exfiltrated instantly</span>
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-red-400">04.</span> You would be silently redirected to the real site
                  </p>
                </div>
              </motion.div>

              {/* Key warning callout */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mx-8 mb-7 p-4 rounded-xl flex items-start gap-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="text-white font-semibold">Remember: </span>
                  Legitimate companies will <span className="text-primary font-medium">never</span> send you an email with a direct login link or ask you to verify credentials via an unexpected alert.
                </p>
              </motion.div>

              {/* Action buttons */}
              <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcknowledge}
                  className="flex-1 btn-primary-glow py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  data-testid="button-modal-acknowledge"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I Understand — View Analysis
                </button>
                <button
                  onClick={handleAcknowledge}
                  className="btn-outline-glow py-3.5 px-5 rounded-xl text-sm font-semibold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
