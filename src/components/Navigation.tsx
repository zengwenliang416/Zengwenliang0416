import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { navLinks, siteConfig } from '../data/content'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark/90 backdrop-blur-xl border-b border-dark-border' : ''
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-12 py-5">
        <a href="#" className="font-display font-bold text-xl text-text-primary hover:text-coral transition-colors">
          WZ<span className="text-coral">.</span>
        </a>

        <div className="flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="text-text-secondary text-sm hover:text-text-primary transition-colors hidden md:block"
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href={`mailto:${siteConfig.email}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="px-5 py-2 rounded-full bg-coral text-dark text-sm font-semibold hover:bg-coral/90 transition-colors"
          >
            Contact
          </motion.a>
        </div>
      </div>
    </motion.nav>
  )
}
