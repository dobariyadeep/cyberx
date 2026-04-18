import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Network, Server, Play, Square, RefreshCw, Wifi, Cpu, MemoryStick, Activity, AlertTriangle, ShieldOff, Zap } from "lucide-react";

/* ─── types ─────────────────────────────────────── */
interface Packet {
  id: number;
  startX: number;
  startY: number;
  color: string;
  shadow: string;
  duration: number;
  delay: number;
  size: number;
}

type ServerStatus = "online" | "warning" | "critical" | "down";

/* ─── helpers ───────────────────────────────────── */
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

const STATUS_CFG: Record<ServerStatus, { label: string; color: string; bg: string; border: string; glow: string }> = {
  online:   { label: "ONLINE",    color: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.3)",   glow: "0 0 32px rgba(34,197,94,0.25)" },
  warning:  { label: "WARNING",   color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)",  glow: "0 0 40px rgba(245,158,11,0.35)" },
  critical: { label: "CRITICAL",  color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)",   glow: "0 0 56px rgba(239,68,68,0.5)"  },
  down:     { label: "OFFLINE",   color: "#475569", bg: "rgba(71,85,105,0.08)",   border: "rgba(71,85,105,0.3)",   glow: "none"                          },
};

/* ─── botnet source nodes ───────────────────────── */
const BOT_NODES = [
  { id: 0,  x: "3%",  y: "8%"  },
  { id: 1,  x: "3%",  y: "28%" },
  { id: 2,  x: "3%",  y: "50%" },
  { id: 3,  x: "3%",  y: "72%" },
  { id: 4,  x: "3%",  y: "92%" },
  { id: 5,  x: "18%", y: "5%"  },
  { id: 6,  x: "18%", y: "95%" },
  { id: 7,  x: "32%", y: "5%"  },
  { id: 8,  x: "32%", y: "95%" },
];

/* ─── component ─────────────────────────────────── */
let packetCounter = 0;

