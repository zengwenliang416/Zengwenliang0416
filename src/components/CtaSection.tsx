import { useRef, useCallback } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { useSplitTextReveal } from "../hooks/useSplitTextReveal";
import { useRAF } from "../hooks/useRAF";
import { lerp } from "../lib/math";
import RevealOnScroll from "./ui/RevealOnScroll";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lusion-style CTA button: shake on hover + double stroke offset.
 * Inner stroke is white, outer ghost stroke is coral with 2px offset.
 * Shake uses sine/cos with different frequencies for organic feel.
 */
function ShakeButton({ text }: { text: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const shakeTime = useRef(0);
  const hoverProgress = useRef(0);

  const update = useCallback(() => {
    if (REDUCED || !ref.current || !ghostRef.current || !underlineRef.current)
      return;
    const el = ref.current;

    const target = hovered.current ? 1 : 0;
    hoverProgress.current = lerp(hoverProgress.current, target, 0.08);

    if (hovered.current) {
      shakeTime.current += 0.12;
      const x = Math.sin(shakeTime.current * 7) * 3 * hoverProgress.current;
      const y = Math.cos(shakeTime.current * 5) * 2 * hoverProgress.current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    } else {
      shakeTime.current *= 0.9;
      el.style.transform = "translate3d(0, 0, 0)";
    }

    // Ghost stroke offset + opacity
    const gx = 3 * hoverProgress.current;
    const gy = 3 * hoverProgress.current;
    ghostRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
    ghostRef.current.style.opacity = String(hoverProgress.current * 0.7);

    // Underline wipe
    const clipR = 100 - hoverProgress.current * 100;
    underlineRef.current.style.clipPath = `inset(0 ${clipR}% 0 0)`;
  }, []);

  useRAF(update);

  return (
    <a
      ref={ref}
      href="mailto:wenliang_zeng416@163.com"
      className="inline-block relative"
      onMouseEnter={() => {
        hovered.current = true;
      }}
      onMouseLeave={() => {
        hovered.current = false;
      }}
      style={{ willChange: "transform" }}
    >
      {/* Ghost stroke layer */}
      <span
        ref={ghostRef}
        className="absolute inset-0 font-display font-black text-transparent uppercase tracking-[-0.02em] pointer-events-none"
        style={{
          fontSize: "clamp(28px, 5vw, 56px)",
          WebkitTextStroke: "2px rgba(255,60,95,0.5)",
          opacity: 0,
        }}
        aria-hidden="true"
      >
        {text}
      </span>

      {/* Main text */}
      <span
        className="font-display font-black text-text-primary uppercase tracking-[-0.02em] relative"
        style={{
          fontSize: "clamp(28px, 5vw, 56px)",
          WebkitTextStroke: "1px rgba(255,255,255,0.2)",
        }}
      >
        {text}
      </span>

      {/* Animated underline */}
      <div
        ref={underlineRef}
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-coral"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      />
    </a>
  );
}

function ContinueMarquee({ text }: { text: string }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const smoothScrollSpeed = useRef(0);
  const lastScrollY = useRef(0);

  const update = useCallback(() => {
    if (REDUCED || !rowRef.current) return;

    const scrollDelta = Math.abs(window.scrollY - lastScrollY.current);
    lastScrollY.current = window.scrollY;
    smoothScrollSpeed.current = lerp(
      smoothScrollSpeed.current,
      scrollDelta,
      0.05,
    );

    const speed = 0.5 + smoothScrollSpeed.current * 0.2;
    offset.current -= speed;

    const el = rowRef.current;
    const halfWidth = el.scrollWidth / 2;
    if (Math.abs(offset.current) >= halfWidth) {
      offset.current = offset.current % halfWidth;
    }

    el.style.transform = `translate3d(${offset.current}px, 0, 0)`;
  }, []);

  useRAF(update);

  const items = Array(8).fill(text);
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-4 border-t border-white/[0.06]">
      <div
        ref={rowRef}
        className="flex whitespace-nowrap w-max"
        style={{ willChange: "transform" }}
      >
        {doubled.map((t, i) => (
          <span
            key={i}
            className="text-xs font-mono text-text-muted tracking-[0.3em] uppercase mx-12"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CtaSection() {
  const { t } = useLocale();
  const headingRef = useSplitTextReveal({ translateEm: 2.0, rotateDeg: 20 });

  return (
    <section className="relative py-32 md:py-48">
      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
        <h2
          ref={headingRef as React.RefObject<HTMLHeadingElement>}
          className="font-display font-black text-text-primary leading-[1.1] tracking-[-0.03em] mb-16"
          style={{ fontSize: "clamp(32px, 6vw, 80px)" }}
        >
          {t.cta.heading}
        </h2>

        <RevealOnScroll>
          <ShakeButton text={t.cta.button} />
        </RevealOnScroll>
      </div>

      <div className="mt-24">
        <ContinueMarquee text={t.cta.marqueeText} />
      </div>
    </section>
  );
}
