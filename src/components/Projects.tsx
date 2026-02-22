import { motion } from "framer-motion";
import { projects, type Project } from "../data/content";
import { useLocale } from "../i18n/LocaleContext";
import RevealOnScroll from "./ui/RevealOnScroll";
import GlassCard from "./glass/GlassCard";

function ProjectImage({ project }: { project: Project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${project.gradient[0]}15, ${project.gradient[1]}08)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(${project.gradient[0]}30 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-30 blur-[60px]"
        style={{
          background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
        }}
      />
      <div className="absolute bottom-6 right-6 font-mono text-xs opacity-20 text-text-muted">
        {project.name}
      </div>
    </div>
  );
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLocale();
  const tr = t.projects.items[project.name];
  const isReversed = index % 2 === 1;
  return (
    <RevealOnScroll>
      <motion.div
        className="relative"
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Per-card background glow */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.15] blur-[120px]"
          style={{
            background: `radial-gradient(ellipse, ${project.gradient[0]}AA, transparent 70%)`,
          }}
        />

        <GlassCard variant="featured" className="h-full">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group grid grid-cols-1 lg:grid-cols-2 gap-0 glass-interactive`}
          >
            <div
              className={`aspect-[16/10] lg:aspect-auto ${isReversed ? "lg:order-2" : ""}`}
            >
              <div className="w-full h-full group-hover:scale-[1.03] transition-transform duration-700">
                <ProjectImage project={project} />
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: project.gradient[0] }}
                />
                <span className="text-xs font-mono uppercase tracking-[0.15em] text-text-muted">
                  {t.projects.featuredLabel}
                </span>
                {project.stars && (
                  <span className="ml-auto font-mono text-xs text-lime">
                    ★ {project.stars}
                  </span>
                )}
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-text-primary mb-4 leading-tight">
                {tr?.title ?? project.name}
              </h3>
              <div className="glass-text-area mb-6">
                <p className="text-[16px] font-medium text-text-secondary leading-[1.65]">
                  {tr?.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-mono tracking-[0.02em] text-text-muted bg-black/[0.03] border border-black/[0.06] rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </a>
        </GlassCard>
      </motion.div>
    </RevealOnScroll>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const { t } = useLocale();
  const tr = t.projects.items[project.name];
  return (
    <RevealOnScroll delay={delay}>
      <motion.div
        className="relative"
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div
          className="absolute inset-0 -z-10 opacity-[0.12] blur-[100px]"
          style={{
            background: `radial-gradient(ellipse, ${project.gradient[0]}99, transparent 70%)`,
          }}
        />

        <GlassCard variant="grid" className="h-full">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block glass-interactive"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <div className="w-full h-full group-hover:scale-[1.05] transition-transform duration-700">
                <ProjectImage project={project} />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg font-bold text-text-primary">
                  {tr?.title ?? project.name}
                </h3>
                {project.stars && (
                  <span className="font-mono text-xs text-lime">
                    ★ {project.stars}
                  </span>
                )}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4 font-medium">
                {tr?.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-full text-xs font-mono text-text-muted bg-black/[0.03] border border-black/[0.06]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </a>
        </GlassCard>
      </motion.div>
    </RevealOnScroll>
  );
}

export default function Projects() {
  const { t } = useLocale();
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-muted">
            {t.projects.counter(projects.length)}
          </p>
          <h2
            className="mt-3 font-display font-bold text-text-primary"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            {t.projects.heading[0]}{" "}
            <span className="text-gradient-coral">{t.projects.heading[1]}</span>
          </h2>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featured.map((p, i) => (
            <FeaturedCard key={p.name} project={p} index={i} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map((p, i) => (
            <ProjectCard key={p.name} project={p} delay={i * 0.08} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/Zengwenliang0416"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors glass-interactive"
          >
            {t.projects.moreHeading} →
          </a>
        </div>
      </div>
    </section>
  );
}
