import type {Caption} from '@remotion/captions';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type CaptionStyleProps = {
  /** Captions in Remotion's Caption[] format. */
  captions: Caption[];
  /** Canvas width in pixels. */
  width?: number;
  /** Canvas height in pixels. */
  height?: number;
  /** Main text or highlight color. */
  color?: string;
  /** Secondary accent color. */
  secondaryColor?: string;
  /** Base color behind the caption style. */
  backgroundColor?: string;
  /** Text size in pixels before the card scales the preview. */
  fontSize?: number;
  /** Font family used by the caption text. */
  fontFamily?: string;
};

type Dimensions = {width: number; height: number};

const getDimensions = (width: number, height: number): Dimensions => ({
  width: Number.isFinite(width) ? Math.max(1, width) : 1,
  height: Number.isFinite(height) ? Math.max(1, height) : 1,
});

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const getCaptionAtTime = (captions: Caption[], timeMs: number) =>
  captions.find((caption) => timeMs >= caption.startMs && timeMs < caption.endMs) ?? null;

const getCaptionProgress = (caption: Caption, timeMs: number) =>
  clamp((timeMs - caption.startMs) / Math.max(1, caption.endMs - caption.startMs));

const getCaptionOpacity = (caption: Caption, timeMs: number) => {
  const progress = getCaptionProgress(caption, timeMs);
  const fadeIn = clamp(progress / 0.16);
  const fadeOut = clamp((1 - progress) / 0.16);
  return Math.min(fadeIn, fadeOut);
};

const splitCaption = (text: string, maxChars: number) => {
  const chars = Array.from(text.trim());
  if (chars.length === 0) return [''];
  const lines: string[] = [];
  for (let index = 0; index < chars.length; index += maxChars) {
    lines.push(chars.slice(index, index + maxChars).join(''));
  }
  return lines;
};

const captionText = (caption: Caption | null) => caption?.text.trim() ?? '';

const CAPTION_LETTER_SPACING = 0.9;

const estimateTextWidth = (text: string, fontSize: number, latinWidthRatio: number) =>
  Array.from(text).reduce((width, character) => {
    if (/^[\u2e80-\u9fff\uf900-\ufaff]$/u.test(character)) return width + fontSize;
    if (character.trim() === '') return width + fontSize * 0.35;
    return width + fontSize * latinWidthRatio;
  }, 0) + Math.max(0, Array.from(text).length - 1) * CAPTION_LETTER_SPACING;

const estimateCaptionInkHeight = (text: string, fontSize: number) => {
  const ratios = Array.from(text).map((character) => {
    if (character === '一' || character === '—' || character === '–' || character === '-') return 0.26;
    if (character === '~' || character === '～') return 0.38;
    if (character.trim() === '') return 0.3;
    if (/^[\u2e80-\u9fff\uf900-\ufaff]$/u.test(character)) return 0.92;
    return 0.72;
  });
  return Math.max(fontSize * 0.2, fontSize * Math.max(0.2, ...ratios));
};

const fitFontSize = (text: string, desiredSize: number, maxWidth: number, glyphWidthRatio: number) =>
  Math.max(1, Math.min(desiredSize, maxWidth / Math.max(1, estimateTextWidth(text, desiredSize, glyphWidthRatio)) * desiredSize));

const longestCaptionLine = (captions: Caption[], maxChars: number) =>
  captions.reduce((longest, caption) => splitCaption(caption.text, maxChars).reduce((currentLongest, line) => line.length > currentLongest.length ? line : currentLongest, longest), '');

const CAPTION_BUBBLE_PADDING_X = 4;
const CAPTION_BUBBLE_PADDING_Y = 3;
const CAPTION_BUBBLE_AMPLITUDE = 10;
const CAPTION_BUBBLE_VERTICAL_SHIFT = 0.08;

const bubbleRadius = (amplitude: number, index: number, phase: number) =>
  amplitude * (0.68 + 0.24 * Math.sin(index * 1.81 + phase) + 0.14 * Math.cos(index * 0.73 - phase));

