import { siteConfig } from '../data/content'

export default function Footer() {
  return (
    <footer className="border-t border-dark-border py-8 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display font-bold text-text-primary">
          WZ<span className="text-coral">.</span>
        </span>
        <p className="text-text-muted text-sm">
          Built by{' '}
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors">
            {siteConfig.name}
          </a>
        </p>
      </div>
    </footer>
  )
}
