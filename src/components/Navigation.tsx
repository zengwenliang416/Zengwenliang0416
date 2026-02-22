import { useState, useEffect } from "react";
import { siteConfig } from "../data/content";
import { useLocale } from "../i18n/LocaleContext";
import GlassNav from "./glass/GlassNav";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <GlassNav scrolled={scrolled}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="font-display font-black text-lg tracking-tight hover:text-coral transition-colors"
          style={{ color: "#1C1C1E" }}
        >
          WZ<span className="text-coral">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {t.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-150 glass-interactive"
              style={{ color: "#3A3A3C" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors glass-interactive px-2 py-1"
          >
            {locale === "en" ? "中" : "EN"}
          </button>

          <a
            href={`mailto:${siteConfig.email}`}
            className="px-4 py-2 rounded-full bg-coral text-white text-sm font-semibold hover:bg-coral/90 transition-colors min-h-[44px] flex items-center"
          >
            {t.nav.contact}
          </a>
        </div>
      </div>
    </GlassNav>
  );
}
