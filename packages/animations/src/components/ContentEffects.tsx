import {useLayoutEffect, useRef, useState} from 'react';
import {CanvasImage, Easing, interpolate, useCurrentFrame, useDelayRender, useVideoConfig} from 'remotion';
import type {EffectProps} from './Effects';

export type ContentEffectProps = Pick<EffectProps, 'width' | 'height' | 'backgroundColor' | 'speed'> & {
  /** Image to transform; defaults to the official Elements demonstration image. */
  src?: string;
  /** Complete one-shot animation duration in seconds. */
  durationInSeconds?: number;
  /** Controlled position in the full cycle, from 0 to 1. */
  progress?: number;
};
export type WigglingCalloutProps = Omit<ContentEffectProps, 'src'> & {text?: string; color?: string; secondaryColor?: string};

type EffectFactories = {
  scale: typeof import('@remotion/effects/scale').scale;
  pageTurn: typeof import('@remotion/effects/page-turn').pageTurn;
  shine: typeof import('@remotion/effects/shine').shine;
  tear: typeof import('@remotion/effects/tear').tear;
};

let enginePromise: Promise<EffectFactories> | undefined;
/** Native import keeps the ESM-only effect package compatible with our CJS entry. */
export const loadContentEffectEngine = () => enginePromise ??= Promise.all([
  import('@remotion/effects/scale'), import('@remotion/effects/page-turn'),
  import('@remotion/effects/shine'), import('@remotion/effects/tear'),
]).then(([scaling, peeling, shining, tearing]) => ({
  scale: scaling.scale, pageTurn: peeling.pageTurn, shine: shining.shine, tear: tearing.tear,
}));

type RenderBlock = {released: boolean; release: () => void};

const createRenderBlock = (delayRender: ReturnType<typeof useDelayRender>['delayRender'], continueRender: ReturnType<typeof useDelayRender>['continueRender']): RenderBlock => {
  const handle = delayRender('Loading Remotion content effects');
  const block: RenderBlock = {
    released: false,
    release: () => {
      if (block.released) return;
      block.released = true;
      continueRender(handle);
    },
  };
  return block;
};

/** Register before commit, then release only after the engine-backed child commits. */
export const useContentEffectEngine = (loadEngine = loadContentEffectEngine) => {
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const blockRef = useRef<RenderBlock | null>(null);
  const [initialBlock] = useState(() => {
    // The ref also guards React Strict Mode's repeated state initializer.
    blockRef.current ??= createRenderBlock(delayRender, continueRender);
    return blockRef.current;
  });
  const [engine, setEngine] = useState<EffectFactories | null>(null);

  useLayoutEffect(() => {
    // Strict Mode replays setup after cleanup; restore its render block before paint.
    if (blockRef.current?.released) blockRef.current = createRenderBlock(delayRender, continueRender);
    const block = blockRef.current ?? initialBlock;
    let active = true;
    loadEngine().then((loaded) => {
      if (active) setEngine(loaded);
    }).catch((error: unknown) => {
      if (!active) return;
      block.release();
      cancelRender(error instanceof Error ? error : new Error(String(error)));
    });
    return () => {active = false; block.release();};
  }, [initialBlock, loadEngine, delayRender, continueRender, cancelRender]);

  useLayoutEffect(() => {
    if (engine) blockRef.current?.release();
  });
  return engine;
};

const number = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;
const dimension = (value: number) => Math.max(1, Math.round(number(value, 1)));
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const useProgress = (seconds: number, speed: number, progress?: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (progress !== undefined && Number.isFinite(progress)) return clamp(progress);
  const lastFrame = Math.max(1, Math.round(Math.max(0.1, number(seconds, 2)) * Math.max(1, number(fps, 30))) - 1);
  return clamp(frame * Math.max(0, number(speed, 1)) / lastFrame);
};
const clampOptions = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const tearSpring = Easing.spring({damping: 200, mass: 1, stiffness: 100, allowTail: true, durationRestThreshold: 0.02, overshootClamping: false});

