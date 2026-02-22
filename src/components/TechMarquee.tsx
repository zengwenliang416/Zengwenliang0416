import { techStack } from "../data/content";
import { useLocale } from "../i18n/LocaleContext";
import RevealOnScroll from "./ui/RevealOnScroll";
import GlassSection from "./glass/GlassSection";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-3">
      <div
        className={`flex gap-4 whitespace-nowrap w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"} hover:pause-animation`}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono text-text-muted tracking-[0.02em] bg-black/[0.03] border border-black/[0.06]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  const { t } = useLocale();
  const mid = Math.ceil(techStack.length / 2);
  const row1 = techStack.slice(0, mid);
  const row2 = techStack.slice(mid);

  return (
    <section id="stack" className="relative py-8 overflow-hidden">
      {/* Section background gradient */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(88,86,214,0.06), transparent 20%, transparent 80%, rgba(88,86,214,0.06))",
        }}
      />

      <RevealOnScroll>
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <h2
            className="font-display font-bold text-text-primary"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            {t.techStack.heading[0]}{" "}
            <span className="text-gradient-lime">{t.techStack.heading[1]}</span>
          </h2>
        </div>
      </RevealOnScroll>

      <GlassSection fullWidth preset="marquee" className="w-full py-6">
        <div className="relative overflow-hidden">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#F2F2F7]/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#F2F2F7]/80 to-transparent pointer-events-none" />

          <MarqueeRow items={row1} />
          <MarqueeRow items={row2} reverse />
        </div>
      </GlassSection>
    </section>
  );
}
