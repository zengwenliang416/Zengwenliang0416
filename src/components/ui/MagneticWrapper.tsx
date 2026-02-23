import { useRef, useEffect, type ReactNode } from "react";
import { lerp } from "../../lib/math";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

const IS_FINE =
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lusion-style magnetic hover: RAF lerp spring, no framer-motion.
 * Element pulls toward cursor within radius, springs back on leave.
 */
export default function MagneticWrapper({
  children,
  strength = 0.3,
  radius = 80,
  className = "",
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (REDUCED || !IS_FINE || !ref.current) return;
    const el = ref.current;
    let raf = 0;
    let active = false;

    const animate = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.12);
      current.current.y = lerp(current.current.y, target.current.y, 0.12);
      el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;

      const dx = Math.abs(current.current.x - target.current.x);
      const dy = Math.abs(current.current.y - target.current.y);
      if (dx > 0.05 || dy > 0.05) {
        raf = requestAnimationFrame(animate);
      } else {
        active = false;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist > radius) return;
      target.current.x = (e.clientX - cx) * strength;
      target.current.y = (e.clientY - cy) * strength;
      if (!active) {
        active = true;
        raf = requestAnimationFrame(animate);
      }
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
      if (!active) {
        active = true;
        raf = requestAnimationFrame(animate);
      }
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
