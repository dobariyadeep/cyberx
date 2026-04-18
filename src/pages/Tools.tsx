import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Link2, Key, CheckCircle, XCircle, AlertTriangle,
  Search, ShieldCheck, ShieldAlert, ShieldX,
  Globe, Lock, AlertCircle, ChevronRight, Eye, EyeOff,
  Zap, Info, RefreshCw,
} from "lucide-react";

function RevealSection({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
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

type RiskLevel = "idle" | "scanning" | "safe" | "suspicious" | "danger";

interface UrlFlag {
  label: string;
  detail: string;
  severity: "high" | "medium" | "low";
}

interface UrlAnalysis {
  level: RiskLevel;
  score: number;
  flags: UrlFlag[];
  protocol: string;
  domain: string;
  path: string;
}

const HIGH_RISK_KEYWORDS = [
  "login", "verify", "bank", "secure-login", "account-update",
  "confirm", "credential", "password-reset", "signin", "auth-verify",
  "paypal-verify", "amazon-security", "apple-id", "win", "prize", "claim",
];

const MEDIUM_RISK_KEYWORDS = [
  "free", "click", "update", "billing", "support", "wallet",
  "recover", "suspend", "alert", "limited", "access",
];

const HIGH_RISK_TLDS = [".ru", ".tk", ".ml", ".ga", ".cf", ".gq", ".cc", ".pw"];
const MEDIUM_RISK_TLDS = [".xyz", ".top", ".click", ".link", ".online", ".site", ".club"];

const TRUSTED_DOMAINS = ["google.com", "github.com", "microsoft.com", "apple.com",
  "amazon.com", "facebook.com", "twitter.com", "linkedin.com", "youtube.com"];

function analyzeUrl(rawUrl: string): UrlAnalysis {
  const lower = rawUrl.toLowerCase().trim();
  const flags: UrlFlag[] = [];
  let score = 0;

  let protocol = "unknown";
  let domain = "";
  let path = "";

  try {
    const parsed = new URL(rawUrl.startsWith("http") ? rawUrl : "https://" + rawUrl);
    protocol = parsed.protocol.replace(":", "");
    domain = parsed.hostname;
    path = parsed.pathname + parsed.search;
  } catch {
    domain = lower.split("/")[0];
    path = "/" + lower.split("/").slice(1).join("/");
  }

  if (protocol === "http") {
    score += 25;
    flags.push({
      label: "Unencrypted HTTP Protocol",
      detail: "This URL uses HTTP instead of HTTPS, meaning data is transmitted in plain text with no encryption.",
      severity: "high",
    });
  }

  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}/;
  if (ipRegex.test(domain)) {
    score += 30;
    flags.push({
      label: "Raw IP Address as Domain",
      detail: `The domain is an IP address (${domain}) rather than a named domain — a classic phishing and malware delivery tactic.`,
      severity: "high",
    });
  }

  const isTrusted = TRUSTED_DOMAINS.some(d => domain === d || domain.endsWith("." + d));

  if (!isTrusted) {
    for (const kw of HIGH_RISK_KEYWORDS) {
      if (lower.includes(kw)) {
        score += 20;
        flags.push({
          label: `High-Risk Keyword: "${kw}"`,
          detail: `The URL contains "${kw}" — commonly used in phishing pages designed to steal credentials or trick users into verifying accounts.`,
          severity: "high",
        });
        break;
      }
    }
    for (const kw of MEDIUM_RISK_KEYWORDS) {
      if (lower.includes(kw)) {
        score += 10;
        flags.push({
          label: `Suspicious Keyword: "${kw}"`,
          detail: `The word "${kw}" is frequently associated with spam, scam, or social-engineering attacks.`,
          severity: "medium",
        });
        break;
      }
    }
  }

  for (const tld of HIGH_RISK_TLDS) {
    if (domain.endsWith(tld) || lower.includes(tld + "/")) {
      score += 30;
      flags.push({
        label: `High-Risk TLD: "${tld}"`,
        detail: `The "${tld}" top-level domain is frequently abused by threat actors due to low cost and minimal registration checks.`,
        severity: "high",
      });
      break;
    }
  }

  for (const tld of MEDIUM_RISK_TLDS) {
    if (domain.endsWith(tld)) {
      score += 15;
      flags.push({
        label: `Non-Standard TLD: "${tld}"`,
        detail: `"${tld}" is not commonly used by legitimate organizations and appears frequently in phishing and malware campaigns.`,
        severity: "medium",
      });
      break;
    }
  }

  const subParts = domain.split(".");
  if (subParts.length > 4) {
    score += 15;
    flags.push({
      label: "Excessive Subdomain Depth",
      detail: `The domain has ${subParts.length - 2} subdomains (${domain}) — attackers use deep subdomains to mimic legitimate services (e.g. login.paypal.com.attacker.com).`,
      severity: "medium",
    });
  }

  const hexOrObfuscation = /%[0-9a-f]{2}/i.test(rawUrl) || rawUrl.includes("//");
  if (hexOrObfuscation && !rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
    score += 15;
    flags.push({
      label: "URL Obfuscation Detected",
      detail: "The URL contains percent-encoding or double-slashes used to disguise the real destination from users and filters.",
      severity: "medium",
    });
  }

  if (path && path.length > 120) {
    score += 10;
    flags.push({
      label: "Unusually Long URL Path",
      detail: "Extremely long URLs are often used to bury tracking parameters or hide the actual destination from users.",
      severity: "low",
    });
  }

  score = Math.min(score, 100);
  let level: RiskLevel = "safe";
  if (score >= 60) level = "danger";
  else if (score >= 25) level = "suspicious";

  return { level, score, flags, protocol, domain, path };
}

const PASSWORD_TIPS = [
  { label: "8+ characters", check: (p: string) => p.length >= 8 },
  { label: "12+ characters", check: (p: string) => p.length >= 12 },
  { label: "Uppercase letter", check: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", check: (p: string) => /[a-z]/.test(p) },
  { label: "Number (0–9)", check: (p: string) => /[0-9]/.test(p) },
  { label: "Special character", check: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function calcPasswordStrength(pass: string) {
  if (!pass) return { score: 0, pct: 0, label: "Empty", color: "#334155" };
  let score = PASSWORD_TIPS.filter(t => t.check(pass)).length;
  if (score <= 2) return { score, pct: Math.round((score / 6) * 100), label: "Weak", color: "#ef4444" };
  if (score <= 4) return { score, pct: Math.round((score / 6) * 100), label: "Moderate", color: "#f59e0b" };
  return { score, pct: Math.round((score / 6) * 100), label: "Strong", color: "#22c55e" };
}

const RISK_CONFIG = {
  safe: {
    icon: ShieldCheck,
    label: "Low Risk",
    sublabel: "No obvious threats detected",
    accent: "#22c55e",
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.25)",
    iconBg: "rgba(34,197,94,0.12)",
    bar: "hsl(142,71%,45%)",
  },
  suspicious: {
    icon: ShieldAlert,
    label: "Suspicious",
    sublabel: "Proceed with caution",
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.25)",
    iconBg: "rgba(245,158,11,0.12)",
    bar: "hsl(43,96%,56%)",
  },
  danger: {
    icon: ShieldX,
    label: "High Risk",
    sublabel: "Do NOT visit this URL",
    accent: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.25)",
    iconBg: "rgba(239,68,68,0.12)",
    bar: "hsl(0,84%,60%)",
  },
};

export default function Tools() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<UrlAnalysis | null>(null);
  const [scanning, setScanning] = useState(false);
  const [expandedFlag, setExpandedFlag] = useState<number | null>(null);

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const passStrength = calcPasswordStrength(password);

  const handleCheck = () => {
    if (!url.trim()) return;
    setScanning(true);
    setAnalysis(null);
    setTimeout(() => {
      setAnalysis(analyzeUrl(url));
      setScanning(false);
    }, 900);
  };

  const handleReset = () => {
    setUrl("");
    setAnalysis(null);
    setExpandedFlag(null);
  };

  const riskCfg = analysis ? RISK_CONFIG[analysis.level as keyof typeof RISK_CONFIG] : null;

  const severityColor: Record<string, string> = {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-blue-400",
  };
  const severityBg: Record<string, string> = {
    high: "rgba(239,68,68,0.08)",
    medium: "rgba(245,158,11,0.08)",
    low: "rgba(59,130,246,0.08)",
  };
  const severityBorder: Record<string, string> = {
    high: "rgba(239,68,68,0.2)",
    medium: "rgba(245,158,11,0.2)",
    low: "rgba(59,130,246,0.2)",
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 relative overflow-hidden">
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="aurora-1 absolute top-0 left-[-15%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,150,255,0.04) 0%, transparent 70%)" }} />
        <div className="aurora-2 absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <RevealSection className="text-center mb-16">
          <div className="section-label mb-6 mx-auto">Security Utilities</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white leading-none">
            Threat{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(192,100%,60%), hsl(200,100%,70%))" }}>
              Analysis
            </span>{" "}
            Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Practical security utilities to evaluate potential threats and strengthen your digital defenses.
          </p>
        </RevealSection>

        {/* ── URL SAFETY CHECKER ─────────────────────────────────────── */}
        <RevealSection delay={0.1} className="mb-10">
          <div className="gradient-border-card p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute inset-0 cyber-dots opacity-10 pointer-events-none" />
            <div className="relative z-10">

              {/* Tool header */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,150,255,0.1)", border: "1px solid rgba(0,150,255,0.2)" }}>
                    <Link2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">URL Safety Checker</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Analyze any link for phishing patterns, malicious keywords, risky domains &amp; more
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
                  style={{ background: "rgba(0,150,255,0.06)", border: "1px solid rgba(0,150,255,0.15)", color: "hsl(192,100%,65%)" }}>
                  <Zap className="w-3 h-3" /> Client-side only
                </div>
              </div>

              {/* Input row */}
              <div className="flex gap-3 mb-8">
                <div className="relative flex-grow">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Paste a URL to check  (e.g. http://bank-verify-login.ru/account)"
                    className="w-full py-4 pl-11 pr-4 rounded-xl font-mono text-sm text-white focus:outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1.5px solid rgba(255,255,255,0.09)",
                    }}
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setAnalysis(null); }}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    onFocus={(e) => (e.currentTarget.style.border = "1.5px solid hsl(192,100%,60%)")}
                    onBlur={(e) => (e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.09)")}
                  />
                </div>
                {analysis && (
                  <button onClick={handleReset}
                    className="px-4 py-4 rounded-xl text-muted-foreground hover:text-white transition-colors flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.09)" }}
                    title="Reset">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleCheck}
                  disabled={scanning || !url.trim()}
                  className="btn-primary-glow px-7 py-4 rounded-xl font-bold text-sm flex items-center gap-2 flex-shrink-0"
                  style={{ opacity: !url.trim() ? 0.5 : 1 }}
                >
                  {scanning ? (
                    <>
                      <motion.div animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Scanning…
                    </>
                  ) : (
                    <><Search className="w-4 h-4" /> Check</>
                  )}
                </button>
              </div>

              {/* Result area */}
              <AnimatePresence mode="wait">
                {scanning && (
                  <motion.div key="scanning"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="rounded-2xl p-8 flex flex-col items-center gap-4"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        className="w-12 h-12 border-2 rounded-full"
                        style={{ borderColor: "rgba(0,150,255,0.15)", borderTopColor: "hsl(192,100%,60%)" }}
                      />
                      <Shield className="absolute inset-0 m-auto w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      <span className="text-primary">$</span> running threat intelligence scan…
                    </p>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {analysis && riskCfg && (
                  <motion.div key="result"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Risk header card */}
                    <div className="rounded-2xl p-6 mb-5 relative overflow-hidden"
                      style={{ background: riskCfg.bg, border: `1px solid ${riskCfg.border}` }}>
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: riskCfg.iconBg, border: `1px solid ${riskCfg.border}` }}>
                          <riskCfg.icon className="w-7 h-7" style={{ color: riskCfg.accent }} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-1">
                            <h3 className="text-2xl font-black" style={{ color: riskCfg.accent }}>
                              {riskCfg.label}
                            </h3>
                            <span className="text-sm text-muted-foreground">{riskCfg.sublabel}</span>
                          </div>
                          {/* Risk score bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                              <span className="text-muted-foreground">Risk Score</span>
                              <span style={{ color: riskCfg.accent }} className="font-bold">
                                {analysis.score}/100
                              </span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden"
                              style={{ background: "rgba(255,255,255,0.07)" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.score}%` }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full"
                                style={{ background: riskCfg.bar }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* URL anatomy breakdown */}
                    <div className="rounded-xl px-4 py-3 mb-5 font-mono text-xs flex flex-wrap items-center gap-x-1 gap-y-1 overflow-x-auto"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <span className="text-muted-foreground">Parsed:</span>
                      <span style={{ color: analysis.protocol === "http" ? "#ef4444" : "#22c55e" }}>
                        {analysis.protocol}://
                      </span>
                      <span className={analysis.score >= 60 ? "text-red-300" : analysis.score >= 25 ? "text-amber-300" : "text-green-300"}>
                        {analysis.domain}
                      </span>
                      <span className="text-muted-foreground break-all">{analysis.path || "/"}</span>
                    </div>

                    {/* Flags list */}
                    {analysis.flags.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" />
                          Threat Indicators ({analysis.flags.length})
                        </p>
                        {analysis.flags.map((flag, i) => (
                          <motion.div key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                          >
                            <button
                              onClick={() => setExpandedFlag(expandedFlag === i ? null : i)}
                              className="w-full text-left rounded-xl px-4 py-3 transition-all group"
                              style={{
                                background: severityBg[flag.severity],
                                border: `1px solid ${severityBorder[flag.severity]}`,
                              }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${severityColor[flag.severity]}`} />
                                  <span className={`text-sm font-semibold ${severityColor[flag.severity]}`}>
                                    {flag.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full"
                                    style={{
                                      background: severityBg[flag.severity],
                                      border: `1px solid ${severityBorder[flag.severity]}`,
                                      color: flag.severity === "high" ? "#ef4444" : flag.severity === "medium" ? "#f59e0b" : "#60a5fa",
                                    }}>
                                    {flag.severity}
                                  </span>
                                  <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${expandedFlag === i ? "rotate-90" : ""}`} />
                                </div>
                              </div>
                              <AnimatePresence>
                                {expandedFlag === i && (
                                  <motion.p
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-2 text-xs text-muted-foreground leading-relaxed overflow-hidden pl-7"
                                  >
                                    {flag.detail}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 rounded-xl mb-4"
                        style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <p className="text-sm text-green-300">
                          No threat indicators detected. Always verify URLs by navigating directly to the site.
                        </p>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2.5 mt-2 p-3 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This is a heuristic analysis tool for educational purposes. It cannot definitively classify all threats.
                        When in doubt, do not click.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Example test URLs */}
              {!analysis && !scanning && (
                <div className="mt-6 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-mono mr-1">Try:</span>
                  {[
                    "http://bank-login-verify.ru/account",
                    "https://secure-paypal-verify.tk",
                    "https://github.com",
                  ].map((example) => (
                    <button key={example}
                      onClick={() => { setUrl(example); setAnalysis(null); }}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-white"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {example}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </RevealSection>

        {/* ── PASSWORD STRENGTH ANALYZER ─────────────────────────────── */}
        <RevealSection delay={0.15}>
          <div className="gradient-border-card p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute inset-0 cyber-dots opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Key className="w-6 h-6" style={{ color: "hsl(263,70%,70%)" }} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Password Strength Analyzer</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Evaluate cryptographic strength against brute-force and dictionary attacks
                  </p>
                </div>
              </div>

              {/* Input */}
              <div className="relative mb-8">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Type any password to test (nothing is stored or sent)"
                  className="w-full py-4 pl-11 pr-12 rounded-xl font-mono text-sm text-white focus:outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1.5px solid rgba(255,255,255,0.09)",
                    letterSpacing: showPass ? "normal" : "0.15em",
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.border = "1.5px solid hsl(263,70%,70%)")}
                  onBlur={(e) => (e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.09)")}
                />
                <button onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left — strength meter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground font-mono">Strength</span>
                    <motion.span key={passStrength.label}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-bold font-mono"
                      style={{ color: passStrength.color }}>
                      {passStrength.label.toUpperCase()}
                    </motion.span>
                  </div>

                  {/* Segmented bar */}
                  <div className="flex gap-1.5 mb-6">
                    {[1, 2, 3, 4, 5, 6].map((seg) => (
                      <motion.div key={seg}
                        className="flex-1 h-2.5 rounded-full"
                        animate={{
                          background: passStrength.score >= seg
                            ? passStrength.color
                            : "rgba(255,255,255,0.07)",
                        }}
                        transition={{ duration: 0.3, delay: seg * 0.04 }}
                      />
                    ))}
                  </div>

                  {/* Crack time estimate */}
                  <div className="p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">Est. Crack Time</p>
                    <p className="text-lg font-black font-mono" style={{ color: passStrength.color }}>
                      {!password ? "—"
                        : passStrength.label === "Weak" ? "< 1 second"
                        : passStrength.label === "Moderate" ? "A few hours"
                        : "Centuries+"}
                    </p>
                  </div>
                </div>

                {/* Right — checklist */}
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">Requirements</p>
                  <div className="space-y-2.5">
                    {PASSWORD_TIPS.map((tip, i) => {
                      const passed = password ? tip.check(password) : false;
                      return (
                        <motion.div key={i}
                          className="flex items-center gap-3 text-sm"
                          animate={{ opacity: password ? 1 : 0.5 }}
                        >
                          <motion.div
                            animate={{ scale: passed ? [1.2, 1] : 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {passed
                              ? <CheckCircle className="w-4 h-4 text-green-400" />
                              : <XCircle className="w-4 h-4 text-muted-foreground/40" />}
                          </motion.div>
                          <span className={passed ? "text-white" : "text-muted-foreground"}>
                            {tip.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
