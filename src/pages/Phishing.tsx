import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  MailWarning, AlertTriangle, CheckCircle, X, ShieldAlert,
  Trophy, RefreshCw, Eye, ChevronRight, Star, Crosshair,
  Target, Info,
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

/* ─── clue definitions ───────────────────────────── */
interface Clue {
  id: string;
  label: string;
  title: string;
  explanation: string;
  severity: "high" | "medium" | "low";
  tip: string;
}

const CLUES: Clue[] = [
  {
    id: "sender",
    label: "Spoofed Sender",
    title: "Spoofed Email Address",
    explanation: "The sender is 'IT Support <security@micros0ft-update.com>' — the domain uses a zero (0) instead of the letter 'o' in Microsoft. This is called typosquatting: registering a near-identical domain to deceive recipients.",
    severity: "high",
    tip: "Always expand and read the full sender address — display names can say anything.",
  },
  {
    id: "subject",
    label: "Urgency in Subject",
    title: "Artificial Urgency",
    explanation: "The subject 'URGENT: Your account will be locked in 2 hours' uses all-caps and a countdown to create panic. This is deliberate social engineering — fear and time pressure short-circuit rational thinking.",
    severity: "high",
    tip: "Legitimate companies don't use uppercase 'URGENT' threats with hard deadlines in subjects.",
  },
  {
    id: "greeting",
    label: "Generic Greeting",
    title: "Impersonal Salutation",
    explanation: "'Dear Customer' instead of your actual name is a strong phishing indicator. Real companies that have your account details will always address you by name because they have it on file.",
    severity: "medium",
    tip: "Any organization with an account for you knows your name. Generic greetings = mass phishing blast.",
  },
  {
    id: "threat",
    label: "Fear Tactic",
    title: "Threat of Data Loss",
    explanation: "'All your data will be permanently deleted' is a threat designed to paralyze your critical thinking. No legitimate organization deletes data without prior notice and a formal process.",
    severity: "high",
    tip: "Threats about permanent data loss are almost exclusively used in phishing emails.",
  },
  {
    id: "button",
    label: "Malicious Link",
    title: "Spoofed CTA Button",
    explanation: "The 'Verify Account Now' button appears to be from Microsoft, but hovering would reveal it points to http://login-secure-verify-update.ru/auth/ — a completely different (and malicious) domain. Never click email buttons without inspecting the actual URL first.",
    severity: "high",
    tip: "Always hover over links before clicking. The displayed text and actual URL are independent.",
  },
  {
    id: "footer",
    label: "Missing Branding",
    title: "No Official Branding",
    explanation: "Real Microsoft emails include official logos, consistent brand colors, legal disclaimers, and an unsubscribe footer. This email has none of these — just a plain 'The Security Team' signature, which anyone can write.",
    severity: "medium",
    tip: "Absence of official branding, logos, and legal footer text is a strong phishing signal.",
  },
];

const SEVERITY_CFG = {
  high:   { color: "text-red-400",   bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   badge: "bg-red-500/15 text-red-400 border-red-500/30" },
  medium: { color: "text-amber-400", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  low:    { color: "text-blue-400",  bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.25)",  badge: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
};

/* score label */
function scoreLabel(found: number, total: number) {
  const pct = found / total;
  if (pct === 1)   return { label: "Expert Analyst", color: "#22c55e", icon: Trophy };
  if (pct >= 0.67) return { label: "Threat Hunter",  color: "#f59e0b", icon: Star };
  return { label: "Awareness Beginner", color: "#ef4444", icon: ShieldAlert };
}

/* ─── Clue Spot ─────────────────────────────────── */
function ClueSpot({
  id, children, found, onClick, inline = false,
}: {
  id: string; children: React.ReactNode; found: boolean; onClick: (id: string) => void; inline?: boolean;
}) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag
      onClick={() => onClick(id)}
      className={[
        "relative cursor-pointer rounded transition-all duration-200 select-none",
        inline ? "inline" : "block",
        found
          ? "bg-green-400/20 outline outline-2 outline-green-400"
          : "bg-amber-400/10 outline outline-2 outline-amber-400/60 hover:bg-amber-400/20 hover:outline-amber-400",
      ].join(" ")}
      title={found ? "✓ Found!" : "Click to inspect"}
    >
      {children}
      {!found && (
        <span className="inline-flex items-center gap-0.5 ml-1 text-[9px] font-mono text-amber-400/80 bg-amber-400/10 px-1 rounded align-middle">
          <Target className="w-2.5 h-2.5 inline" /> inspect
        </span>
      )}
      {found && (
        <span className="inline-flex items-center gap-0.5 ml-1 text-[9px] font-mono text-green-400 bg-green-400/10 px-1 rounded align-middle">
          <CheckCircle className="w-2.5 h-2.5 inline" /> found
        </span>
      )}
    </Tag>
  );
}

