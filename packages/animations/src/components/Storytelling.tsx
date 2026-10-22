import type {CSSProperties, ReactNode} from 'react';
import {Easing, Img, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';

export type StorytellingProps = {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  durationInSeconds?: number;
  speed?: number;
  /** Controlled position in the complete entrance/hold/exit cycle. */
  progress?: number;
};

const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;
const dimension = (value: number) => Math.max(1, finite(value, 1));
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamped = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const useTime = (seconds: number, speed: number, progress?: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (progress !== undefined && Number.isFinite(progress)) return clamp(progress);
  const last = Math.max(1, Math.round(Math.max(0.1, finite(seconds, 5)) * Math.max(1, finite(fps, 30))) - 1);
  return clamp(frame * Math.max(0, finite(speed, 1)) / last);
};
const tween = (frame: number, start: number, end: number) => interpolate(frame, [start, end], [0, 1], {...clamped, easing: ease});

/** Fit a reference stage uniformly. Text, tails, and photos never stretch with the viewport. */
const Stage = ({width, height, baseWidth, baseHeight, backgroundColor, label, children}: {
  width: number; height: number; baseWidth: number; baseHeight: number;
  backgroundColor?: string; label: string; children: ReactNode;
}) => {
  const w = dimension(width);
  const h = dimension(height);
  const scale = Math.min(w / baseWidth, h / baseHeight);
  return <div role="img" aria-label={label} style={{width: w, height: h, position: 'relative', overflow: 'hidden', backgroundColor}}>
    <div data-story-stage="" style={{position: 'absolute', width: baseWidth, height: baseHeight, left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: 'center'}}>{children}</div>
  </div>;
};

export type StoryMessage = {text: string; from: 'me' | 'them'};
export type OnScreenMessagesProps = StorytellingProps & {
  /** An explicit empty array renders no messages. */
  messages?: readonly StoryMessage[];
  incomingColor?: string;
  fontFamily?: string;
};
const demoMessages: readonly StoryMessage[] = [
  {text: '我刚刚在车站看见你了。', from: 'them'},
  {text: '可我还在柏林。', from: 'me'},
  {text: '那刚才是谁在向我招手？', from: 'them'},
];

/** Blue/gray message bubbles reveal in conversation order, with shaped iMessage tails. */
export const OnScreenMessages = ({width = 1260, height = 680, color = '#248bf5', incomingColor = '#e5e5ea', backgroundColor, durationInSeconds = 5.4, speed = 1, progress, messages = demoMessages, fontFamily = 'Inter, Arial, "Microsoft YaHei", sans-serif'}: OnScreenMessagesProps) => {
  const frame = useTime(durationInSeconds, speed, progress) * 161;
  // Grow the reference stage for long conversations instead of cropping or discarding items.
  const textHeight = messages.reduce((sum, message) => {
    const ems = Array.from(message.text).reduce((length, char) => length + (/[^\u0000-\u007f]/u.test(char) ? 1 : 0.65), 0);
    return sum + Math.max(1, Math.ceil(ems / 21)) * 50 + 64;
  }, 0);
  const stageHeight = Math.max(680, 148 + textHeight);
  return <Stage width={width} height={height} baseWidth={1260} baseHeight={stageHeight} backgroundColor={backgroundColor} label="屏幕消息">
    <div style={{display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 90, paddingInline: 70, fontFamily, boxSizing: 'border-box'}}>
      {messages.map((message, index) => {
        const outgoing = message.from === 'me';
        const start = 2 + index / Math.max(1, messages.length - 1) * 50;
        const reveal = tween(frame, start, start + 8);
        const fill = outgoing ? color : incomingColor;
        const bubble: CSSProperties = {alignSelf: outgoing ? 'flex-end' : 'flex-start', backgroundColor: fill, borderRadius: 37, boxSizing: 'border-box', color: outgoing ? '#fff' : '#000', fontSize: 40, fontWeight: 400, lineHeight: 1.25, maxWidth: '84%', padding: '16px 28px', position: 'relative', opacity: reveal, translate: `0px ${(1 - reveal) * 32}px`, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap', textAlign: 'start', flexShrink: 0};
        return <div key={index} data-story-message={index} data-from={message.from} dir="auto" style={bubble}>
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" style={{position: 'absolute', bottom: 0, ...(outgoing ? {right: -12} : {left: -12})}}><path d={outgoing ? 'M0 0h20v16c0 8 4 13 12 16C14 32 0 25 0 16Z' : 'M32 0H12v16c0 8-4 13-12 16 18 0 32-7 32-16Z'} fill={fill} /></svg>
          <span style={{position: 'relative'}}>{message.text}</span>
        </div>;
      })}
    </div>
  </Stage>;
};

export type NewsArticleHighlightProps = StorytellingProps & {
  category?: string;
  headline?: string;
  summary?: string;
  /** Exact headline phrases to highlight, in animation order; absent phrases are ignored. */
  highlights?: readonly string[];
  fadeOut?: boolean;
  fontFamily?: string;
};

// Each token gets two slightly irregular ink passes, clipped from left to right.
const Marker = ({children, amount, color, seed}: {children: ReactNode; amount: number; color: string; seed: number}) => <span data-story-highlight={seed} style={{display: 'inline-block', position: 'relative', isolation: 'isolate'}}>
  <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: '-2% -1.5%', width: '103%', height: '104%', zIndex: -1, overflow: 'visible', clipPath: `inset(0 ${(1 - amount) * 100}% 0 0)`}}>
    <path d={`M0 ${8 + seed % 4} Q45 2 100 10 L99 94 Q50 101 1 91Z`} fill={color} opacity="0.72" />
    <path d={`M1 14 L99 ${6 + seed % 5} L100 89 L2 98Z`} fill={color} opacity="0.46" />
  </svg>{children}
