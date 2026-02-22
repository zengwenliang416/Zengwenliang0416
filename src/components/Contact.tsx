import { siteConfig } from "../data/content";
import { useLocale } from "../i18n/LocaleContext";
import RevealOnScroll from "./ui/RevealOnScroll";
import GlassSection from "./glass/GlassSection";
import GlassButton from "./glass/GlassButton";

const CONTACT_GRADIENT = `
  radial-gradient(ellipse 70% 60% at 20% 90%, rgba(255,60,95,0.12) 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 80% 10%, rgba(52,199,89,0.08) 0%, transparent 55%),
  radial-gradient(ellipse 50% 40% at 50% 50%, rgba(88,86,214,0.10) 0%, transparent 50%)
`;

export default function Contact() {
  const { t } = useLocale();
  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      {/* Section background gradient */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ background: CONTACT_GRADIENT }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto">
        <RevealOnScroll>
          <GlassSection preset="cta" className="w-full">
            <div className="p-12 md:p-20 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-muted mb-6">
                {t.contact.eyebrow}
              </p>

              <h2
                className="font-display font-bold text-text-primary mb-4"
                style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
              >
                {t.contact.heading[0]}
                <br />
                <span className="text-gradient-multi">
                  {t.contact.heading[1]}
                </span>
              </h2>

              <p className="text-[16px] font-medium text-text-secondary leading-[1.65] max-w-xl mx-auto mb-10">
                {t.contact.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Primary CTA — solid coral */}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="px-8 py-4 rounded-full bg-coral text-white text-base font-semibold min-h-[44px] flex items-center gap-2 hover:bg-coral/90 transition-colors glass-interactive"
                >
                  {t.contact.emailBtn}
                </a>

                {/* Secondary — glass button */}
                <GlassButton
                  variant="secondary"
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 text-base font-semibold text-text-primary"
                >
                  {t.contact.githubBtn}
                </GlassButton>
              </div>
            </div>
          </GlassSection>
        </RevealOnScroll>
      </div>
    </section>
  );
}
