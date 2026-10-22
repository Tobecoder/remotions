export const getPreviewDurationInFrames = (durationInSeconds: number, fps: number) => Math.max(1, Math.round(durationInSeconds * fps));

export const getPreviewFrame = (elapsedInMilliseconds: number, fps: number, durationInFrames: number) => {
  const elapsedFrames = Math.floor(Math.max(0, elapsedInMilliseconds) / 1000 * fps);
  return elapsedFrames % Math.max(1, durationInFrames);
};