const buildBubblePath = (x: number, y: number, width: number, height: number, amplitude: number, phase: number) => {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const safeAmplitude = Math.max(1, Math.min(amplitude, safeWidth / 4, safeHeight * 0.38));
  // Fewer, wider lobes keep the silhouette cloud-like instead of turning it
  // into a thin wavy border when the preview card is scaled down.
  const horizontalSegments = Math.max(4, Math.min(9, Math.ceil(safeWidth / Math.max(34, safeAmplitude * 4))));
  const verticalSegments = Math.max(2, Math.min(3, Math.ceil(safeHeight / Math.max(24, safeAmplitude * 2.8))));
  let path = `M ${x} ${y}`;

  for (let index = 0; index < horizontalSegments; index += 1) {
    const start = x + (safeWidth * index) / horizontalSegments;
    const end = x + (safeWidth * (index + 1)) / horizontalSegments;
    path += ` Q ${(start + end) / 2} ${y - bubbleRadius(safeAmplitude, index, phase)} ${end} ${y}`;
  }
  for (let index = 0; index < verticalSegments; index += 1) {
    const start = y + (safeHeight * index) / verticalSegments;
    const end = y + (safeHeight * (index + 1)) / verticalSegments;
    path += ` Q ${x + safeWidth + bubbleRadius(safeAmplitude, horizontalSegments + index, phase + 0.4)} ${(start + end) / 2} ${x + safeWidth} ${end}`;
  }
  for (let index = 0; index < horizontalSegments; index += 1) {
    const start = x + safeWidth - (safeWidth * index) / horizontalSegments;
    const end = x + safeWidth - (safeWidth * (index + 1)) / horizontalSegments;
    // Mirror the top edge's lobe sizes so the filled cloud has a stable,
    // balanced silhouette instead of visibly different top and bottom waves.
    const mirroredIndex = horizontalSegments - 1 - index;
    path += ` Q ${(start + end) / 2} ${y + safeHeight + bubbleRadius(safeAmplitude, mirroredIndex, phase)} ${end} ${y + safeHeight}`;
  }
  for (let index = 0; index < verticalSegments; index += 1) {
    const start = y + safeHeight - (safeHeight * index) / verticalSegments;
    const end = y + safeHeight - (safeHeight * (index + 1)) / verticalSegments;
    path += ` Q ${x - bubbleRadius(safeAmplitude, horizontalSegments * 2 + verticalSegments + index, phase + 1.2)} ${(start + end) / 2} ${x} ${end}`;
  }

  return `${path} Z`;
};

const commonStyle = (fontFamily: string) => ({
  fontFamily,
  fontWeight: 700,
  letterSpacing: `${CAPTION_LETTER_SPACING}px`,
});

/** A clean, centered caption line with a subtle shadow. */
export const BasicCaptions = ({
  captions,
  width = 1920,
  height = 1080,
  color = '#ffffff',
  secondaryColor = '#1f2937',
  backgroundColor = '#dcecff',
  fontSize = 64,
  fontFamily = 'system-ui, sans-serif',
}: CaptionStyleProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const caption = getCaptionAtTime(captions, (frame / Math.max(1, fps)) * 1000);
  const opacity = caption ? getCaptionOpacity(caption, (frame / Math.max(1, fps)) * 1000) : 0;
  const lines = splitCaption(captionText(caption), 20);
  const layoutLine = longestCaptionLine(captions, 20);
  const fittedFontSize = fitFontSize(layoutLine, fontSize, dimensions.width * 0.86, 0.72);
  const lineHeight = fittedFontSize * 1.16;
  const centerY = dimensions.height * 0.7;

  return <svg role="img" aria-label="基础字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      {lines.map((line, index) => <text key={index} x={dimensions.width / 2} y={centerY + (index - (lines.length - 1) / 2) * lineHeight} textAnchor="middle" dominantBaseline="middle" fill={color} stroke={secondaryColor} strokeWidth={Math.max(1, fittedFontSize * 0.06)} paintOrder="stroke" fontSize={fittedFontSize}>{line}</text>)}
    </g>
  </svg>;
};

