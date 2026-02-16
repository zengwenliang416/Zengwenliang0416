import { techStack } from '../data/content'
import RevealOnScroll from './ui/RevealOnScroll'

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden py-3">
      <div
        className="flex gap-4 whitespace-nowrap w-max"
        style={{ animation: `${reverse ? 'marquee-reverse' : 'marquee'} 30s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-dark-border text-text-secondary font-mono text-sm hover:border-coral/30 hover:text-text-primary transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-coral/50" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TechMarquee() {
  const mid = Math.ceil(techStack.length / 2)
  const row1 = techStack.slice(0, mid)
  const row2 = techStack.slice(mid)

  return (
    <section id="stack" className="py-24 border-y border-dark-border">
      <RevealOnScroll>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-10">
          <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold text-text-primary">
            Tech <span className="text-gradient-lime">Stack</span>
          </h2>
        </div>
      </RevealOnScroll>
      <MarqueeRow items={row1} />
      <MarqueeRow items={row2} reverse />
    </section>
  )
}
