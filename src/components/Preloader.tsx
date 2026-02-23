import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";
import { useState, useEffect } from "react";

interface PreloaderProps {
  onComplete: () => void;
  duration?: number;
}

const BRAND = "WENLIANG ZENG".split("");
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;
const EASE_EXIT = [0.76, 0, 0.24, 1] as const;

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Preloader({
  onComplete,
  duration = 2400,
}: PreloaderProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"loading" | "complete" | "revealing">(
    "loading",
  );
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: reduced ? 0.4 : duration / 1000,
      ease: reduced ? "linear" : [0.4, 0, 0.2, 1],
      delay: reduced ? 0 : 0.4,
      onComplete: () => {
        setPhase("complete");
        setTimeout(() => setPhase("revealing"), reduced ? 100 : 300);
      },
    });
    return () => controls.stop();
  }, [count, duration, reduced]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== "revealing" && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#050505" }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={
            reduced ? { duration: 0.4 } : { duration: 0.8, ease: EASE_EXIT }
          }
          aria-hidden="true"
        >
          <div
            className="absolute inset-[-50%] w-[200%] h-[200%] pointer-events-none"
            style={{
              backgroundImage: NOISE_SVG,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
              opacity: 0.045,
              animation: reduced ? "none" : "noise 8s steps(10) infinite",
              willChange: "transform",
            }}
          />

          <motion.p
            className="absolute left-1/2 flex font-display font-bold uppercase"
            style={{
              top: "calc(50% - 15vh)",
              transform: "translateX(-50%)",
              letterSpacing: "0.15em",
            }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {BRAND.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block whitespace-pre"
                style={{
                  fontSize: "clamp(14px, 2vw, 20px)",
                  color: "rgba(255,255,255,0.50)",
                }}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: reduced ? 0 : 0.2 + i * 0.03,
                  ease: EASE_REVEAL,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            className="flex items-start leading-none select-none font-display font-black text-white"
            style={{
              fontSize: "clamp(96px, 18vw, 200px)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
            }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <motion.span>{rounded}</motion.span>
            <span
              className="self-start"
              style={{ fontSize: "50%", opacity: 0.6, marginTop: "0.15em" }}
            >
              %
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
