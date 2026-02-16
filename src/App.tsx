import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Projects from './components/Projects'
import TechMarquee from './components/TechMarquee'
import Publications from './components/Publications'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="noise-overlay">
      <CustomCursor />
      <Navigation />
      <main className="md:cursor-none">
        <Hero />
        <Projects />
        <TechMarquee />
        <Publications />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}
