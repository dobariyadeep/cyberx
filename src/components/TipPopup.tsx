import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ChevronRight } from "lucide-react";

const TIPS = [
  { title: "Use a Password Manager", body: "Generate and store unique, complex passwords for every account — never reuse credentials." },
  { title: "Enable Two-Factor Auth", body: "Add a second verification layer so stolen passwords alone can't compromise your accounts." },
  { title: "Verify Before You Click", body: "Always inspect the sender's domain and hover over links before clicking anything in emails." },
  { title: "Keep Systems Updated", body: "Software patches close known vulnerabilities. Enable automatic updates whenever possible." },
  { title: "Avoid Public Wi-Fi", body: "Unencrypted public networks expose your traffic. Use a VPN for sensitive operations on public networks." },
];

export default function TipPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTipIndex(Math.floor(Math.random() * TIPS.length));
      setIsVisible(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const tip = TIPS[tipIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-24 right-8 z-40 w-80 rounded-xl overflow-hidden"
          style={{
            background: "rgba(8, 14, 28, 0.95)",
            border: "1px solid rgba(0,255,255,0.2)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,255,0.06) inset",
          }}
        >
          {/* Top accent bar */}
          <div className="h-px w-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)" }} />

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-primary/70">Security Tip</p>
                  <p className="text-sm font-semibold text-white">{tip.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-white transition-colors ml-2 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tip.body}</p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setTipIndex((tipIndex + 1) % TIPS.length);
                }}
                className="text-xs font-mono text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
              >
                Next tip <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-xs text-muted-foreground hover:text-white transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
