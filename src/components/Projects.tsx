import { useRef, useEffect, useCallback } from "react";
import { projects, type Project } from "../data/content";
import { useLocale } from "../i18n/LocaleContext";
import { useRAF } from "../hooks/useRAF";
import { ease } from "../lib/ease";
import { fit, lerp, clamp } from "../lib/math";
import RevealOnScroll from "./ui/RevealOnScroll";
import { RevealHeading } from "./ui/RevealOnScroll";

const IS_FINE =
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lusion-style cross decoration, triggered on scroll.
 */
function SectionCross({ delay }: { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (REDUCED || !ref.current) return;
    const el = ref.current;
    el.style.transform = "scale(0) rotate(0deg)";
    el.style.opacity = "0";
    let time = 0;
    let triggered = false;
    let raf = 0;
    let prevTs = 0;

    const animate = (ts: number) => {
      const dt = prevTs ? (ts - prevTs) / 1000 : 1 / 60;
      prevTs = ts;
      time += dt;
      const t = time - delay;
      const s = fit(t, 0, 0.6, 0, 1, ease.lusion);
      const r = fit(t, 0, 0.6, 0, 180, ease.lusion);
      const o = fit(t, 0, 0.3, 0, 1, ease.lusion);
      el.style.transform = `scale(${s}) rotate(${r}deg)`;
      el.style.opacity = String(o);
      if (s < 0.99) {
        raf = requestAnimationFrame(animate);
      } else {
        el.style.willChange = "auto";
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
  }, [delay]);

  return (
    <div
      ref={ref}
      className="text-text-muted/30 select-none"
      style={{
        fontSize: "18px",
        lineHeight: 1,
        willChange: "transform, opacity",
      }}
    >
      ✕
    </div>
  );
}

/**
 * Lusion-style project card with 3D tilt, clip-path reveal,
 * and mouse-following glow overlay.
 */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLocale();
  const tr = t.projects.items[project.name];
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const hover = useRef(0);
  const smoothHover = useRef(0);
  const smoothY = useRef(0);

  const isFeatured = project.featured;

  // Stagger tag entrance on scroll
  useEffect(() => {
    if (REDUCED || !tagContainerRef.current) return;
    const tags =
      tagContainerRef.current.querySelectorAll<HTMLElement>("[data-tag]");
    tags.forEach((tag) => {
      tag.style.transform = "translate3d(0, 100%, 0)";
      tag.style.opacity = "0";
    });

    let triggered = false;
    let time = 0;
    let raf = 0;
    let prevTs = 0;

    const animate = (ts: number) => {
      const dt = prevTs ? (ts - prevTs) / 1000 : 1 / 60;
      prevTs = ts;
      time += dt;
      let allDone = true;
      tags.forEach((tag, i) => {
        const t = time - i * 0.06;
        const y = fit(t, 0, 0.5, 100, 0, ease.lusion);
        const o = fit(t, 0, 0.3, 0, 1, ease.lusion);
        tag.style.transform = `translate3d(0, ${y}%, 0)`;
        tag.style.opacity = String(o);
        if (y > 0.5) allDone = false;
      });
      if (!allDone) {
        raf = requestAnimationFrame(animate);
      } else {
        tags.forEach((tag) => {
          tag.style.transform = "translate3d(0, 0, 0)";
          tag.style.opacity = "1";
        });
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
      { rootMargin: "-5% 0px -5% 0px" },
    );
    if (tagContainerRef.current) obs.observe(tagContainerRef.current);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const update = useCallback(() => {
    if (REDUCED) return;
    const el = cardRef.current;
    const imgEl = imgInnerRef.current;
    if (!el || !imgEl) return;

    // Lerp mouse position
    smoothMouse.current.x = lerp(smoothMouse.current.x, mouse.current.x, 0.08);
    smoothMouse.current.y = lerp(smoothMouse.current.y, mouse.current.y, 0.08);
    smoothHover.current = lerp(smoothHover.current, hover.current, 0.06);

    // 3D tilt
    const rx = (smoothMouse.current.y - 0.5) * 8 * smoothHover.current;
    const ry = (smoothMouse.current.x - 0.5) * -8 * smoothHover.current;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;

    // Image scale on hover
    const imgScale = 1 + smoothHover.current * 0.06;
    imgEl.style.transform = `scale(${imgScale})`;

    // Glow overlay
    if (overlayRef.current) {
      overlayRef.current.style.opacity = String(smoothHover.current * 0.4);
      overlayRef.current.style.background = `radial-gradient(circle at ${smoothMouse.current.x * 100}% ${smoothMouse.current.y * 100}%, ${project.gradient[0]}30 0%, transparent 60%)`;
    }

    // Scroll-based parallax for image
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const ratio = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
      const targetY = (ratio - 0.5) * -40;
      smoothY.current = lerp(smoothY.current, targetY, 0.06);

      const clipProgress = clamp((vh - rect.top) / (vh * 0.5), 0, 1);
      const clipTop = fit(clipProgress, 0, 0.7, 12, 0, ease.lusion);
      const clipBot = fit(clipProgress, 0, 0.7, 12, 0, ease.lusion);
      const imgScaleScroll = fit(clipProgress, 0, 0.7, 1.15, 1, ease.lusion);
      imageRef.current.style.clipPath = `inset(${clipTop}% 0% ${clipBot}% 0%)`;
      imageRef.current.style.transform = `translate3d(0, ${smoothY.current}px, 0) scale(${imgScaleScroll})`;
    }
  }, [project.gradient]);

  useRAF(update);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!IS_FINE || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouse.current.x = (e.clientX - rect.left) / rect.width;
    mouse.current.y = (e.clientY - rect.top) / rect.height;
    hover.current = 1;
  };

  const onMouseLeave = () => {
    mouse.current = { x: 0.5, y: 0.5 };
    hover.current = 0;
  };

  return (
    <RevealOnScroll delay={index * 0.12} clipReveal>
      <a
        ref={cardRef}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="open"
        className={`group block rounded-2xl overflow-hidden border border-white/[0.06] bg-dark-card ${
          isFeatured ? "lg:col-span-2" : ""
        }`}
        style={{ willChange: "transform" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div
          ref={imageRef}
          className="relative overflow-hidden"
          style={{ willChange: "clip-path, transform" }}
        >
          <div
            ref={imgInnerRef}
            className={`w-full ${isFeatured ? "aspect-[2/1]" : "aspect-[16/10]"}`}
            style={{ willChange: "transform", transition: "none" }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={tr?.title ?? project.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full relative">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${project.gradient[0]}15, ${project.gradient[1]}08)`,
                  }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-[80px]"
                  style={{
                    background: `linear-gradient(135deg, ${project.gradient[0]}40, ${project.gradient[1]}20)`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-[background-color] duration-500" />

          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0 }}
          />

          <div className="absolute bottom-0 inset-x-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <p className="font-mono text-xs text-white/50 tracking-[0.15em] uppercase mb-1">
              {project.tech[0]}
            </p>
            <div className="flex items-center gap-3">
              <h3 className="font-display font-bold text-white text-xl">
                {tr?.title ?? project.name}
              </h3>
              <svg
                className="w-5 h-5 text-white/80 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M4 12L12 4M12 4H6M12 4v6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-text-primary text-lg group-hover:text-coral transition-colors duration-300">
              {tr?.title ?? project.name}
            </h3>
            <div className="flex items-center gap-3">
              {project.stars != null && (
                <span className="font-mono text-xs text-lime">
                  ★ {project.stars}
                </span>
              )}
              <svg
                className="w-4 h-4 text-text-muted group-hover:text-text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M4 12L12 4M12 4H6M12 4v6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
            {tr?.desc}
          </p>

          <div
            ref={tagContainerRef}
            className="flex flex-wrap gap-2 overflow-hidden"
          >
            {project.tech.map((tech) => (
              <span
                key={tech}
                data-tag
                className="px-2.5 py-0.5 rounded-full text-xs font-mono text-text-muted bg-white/[0.03] border border-white/[0.06]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </a>
    </RevealOnScroll>
  );
}

export default function Projects() {
  const { t } = useLocale();

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Cross decorations */}
        {!REDUCED && (
          <div className="absolute top-28 right-8 md:right-16 flex gap-3 opacity-40">
            {[0, 1, 2, 3, 4].map((i) => (
              <SectionCross key={i} delay={i * 0.1} />
            ))}
          </div>
        )}

        <RevealOnScroll clipReveal>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-muted mb-3">
            {t.projects.counter(projects.length)}
          </p>
        </RevealOnScroll>

        <RevealHeading
          className="font-display font-bold text-text-primary mb-16"
          style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
        >
          {`${t.projects.heading[0]} ${t.projects.heading[1]}`}
        </RevealHeading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>

        <RevealOnScroll delay={0.5}>
          <div className="mt-12 text-center">
            <a
              href="https://github.com/zengwenliang416"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors glass-interactive"
            >
              {t.projects.moreHeading} →
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
