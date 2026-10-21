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

const characterCount = (text: string) => Math.max(1, Array.from(text).length);

const fitFontSize = (text: string, desiredSize: number, maxWidth: number, glyphWidthRatio: number) =>
  Math.max(1, Math.min(desiredSize, maxWidth / (characterCount(text) * glyphWidthRatio)));

const commonStyle = (fontFamily: string) => ({
  fontFamily,
  fontWeight: 700,
  letterSpacing: 0.3,
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
  const lineHeight = fontSize * 1.16;
  const centerY = dimensions.height * 0.7;

  return <svg role="img" aria-label="基础字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      {lines.map((line, index) => <text key={index} x={dimensions.width / 2} y={centerY + (index - (lines.length - 1) / 2) * lineHeight} textAnchor="middle" dominantBaseline="middle" fill={color} stroke={secondaryColor} strokeWidth={Math.max(1, fontSize * 0.06)} paintOrder="stroke" fontSize={fontSize}>{line}</text>)}
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
  const fittedFontSize = fitFontSize(lines.reduce((longest, line) => line.length > longest.length ? line : longest, ''), fontSize, textAreaWidth, 0.72);
  const lineHeight = fittedFontSize * 1.18;
  const boxHeight = Math.max(fittedFontSize * 1.55, lines.length * lineHeight + fittedFontSize * 0.62);
  const boxWidth = Math.min(dimensions.width * 0.88, Math.max(fittedFontSize * 4, Math.max(...lines.map((line) => Array.from(line).length)) * fittedFontSize * 0.72 + fittedFontSize * 1.5));
  const boxX = (dimensions.width - boxWidth) / 2;
  const boxY = dimensions.height * 0.68 - boxHeight / 2;

  return <svg role="img" aria-label="圆角字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      <rect x={boxX} y={boxY} width={boxWidth} height={boxHeight} rx={boxHeight / 2} fill={secondaryColor} opacity="0.16" />
      <rect x={boxX + 2} y={boxY + 2} width={Math.max(1, boxWidth - 4)} height={Math.max(1, boxHeight - 4)} rx={Math.max(1, boxHeight / 2 - 2)} fill="#ffffff" stroke={secondaryColor} strokeWidth={Math.max(2, fontSize * 0.035)} />
      {lines.map((line, index) => <text key={index} x={dimensions.width / 2} y={dimensions.height * 0.68 + (index - (lines.length - 1) / 2) * lineHeight} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={fittedFontSize} textLength={Math.min(textAreaWidth, Math.max(1, Array.from(line).length * fittedFontSize * 0.72))} lengthAdjust="spacingAndGlyphs">{line}</text>)}
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
  const fittedFontSize = fitFontSize(text, fontSize, maxTextWidth, 0.7);
  const naturalTextWidth = characterCount(text) * fittedFontSize * 0.7;
  const iconSpace = fittedFontSize * 0.95;
  const horizontalPadding = fittedFontSize * 0.65;
  const pillWidth = Math.min(dimensions.width * 0.86, Math.max(fittedFontSize * 4, naturalTextWidth + iconSpace + horizontalPadding * 2));
  const pillHeight = fittedFontSize * 1.65;
  const pillX = (dimensions.width - pillWidth) / 2 + slide;
  const pillY = dimensions.height * 0.7 - pillHeight / 2;
  const textAreaWidth = Math.max(1, pillWidth - iconSpace - horizontalPadding * 2);
  const textX = pillX + iconSpace + horizontalPadding + textAreaWidth / 2;

  return <svg role="img" aria-label="移动胶囊字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      <rect x={pillX} y={pillY} width={pillWidth} height={pillHeight} rx={pillHeight / 2} fill={secondaryColor} />
      <circle cx={pillX + iconSpace * 0.52} cy={dimensions.height * 0.7} r={pillHeight * 0.18} fill="#ffffff" opacity="0.78" />
      <text x={textX} y={dimensions.height * 0.7} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={fittedFontSize} textLength={Math.min(textAreaWidth, naturalTextWidth)} lengthAdjust="spacingAndGlyphs">{text}</text>
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
  const visibleChars = chars.length || 1;
  const gap = fontSize * 0.12;
  const totalWidth = Math.min(dimensions.width * 0.88, visibleChars * fontSize * 0.84 + Math.max(0, visibleChars - 1) * gap);
  const startX = (dimensions.width - totalWidth) / 2;
  const baseY = dimensions.height * 0.7;

  return <svg role="img" aria-label="弹出单词字幕动画" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity={opacity} style={{...commonStyle(fontFamily)}}>
      {chars.map((character, index) => {
        const localProgress = clamp((progress * (chars.length + 2) - index) / 1.5);
        const scale = 0.72 + localProgress * 0.28;
        const y = baseY + (1 - localProgress) * fontSize * 0.62;
        const x = startX + index * (totalWidth / Math.max(1, chars.length - 1));
        return <g key={`${character}-${index}`} transform={`translate(${x} ${y}) scale(${scale})`}>
          <circle r={fontSize * 0.68} fill={index % 2 === 0 ? secondaryColor : '#ffffff'} opacity={index % 2 === 0 ? 0.18 : 0.7} />
          <text textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={fontSize}>{character}</text>
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
  const lineHeight = fontSize * 1.2;
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
        const lineWidth = Math.min(dimensions.width * 0.9, lineChars.length * fontSize * 0.76);
        const startX = (dimensions.width - lineWidth) / 2;
        return <g key={lineIndex}>
          {lineChars.map((character, index) => {
            const globalIndex = offset + index;
            return <text key={`${character}-${globalIndex}`} x={startX + index * (lineWidth / Math.max(1, lineChars.length - 1))} y={startY + lineIndex * lineHeight} textAnchor="middle" dominantBaseline="middle" fill={globalIndex <= highlightIndex ? secondaryColor : color} fontSize={fontSize}>{character}</text>;
          })}
        </g>;
      })}
    </g>
  </svg>;
};
