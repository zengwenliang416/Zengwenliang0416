import { useLocale } from "../i18n/LocaleContext";
import { useSplitTextReveal } from "../hooks/useSplitTextReveal";
import RevealOnScroll, { RevealHeading } from "./ui/RevealOnScroll";

export default function IntroSection() {
  const { t } = useLocale();
  const bioRef = useSplitTextReveal();

  return (
    <section id="about" className="relative py-32 md:py-48">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <RevealHeading
          className="font-display font-black text-text-primary uppercase tracking-[-0.03em] mb-12"
          style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
        >
          {t.intro.heading}
        </RevealHeading>

        <RevealOnScroll>
          <p
            ref={bioRef as React.RefObject<HTMLParagraphElement>}
            className="text-text-secondary text-xl md:text-2xl max-w-3xl leading-relaxed"
          >
            {t.intro.bio}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
