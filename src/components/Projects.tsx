import { motion } from 'framer-motion'
import { projects, type Project } from '../data/content'
import RevealOnScroll from './ui/RevealOnScroll'

function ProjectImage({ project }: { project: Project }) {
  if (project.image) {
    return (
      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
    )
  }
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${project.gradient[0]}15, ${project.gradient[1]}08)` }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(${project.gradient[0]}30 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-30 blur-[60px]"
        style={{ background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})` }}
      />
      <div className="absolute bottom-6 right-6 font-mono text-xs opacity-20 text-text-primary">
        {project.name}
      </div>
    </div>
  )
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const isReversed = index % 2 === 1
  return (
    <RevealOnScroll>
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-dark-card border border-dark-border hover:border-${project.accent}/30 transition-all duration-500`}
        whileHover={{ y: -4 }}
      >
        <div className={`aspect-[16/10] lg:aspect-auto ${isReversed ? 'lg:order-2' : ''}`}>
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
            <span className="text-text-muted text-xs font-mono uppercase tracking-widest">Featured</span>
            {project.stars && (
              <span className="ml-auto font-mono text-sm" style={{ color: project.gradient[0] }}>
                {project.stars} ★
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-text-primary mb-4 group-hover:text-gradient-multi transition-colors">
            {project.title}
          </h3>
          <p className="text-text-secondary text-[15px] leading-relaxed mb-6">{project.desc}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-xs font-mono border border-dark-border text-text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.a>
    </RevealOnScroll>
  )
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <RevealOnScroll delay={delay}>
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -6 }}
        className="group block rounded-2xl overflow-hidden bg-dark-card border border-dark-border hover:border-dark-border transition-all duration-500"
      >
        <div className="aspect-[16/10] overflow-hidden">
          <div className="w-full h-full group-hover:scale-[1.05] transition-transform duration-700">
            <ProjectImage project={project} />
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-gradient-multi transition-colors">
              {project.title}
            </h3>
            {project.stars && (
              <span className="font-mono text-xs" style={{ color: project.gradient[0] }}>
                {project.stars} ★
              </span>
            )}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">{project.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-dark-border text-text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.a>
    </RevealOnScroll>
  )
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="max-w-[1400px] mx-auto px-6 md:px-12 py-32">
      <RevealOnScroll>
        <div className="flex items-center gap-6 mb-16">
          <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold text-text-primary">
            Selected<br />
            <span className="text-gradient-coral">Projects</span>
          </h2>
          <div className="flex-1 h-px bg-dark-border" />
          <span className="text-text-muted font-mono text-sm">{projects.length} projects</span>
        </div>
      </RevealOnScroll>

      <div className="flex flex-col gap-8 mb-12">
        {featured.map((p, i) => (
          <FeaturedCard key={p.name} project={p} index={i} />
        ))}
      </div>

      <RevealOnScroll className="mb-8">
        <h3 className="font-display text-xl text-text-secondary">More Projects</h3>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {others.map((p, i) => (
          <ProjectCard key={p.name} project={p} delay={i * 0.08} />
        ))}
      </div>
    </section>
  )
}
