import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group"
          style={{
            background: "rgba(0,255,255,0.1)",
            border: "1px solid rgba(0,255,255,0.3)",
            boxShadow: "0 0 20px rgba(0,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