/** A rounded label that expands to fit each active caption line. */
export const RoundedCaptions = ({
  captions,
  width = 1920,
  height = 1080,
  color = '#1f2937',
  secondaryColor = '#409eff',
  backgroundColor = '#eef6ff',
  fontSize = 58,
  fontFamily = 'system-ui, sans-serif',
}: CaptionStyleProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const timeMs = (frame / Math.max(1, fps)) * 1000;
  const caption = getCaptionAtTime(captions, timeMs);
  const opacity = caption ? getCaptionOpacity(caption, timeMs) : 0;
  const lines = splitCaption(captionText(caption), 18);
  const textAreaWidth = dimensions.width * 0.76;
  const layoutLine = longestCaptionLine(captions, 18);
  const fittedFontSize = fitFontSize(layoutLine, fontSize, textAreaWidth, 0.72);
  const lineHeight = fittedFontSize * 1.18;
  const bubblePhase = frame / Math.max(1, fps) * 1.6;
  const activeTextWidth = Math.max(1, ...lines.map((line) => estimateTextWidth(line, fittedFontSize, 0.72)));
  const bubbleWidth = Math.min(textAreaWidth, Math.max(1, activeTextWidth + CAPTION_BUBBLE_PADDING_X * 2));
  const lineInkHeights = lines.map((line) => estimateCaptionInkHeight(line, fittedFontSize));
  const bubbleHeight = lines.length === 1
    ? lineInkHeights[0] + CAPTION_BUBBLE_PADDING_Y * 2
    : lines.length * lineHeight + CAPTION_BUBBLE_PADDING_Y * 2;
  const bubbleX = (dimensions.width - bubbleWidth) / 2;
  const bubbleY = dimensions.height * 0.68 - fittedFontSize * CAPTION_BUBBLE_VERTICAL_SHIFT - bubbleHeight / 2;
  const bubblePath = buildBubblePath(bubbleX, bubbleY, bubbleWidth, bubbleHeight, CAPTION_BUBBLE_AMPLITUDE, bubblePhase);

  return <svg role="img" aria-label="气泡字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      <path data-caption-shape="bubble-background" d={bubblePath} fill={secondaryColor} opacity="0.24" />
      {lines.map((line, index) => {
        const y = dimensions.height * 0.68 + (index - (lines.length - 1) / 2) * lineHeight;
        return <text key={index} x={dimensions.width / 2} y={y} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={fittedFontSize}>{line}</text>;
      })}
    </g>
  </svg>;
};

/** A compact pill that slides in from the side whenever a caption starts. */
export const MovingPillCaptions = ({
  captions,
  width = 1920,
  height = 1080,
  color = '#ffffff',
  secondaryColor = '#409eff',
  backgroundColor = '#eaf4ff',
  fontSize = 58,
  fontFamily = 'system-ui, sans-serif',
}: CaptionStyleProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const timeMs = (frame / Math.max(1, fps)) * 1000;
  const caption = getCaptionAtTime(captions, timeMs);
  const progress = caption ? getCaptionProgress(caption, timeMs) : 0;
  const opacity = caption ? getCaptionOpacity(caption, timeMs) : 0;
  const slide = interpolate(Math.min(1, progress / 0.22), [0, 1], [dimensions.width * 0.13, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const text = captionText(caption);
  const maxTextWidth = dimensions.width * 0.66;
  const layoutText = captions.reduce((longest, item) => item.text.trim().length > longest.length ? item.text.trim() : longest, '');
  const fittedFontSize = fitFontSize(layoutText, fontSize, maxTextWidth, 0.7);
  const activeTextWidth = Math.min(maxTextWidth, Math.max(1, estimateTextWidth(text, fittedFontSize, 0.7)));
  const bubbleWidth = Math.min(dimensions.width * 0.86, activeTextWidth + CAPTION_BUBBLE_PADDING_X * 2);
  const bubbleHeight = estimateCaptionInkHeight(text, fittedFontSize) + CAPTION_BUBBLE_PADDING_Y * 2;
  const bubbleX = (dimensions.width - bubbleWidth) / 2 + slide;
  const bubbleY = dimensions.height * 0.7 - fittedFontSize * CAPTION_BUBBLE_VERTICAL_SHIFT - bubbleHeight / 2;
  const bubblePhase = frame / Math.max(1, fps) * 1.6;
  const bubblePath = buildBubblePath(bubbleX, bubbleY, bubbleWidth, bubbleHeight, CAPTION_BUBBLE_AMPLITUDE, bubblePhase);
  const textX = dimensions.width / 2 + slide;

  return <svg role="img" aria-label="移动气泡字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      <path data-caption-shape="bubble-background" d={bubblePath} fill={secondaryColor} />
      <text x={textX} y={dimensions.height * 0.7} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={fittedFontSize}>{text}</text>
    </g>
  </svg>;
};

/** A word-by-word pop animation that works for both Chinese characters and spaced words. */
export const PoppingWordCaptions = ({
  captions,
  width = 1920,
  height = 1080,
  color = '#1f2937',
  secondaryColor = '#409eff',
  backgroundColor = '#f5f9ff',
  fontSize = 62,
  fontFamily = 'system-ui, sans-serif',
}: CaptionStyleProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const timeMs = (frame / Math.max(1, fps)) * 1000;
  const caption = getCaptionAtTime(captions, timeMs);
  const progress = caption ? getCaptionProgress(caption, timeMs) : 0;
  const opacity = caption ? getCaptionOpacity(caption, timeMs) : 0;
  const chars = Array.from(captionText(caption));
  const visibleChars = Math.max(1, chars.length);
  const layoutText = captions.reduce((longest, item) => item.text.trim().length > longest.length ? item.text.trim() : longest, '');
  const maxWidth = dimensions.width * 0.88;
  const fittedFontSize = fitFontSize(layoutText, fontSize, maxWidth, 0.84);
  const gap = CAPTION_LETTER_SPACING;
  const activeCharWidths = chars.map((character) => estimateTextWidth(character, fittedFontSize, 0.84));
  const activeWidth = Math.min(maxWidth, activeCharWidths.reduce((total, characterWidth) => total + characterWidth, 0) + Math.max(0, visibleChars - 1) * gap);
  const activeStartX = (dimensions.width - activeWidth) / 2;
  const baseY = dimensions.height * 0.7;

  return <svg role="img" aria-label="弹出单词字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      {chars.map((character, index) => {
        const localProgress = clamp((progress * (chars.length + 2) - index) / 1.5);
        const scale = 0.72 + localProgress * 0.28;
        const y = baseY + (1 - localProgress) * fittedFontSize * 0.62;
        const previousWidth = activeCharWidths.slice(0, index).reduce((total, characterWidth) => total + characterWidth + gap, 0);
        const x = activeStartX + previousWidth + activeCharWidths[index] / 2;
        return <g key={`${character}-${index}`} transform={`translate(${x} ${y}) scale(${scale})`}>
          <circle r={fittedFontSize * 0.62} fill={index % 2 === 0 ? secondaryColor : '#ffffff'} opacity={index % 2 === 0 ? 0.18 : 0.7} />
          <text textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={fittedFontSize}>{character}</text>
        </g>;
      })}
    </g>
  </svg>;
};

