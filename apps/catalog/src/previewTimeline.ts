import type {PreviewLoopMode} from './catalog';

export const getPreviewDurationInFrames = (durationInSeconds: number, fps: number) => Math.max(1, Math.round(durationInSeconds * fps));

/** Total frames needed to play a preview cycle without jumping at its turnaround. */
export const getPreviewLoopDurationInFrames = (cycleDurationInFrames: number, mode: PreviewLoopMode = 'forward') => {
  const safeCycle = Math.max(1, Math.floor(cycleDurationInFrames));
  return mode === 'ping-pong' && safeCycle > 1 ? safeCycle * 2 - 2 : safeCycle;
};

export const getPreviewFrame = (elapsedInMilliseconds: number, fps: number, durationInFrames: number, mode: PreviewLoopMode = 'forward') => {
  const elapsedFrames = Math.floor(Math.max(0, elapsedInMilliseconds) / 1000 * fps);
  const safeDuration = Math.max(1, Math.floor(durationInFrames));
  if (mode === 'forward-hold') return Math.min(elapsedFrames, safeDuration - 1);
  if (mode !== 'ping-pong' || safeDuration === 1) return elapsedFrames % safeDuration;
  const loopDuration = safeDuration * 2 - 2;
  const loopFrame = elapsedFrames % loopDuration;
  return loopFrame < safeDuration ? loopFrame : loopDuration - loopFrame;
};
