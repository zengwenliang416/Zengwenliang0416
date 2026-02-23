export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function fit(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  easeFn?: (t: number) => number,
): number {
  let t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  if (easeFn) t = easeFn(t);
  return outMin + (outMax - outMin) * t;
}

export function saturate(v: number): number {
  return clamp(v, 0, 1);
}