</span>;

export const NewsArticleHighlight = ({width = 1920, height = 1080, color = '#ffe04c', backgroundColor, durationInSeconds = 5, speed = 1, progress, category = '创意观察', headline = '当创意遇见动态表达，每一个灵感都能变成故事，让重要的信息被看见', summary = '从一个想法开始，用画面组织叙事，让观众跟随文字与节奏，看见故事里的关键瞬间。', highlights = ['变成故事', '被看见'], fadeOut = true, fontFamily = 'Georgia, "Times New Roman", "Noto Serif SC", SimSun, serif'}: NewsArticleHighlightProps) => {
  const frame = useTime(durationInSeconds, speed, progress) * 149;
  const phrases = highlights.filter((phrase, index) => phrase.length > 0 && headline.includes(phrase) && highlights.indexOf(phrase) === index);
  const pieces: ReactNode[] = [];
  let offset = 0;
  let key = 0;
  while (offset < headline.length) {
    const matches = phrases.map((phrase, index) => ({phrase, index, at: headline.indexOf(phrase, offset)})).filter((match) => match.at >= 0).sort((a, b) => a.at - b.at || b.phrase.length - a.phrase.length);
    const match = matches[0];
    if (!match) {pieces.push(headline.slice(offset)); break;}
    if (match.at > offset) pieces.push(headline.slice(offset, match.at));
    // Chinese text can break at characters; Latin words stay together as in the reference.
    const words = (match.phrase.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*|\s+|[^\s]/gu) ?? []).flatMap((word) => word.length > 16 && !/^\s+$/u.test(word) ? word.match(/.{1,16}/gu) ?? [] : [word]);
    const visibleWords = words.filter((word) => !/^\s+$/u.test(word));
    let wordIndex = 0;
    const start = 31 + match.index / Math.max(1, phrases.length - 1) * 29;
    const amount = tween(frame, start, start + 24);
    for (const word of words) {
      if (/^\s+$/u.test(word)) {pieces.push(word); continue;}
      const reveal = clamp(amount * visibleWords.length - wordIndex++);
      const id = key++;
      pieces.push(<Marker key={id} amount={reveal} color={color} seed={id}>{word}</Marker>);
    }
    offset = match.at + match.phrase.length;
  }
  const textEms = Array.from(headline).reduce((sum, char) => sum + (/[^\u0000-\u007f]/u.test(char) ? 1 : 0.63), 0);
  const headlineSize = Math.min(70, 70 * Math.sqrt(62 / Math.max(62, textEms)));
  const summaryEms = Array.from(summary).reduce((sum, char) => sum + (/[^\u0000-\u007f]/u.test(char) ? 1 : 0.65), 0);
  const baseHeight = Math.max(458, 180 + (1 + Math.ceil(textEms * headlineSize / 1252)) * headlineSize * 1.15 + Math.ceil(summaryEms * 25 / 1080) * 36);
  return <Stage width={width} height={height} baseWidth={1420} baseHeight={baseHeight} backgroundColor={backgroundColor} label="新闻高亮">
    <article data-story-article="" style={{boxSizing: 'border-box', padding: '54px 84px 30px', color: '#181816', opacity: fadeOut ? 1 - interpolate(frame, [125, 149], [0, 1], {...clamped, easing: Easing.in(Easing.cubic)}) : 1}}>
      <div style={{color: '#a0432d', fontFamily: 'Arial, "Microsoft YaHei", sans-serif', fontSize: 15, fontWeight: 700, letterSpacing: 2.6, textTransform: 'uppercase'}}>{category}</div>
      <h1 style={{fontFamily, fontSize: headlineSize, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1.12, margin: '14px 0 18px', overflowWrap: 'anywhere', textWrap: 'balance'}}>{pieces}</h1>
      <p style={{fontFamily, color: '#4c4c48', fontSize: 25, lineHeight: 1.42, margin: 0, maxWidth: 1080, overflowWrap: 'anywhere'}}>{summary}</p>
    </article>
  </Stage>;
};

