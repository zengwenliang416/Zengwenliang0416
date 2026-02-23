import { useRef, useEffect } from "react";
import { achievements, totalAchievements } from "../data/content";
import { useLocale } from "../i18n/LocaleContext";
import { ease } from "../lib/ease";
import { fit } from "../lib/math";
import RevealOnScroll, { RevealHeading } from "./ui/RevealOnScroll";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) {
      if (el) el.textContent = String(target);
      return;
    }

    el.textContent = "0";
    let time = 0;
    let triggered = false;
    let raf = 0;
    let prevTs = 0;

    const animate = (ts: number) => {
      const dt = prevTs ? (ts - prevTs) / 1000 : 1 / 60;
      prevTs = ts;
      time += dt;
      const val = Math.round(fit(time, 0, 1.5, 0, target, ease.lusion));
      el.textContent = String(val);

      if (val < target) {
        raf = requestAnimationFrame(animate);
      } else {
        el.textContent = String(target);
      }
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !triggered) {
            triggered = true;
            raf = requestAnimationFrame(animate);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return <span ref={ref}>{REDUCED ? target : 0}</span>;
}

function AchievementRow({
  category,
  index,
}: {
  category: (typeof achievements)[0];
  index: number;
}) {
  return (
    <RevealOnScroll delay={index * 0.08}>
      <div className="flex flex-col md:flex-row md:items-center justify-between py-5 border-b border-white/[0.06] gap-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-text-muted tracking-[0.15em]">
            0{index + 1}
          </span>
          <span className="font-display font-bold text-text-primary text-lg md:text-xl">
            {category.platform}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pl-8 md:pl-0">
          {category.items.map((item) => (
            <span
              key={item}
              className="text-xs font-mono text-text-muted px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}

export default function Awards() {
  const { t } = useLocale();

  return (
    <section id="achievements" className="relative py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-baseline justify-between mb-16">
          <RevealHeading
            className="font-display font-bold text-text-primary"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            {t.achievementsSection.heading}
          </RevealHeading>
          <RevealOnScroll>
            <div className="text-right">
              <span className="font-display font-black text-text-primary text-4xl md:text-6xl">
                <CountUp target={totalAchievements} />
              </span>
              <span className="block text-xs font-mono text-text-muted tracking-[0.2em] uppercase mt-1">
                {t.achievementsSection.total}
              </span>
            </div>
          </RevealOnScroll>
        </div>

        <div>
          {achievements.map((cat, i) => (
            <AchievementRow key={cat.platform} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