/** A karaoke-style line that advances a bright highlight across each character. */
export const WordHighlightCaptions = ({
  captions,
  width = 1920,
  height = 1080,
  color = '#4b5563',
  secondaryColor = '#409eff',
  backgroundColor = '#f8fbff',
  fontSize = 62,
  fontFamily = 'system-ui, sans-serif',
}: CaptionStyleProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const timeMs = (frame / Math.max(1, fps)) * 1000;
  const caption = getCaptionAtTime(captions, timeMs);
  const progress = caption ? getCaptionProgress(caption, timeMs) : 0;
  const opacity = caption ? getCaptionOpacity(caption, timeMs) : 0;
  const chars = Array.from(captionText(caption));
  const lines = splitCaption(captionText(caption), 18);
  const longestLine = captions.flatMap((item) => splitCaption(item.text, 18)).reduce((longest, line) => line.length > longest.length ? line : longest, '');
  const maxLineWidth = dimensions.width * 0.9;
  const fittedFontSize = fitFontSize(longestLine, fontSize, maxLineWidth, 0.76);
  const lineHeight = fittedFontSize * 1.2;
  const startY = dimensions.height * 0.7 - (lines.length - 1) * lineHeight / 2;
  const highlightIndex = chars.length === 0 ? -1 : Math.min(chars.length - 1, Math.floor(progress * chars.length));
  let charOffset = 0;
  const lineEntries = lines.map((line) => {
    const offset = charOffset;
    charOffset += Array.from(line).length;
    return {line, offset};
  });

  return <svg role="img" aria-label="逐字高亮字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      {lineEntries.map(({line, offset}, lineIndex) => {
        const lineChars = Array.from(line);
        const characterWidths = lineChars.map((character) => estimateTextWidth(character, fittedFontSize, 0.76));
        const lineWidth = Math.min(maxLineWidth, characterWidths.reduce((total, characterWidth) => total + characterWidth, 0) + Math.max(0, lineChars.length - 1) * CAPTION_LETTER_SPACING);
        const startX = (dimensions.width - lineWidth) / 2;
        return <g key={lineIndex}>
          {lineChars.map((character, index) => {
            const globalIndex = offset + index;
            const previousWidth = characterWidths.slice(0, index).reduce((total, characterWidth) => total + characterWidth + CAPTION_LETTER_SPACING, 0);
            const x = startX + previousWidth + characterWidths[index] / 2;
            return <text key={`${character}-${globalIndex}`} x={x} y={startY + lineIndex * lineHeight} textAnchor="middle" dominantBaseline="middle" fill={globalIndex <= highlightIndex ? secondaryColor : color} fontSize={fittedFontSize}>{character}</text>;
          })}
        </g>;
      })}
    </g>
  </svg>;
};
