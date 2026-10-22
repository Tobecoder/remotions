import type {ReactNode} from 'react';
import {CanvasImage, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {estimateTextLines, useConversationHeight} from './StorytellingText';
import {loadCylinderEffect, loadTextAnnotations, useTextEffectResource} from './TextEffectsRuntime';

export type TextEffectProps = {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  durationInSeconds?: number;
  speed?: number;
  /** Controlled position in the full animation, from 0 to 1. */
  progress?: number;
};
export type TextAnnotationProps = TextEffectProps & {
  text?: string;
  /** First literal occurrence to annotate; absent phrases leave the text unchanged. */
  markedText?: string;
  textColor?: string;
  /** Reference-stage pixels; the entire stage scales uniformly to fit. */
  fontSize?: number;
};
export type CylinderTextProps = Omit<TextEffectProps, 'durationInSeconds' | 'speed'> & {
  text?: string;
  /** Revolutions per second; negative values reverse the rotation. Default 1/6. */
  speed?: number;
  tilt?: number;
};
export type SpinningTextWheelProps = TextEffectProps & {
  /** The first item is the final selection. Empty arrays stay empty. */
  items?: readonly string[];
};

const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;
const dimension = (value: number) => Math.max(1, finite(value, 1));
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const clamped = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const useTime = (seconds: number, speed: number, progress?: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = Math.max(1, finite(fps, 30));
  const duration = Math.max(0.1, finite(seconds, 4));
  const lastFrame = Math.max(1, Math.round(duration * safeFps) - 1);
  return {time: progress !== undefined && Number.isFinite(progress) ? clamp(progress) : clamp(frame * Math.max(0, finite(speed, 1)) / lastFrame), fps: safeFps, duration};
};

const Stage = ({width, height, baseWidth, baseHeight, backgroundColor, label, children}: {
  width: number; height: number; baseWidth: number; baseHeight: number;
  backgroundColor?: string; label: string; children: ReactNode;
}) => {
  const w = dimension(width);
  const h = dimension(height);
  return <div role="img" aria-label={label} data-text-effect={label} style={{width: w, height: h, position: 'relative', overflow: 'hidden', backgroundColor}}>
    <div style={{width: baseWidth, height: baseHeight, position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${Math.min(w / baseWidth, h / baseHeight)})`, transformOrigin: 'center'}}>{children}</div>
  </div>;
};

type AnnotationKind = 'circle' | 'cross' | 'strike' | 'highlight';
const annotationDefaults = {
  circle: {text: 'How much circular financing is in AI?', markedText: 'circular', color: '#2563eb', label: '圈画标记'},
  cross: {text: 'Please remove this', markedText: 'remove', color: '#eb2525', label: '交叉划除'},
  strike: {text: 'The forbidden fruit', markedText: 'forbidden', color: '#f11515', label: '删除线'},
  highlight: {text: 'A truly remarkable end to the World cup', markedText: 'remarkable', color: 'rgba(255, 236, 79, 0.62)', label: '荧光标记'},
} as const;

const TextAnnotation = ({kind, width = 900, height = 340, color, backgroundColor, fontFamily = '"Cormorant Garamond", "Noto Serif SC", "Songti SC", SimSun, Georgia, serif', fontSize = 80, textColor = '#171717', durationInSeconds = 4, speed = 1, progress, text, markedText}: TextAnnotationProps & {kind: AnnotationKind}) => {
  const defaults = annotationDefaults[kind];
  const content = text ?? defaults.text;
  const phrase = markedText ?? defaults.markedText;
  const start = phrase.length ? content.indexOf(phrase) : -1;
  const {time} = useTime(durationInSeconds, speed, progress);
  const referenceFrame = time * 119;
  const engine = useTextEffectResource(loadTextAnnotations);
  const size = Math.max(1, finite(fontSize, 80));
  const measured = useConversationHeight(`${content}:${size}:${Boolean(engine)}`, fontFamily);
  const baseHeight = Math.max(220, (measured.height ?? estimateTextLines(content, 800, size) * size * 1.1) + 72);
  const amount = kind === 'circle' ? interpolate(Math.floor(referenceFrame / 4) * 4, [0, 43], [0, 1], {...clamped, easing: Easing.bezier(0.42, 0, 0.58, 1)})
    : kind === 'cross' ? interpolate(referenceFrame, [18, 39], [0, 1], clamped)
    : kind === 'strike' ? interpolate(referenceFrame, [10, 25], [0, 1], clamped)
    : interpolate(referenceFrame, [0, 25], [0, 1], {...clamped, easing: Easing.spring({damping: 200, mass: 1, stiffness: 100, allowTail: true, durationRestThreshold: 0.02, overshootClamping: false})});
  const ink = color ?? defaults.color;
  const target = start < 0 ? null : content.slice(start, start + phrase.length);
  let annotated: ReactNode = target;
  if (engine && target !== null) {
    const common = {progress: amount, color: ink, children: target};
    annotated = kind === 'circle' ? <engine.Circle {...common} seed={Math.min(89, Math.floor(referenceFrame / 4) * 4) + 1} roughness={1.8} strokeWidth={12} padding={{left: 10, right: 10, top: 10, bottom: 10}} box="inside" />
      : kind === 'cross' ? <engine.CrossedOff {...common} strokeWidth={6} iterations={10} roughness={2} />
      : kind === 'strike' ? <engine.StrikeThrough {...common} strokeWidth={14} />
      : <engine.Highlight {...common} maxRandomnessOffset={10} roughness={2.3} padding={{left: 20, right: 20}} bowing={0} />;
  }
  return <Stage width={width} height={height} baseWidth={900} baseHeight={baseHeight} backgroundColor={backgroundColor} label={defaults.label}>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div ref={measured.ref} data-text-content="" data-annotation-progress={amount} style={{width: 800, fontFamily, fontSize: size, fontWeight: 700, lineHeight: 1.1, color: textColor, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', textAlign: kind === 'cross' || kind === 'strike' ? 'center' : 'left'}}>
        {start < 0 ? content : <>{content.slice(0, start)}{annotated}{content.slice(start + phrase.length)}</>}
      </div>
    </div>
  </Stage>;
};

export const CircleMarker = (props: TextAnnotationProps) => <TextAnnotation {...props} kind="circle" />;
export const CrossedOffText = (props: TextAnnotationProps) => <TextAnnotation {...props} kind="cross" />;
export const StrikeThroughText = (props: TextAnnotationProps) => <TextAnnotation {...props} kind="strike" />;
export const TextMarker = (props: TextAnnotationProps) => <TextAnnotation {...props} kind="highlight" />;

const xml = (text: string) => text.replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'}[char]!));

/** The same cylinder shader as Elements, with an SVG text texture instead of experimental HTML-in-canvas. */
export const CylinderText = ({width = 1920, height = 1080, color = '#182033', backgroundColor, text = 'ALWAYS IN MOTION • ALWAYS IN MOTION • ', speed = 1 / 6, tilt = 52, fontFamily = 'Arial, Helvetica, sans-serif', progress}: CylinderTextProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const engine = useTextEffectResource(loadCylinderEffect);
  const w = Math.round(dimension(width));
  const h = Math.round(dimension(height));
  const rotation = progress !== undefined && Number.isFinite(progress) ? clamp(progress) * 360 : frame / Math.max(1, finite(fps, 30)) * finite(speed, 1 / 6) * 360;
  const texture = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="${xml(color)}" font-family="${xml(fontFamily)}" font-size="${w / 22}" font-weight="700" xml:space="preserve">${xml(text)}</text></svg>`;
  return <div role="img" aria-label="圆柱文字" data-text-effect="圆柱文字" data-rotation={rotation} style={{width: w, height: h, backgroundColor, overflow: 'hidden'}}>
    {engine && <CanvasImage src={`data:image/svg+xml,${encodeURIComponent(texture)}`} width={w} height={h} fit="fill" pauseWhenLoading effects={[engine.cylinder({radius: Math.min(w, h) * 0.42, rotation, rotationX: Math.max(0, Math.min(85, finite(tilt, 52))), rotationZ: -18, shading: 0.35})]} style={{display: 'block', width: '100%', height: '100%'}} />}
  </div>;
};

/** A complete forward spin that decelerates onto the first item, like the source wheel. */
export const SpinningTextWheel = ({width = 640, height = 440, color = '#182033', backgroundColor, fontFamily = '"Mona Sans", Arial, "Microsoft YaHei", sans-serif', durationInSeconds = 4, speed = 1, progress, items = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']}: SpinningTextWheelProps) => {
  const {time, fps, duration} = useTime(durationInSeconds, speed, progress);
  const arrival = spring({fps, frame: time * Math.max(1, Math.round(duration * fps) - 1), config: {mass: 10, damping: 200, stiffness: 200}, durationInFrames: Math.max(1, Math.round(duration * fps * 0.75)), durationRestThreshold: 0.0001});
  const rotation = 1 - arrival;
  const longest = Math.max(1, ...items.map((item) => Array.from(item).reduce((ems, char) => ems + (/[^\u0000-\u007f]|[MW]/u.test(char) ? 1 : 0.65), 0)));
  const fontSize = Math.min(65, 380 / longest);
  const mask = 'linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)';
  const stageHeight = Math.max(200, Math.min(440, dimension(height) * 640 / dimension(width)));
  return <Stage width={width} height={height} baseWidth={640} baseHeight={stageHeight} backgroundColor={backgroundColor} label="旋转文字轮">
    <div data-text-wheel="" style={{position: 'absolute', width: 400, height: 200, left: 120, top: (stageHeight - 200) / 2, color, fontFamily, fontSize, fontWeight: 700, lineHeight: 1, maskImage: mask, WebkitMaskImage: mask, overflow: 'hidden', perspective: 10000}}>
      {items.map((value, index) => {
        const wheelIndex = index / items.length + rotation;
        const angle = wheelIndex * Math.PI * 2;
        const rotateX = wheelIndex * 360;
        return <div key={`${index}-${value}`} data-wheel-item={index} style={{alignItems: 'center', backfaceVisibility: 'hidden', display: 'flex', height: '100%', justifyContent: 'center', left: 0, opacity: index === 0 ? interpolate(arrival, [0.88, 1], [0.28, 1], clamped) : 0.28, position: 'absolute', top: 0, perspective: 1000, transform: `translateZ(${Math.cos(angle) * 100}px) translateY(${Math.sin(angle) * 100}px) rotateX(${rotateX}deg)`, width: '100%'}}>
          <div style={{backfaceVisibility: 'hidden', textAlign: 'center', transform: `rotateX(${-rotateX}deg)`, width: '100%'}}>{value}</div>
        </div>;
      })}
    </div>
  </Stage>;
};
