import { publications } from "../data/content";
import { useLocale } from "../i18n/LocaleContext";
import RevealOnScroll from "./ui/RevealOnScroll";
import GlassCard from "./glass/GlassCard";

const GRID_PATTERN = `
  repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 80px),
  repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 80px)
`;

export default function Publications() {
  const { t } = useLocale();

  return (
    <section id="papers" className="relative py-32 px-6">
      {/* Grid background */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ backgroundImage: GRID_PATTERN }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-muted">
            Research
          </p>
          <h2
            className="mt-3 font-display font-bold text-text-primary"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            {t.publications.heading[0]}{" "}
            <span className="text-indigo">{t.publications.heading[1]}</span>
          </h2>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {publications.map((pub, i) => {
            const tr = t.publications.items[pub.title];
            return (
              <RevealOnScroll key={pub.title} delay={i * 0.1}>
                <GlassCard variant="publication" className="h-full">
                  <a
                    href={pub.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-8 glass-interactive"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 text-xs font-mono text-lime bg-lime-dim border border-black/[0.06] rounded-full">
                        {pub.journal}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary leading-tight mb-3">
                      {pub.title}
                    </h3>

                    <p className="text-sm font-medium text-text-muted mb-4">
                      {pub.authors}
                    </p>

                    <p className="text-[15px] font-medium text-text-secondary leading-[1.65] mb-6">
                      {tr?.desc ?? pub.title}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {pub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-mono text-text-muted bg-black/[0.03] border border-black/[0.06]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </GlassCard>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
