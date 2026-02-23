import {
  useState,
  useRef,
  useEffect,
  lazy,
  Suspense,
  Component,
  type ReactNode,
} from "react";
import { ReactLenis } from "lenis/react";
import { LocaleProvider } from "./i18n/LocaleContext";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import IntroSection from "./components/IntroSection";
import Awards from "./components/Awards";
import Expertise from "./components/Expertise";
import CtaSection from "./components/CtaSection";
import Projects from "./components/Projects";
import TechMarquee from "./components/TechMarquee";
import Publications from "./components/Publications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackgroundLayer from "./components/BackgroundLayer";
import SectionDivider from "./components/ui/SectionDivider";
import { ease } from "./lib/ease";
import { fit, clamp } from "./lib/math";

const WebGLCanvas = lazy(() => import("./components/webgl/WebGLCanvas"));

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; errorMsg: string }
> {
  state = { hasError: false, errorMsg: "" };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: String(error?.message || error) };
  }
  componentDidCatch(error: Error) {
    console.error("[WebGL]", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: "fixed",
            bottom: 8,
            left: 8,
            right: 8,
            color: "#ff3c5f",
            fontSize: 11,
            fontFamily: "monospace",
            zIndex: 9999,
            background: "rgba(0,0,0,0.9)",
            padding: "8px 12px",
            borderRadius: 6,
            maxHeight: 120,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          [WebGL Error] {this.state.errorMsg}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Lusion-style RAF entrance: opacity 0→1 after preloader completes
  useEffect(() => {
    if (!contentRef.current) return;
    if (loading) {
      contentRef.current.style.opacity = "0";
      return;
    }
    if (REDUCED) {
      contentRef.current.style.opacity = "1";
      return;
    }

    let time = 0;
    let raf = 0;
    let prevTs = 0;

    const animate = (ts: number) => {
      const dt = prevTs ? (ts - prevTs) / 1000 : 1 / 60;
      prevTs = ts;
      time += dt;
      const opacity = fit(time - 0.1, 0, 0.8, 0, 1, ease.lusion);
      if (contentRef.current) {
        contentRef.current.style.opacity = String(clamp(opacity, 0, 1));
      }
      if (opacity < 0.99) {
        raf = requestAnimationFrame(animate);
      } else if (contentRef.current) {
        contentRef.current.style.opacity = "1";
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [loading]);

  return (
    <LocaleProvider>
      <ReactLenis
        root
        options={{
          lerp: 0.08,
          duration: 1.4,
          smoothWheel: true,
          wheelMultiplier: 0.8,
          touchMultiplier: 1.5,
        }}
      >
        <Preloader
          onComplete={() => {
            window.scrollTo(0, 0);
            setLoading(false);
          }}
        />
        <BackgroundLayer />
        <WebGLErrorBoundary>
          <Suspense fallback={null}>
            <WebGLCanvas />
          </Suspense>
        </WebGLErrorBoundary>
        <div
          ref={contentRef}
          className="noise-overlay relative z-10 min-h-screen text-text-secondary"
          style={{ opacity: 0 }}
        >
          <CustomCursor />
          <Navigation />
          <main className="md:cursor-none">
            <Hero />
            <IntroSection />
            <SectionDivider />
            <Awards />
            <SectionDivider />
            <Expertise />
            <SectionDivider />
            <CtaSection />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <TechMarquee />
            <SectionDivider />
            <Publications />
            <SectionDivider />
            <Contact />
          </main>
          <Footer />
        </div>
      </ReactLenis>
    </LocaleProvider>
  );
}