export type PolaroidPhoto = {src: string; caption?: string; alt?: string; label?: string; filter?: string};
export type PolaroidPicturesProps = StorytellingProps & {
  /** Omit to use Elements demo images; an empty array renders no photos. */
  photos?: readonly PolaroidPhoto[];
  fadeOut?: boolean;
  captionFontFamily?: string;
};
const demoPhotos: readonly PolaroidPhoto[] = [
  {src: 'https://remotion.media/transition-bg-blue.jpg', caption: 'scene A', label: 'A'},
  {src: 'https://remotion.media/transition-bg-pink.jpg', caption: 'scene B', label: 'B'},
  {src: 'https://remotion.media/transition-bg-blue.jpg', caption: 'scene C', label: 'C', filter: 'hue-rotate(-65deg)'},
];
const photoDirections = [{x: -620, y: 260, outX: -760, outY: -120, from: -20, to: -8, exit: -18}, {x: 340, y: -620, outX: 280, outY: -720, from: 16, to: 6, exit: 15}, {x: 680, y: 380, outX: 820, outY: 240, from: 15, to: -3, exit: 10}];

export const PolaroidPictures = ({width = 1480, height = 640, color = '#2d2620', backgroundColor, durationInSeconds = 5, speed = 1, progress, photos = demoPhotos, fadeOut = true, captionFontFamily = 'Caveat, "Segoe Print", "Kaiti SC", KaiTi, cursive'}: PolaroidPicturesProps) => {
  const frame = useTime(durationInSeconds, speed, progress) * 149;
  const drift = interpolate(frame, [58, 118], [0, 1], {...clamped, easing: Easing.inOut(Easing.quad)});
  const stageWidth = Math.max(1480, 190 + photos.length * 430);
  const firstLeft = (stageWidth - (Math.max(0, photos.length - 1) * 430 + 420)) / 2;
  // Reserve room for rotated corners, tape, drift, and shadows in shallow catalog cards.
  return <Stage width={width} height={height} baseWidth={stageWidth} baseHeight={760} backgroundColor={backgroundColor} label="拍立得照片">
    <div style={{position: 'relative', top: 60, width: '100%', height: 640, scale: 1 + drift * 0.035, translate: `0px ${-18 * drift}px`, color}}>
      {photos.map((photo, index) => {
        const position = photoDirections[index % 3];
        const start = 8 + index / Math.max(1, photos.length - 1) * 24;
        const enter = tween(frame, start, start + 26);
        const exitStart = 120 + index / Math.max(1, photos.length - 1) * 4;
        const exit = fadeOut ? tween(frame, exitStart, 149) : 0;
        const opacity = tween(frame, start, start + 8) * (1 - exit);
        return <div key={index} data-story-photo={index} style={{backgroundColor: '#fffdfa', boxShadow: '0 28px 58px rgba(8,5,3,.18), 0 5px 14px rgba(8,5,3,.08), inset 0 0 0 1px rgba(80,62,46,.05)', boxSizing: 'border-box', width: 420, height: 520, padding: '22px 22px 16px', position: 'absolute', left: firstLeft + index * 430, top: index % 3 === 1 ? 35 : 85, opacity, rotate: `${position.from + (position.to - position.from) * enter + (position.exit - position.to) * exit}deg`, scale: 1 + exit * 0.1, translate: `${position.x * (1 - enter) + position.outX * exit}px ${position.y * (1 - enter) + position.outY * exit}px`, zIndex: index + 1}}>
          <div data-story-tape="" style={{position: 'absolute', width: 150, height: 48, left: 135, top: -21, rotate: `${[-5, 4, -2][index % 3]}deg`, opacity: 0.68, backgroundColor: '#d9c58f', boxShadow: '0 2px 8px rgba(67,47,29,.14)', zIndex: 2}} />
          <div style={{width: '100%', height: 380, position: 'relative', overflow: 'hidden', backgroundColor: '#d8cbb8'}}>
            <Img src={photo.src} alt={photo.alt ?? photo.caption ?? ''} style={{width: '100%', height: '100%', objectFit: 'cover', filter: photo.filter}} />
            {photo.label && <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'Arial, sans-serif', fontSize: 160, fontWeight: 900, textShadow: '0 4px 30px rgba(0,0,0,.55)'}}>{photo.label}</div>}
          </div>
          <div style={{fontFamily: captionFontFamily, fontWeight: 600, fontSize: 44, height: 84, marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1.1, textAlign: 'center', overflowWrap: 'anywhere', overflow: 'hidden'}}>{photo.caption}</div>
        </div>;
      })}
    </div>
  </Stage>;
};

