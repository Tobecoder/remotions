export type PlanePose = {x: number; y: number; ax: number; ay: number; bx: number; by: number};

export const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (value: number) => {const t = clamp(value); return t * t * (3 - 2 * t);};
export const during = (time: number, start: number, end: number) => ease((time - start) / Math.max(0.001, end - start));

export const mixPose = (from: PlanePose, to: PlanePose, progress: number): PlanePose => {
  const p = clamp(progress);
  return {x: mix(from.x,to.x,p), y: mix(from.y,to.y,p), ax: mix(from.ax,to.ax,p), ay: mix(from.ay,to.ay,p), bx: mix(from.bx,to.bx,p), by: mix(from.by,to.by,p)};
};

export const frontPose: PlanePose = {x: 338, y: 94, ax: 1, ay: 0, bx: 0, by: 1};
// Axonometric projection measured from the visible reference panel corners.
export const tiltedPose: PlanePose = {x: 436, y: 53, ax: 189 / 360, ay: 99 / 360, bx: -99 / 202.5, by: 57 / 202.5};

// The catalogue's approved timing is the component default, not a per-scene recipe.
export const explodedLayerTiming={tiltStart:.4,tiltEnd:1.2,firstLayer:1.8,interval:.5,duration:.55};
export const openingLayerStartAt=2.1;
// The method heading enters with “是怎么从脚本到成片的”.
export const openingMethodCueAt=1.9;

export const openingState = (time: number) => ({
  tilt: during(time-openingLayerStartAt, explodedLayerTiming.tiltStart, explodedLayerTiming.tiltEnd),
  chapter: during(time, openingMethodCueAt, openingMethodCueAt+.7),
  thumbnail: during(time, 8.50, 9.00),
  fan: during(time, 8.65, 9.18),
});