export default function DDoS() {
  const [isAttacking, setIsAttacking] = useState(false);
  const [health, setHealth] = useState(100);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [reqPerSec, setReqPerSec] = useState(42);
  const [cpu, setCpu]   = useState(12);
  const [ram, setRam]   = useState(28);
  const [dropped, setDropped] = useState(0);
  const [totalPackets, setTotalPackets] = useState(0);

  const status: ServerStatus =
    health === 0   ? "down"     :
    health < 30    ? "critical" :
    health < 65    ? "warning"  : "online";

  const cfg = STATUS_CFG[status];

  /* spawn packets */
  const spawnPacket = useCallback(() => {
    const node = BOT_NODES[Math.floor(Math.random() * BOT_NODES.length)];
    const isMalicious = Math.random() > 0.05;
    const id = packetCounter++;
    const p: Packet = {
      id,
      startX: parseFloat(node.x),
      startY: parseFloat(node.y),
      color:  isMalicious ? "#ef4444" : "#22c55e",
      shadow: isMalicious ? "0 0 8px rgba(239,68,68,0.9), 0 0 16px rgba(239,68,68,0.4)" : "0 0 8px rgba(34,197,94,0.9)",
      duration: 0.4 + Math.random() * 0.8,
      delay: Math.random() * 0.15,
      size: isMalicious ? (Math.random() > 0.7 ? 5 : 3) : 3,
    };
    setPackets(prev => [...prev.slice(-120), p]);
    setTotalPackets(prev => prev + 1);
  }, []);

  /* remove old packets */
  useEffect(() => {
    const cleanup = setInterval(() => {
      setPackets(prev => prev.slice(-80));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  /* attack ticker */
  useEffect(() => {
    if (!isAttacking) return;

    const spawnTimer = setInterval(spawnPacket, 60);

    const statsTimer = setInterval(() => {
      setHealth(prev => {
        const next = Math.max(0, prev - (Math.random() * 3 + 1.5));
        return Math.round(next);
      });
      setReqPerSec(prev => Math.min(99999, prev + Math.floor(Math.random() * 800 + 200)));
      setCpu(prev  => Math.min(100, prev + Math.random() * 5 + 2));
      setRam(prev  => Math.min(100, prev + Math.random() * 3 + 1));
      setDropped(prev => prev + Math.floor(Math.random() * 300 + 100));
    }, 200);

    return () => { clearInterval(spawnTimer); clearInterval(statsTimer); };
  }, [isAttacking, spawnPacket]);

  /* recovery ticker */
  useEffect(() => {
    if (isAttacking || health >= 100) return;
    const t = setInterval(() => {
      setHealth(prev => Math.min(100, prev + 4));
      setReqPerSec(prev => Math.max(42, Math.round(prev * 0.85)));
      setCpu(prev  => Math.max(12, prev - 3));
      setRam(prev  => Math.max(28, prev - 2));
    }, 300);
    return () => clearInterval(t);
  }, [isAttacking, health]);

  const handleReset = () => {
    setIsAttacking(false);
    setHealth(100);
    setPackets([]);
    setReqPerSec(42);
    setCpu(12);
    setRam(28);
    setDropped(0);
    setTotalPackets(0);
  };

  const shake = isAttacking && status !== "online";

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 relative overflow-hidden">
      {/* ambient glow */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="aurora-1 absolute top-0 left-0 w-[700px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)" }} />
        <div className="aurora-2 absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,150,255,0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto">

        {/* ── HEADER ───────────────────────────────── */}
        <RevealSection className="text-center mb-14">
          <div className="section-label mb-6 mx-auto" style={{
            borderColor: "rgba(239,68,68,0.3)",
            color: "hsl(0,84%,70%)",
            background: "rgba(239,68,68,0.06)",
          }}>
            Threat Module 03
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white leading-none">
            Distributed{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(0,84%,65%), hsl(20,90%,60%))" }}>
              Denial of Service
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A coordinated assault from thousands of compromised machines — overwhelming the target's 
            infrastructure until it collapses under the sheer volume of malicious traffic.
          </p>
        </RevealSection>

        {/* ── SIMULATOR ────────────────────────────── */}
        <RevealSection delay={0.1} className="mb-12">
          <div className="gradient-border-card p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 cyber-dots opacity-10 pointer-events-none" />

            {/* top bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Live Network Visualizer
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                {/* status badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />
                  {cfg.label}
                </div>

                {/* controls */}
                <button onClick={handleReset}
                  className="p-2 rounded-lg text-muted-foreground hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
                  title="Reset">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAttacking(!isAttacking)}
                  disabled={status === "down"}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isAttacking
                      ? "text-red-400 hover:bg-red-500/15"
                      : "text-primary hover:bg-primary/15"
                  }`}
                  style={{
                    background: isAttacking ? "rgba(239,68,68,0.1)" : "rgba(0,150,255,0.1)",
                    border: isAttacking ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(0,150,255,0.3)",
                    opacity: status === "down" ? 0.4 : 1,
                  }}
                >
                  {isAttacking
                    ? <><Square className="w-4 h-4 fill-current" /> Stop Attack</>
                    : <><Zap className="w-4 h-4" /> Launch DDoS</>}
                </button>
              </div>
            </div>

            {/* ── CANVAS ─────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden mb-6"
              style={{
                height: "380px",
                background: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: isAttacking ? `inset 0 0 80px rgba(239,68,68,0.06)` : "none",
              }}>

              {/* subtle grid */}
              <div className="absolute inset-0 cyber-dots opacity-20 pointer-events-none" />

              {/* ── BOTNET NODES ─── */}
              {BOT_NODES.map(node => (
                <div key={node.id}
                  className="absolute z-10"
                  style={{ left: node.x, top: node.y, transform: "translate(-50%,-50%)" }}>
                  <motion.div
                    animate={isAttacking ? { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.4, ease: "easeInOut" }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center relative"
                    style={{
                      background: isAttacking ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                      border: isAttacking ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: isAttacking ? "0 0 12px rgba(239,68,68,0.3)" : "none",
                    }}
                  >
                    <Wifi className="w-3.5 h-3.5" style={{ color: isAttacking ? "#ef4444" : "#475569" }} />
                  </motion.div>
                  {isAttacking && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-red-400/80">
                      BOT
                    </div>
                  )}
                </div>
              ))}

              {/* ── ANIMATED PACKETS ─── */}
              {packets.map(p => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    boxShadow: p.shadow,
                    top: `${p.startY}%`,
                    left: `${p.startX}%`,
                    zIndex: 5,
                  }}
                  animate={{
                    left: ["var(--start-left, 3%)", "78%"],
                    top:  [`${p.startY}%`, "50%"],
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1, 0.3],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: "easeIn",
                  }}
                  initial={{
                    left: `${p.startX}%`,
                    top: `${p.startY}%`,
                  }}
                />
              ))}

              {/* ── SERVER BOX ─── */}
              <div className="absolute z-20"
                style={{ right: "8%", top: "50%", transform: "translateY(-50%)" }}>
                <motion.div
                  animate={shake ? {
                    x: status === "critical" ? [-4, 4, -4, 4, -2, 2, 0] : [-2, 2, -1, 1, 0],
                    y: status === "critical" ? [-2, 2, -2, 1, 0] : [0],
                  } : { x: 0, y: 0 }}
                  transition={{
                    repeat: shake ? Infinity : 0,
                    duration: status === "critical" ? 0.2 : 0.35,
                    ease: "easeInOut",
                  }}
                >
                  <div className="relative w-28 rounded-2xl overflow-hidden transition-all duration-500"
                    style={{
                      background: "rgba(8,12,22,0.95)",
                      border: `2px solid ${cfg.color}`,
                      boxShadow: cfg.glow,
                      paddingTop: "12px",
                      paddingBottom: "16px",
                    }}>

                    {/* server top stripe */}
                    <div className="h-1 w-full mb-3 transition-all duration-500"
                      style={{ background: cfg.color, boxShadow: `0 0 10px ${cfg.color}` }} />

                    {/* icon */}
                    <div className="flex flex-col items-center px-4">
                      <motion.div
                        animate={status === "critical" && isAttacking ? {
                          filter: [
                            `drop-shadow(0 0 6px ${cfg.color})`,
                            `drop-shadow(0 0 20px ${cfg.color})`,
                            `drop-shadow(0 0 6px ${cfg.color})`,
                          ]
                        } : {}}
                        transition={{ repeat: Infinity, duration: 0.4 }}
                      >
                        <Server className="w-10 h-10 mb-2 transition-colors duration-500"
                          style={{ color: cfg.color }} />
                      </motion.div>

                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Target</span>
                      <span className="text-[9px] text-white/40 font-mono mt-0.5">192.168.1.100</span>

                      {/* LEDs */}
                      <div className="flex gap-1.5 mt-3">
                        <div className="w-2 h-2 rounded-full transition-colors duration-500"
                          style={{
                            background: status === "down" ? "#334155" : cfg.color,
                            boxShadow: status === "down" ? "none" : `0 0 6px ${cfg.color}`,
                          }} />
                        <motion.div className="w-2 h-2 rounded-full"
                          animate={isAttacking ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                          transition={{ repeat: Infinity, duration: 0.15 }}
                          style={{
                            background: isAttacking ? "#ef4444" : "#334155",
                            boxShadow: isAttacking ? "0 0 6px #ef4444" : "none",
                          }} />
                        <div className="w-2 h-2 rounded-full"
                          style={{ background: "#334155" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Health bar below server */}
                <div className="mt-3 w-28">
                  <div className="flex justify-between text-[9px] font-mono text-muted-foreground mb-1">
                    <span>HEALTH</span>
                    <span style={{ color: cfg.color }}>{health}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div
                      className="h-full rounded-full transition-colors duration-500"
                      style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
                      animate={{ width: `${health}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* ── OVERLOADED LABEL ─── */}
              <AnimatePresence>
                {(status === "critical" || status === "down") && (
                  <motion.div
                    key="overload"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
                  >
                    <motion.div
                      animate={{ opacity: status === "critical" ? [1, 0.6, 1] : 1 }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest"
                      style={{
                        background: status === "down" ? "rgba(71,85,105,0.9)" : "rgba(239,68,68,0.15)",
                        border: `1px solid ${status === "down" ? "#475569" : "#ef4444"}`,
                        boxShadow: status === "down" ? "none" : "0 0 30px rgba(239,68,68,0.4)",
                        color: status === "down" ? "#94a3b8" : "#ef4444",
                        backdropFilter: "blur(8px)",
                      }}>
                      {status === "down"
                        ? <><ShieldOff className="w-4 h-4" /> Server Offline</>
                        : <><AlertTriangle className="w-4 h-4" /> Server Overloaded</>}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── RED ATTACK FLOOD OVERLAY ─── */}
              <AnimatePresence>
                {isAttacking && (
                  <motion.div
                    key="flood"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                      background: "radial-gradient(ellipse at 80% 50%, rgba(239,68,68,0.06) 0%, transparent 60%)",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* idle state label */}
              {!isAttacking && health === 100 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-muted-foreground text-sm font-mono opacity-40 tracking-widest uppercase">
                    Press "Launch DDoS" to begin simulation
                  </p>
                </div>
              )}
            </div>

            {/* ── LIVE STATS BAR ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              {[
                { icon: Activity,    label: "Req / sec",     value: isAttacking || reqPerSec > 42 ? reqPerSec.toLocaleString() : "42",  color: isAttacking ? "#ef4444" : "#22c55e" },
                { icon: Cpu,         label: "CPU Usage",     value: `${Math.round(cpu)}%`,   color: cpu > 80 ? "#ef4444" : cpu > 50 ? "#f59e0b" : "#22c55e" },
                { icon: MemoryStick, label: "Memory",        value: `${Math.round(ram)}%`,   color: ram > 80 ? "#ef4444" : ram > 50 ? "#f59e0b" : "#22c55e" },
                { icon: Network,     label: "Pkts Dropped",  value: dropped.toLocaleString(), color: dropped > 0 ? "#ef4444" : "#22c55e" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-xl p-3.5 flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider truncate">{label}</p>
                    <motion.p
                      key={value}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-black font-mono mt-0.5 truncate"
                      style={{ color }}
                    >
                      {value}
                    </motion.p>
                  </div>
                </div>
              ))}
            </div>

            {/* observation line */}
            <div className="relative z-10 mt-5 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-mono">
                <span className="text-primary font-bold">$ </span>
                <span className="text-muted-foreground">
                  {status === "down"
                    ? "Server is completely unresponsive. All legitimate connections refused. Attack succeeded."
                    : status === "critical"
                    ? "ALERT — Server resources exhausted. Packet loss > 90%. Legitimate users cannot connect."
                    : status === "warning"
                    ? "WARNING — Abnormal traffic spike detected. Server CPU and bandwidth nearing saturation."
                    : isAttacking
                    ? "Monitoring traffic... attack packets inbound. Server still responding within thresholds."
                    : "System nominal. 42 req/sec baseline traffic. All resources within operational limits."}
                </span>
              </p>
            </div>
          </div>
        </RevealSection>

        {/* ── EXPLANATION + MITIGATION ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RevealSection delay={0.15}>
            <div className="gradient-border-card p-8 h-full">
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" /> How It Works
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Attackers first infect thousands of ordinary devices (phones, routers, IoT devices) with malware, 
                  forming a <span className="text-white font-medium">botnet</span> under their control — often without the device owners knowing.
                </p>
                <p>
                  On command, every bot simultaneously floods the target with requests. Because they originate from real 
                  devices worldwide, the traffic appears legitimate and is nearly impossible to block without also 
                  cutting off real users.
                </p>
                <p>
                  Modern DDoS attacks can reach <span className="text-primary font-semibold">terabits per second</span>, 
                  enough to overwhelm even major cloud providers.
                </p>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="gradient-border-card p-8 h-full"
              style={{ borderColor: "rgba(0,150,255,0.2)" }}>
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Mitigation Strategies
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Rate Limiting",            desc: "Cap requests per IP per second — malicious burst traffic is silently dropped before it hits the server." },
                  { title: "Anycast Diffusion",        desc: "Route attack traffic across a globally distributed network so no single node is overwhelmed." },
                  { title: "Web Application Firewall", desc: "Deep-packet inspection filters out crafted attack payloads while allowing legitimate traffic through." },
                  { title: "Traffic Scrubbing",        desc: "Specialized scrubbing centers separate clean from dirty traffic, forwarding only valid requests." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white text-sm font-semibold mb-0.5">{title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </div>
  );
}