export type SpeedLinesProps = StorytellingProps & {/** Number of rays, clamped to 1–256. */ lineCount?: number; seed?: string};
export const SpeedLines = ({width = 1920, height = 1080, color = '#ffffff', backgroundColor, durationInSeconds = 1.5, speed = 1, progress, lineCount = 56, seed = 'speed-lines'}: SpeedLinesProps) => {
  const frame = useTime(durationInSeconds, speed, progress) * 44;
  const w = dimension(width);
  const h = dimension(height);
  const count = Math.max(1, Math.min(256, Math.round(finite(lineCount, 56))));
  const tick = Math.floor(frame / 2);
  const far = Math.hypot(w, h);
  const opacity = interpolate(frame, [0, 3, 40, 44], [0, 0.85, 0.85, 0], clamped);
  return <svg role="img" aria-label="速度线" width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', backgroundColor, overflow: 'hidden'}}>
    <g data-story-rays="" opacity={opacity}>{Array.from({length: count}, (_, index) => {
      const angle = index / count * Math.PI * 2 + random(`${seed}:angle:${index}:${tick}`) * 0.08;
      const spread = 0.006 + random(`${seed}:spread:${index}:${tick}`) * 0.014;
      const inner = 0.36 + random(`${seed}:inner:${index}:${tick}`) * 0.22;
      return <path key={index} d={`M ${w / 2 + Math.cos(angle) * inner * w / 2} ${h / 2 + Math.sin(angle) * inner * h / 2} L ${w / 2 + Math.cos(angle - spread) * far} ${h / 2 + Math.sin(angle - spread) * far} L ${w / 2 + Math.cos(angle + spread) * far} ${h / 2 + Math.sin(angle + spread) * far} Z`} fill={color} />;
    })}</g>
  </svg>;
};
