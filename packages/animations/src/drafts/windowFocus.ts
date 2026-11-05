export type FocusArea = {x: number; y: number; width: number; height: number};
const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const ease = (n: number) => {const t = clamp(n); return 1 - Math.pow(1 - t, 3);};

export const windowFocusState = (frame: number, fps: number, width: number, height: number, imageWidth: number, imageHeight: number, focus: FocusArea) => {
  const seconds = Math.max(0, frame) / fps;
  const enter = ease(seconds / 0.85);
  const mark = ease((seconds - 1.25) / 0.7);
  const zoom = ease((seconds - 2.6) / 1.15);
  const fit = Math.min(width * 0.73 / imageWidth, height * 0.66 / imageHeight);
  const baseWidth = imageWidth * fit;
  const baseHeight = imageHeight * fit;
  const scale = (0.96 + 0.04 * enter) * (1 + 0.18 * zoom);
  const cardWidth = baseWidth * scale;
  const cardHeight = baseHeight * scale;
  const focusX = focus.x + focus.width / 2;
  const focusY = focus.y + focus.height / 2;
  const x = clamp((width - cardWidth) / 2 + (0.5 - focusX) * cardWidth * zoom * 0.35, width * 0.04, width * 0.96 - cardWidth);
  const y = clamp((height - cardHeight) / 2 - height * 0.015 + (0.5 - focusY) * cardHeight * zoom * 0.5 + (1 - enter) * height * 0.045, height * 0.07, height * 0.86 - cardHeight);
  return {x, y, width: cardWidth, height: cardHeight, opacity: clamp(seconds / 0.24), mark, zoom};
};

export const validateWindowInput = (imageWidth: number, imageHeight: number, focus: FocusArea) => {
  if (![imageWidth, imageHeight].every((n) => Number.isFinite(n) && n > 0)) throw new Error('截图宽高必须是正数');
  if (![focus.x, focus.y, focus.width, focus.height].every(Number.isFinite) || focus.x < 0 || focus.y < 0 || focus.width <= 0 || focus.height <= 0 || focus.x + focus.width > 1 || focus.y + focus.height > 1) throw new Error('重点区域必须在截图范围内，使用 0–1 的相对坐标');
};
