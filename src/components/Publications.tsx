import { motion } from 'framer-motion'
import { publications } from '../data/content'
import RevealOnScroll from './ui/RevealOnScroll'

export default function Publications() {
  return (
    <section id="papers" className="max-w-[1400px] mx-auto px-6 md:px-12 py-32">
      <RevealOnScroll>
        <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold text-text-primary mb-16">
          Research <span className="text-indigo">Papers</span>
        </h2>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publications.map((pub, i) => (
          <RevealOnScroll key={pub.title} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4, borderColor: 'rgba(108,99,255,0.3)' }}
              className="p-8 rounded-2xl bg-dark-card border border-dark-border transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-dim flex items-center justify-center text-indigo text-lg font-bold">
                  P
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-indigo transition-colors">
                  {pub.title}
                </h3>
              </div>
              <p className="text-text-secondary text-[15px] leading-relaxed mb-5">{pub.desc}</p>
              <div className="flex flex-wrap gap-2">
                {pub.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono border border-indigo/10 text-indigo/70">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
