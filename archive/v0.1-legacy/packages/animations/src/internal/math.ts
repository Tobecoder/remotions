/** A pure, deterministic progress value. Before delay -> 0, after duration -> 1. */
export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const progressAtFrame = (
  frame: number,
  delayInFrames = 0,
  durationInFrames = 30,
): number => {
  const duration = Math.max(1, durationInFrames);
  return clamp01((frame - delayInFrames) / duration);
};

export const easeOutCubic = (value: number): number => {
  const t = clamp01(value);
  return 1 - Math.pow(1 - t, 3);
};

export const numberBetween = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const formatCount = (value: number, decimals = 0, locale = 'en-US'): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: numberBetween(Math.floor(decimals), 0, 20),
    maximumFractionDigits: numberBetween(Math.floor(decimals), 0, 20),
  }).format(value);
