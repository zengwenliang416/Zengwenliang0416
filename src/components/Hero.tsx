import { motion } from 'framer-motion'
import { heroData, stats } from '../data/content'
import CountUp from './ui/CountUp'

const letterVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.5 + i * 0.04, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
}

function AnimatedName({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="overflow-hidden">
      {lines.map((line, li) => (
        <div key={li} className="flex overflow-hidden">
          {line.split('').map((char, ci) => (
            <motion.span
              key={`${li}-${ci}`}
              custom={li * 10 + ci}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
              style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto pt-20">
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF3C5F, transparent 70%)', animation: 'float 20s ease-in-out infinite' }} />
      <div className="absolute bottom-[15%] left-[0%] w-[400px] h-[400px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6C63FF, transparent 70%)', animation: 'float 25s ease-in-out infinite', animationDelay: '-8s' }} />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-text-secondary text-lg md:text-xl mb-4"
      >
        {heroData.greeting}
      </motion.p>

      <h1 className="font-display font-bold text-[clamp(60px,12vw,160px)] leading-[0.9] tracking-tight text-text-primary mb-8">
        <AnimatedName text={heroData.name} />
      </h1>

      {/* Role pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="flex flex-wrap gap-3 mb-8"
      >
        {heroData.roles.map((role, i) => {
          const colors = ['bg-coral/15 text-coral border-coral/20', 'bg-lime-dim text-lime border-lime/20', 'bg-indigo-dim text-indigo border-indigo/20']
          return (
            <span key={role} className={`px-4 py-1.5 rounded-full text-sm font-mono border ${colors[i % 3]}`}>
              {role}
            </span>
          )
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="text-text-secondary text-lg max-w-[560px] mb-16"
      >
        {heroData.description}
      </motion.p>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-dark-border pt-10"
      >
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-[clamp(36px,5vw,56px)] font-bold text-text-primary leading-none mb-1">
              <CountUp target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-text-muted text-sm">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-text-muted flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  )
}
