import { useEffect, useRef } from "react";

type RAFCallback = (dt: number, elapsed: number) => void;

interface Subscriber {
  cb: RAFCallback;
  start: number;
  prev: number;
}

const subs = new Set<Subscriber>();
let loopId = 0;

function tick(now: number) {
  for (const s of subs) {
    if (!s.start) {
      s.start = now;
      s.prev = now;
    }
    const dt = Math.min((now - s.prev) / 1000, 0.1);
    const elapsed = (now - s.start) / 1000;
    s.prev = now;
    s.cb(dt, elapsed);
  }
  loopId = subs.size > 0 ? requestAnimationFrame(tick) : 0;
}

function startLoop() {
  if (!loopId) loopId = requestAnimationFrame(tick);
}

export function useRAF(callback: RAFCallback, active = true) {
  const subRef = useRef<Subscriber | null>(null);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!active) return;

    const sub: Subscriber = {
      cb: (dt, elapsed) => cbRef.current(dt, elapsed),
      start: 0,
      prev: 0,
    };
    subRef.current = sub;
    subs.add(sub);
    startLoop();

    return () => {
      subs.delete(sub);
      subRef.current = null;
    };
  }, [active]);
}
