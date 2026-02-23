import { useRef, useCallback } from "react";
import { useRAF } from "./useRAF";
import { lerp } from "../lib/math";

interface ScrollState {
  current: number;
  target: number;
  velocity: number;
  progress: number;
  direction: number;
}

export function useScrollPosition(lerpFactor = 0.08): ScrollState {
  const state = useRef<ScrollState>({
    current: 0,
    target: 0,
    velocity: 0,
    progress: 0,
    direction: 0,
  });

  const update = useCallback(
    (_dt: number) => {
      const prev = state.current.current;
      state.current.target = window.scrollY;
      state.current.current = lerp(
        state.current.current,
        state.current.target,
        lerpFactor,
      );
      state.current.velocity = state.current.current - prev;
      state.current.direction = state.current.velocity > 0 ? 1 : -1;

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      state.current.progress = docH > 0 ? state.current.current / docH : 0;
    },
    [lerpFactor],
  );

  useRAF(update);

  return state.current;
}
