import { motion } from "framer-motion";
import { useLocale } from "../i18n/LocaleContext";
import GlassPill from "./glass/GlassPill";
import CountUp from "./ui/CountUp";

export default function Hero() {
  const { t } = useLocale();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16"
    >
      {/* Decorative blobs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="blob-animated absolute top-[-10%] right-[-5%] w-[60vw] h-[60vh] opacity-[0.15] blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,60,95,1), transparent 70%)",
          }}
        />
        <div
          className="blob-animated absolute bottom-[-5%] left-[-10%] w-[50vw] h-[50vh] opacity-[0.12] blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(88,86,214,1), transparent 70%)",
            animationDelay: "3s",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <p className="text-text-secondary text-lg md:text-xl mb-4">
          {t.hero.greeting}
        </p>

        <h1
          className="font-display font-black leading-[0.95] tracking-tight mb-2"
          style={{
            fontSize: "clamp(60px, 12vw, 160px)",
            color: "#1C1C1E",
          }}
        >
          WENLIANG
          <br />
          ZENG
        </h1>

        {t.hero.chineseName && (
          <p className="font-display text-2xl md:text-3xl text-text-secondary mb-6">
            {t.hero.chineseName}
          </p>
        )}

        {!t.hero.chineseName && <div className="mb-6" />}

        {/* Role pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {t.hero.roles.map((role, i) => {
            const accents = ["#FF3C5F", "#5856D6", "#34C759"];
            return (
              <GlassPill key={role} accent={accents[i % 3]}>
                <span className="text-sm font-medium text-text-primary">
                  {role}
                </span>
              </GlassPill>
            );
          })}
        </div>

        <p className="text-text-secondary text-lg max-w-[560px] mb-16 font-medium">
          {t.hero.description}
        </p>

        {/* Stats panel — glass card */}
        <div className="glass-card inline-flex divide-x divide-black/[0.08] rounded-3xl">
          {t.hero.stats.map((s) => (
            <div key={s.label} className="px-8 py-6 text-center">
              <div className="text-3xl font-black text-text-primary font-display">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs font-mono text-text-muted tracking-[0.02em] uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex flex-col items-start gap-2"
        >
          <span className="text-xs font-mono text-text-muted tracking-[0.15em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-text-muted"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