/** A single damped wiggle around the speech-bubble pointer. */
export const WigglingCallout = ({width = 760, height = 760, color = '#2563eb', secondaryColor = '#fff', backgroundColor, durationInSeconds = 4, speed = 1, progress, text = '-20%'}: WigglingCalloutProps) => {
  const time = useProgress(durationInSeconds, speed, progress);
  const angle = interpolate(time, [0, 7 / 119, 14 / 119, 20 / 119, 26 / 119], [0, 10, -7, 3, 0], {...clampOptions, easing: Easing.inOut(Easing.quad)});
  return <svg role="img" aria-label="摇摆气泡" width={dimension(width)} height={dimension(height)} viewBox="0 0 760 760" style={{display: 'block', backgroundColor}}>
    <g data-effect="wiggling-callout" transform={`translate(380 565) rotate(${angle}) translate(-380 -565)`}>
      <path d="M125 195 H635 Q680 195 680 240 V450 Q680 495 635 495 H445 L380 565 L315 495 H125 Q80 495 80 450 V240 Q80 195 125 195 Z" fill={color} />
      <text x="380" y="350" dominantBaseline="central" textAnchor="middle" fill={secondaryColor} fontFamily="Arial, Helvetica, sans-serif" fontSize="180" fontWeight="800" letterSpacing="-7">{text}</text>
    </g>
  </svg>;
};

const demoGraphic = 'https://remotion.media/elements/commerce-tear-a-graphic.png';
type ContentEffectKind = 'peel' | 'shine' | 'tear';

/** Share parameter calculation between preview, export, and native descriptor checks. */
export const getContentEffectChain = (engine: EffectFactories, kind: ContentEffectKind, time: number, width: number, height: number) => {
  const canvasWidth = dimension(width);
  const canvasHeight = dimension(height);
  const phase = clamp(number(time, 0));
  const resolutionScale = Math.min(canvasWidth / 1280, canvasHeight / 720);
  const tearProgress = interpolate(phase, [15 / 44, 25 / 44], [0, 1], {...clampOptions, easing: tearSpring});
  const foldX = interpolate(phase, [0.1, 0.475, 0.85], [1.25, 0.4, -0.45], {...clampOptions, easing: [Easing.quad, Easing.out(Easing.quad)]});
  const effect = kind === 'peel' ? engine.pageTurn({
    foldPosition: [foldX, 0.5], foldDirection: -75, foldRadius: Math.max(0.1, 70 * resolutionScale),
    paperColor: '#fff', backPageOpacity: 0.1,
  }) : kind === 'shine' ? engine.shine({
    progress: phase, angle: 30, haloSigma: Math.max(0.1, 200 * resolutionScale), coreSigma: Math.max(0.1, 65 * resolutionScale), haloIntensity: 0.3, coreIntensity: 0.4,
  }) : engine.tear({jaggedness: 24 * resolutionScale, progress: tearProgress, rotation: 5 * tearProgress});
  return [engine.scale({scale: 0.75}), effect];
};

const ContentEffect = ({kind, width = 1280, height = 720, src = demoGraphic, backgroundColor, durationInSeconds = kind === 'peel' ? 2 : 1.5, speed = 1, progress}: ContentEffectProps & {kind: ContentEffectKind}) => {
  const time = useProgress(durationInSeconds, speed, progress);
  const engine = useContentEffectEngine();
  const canvasWidth = dimension(width);
  const canvasHeight = dimension(height);
  const effects = engine ? getContentEffectChain(engine, kind, time, canvasWidth, canvasHeight) : undefined;
  const label = kind === 'peel' ? '纸面揭开' : kind === 'shine' ? '斜向扫光' : '纸面撕裂';
  return <div role="img" aria-label={label} data-effect={kind} data-progress={time} style={{width: canvasWidth, height: canvasHeight, backgroundColor, position: 'relative', overflow: 'hidden'}}>
    {engine && <CanvasImage src={src} fit="cover" width={canvasWidth} height={canvasHeight} effects={effects} pauseWhenLoading style={{display: 'block', width: '100%', height: '100%'}} />}
  </div>;
};

export const Peel = (props: ContentEffectProps) => <ContentEffect {...props} kind="peel" />;
export const Shine = (props: ContentEffectProps) => <ContentEffect {...props} kind="shine" />;
export const TearApart = (props: ContentEffectProps) => <ContentEffect {...props} kind="tear" />;