/* ─── Popup ──────────────────────────────────────── */
function CluePopup({ clue, onClose }: { clue: Clue; onClose: () => void }) {
  const cfg = SEVERITY_CFG[clue.severity];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.88, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(8,12,22,0.98)",
          border: `1px solid ${cfg.border}`,
          boxShadow: `0 0 60px ${cfg.bg}, 0 40px 80px rgba(0,0,0,0.7)`,
        }}
      >
        {/* top stripe */}
        <div className="h-1" style={{ background: clue.severity === "high" ? "#ef4444" : clue.severity === "medium" ? "#f59e0b" : "#60a5fa" }} />

        <div className="p-7">
          {/* header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <AlertTriangle className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-tight">{clue.title}</h3>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 inline-block ${cfg.badge}`}>
                  {clue.severity} risk
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors flex-shrink-0 mt-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* explanation */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {clue.explanation}
          </p>

          {/* tip */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-6"
            style={{ background: "rgba(0,150,255,0.06)", border: "1px solid rgba(0,150,255,0.15)" }}>
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-primary font-semibold">Tip: </span>{clue.tip}
            </p>
          </div>

          <button onClick={onClose} className="w-full btn-primary-glow py-3 rounded-xl text-sm font-bold">
            Got it — keep hunting
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Results Screen ─────────────────────────────── */
function ResultScreen({ found, total, onReset }: { found: number; total: number; onReset: () => void }) {
  const { label, color, icon: Icon } = scoreLabel(found, total);
  const pct = Math.round((found / total) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-10 flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 relative"
        style={{ background: `${color}15`, border: `2px solid ${color}40`, boxShadow: `0 0 50px ${color}20` }}
      >
        <Icon className="w-12 h-12" style={{ color }} />
      </motion.div>

      <h3 className="text-3xl font-black text-white mb-2">{label}</h3>
      <p className="text-muted-foreground mb-6 text-sm">
        You spotted <span className="font-bold" style={{ color }}>{found}</span> out of {total} red flags
      </p>

      {/* score bar */}
      <div className="w-56 mb-8">
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          />
        </div>
        <p className="text-center text-xs font-mono mt-2" style={{ color }}>{pct}% accuracy</p>
      </div>

      {/* feedback message */}
      <div className="max-w-sm mb-8 p-4 rounded-xl text-sm text-muted-foreground leading-relaxed"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {found === total
          ? "Outstanding! You identified every single red flag in this phishing email. Your awareness level is exceptional — you'd make a great cybersecurity analyst."
          : found >= 4
          ? "Strong performance. You caught most of the major threat indicators. Review the ones you missed to sharpen your instincts further."
          : "Phishing emails are deliberately designed to look convincing. Study the missed clues and try again — this awareness could protect you one day."}
      </div>

      <button onClick={onReset} className="btn-outline-glow px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-sm">
        <RefreshCw className="w-4 h-4" /> Play Again
      </button>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────── */
export default function Phishing() {
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set());
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleClick = (id: string) => {
    const clue = CLUES.find(c => c.id === id)!;
    setActiveClue(clue);
    setFoundIds(prev => new Set([...prev, id]));
  };

  const handleClose = () => {
    setActiveClue(null);
    if (foundIds.size === CLUES.length) {
      setTimeout(() => setShowResults(true), 400);
    }
  };

  const handleReset = () => {
    setFoundIds(new Set());
    setActiveClue(null);
    setShowResults(false);
  };

  const remaining = CLUES.length - foundIds.size;

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 relative overflow-hidden">
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="aurora-1 absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto">

        {/* ── HEADER ───────────────────────────────── */}
        <RevealSection className="text-center mb-14">
          <div className="section-label mb-6 mx-auto" style={{
            borderColor: "rgba(245,158,11,0.3)",
            color: "hsl(43,96%,65%)",
            background: "rgba(245,158,11,0.06)",
          }}>
            Threat Module 02
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white leading-none">
            Spot the{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(43,96%,60%), hsl(30,95%,60%))" }}>
              Phishing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            This email contains <strong className="text-white">{CLUES.length} hidden red flags</strong>. 
            Click on every suspicious element to reveal what attackers are trying to hide.
          </p>
        </RevealSection>

        {/* ── QUIZ AREA ───────────────────────────── */}
        <RevealSection delay={0.1} className="mb-10">
          <div className="gradient-border-card p-6 lg:p-8">

            {/* progress bar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Crosshair className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-white">
                  {foundIds.size} / {CLUES.length} red flags found
                </span>
                {remaining > 0 && (
                  <span className="text-xs text-muted-foreground font-mono">
                    — {remaining} remaining
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* clue pip indicators */}
                <div className="flex gap-1.5">
                  {CLUES.map(c => (
                    <div key={c.id}
                      className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        background: foundIds.has(c.id) ? "#22c55e" : "rgba(255,255,255,0.12)",
                        boxShadow: foundIds.has(c.id) ? "0 0 6px #22c55e" : "none",
                      }} />
                  ))}
                </div>
                {foundIds.size > 0 && (
                  <button onClick={handleReset}
                    className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1 font-mono">
                    <RefreshCw className="w-3 h-3" /> reset
                  </button>
                )}
              </div>
            </div>

            <div className="w-full h-1.5 rounded-full overflow-hidden mb-8"
              style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${(foundIds.size / CLUES.length) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: "linear-gradient(90deg, #f59e0b, #22c55e)", boxShadow: "0 0 8px rgba(245,158,11,0.4)" }}
              />
            </div>

            {showResults ? (
              <ResultScreen found={foundIds.size} total={CLUES.length} onReset={handleReset} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* ── FAKE EMAIL ── */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <p className="text-xs text-muted-foreground font-mono">
                      Click the <span className="text-amber-400">highlighted</span> areas to inspect them
                    </p>
                  </div>

                  {/* Email chrome */}
                  <div className="rounded-2xl overflow-hidden"
                    style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)" }}>

                    {/* browser bar */}
                    <div className="flex items-center gap-3 px-4 py-3"
                      style={{ background: "rgba(20,28,45,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                        <div className="w-3 h-3 rounded-full bg-green-500/40" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">Inbox — Microsoft Outlook</span>
                    </div>

                    {/* Email itself — white background */}
                    <div style={{ background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>

                      {/* Email header */}
                      <div className="px-6 py-5" style={{ borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-grow min-w-0">
                            <p className="text-xs text-gray-500 mb-1.5">From</p>
                            <ClueSpot id="sender" found={foundIds.has("sender")} onClick={handleClick} inline>
                              <span style={{ color: "#1e293b", fontSize: "13px" }}>
                                IT Support &lt;security@micros<strong style={{ color: "#ef4444" }}>0</strong>ft-update.com&gt;
                              </span>
                            </ClueSpot>
                          </div>
                          <span style={{ color: "#94a3b8", fontSize: "12px", flexShrink: 0 }}>Today, 14:23</span>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1.5">Subject</p>
                          <ClueSpot id="subject" found={foundIds.has("subject")} onClick={handleClick} inline>
                            <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "14px" }}>
                              URGENT: Your account will be locked in 2 hours
                            </span>
                          </ClueSpot>
                        </div>
                      </div>

                      {/* Email body */}
                      <div className="px-6 py-6" style={{ background: "#fff" }}>
                        {/* Fake MS logo area */}
                        <div className="mb-5 pb-4" style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-black"
                              style={{ background: "linear-gradient(135deg, #0078d4, #00bcf2)", fontSize: "11px" }}>
                              M
                            </div>
                            <span style={{ color: "#0078d4", fontWeight: 700, fontSize: "14px" }}>Microsoft</span>
                          </div>
                        </div>

                        <p style={{ color: "#374151", fontSize: "14px", marginBottom: "16px" }}>
                          <ClueSpot id="greeting" found={foundIds.has("greeting")} onClick={handleClick} inline>
                            Dear Customer,
                          </ClueSpot>
                        </p>

                        <p style={{ color: "#374151", fontSize: "14px", marginBottom: "16px", lineHeight: 1.6 }}>
                          We have detected suspicious login attempts on your account from a foreign IP address. 
                          For your security, your account has been temporarily restricted and requires immediate verification.
                        </p>

                        <p style={{ fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
                          <ClueSpot id="threat" found={foundIds.has("threat")} onClick={handleClick} inline>
                            <span style={{ color: "#ef4444", fontWeight: 600 }}>
                              You must verify your identity within 2 hours, otherwise all your data will be permanently deleted and your account closed.
                            </span>
                          </ClueSpot>
                        </p>

                        <div className="text-center mb-6">
                          <ClueSpot id="button" found={foundIds.has("button")} onClick={handleClick} inline={false}
                            >
                            <div className="inline-block py-3 px-8 rounded-lg text-white font-bold text-sm cursor-pointer"
                              style={{ background: "#0078d4", boxShadow: "0 2px 8px rgba(0,120,212,0.3)" }}>
                              Verify Account Now →
                            </div>
                            <p className="text-[10px] font-mono mt-1" style={{ color: "#ef4444" }}>
                              http://login-secure-verify-update.ru/auth/
                            </p>
                          </ClueSpot>
                        </div>

                        <div className="pt-4" style={{ borderTop: "1px solid #e2e8f0" }}>
                          <ClueSpot id="footer" found={foundIds.has("footer")} onClick={handleClick} inline={false}>
                            <p style={{ color: "#6b7280", fontSize: "12px" }}>Thank you,</p>
                            <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 600 }}>The Security Team</p>
                          </ClueSpot>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SIDE PANEL ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                  {/* Instructions */}
                  <div className="gradient-border-card p-5">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" /> How to Play
                    </h3>
                    <ol className="space-y-2.5 text-xs text-muted-foreground">
                      {[
                        "Read the email carefully like a real user would.",
                        "Click any highlighted text that looks suspicious.",
                        "A popup explains what the attacker is doing.",
                        "Find all 6 red flags to get your score!",
                      ].map((step, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="font-mono text-primary/60 font-bold flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Clue tracker */}
                  <div className="gradient-border-card p-5 flex-grow">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" /> Red Flags
                    </h3>
                    <div className="space-y-2.5">
                      {CLUES.map((clue) => {
                        const found = foundIds.has(clue.id);
                        const cfg = SEVERITY_CFG[clue.severity];
                        return (
                          <motion.div key={clue.id}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 p-2.5 rounded-lg transition-all"
                            style={{
                              background: found ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)",
                              border: found ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,255,255,0.06)",
                            }}>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                background: found ? "rgba(34,197,94,0.15)" : cfg.bg,
                                border: found ? "1px solid rgba(34,197,94,0.4)" : `1px solid ${cfg.border}`,
                              }}>
                              {found
                                ? <CheckCircle className="w-3 h-3 text-green-400" />
                                : <span className="w-1.5 h-1.5 rounded-full" style={{ background: clue.severity === "high" ? "#ef4444" : "#f59e0b" }} />}
                            </div>
                            <span className={`text-xs font-medium ${found ? "text-green-300" : "text-muted-foreground"}`}>
                              {found ? clue.label : "???"}
                            </span>
                            {!found && (
                              <span className={`ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>
                                {clue.severity}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {foundIds.size === CLUES.length && !showResults && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setShowResults(true)}
                        className="w-full mt-4 btn-primary-glow py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <Trophy className="w-4 h-4" /> See My Score
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </RevealSection>

        {/* ── INFO CARDS ───────────────────────────── */}
        <RevealSection delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: MailWarning, title: "Phishing Statistics", color: "text-amber-400", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
                facts: ["90% of data breaches begin with a phishing email", "3.4 billion phishing emails are sent every single day", "Average cost of a phishing attack: $4.91 million"] },
              { icon: AlertTriangle, title: "Common Tactics", color: "text-red-400", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)",
                facts: ["Spoofed sender domains (typosquatting)", "Artificial urgency and fear-based language", "Lookalike login pages to steal credentials"] },
              { icon: ShieldAlert, title: "How to Stay Safe", color: "text-primary", bg: "rgba(0,150,255,0.08)", border: "rgba(0,150,255,0.2)",
                facts: ["Verify sender addresses character by character", "Hover over links before clicking to see the real URL", "When in doubt, go to the site directly — not via the email"] },
            ].map(({ icon: Icon, title, color, bg, border, facts }) => (
              <div key={title} className="gradient-border-card p-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: "18px", height: "18px" }} />
                </div>
                <h4 className="text-sm font-bold text-white mb-3">{title}</h4>
                <ul className="space-y-2">
                  {facts.map(f => (
                    <li key={f} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                      <ChevronRight className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>

      {/* ── CLUE POPUP ───────────────────────────── */}
      <AnimatePresence>
        {activeClue && <CluePopup clue={activeClue} onClose={handleClose} />}
      </AnimatePresence>
    </div>
  );
}
