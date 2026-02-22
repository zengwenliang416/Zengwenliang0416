import { LocaleProvider } from "./i18n/LocaleContext";
import CustomCursor from "./components/CustomCursor";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import TechMarquee from "./components/TechMarquee";
import Publications from "./components/Publications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackgroundLayer from "./components/BackgroundLayer";

export default function App() {
  return (
    <LocaleProvider>
      <div className="noise-overlay min-h-screen bg-dark text-text-secondary">
        <BackgroundLayer />
        <CustomCursor />
        <Navigation />
        <main className="md:cursor-none">
          <Hero />
          <Projects />
          <TechMarquee />
          <Publications />
          <Contact />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
