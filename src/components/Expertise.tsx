import { useState, useRef, useEffect } from "react";
import { expertise } from "../data/content";
import { useLocale } from "../i18n/LocaleContext";
import { useSplitTextReveal } from "../hooks/useSplitTextReveal";
import { ease } from "../lib/ease";
import { fit } from "../lib/math";
import RevealOnScroll, { RevealHeading } from "./ui/RevealOnScroll";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lusion-style accordion with staggered child pill reveal.
 * On open: height animates via RAF, then pills stagger in with
 * translate3d(0, 20px, 0) + opacity 0→1.
 */
function AccordionItem({
  category,
  index,
  isOpen,
  onToggle,
}: {
  category: (typeof expertise)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [height, setHeight] = useState(0);

  // Animate height
  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  // Stagger pills on open
  useEffect(() => {
    if (REDUCED || !isOpen) return;

    const pills = pillsRef.current.filter(Boolean) as HTMLSpanElement[];
    pills.forEach((p) => {
      p.style.transform = "translate3d(0, 20px, 0)";
      p.style.opacity = "0";
    });

    let time = 0;
    let raf = 0;
    let prevTs = 0;
    const STAGGER = 0.06;
    const DELAY = 0.2;

    const animate = (ts: number) => {
      const dt = prevTs ? (ts - prevTs) / 1000 : 1 / 60;
      prevTs = ts;
      time += dt;

      let allDone = true;
      for (let i = 0; i < pills.length; i++) {
        const t = time - DELAY - i * STAGGER;
        const y = fit(t, 0, 0.5, 20, 0, ease.lusion);
        const o = fit(t, 0, 0.3, 0, 1, ease.lusion);
        pills[i].style.transform = `translate3d(0, ${y}px, 0)`;
        pills[i].style.opacity = String(o);
        if (y > 0.5) allDone = false;
      }

      if (allDone) {
        pills.forEach((p) => {
          p.style.transform = "translate3d(0, 0, 0)";
          p.style.opacity = "1";
        });
      } else {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  return (
    <RevealOnScroll delay={index * 0.08}>
      <div className="border-b border-white/[0.06]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between py-6 group"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-text-muted tracking-[0.15em]">
              0{index + 1}
            </span>
            <h3 className="font-display text-xl md:text-2xl text-text-primary font-bold group-hover:text-coral transition-colors">
              {category.title}
            </h3>
            <span className="font-mono text-xs text-text-muted ml-2">
              ({category.items.length})
            </span>
          </div>
          <span
            className="text-text-muted text-2xl"
            style={{
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.5s cubic-bezier(0.35, 0, 0, 1)",
            }}
          >
            +
          </span>
        </button>

        <div
          style={{
            height,
            overflow: "hidden",
            transition: "height 0.6s cubic-bezier(0.35, 0, 0, 1)",
          }}
        >
          <div ref={contentRef} className="pb-8 pl-12 md:pl-16">
            <div className="flex flex-wrap gap-3">
              {category.items.map((item, i) => (
                <span
                  key={item}
                  ref={(el) => {
                    pillsRef.current[i] = el;
                  }}
                  className="text-sm font-mono text-text-secondary px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export default function Expertise() {
  const { t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const descRef = useSplitTextReveal();

  return (
    <section id="expertise" className="relative py-32 md:py-48">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <RevealHeading
          className="font-display font-black text-text-primary uppercase tracking-[-0.03em] mb-8"
          style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
        >
          {t.expertiseSection.heading}
        </RevealHeading>

        <RevealOnScroll>
          <p
            ref={descRef as React.RefObject<HTMLParagraphElement>}
            className="text-text-secondary text-lg md:text-xl max-w-3xl mb-16 leading-relaxed"
          >
            {t.expertiseSection.description}
          </p>
        </RevealOnScroll>

        <div>
          {expertise.map((cat, i) => (
            <AccordionItem
              key={cat.title}
              category={cat}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
