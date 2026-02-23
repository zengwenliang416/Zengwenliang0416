import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { ease } from "../lib/ease";
import { fit, clamp } from "../lib/math";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lusion-style word reveal: translate3d(0, 1.7em, 0) + rotate(15deg)
 * Scroll-driven bidirectional — animates forward on enter, reverses on leave.
 * Stagger: word_index / 20 (0.05s per word) — extracted from lusion source.
 */
export function useSplitTextReveal(
  opts: {
    translateEm?: number;
    rotateDeg?: number;
    staggerDivisor?: number;
  } = {},
) {
  const ref = useRef<HTMLElement>(null);

  const translateEm = opts.translateEm ?? 1.7;
  const rotateDeg = opts.rotateDeg ?? 15;
  const staggerDiv = opts.staggerDivisor ?? 20;

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) return;

    const split = new SplitType(el, { types: "words" });
    const words = (split.words ?? []) as HTMLElement[];

    words.forEach((w) => {
      w.style.display = "inline-block";
      w.style.transform = `translate3d(0, ${translateEm}em, 0) rotate(${rotateDeg}deg)`;
      w.style.willChange = "transform";
      const parent = w.parentElement;
      if (parent) {
        parent.style.overflow = "hidden";
        parent.style.display = "inline-block";
      }
    });

    let time = 0;
    let animating = false;
    let raf = 0;
    let prevTs = 0;

    const animate = (ts: number) => {
      const dt = prevTs ? (ts - prevTs) / 1000 : 1 / 60;
      prevTs = ts;

      time = clamp(
        time + (animating ? dt : -dt),
        0,
        words.length / staggerDiv + 2,
      );

      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const t = time - i / staggerDiv;
        const y = fit(t, 0, 1, translateEm, 0, ease.lusion);
        const r = fit(t, 0, 0.7, rotateDeg, 0, ease.lusion);
        w.style.transform = `translate3d(0, ${y}em, 0) rotate(${r}deg)`;
      }

      // Stop RAF when fully settled (not visible + time near zero)
      if (!animating && time <= 0.01) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(animate);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          animating = entry.isIntersecting;
          // Restart loop if it was paused
          if (animating && !raf) {
            prevTs = 0;
            raf = requestAnimationFrame(animate);
          }
        });
      },
      { rootMargin: "-15% 0px -15% 0px" },
    );
    obs.observe(el);

    raf = requestAnimationFrame(animate);

    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
      split.revert();
    };
  }, [translateEm, rotateDeg, staggerDiv]);

  return ref;
}

/**
 * Lusion-style character reveal: translate3d(0, 1em, 0) + rotate(10deg)
 * Time-based entrance triggered by IntersectionObserver.
 * Stagger: char_index / 20 — extracted from lusion source.
 */
export function useSplitCharReveal<T extends HTMLElement = HTMLElement>(
  opts: { stagger?: number; delay?: number } = {},
) {
  const ref = useRef<T>(null);

  const stagger = opts.stagger ?? 0.05;
  const delay = opts.delay ?? 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) return;

    const split = new SplitType(el, { types: "chars" });
    const chars = (split.chars ?? []) as HTMLElement[];

    chars.forEach((ch) => {
      ch.style.display = "inline-block";
      ch.style.transform = "translate3d(0, 1em, 0)";
      ch.style.willChange = "transform";
    });

    el.style.overflow = "hidden";

    let time = 0;
    let triggered = false;
    let raf = 0;
    let prevTs = 0;

    const animate = (ts: number) => {
      const dt = prevTs ? (ts - prevTs) / 1000 : 1 / 60;
      prevTs = ts;
      time += dt;
      let allDone = true;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const t = time - delay - i * stagger;
        const y = fit(t, 0, 1, 1, 0, ease.lusion);
        const r = fit(t, 0, 1, 10, 0, ease.lusion);
        ch.style.transform = `translate3d(0, ${y}em, 0) rotate(${r}deg)`;
        if (y > 0.01) allDone = false;
      }

      if (allDone) {
        chars.forEach((ch) => {
          ch.style.transform = "translate3d(0, 0, 0)";
          ch.style.willChange = "auto";
        });
      } else {
        raf = requestAnimationFrame(animate);
      }
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !triggered) {
            triggered = true;
            raf = requestAnimationFrame(animate);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      split.revert();
    };
  }, [stagger, delay]);

  return ref;
}
