import { useRef, useState, useEffect, useCallback } from "react";
import { useRAF } from "./useRAF";
import { clamp, lerp } from "../lib/math";

interface ElementScrollState {
  progress: number;
  isInView: boolean;
  screenRatio: number;
}

export function useElementScrollProgress(
  lerpFactor = 0.12,
): [React.RefObject<HTMLElement | null>, ElementScrollState] {
  const ref = useRef<HTMLElement | null>(null);
  const stateRef = useRef<ElementScrollState>({
    progress: 0,
    isInView: false,
    screenRatio: -1,
  });
  const [, setTick] = useState(0);
  const smoothProgress = useRef(0);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;

    const rawProgress = clamp(1 - rect.top / vh, 0, 1);
    smoothProgress.current = lerp(
      smoothProgress.current,
      rawProgress,
      lerpFactor,
    );

    const screenRatio = clamp((vh - rect.top) / (vh + rect.height), -0.2, 1.2);
    const isInView = rect.top < vh && rect.bottom > 0;

    stateRef.current = {
      progress: smoothProgress.current,
      isInView,
      screenRatio,
    };

    setTick((t) => t + 1);
  }, [lerpFactor]);

  useRAF(update);

  useEffect(() => {
    smoothProgress.current = 0;
  }, []);

  return [ref, stateRef.current];
}
