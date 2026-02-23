function cubicBezier(
  t: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (p1x === p1y && p2x === p2y) return t;

  const bx = 3 * p1x;
  const cx = 3 * (p2x - p1x) - bx;
  const ax = 1 - bx - cx;

  const by = 3 * p1y;
  const cy = 3 * (p2y - p1y) - by;
  const ay = 1 - by - cy;

  let x = t;
  for (let i = 0; i < 8; i++) {
    const xCalc = ((ax * x + cx) * x + bx) * x;
    const err = xCalc - t;
    if (Math.abs(err) < 1e-6) break;
    const slope = (3 * ax * x + 2 * cx) * x + bx;
    if (slope === 0) break;
    x -= err / slope;
    x = Math.min(Math.max(x, 0), 1);
  }

  return ((ay * x + cy) * x + by) * x;
}

export const ease = {
  lusion: (t: number) => cubicBezier(t, 0.35, 0, 0, 1),
  expoOut: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  expoInOut: (t: number) =>
    t === 0
      ? 0
      : t === 1
        ? 1
        : (t *= 2) < 1
          ? 0.5 * Math.pow(1024, t - 1)
          : 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2),
  cubicOut: (t: number) => --t * t * t + 1,
  cubicInOut: (t: number) =>
    (t *= 2) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
} as const;
