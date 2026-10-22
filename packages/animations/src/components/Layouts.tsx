import type {CSSProperties, ReactNode} from 'react';
import {Easing, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type LayoutProps = {
  /** Canvas width in pixels. */
  width?: number;
  /** Canvas height in pixels. */
  height?: number;
  /** Background color behind the layout. */
  backgroundColor?: string;
  /** Primary panel color. */
  color?: string;
  /** Secondary panel or accent color. */
  secondaryColor?: string;
  /** One-shot transition duration in seconds. */
  durationInSeconds?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Optional externally controlled progress from 0 to 1. */
  progress?: number;
};

type LayoutDimensions = {width: number; height: number};

const getDimensions = (width: number, height: number): LayoutDimensions => ({
  width: Number.isFinite(width) ? Math.max(1, width) : 1,
  height: Number.isFinite(height) ? Math.max(1, height) : 1,
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getProgress = (frame: number, fps: number, durationInSeconds: number, speed: number, progress?: number) => {
  if (progress !== undefined && Number.isFinite(progress)) return clamp(progress, 0, 1);
  const safeDurationInSeconds = Number.isFinite(durationInSeconds) ? Math.max(0.1, durationInSeconds) : 5;
  const safeSpeed = Number.isFinite(speed) ? Math.max(0, speed) : 1;
  const safeFps = Number.isFinite(fps) ? Math.max(1, fps) : 30;
  const durationInFrames = Math.max(1, safeFps * safeDurationInSeconds);
  return interpolate(frame * safeSpeed, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

const getSafeSpeed = (speed: number) => Number.isFinite(speed) ? Math.max(0, speed) : 1;

const getSafeDurationInFrames = (fps: number, durationInSeconds: number) => {
  const safeFps = Number.isFinite(fps) ? Math.max(1, fps) : 30;
  const safeDurationInSeconds = Number.isFinite(durationInSeconds) ? Math.max(0.1, durationInSeconds) : 5;
  return Math.max(1, safeFps * safeDurationInSeconds);
};

const sourceSpring = Easing.spring({
  damping: 200,
  mass: 1,
  stiffness: 100,
  allowTail: true,
  durationRestThreshold: 0.02,
  overshootClamping: false,
});

const getPictureInPictureProgress = (frame: number, fps: number, durationInSeconds: number, speed: number, progress?: number) => {
  if (progress !== undefined && Number.isFinite(progress)) return clamp(progress, 0, 1);
  const scale = getSafeDurationInFrames(fps, durationInSeconds) / 150;
  return interpolate(frame * getSafeSpeed(speed), [15 * scale, 50 * scale], [0, 1], {
    easing: [sourceSpring],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

const getSlideToSplitProgress = (frame: number, fps: number, durationInSeconds: number, speed: number, progress?: number) => {
  if (progress !== undefined && Number.isFinite(progress)) return clamp(progress, 0, 1);
  const scale = getSafeDurationInFrames(fps, durationInSeconds) / 150;
  return interpolate(frame * getSafeSpeed(speed), [20 * scale, 52 * scale, 98 * scale, 130 * scale], [0, 1, 1, 0], {
    easing: [Easing.bezier(0.65, 0, 0.35, 1), Easing.linear, Easing.bezier(0.65, 0, 0.35, 1)],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

const rootStyle = (dimensions: LayoutDimensions, backgroundColor: string): CSSProperties => ({
  position: 'relative',
  width: dimensions.width,
  height: dimensions.height,
  overflow: 'hidden',
  backgroundColor,
  fontFamily: 'system-ui, sans-serif',
});

const panelStyle = (dimensions: LayoutDimensions, color: string): CSSProperties => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${color} 0%, #ffffff 145%)`,
  color: '#ffffff',
  fontSize: Math.max(16, Math.min(dimensions.width, dimensions.height) * 0.12),
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
});

const DefaultPanel = ({label, dimensions, color, secondaryColor}: {label: string; dimensions: LayoutDimensions; color: string; secondaryColor: string}) => <div style={{...panelStyle(dimensions, color), position: 'relative'}}>
  <span style={{position: 'absolute', top: dimensions.height * 0.12, left: dimensions.width * 0.1, fontSize: Math.max(10, Math.min(dimensions.width, dimensions.height) * 0.045), letterSpacing: '0.18em', opacity: 0.72}}>{label}</span>
  <span style={{width: '62%', height: Math.max(2, dimensions.height * 0.018), borderRadius: 999, backgroundColor: secondaryColor, opacity: 0.82}} />
</div>;

export type PictureInPictureTransitionProps = LayoutProps & {
  /** Content that transitions from fullscreen into a floating card. */
  children?: ReactNode;
  /** Content that remains behind the floating card. */
  background?: ReactNode;
  /** Final position of the floating card. */
  insetPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Final card size as a fraction of the full frame. */
  insetScale?: number;
  /** Final card corner radius in pixels. */
  cornerRadius?: number;
  /** Padding from the frame edge in pixels. */
  padding?: number;
  /** Image used for the fullscreen source scene when no children are supplied. */
  primarySrc?: string;
  /** Image used for the background scene when no background is supplied. */
  secondarySrc?: string;
};

const SourceScene = ({label, src, dimensions, color = '#ffffff'}: {label: string; src: string; dimensions: LayoutDimensions; color?: string}) => <div style={{alignItems: 'center', color, display: 'flex', fontFamily: 'sans-serif', fontSize: Math.max(32, Math.min(dimensions.width, dimensions.height) * 0.22), fontWeight: 900, height: '100%', justifyContent: 'center', position: 'absolute', textShadow: '0 4px 30px rgba(0, 0, 0, 0.55)', width: '100%'}}>
  <Img alt="" src={src} style={{height: '100%', objectFit: 'cover', position: 'absolute', width: '100%'}} />
  <div style={{position: 'relative'}}>{label}</div>
</div>;

const defaultPrimarySrc = 'https://remotion.media/transition-bg-blue.jpg';
const defaultSecondarySrc = 'https://remotion.media/transition-bg-pink.jpg';

/** Shrinks a fullscreen scene into the same top-right picture-in-picture transition used by the reference Element. */
export const PictureInPictureTransition = ({
  width = 1920,
  height = 1080,
  backgroundColor = '#edf5ff',
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  durationInSeconds = 5,
  speed = 1,
  progress,
  children,
  background,
  insetPosition = 'top-right',
  insetScale = 0.38,
  cornerRadius = 48,
  padding,
  primarySrc = defaultPrimarySrc,
  secondarySrc = defaultSecondarySrc,
}: PictureInPictureTransitionProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPictureInPictureProgress(frame, fps, durationInSeconds, speed, progress);
  const scale = clamp(Number.isFinite(insetScale) ? insetScale : 0.38, 0.18, 0.72);
  const edgePadding = Number.isFinite(padding) ? Math.max(0, padding as number) : 0;
  const cropLeft = interpolate(phase, [0, 1], [0, 0.302], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cropRight = cropLeft;
  const cropTop = interpolate(phase, [0, 1], [0, 0.06], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cropBottom = cropTop;
  const sourceScale = interpolate(phase, [0, 1], [1, scale]);
  const visibleRightOffset = dimensions.width * (1 - cropRight) * sourceScale;
  const visibleBottomOffset = dimensions.height * (1 - cropBottom) * sourceScale;
  const visibleLeftOffset = dimensions.width * cropLeft * sourceScale;
  const visibleTopOffset = dimensions.height * cropTop * sourceScale;
  const sourceRightMargin = dimensions.width * (1 - 0.7109375 - (1 - 0.302) * 0.38) + edgePadding;
  const sourceTopMargin = dimensions.height * (0.0212963 + 0.06 * 0.38) + edgePadding;
  const sourceTargetX = insetPosition.endsWith('right')
    ? dimensions.width - sourceRightMargin - visibleRightOffset
    : edgePadding - visibleLeftOffset;
  const sourceTargetY = insetPosition.startsWith('bottom')
    ? dimensions.height - edgePadding - visibleBottomOffset
    : sourceTopMargin - visibleTopOffset;
  const translateX = interpolate(phase, [0, 1], [0, sourceTargetX]);
  const translateY = interpolate(phase, [0, 1], [0, sourceTargetY]);
  const radius = interpolate(phase, [0, 1], [0, Number.isFinite(cornerRadius) ? Math.max(0, cornerRadius) : 48]);
  const source = children ?? <SourceScene label="A" src={primarySrc} dimensions={dimensions} />;
  const backdrop = background ?? <SourceScene label="B" src={secondarySrc} dimensions={dimensions} />;

  return <div role="img" aria-label="画中画转场布局" data-layout="picture-in-picture" style={rootStyle(dimensions, backgroundColor)}>
    <div style={{position: 'absolute', inset: 0}}>{backdrop}</div>
    <div style={{position: 'absolute', left: 0, top: 0, width: dimensions.width, height: dimensions.height, overflow: 'hidden', borderRadius: radius, clipPath: `inset(${cropTop * 100}% ${cropRight * 100}% ${cropBottom * 100}% ${cropLeft * 100}%)`, transformOrigin: 'top left', translate: `${translateX}px ${translateY}px`, scale: sourceScale, willChange: 'transform'}}>{source}</div>
  </div>;
};

export type SlideToSplitScreenProps = LayoutProps & {
  /** The scene that starts fullscreen and settles into the primary panel. */
  children?: ReactNode;
  /** The scene that enters as the secondary panel. */
  secondary?: ReactNode;
  /** Final width fraction of the primary panel. */
  splitRatio?: number;
  /** Side from which the secondary panel enters. */
  direction?: 'left' | 'right';
  /** Gap between the final panels in pixels. */
  gap?: number;
  /** Image used for the primary scene when no children are supplied. */
  primarySrc?: string;
  /** Image used for the secondary scene when no secondary content is supplied. */
  secondarySrc?: string;
};

/** Opens a fullscreen scene into the same 60/40 split-screen transition used by the reference Element. */
export const SlideToSplitScreen = ({
  width = 1920,
  height = 1080,
  backgroundColor = '#f4f8ff',
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  durationInSeconds = 5,
  speed = 1,
  progress,
  children,
  secondary,
  splitRatio = 0.6,
  direction = 'right',
  gap = 15,
  primarySrc = defaultPrimarySrc,
  secondarySrc = defaultSecondarySrc,
}: SlideToSplitScreenProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const splitProgress = getSlideToSplitProgress(frame, fps, durationInSeconds, speed, progress);
  const safeGap = clamp(Number.isFinite(gap) ? gap : 15, 1, dimensions.width * 0.08);
  const safeRatio = clamp(Number.isFinite(splitRatio) ? splitRatio : 0.6, 0.2, 0.8);
  const secondaryWidth = dimensions.width * (1 - safeRatio);
  const primaryWidth = dimensions.width - secondaryWidth - safeGap;
  const primary = children ?? <SourceScene label="A" src={primarySrc} dimensions={dimensions} />;
  const secondaryContent = secondary ?? <SourceScene label="B" src={secondarySrc} dimensions={{width: secondaryWidth, height: dimensions.height}} />;
  const primaryPanelWidth = interpolate(splitProgress, [0, 1], [dimensions.width, primaryWidth]);
  const secondaryTravel = secondaryWidth + safeGap;
  const primaryShift = (dimensions.width - primaryWidth) / 2;
  const secondaryStyle = direction === 'right'
    ? {right: 0, translate: `${(1 - splitProgress) * secondaryTravel}px 0px`}
    : {left: 0, translate: `${-(1 - splitProgress) * secondaryTravel}px 0px`};
  const primaryStyle = direction === 'right'
    ? {left: 0}
    : {right: 0};
  const primaryContentStyle = direction === 'right'
    ? {translate: `${-primaryShift * splitProgress}px 0px`}
    : {translate: `${primaryShift * splitProgress}px 0px`};

  return <div role="img" aria-label="滑动分屏布局" data-layout="slide-to-split-screen" style={rootStyle(dimensions, backgroundColor)}>
    <div style={{position: 'absolute', top: 0, bottom: 0, ...primaryStyle, width: primaryPanelWidth, overflow: 'hidden'}}><div style={{position: 'absolute', width: dimensions.width, height: dimensions.height, ...primaryContentStyle, willChange: 'transform'}}>{primary}</div></div>
    <div style={{display: 'flex', flexDirection: direction === 'right' ? 'row' : 'row-reverse', height: dimensions.height, position: 'absolute', top: 0, ...secondaryStyle, width: secondaryTravel, willChange: 'transform'}}>
      <div style={{backgroundColor: '#ffffff', flex: `0 0 ${safeGap}px`, height: '100%'}} />
      <div style={{height: '100%', overflow: 'hidden', position: 'relative', width: secondaryWidth}}>{secondaryContent}</div>
    </div>
  </div>;
};

export type RotatingCardsProps = LayoutProps & {
  /** Cards shown one at a time in the center. */
  cards?: readonly ReactNode[];
  /** Width of each card as a fraction of the frame. */
  cardScale?: number;
};

export type ProductCollectionProps = LayoutProps & {
  /** Optional labels for the three source-style product cards. */
  labels?: readonly [string, string, string];
  /** Image used for the first and third cards. */
  primarySrc?: string;
  /** Image used for the middle card. */
  secondarySrc?: string;
  /** Whether the source-style container fades out during the final frames. */
  fadeOut?: boolean;
};

const sourceProductCard = ({
  count,
  index,
  label,
  frame,
  durationInFrames,
  scale,
  primarySrc,
  secondarySrc,
}: {
  count: number;
  index: number;
  label: string;
  frame: number;
  durationInFrames: number;
  scale: number;
  primarySrc: string;
  secondarySrc: string;
}) => {
  const lastProductIndex = Math.max(0, count - 1);
  const rawScrollPosition = interpolate(frame, [24, Math.max(25, durationInFrames - 28)], [0, lastProductIndex], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const transitionIndex = Math.min(Math.floor(rawScrollPosition), Math.max(0, lastProductIndex - 1));
  const transitionProgress = interpolate(rawScrollPosition - transitionIndex, [0.18, 0.82], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scrollPosition = transitionIndex + transitionProgress;
  const unwrappedSlotPosition = index - scrollPosition;
  const slotPosition = count <= 2
    ? unwrappedSlotPosition
    : ((((unwrappedSlotPosition + count / 2) % count) + count) % count) - count / 2;
  const distanceFromCenter = Math.abs(slotPosition);
  const visibility = interpolate(distanceFromCenter, [1.02, 1.18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const entryStart = 8 + Math.min(index, 1) * 5;
  const entryProgress = interpolate(frame, [entryStart, entryStart + 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = slotPosition * 270 * scale;
  const y = (Math.min(distanceFromCenter, 1.3) * 36 + (1 - entryProgress) * 180) * scale;
  const rotation = slotPosition * 5.5;
  const cardScale = interpolate(distanceFromCenter, [0, 1.5], [1.02, 0.84], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardWidth = 300 * scale;
  const cardHeight = 560 * scale;
  const borderRadius = Math.max(2, 6 * scale);
  const imageSrc = index === 1 ? secondarySrc : primarySrc;

  return <div key={index} style={{
    height: cardHeight,
    left: 300 * scale,
    top: 40 * scale,
    opacity: visibility * entryProgress,
    position: 'absolute',
    rotate: `${rotation}deg`,
    scale: cardScale * (0.86 + entryProgress * 0.14),
    transform: 'perspective(1000px)',
    translate: `${x}px ${y}px`,
    width: cardWidth,
    willChange: 'transform, opacity',
    zIndex: 100 - Math.round(distanceFromCenter * 20),
  }}>
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius,
      boxShadow: `0 ${2 * scale}px ${6 * scale}px rgba(29, 29, 25, 0.12)`,
      boxSizing: 'border-box',
      color: '#1d1d19',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      width: '100%',
    }}>
      <div style={{
        alignItems: 'center',
        color: '#ffffff',
        display: 'flex',
        fontFamily: 'sans-serif',
        fontSize: Math.max(12, 160 * scale),
        fontWeight: 900,
        height: '100%',
        justifyContent: 'center',
        letterSpacing: `${-8 * scale}px`,
        overflow: 'hidden',
        position: 'relative',
        textShadow: `0 ${4 * scale}px ${30 * scale}px rgba(0, 0, 0, 0.55)`,
      }}>
        <Img alt="" src={imageSrc} style={{
          filter: index === 2 ? 'hue-rotate(-65deg)' : 'none',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          width: '100%',
        }} />
        <div style={{position: 'relative'}}>{label}</div>
      </div>
    </div>
  </div>;
};

/** The source Remotion Elements product-collection layout, kept alongside the library's own RotatingCards. */
export const ProductCollection = ({
  width = 1020,
  height = 1020,
  backgroundColor = '#ffffff',
  durationInSeconds = 5,
  speed = 1,
  progress,
  labels = ['A', 'B', 'C'],
  primarySrc = defaultPrimarySrc,
  secondarySrc = defaultSecondarySrc,
  fadeOut = true,
}: ProductCollectionProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const durationInFrames = getSafeDurationInFrames(fps, durationInSeconds);
  const controlledProgress = progress !== undefined && Number.isFinite(progress) ? clamp(progress, 0, 1) : null;
  const animationFrame = controlledProgress === null
    ? frame * getSafeSpeed(speed)
    : controlledProgress * Math.max(0, durationInFrames - 1);
  const safeLabels: [string, string, string] = [labels[0] ?? 'A', labels[1] ?? 'B', labels[2] ?? 'C'];
  const designScale = Math.min(dimensions.width / 1020, dimensions.height / 660);
  const containerWidth = 900 * designScale;
  const containerHeight = 660 * designScale;
  const containerLeft = (dimensions.width - containerWidth) / 2;
  const containerTop = (dimensions.height - containerHeight) / 2;
  const fadeInEnd = Math.min(10, Math.max(1, durationInFrames - 1));
  const scaleUpEnd = Math.min(16, Math.max(fadeInEnd + 1, durationInFrames - 1));
  const holdStart = Math.min(Math.max(scaleUpEnd + 1, durationInFrames - 8), durationInFrames);
  const lastFrame = Math.max(holdStart + 1, durationInFrames - 1);
  const outerOpacity = interpolate(animationFrame, [0, fadeInEnd, holdStart, lastFrame], [0, 1, 1, fadeOut ? 0 : 1], {
    easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.16, 1, 0.3, 1)],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outerScale = interpolate(animationFrame, [0, scaleUpEnd, holdStart, lastFrame], [0.4, 1, 1, 0.7], {
    easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.16, 1, 0.3, 1)],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outerTranslateY = interpolate(animationFrame, [0, scaleUpEnd, holdStart, lastFrame], [30, 0, 0, -20], {
    easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.16, 1, 0.3, 1)],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }) * designScale;

  return <div role="img" aria-label="源站旋转卡片布局" data-layout="product-collection" style={rootStyle(dimensions, backgroundColor)}>
    <div style={{
      WebkitFontSmoothing: 'antialiased',
      color: '#1d1d19',
      fontFamily: 'Inter, sans-serif',
      height: containerHeight,
      isolation: 'isolate',
      left: containerLeft,
      opacity: outerOpacity,
      overflow: 'hidden',
      position: 'absolute',
      scale: outerScale,
      top: containerTop,
      transform: 'perspective(100px)',
      translate: `0px ${outerTranslateY}px`,
      width: containerWidth,
      willChange: 'transform, opacity',
    }}>
      {[0, 1, 2].map((index) => sourceProductCard({
        count: 3,
        durationInFrames,
        frame: animationFrame,
        index,
        label: safeLabels[index],
        primarySrc,
        scale: designScale,
        secondarySrc,
      }))}
    </div>
  </div>;
};

const defaultCards = [
  <DefaultPanel key="audio" label="audio" dimensions={{width: 640, height: 420}} color="#409eff" secondaryColor="#dcecff" />,
  <DefaultPanel key="caption" label="caption" dimensions={{width: 640, height: 420}} color="#67c23a" secondaryColor="#e5f6df" />,
  <DefaultPanel key="effect" label="effect" dimensions={{width: 640, height: 420}} color="#8b5cf6" secondaryColor="#eee7ff" />,
];

/** Cycles a set of content cards through a central showcase position. */
export const RotatingCards = ({
  width = 1920,
  height = 1080,
  backgroundColor = '#f5f8fc',
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  durationInSeconds = 5,
  speed = 1,
  progress,
  cards = defaultCards,
  cardScale = 0.58,
}: RotatingCardsProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getProgress(frame, fps, durationInSeconds, speed, progress);
  const items = cards.length > 0 ? cards : defaultCards;
  const count = items.length;
  const segment = (phase * count) % count;
  const activeIndex = Math.floor(segment);
  const localPhase = segment - activeIndex;
  const safeCardScale = Number.isFinite(cardScale) ? cardScale : 0.58;
  const cardWidth = Math.min(dimensions.width * clamp(safeCardScale, 0.3, 0.78), dimensions.height * 1.25);
  const cardHeight = Math.min(dimensions.height * 0.72, cardWidth * 0.66);
  const travel = dimensions.width * 0.76;
  const renderCard = (card: ReactNode, index: number) => {
    const relative = (index - activeIndex + count) % count;
    const isCurrent = relative === 0;
    const isNext = relative === 1;
    const translateX = isCurrent
      ? interpolate(localPhase, [0, 1], [0, -travel])
      : isNext
        ? interpolate(localPhase, [0, 1], [travel, 0])
        : -travel;
    const rotate = isCurrent
      ? interpolate(localPhase, [0, 1], [0, -8])
      : isNext
        ? interpolate(localPhase, [0, 1], [8, 0])
        : -8;
    const opacity = isCurrent
      ? interpolate(localPhase, [0, 1], [1, 0.28])
      : isNext
        ? interpolate(localPhase, [0, 1], [0.72, 1])
        : 0.22;
    return <div key={index} style={{position: 'absolute', left: '50%', top: '50%', width: cardWidth, height: cardHeight, marginLeft: -cardWidth / 2, marginTop: -cardHeight / 2, overflow: 'hidden', borderRadius: 24, boxShadow: `0 20px 50px rgba(31, 41, 55, ${isNext || isCurrent ? 0.16 : 0.04})`, opacity, zIndex: isNext ? 12 : isCurrent ? 11 : 1, transform: `translateX(${translateX}px) rotate(${rotate}deg)`}}>{card}</div>;
  };

  return <div role="img" aria-label="旋转卡片布局" data-layout="rotating-cards" style={rootStyle(dimensions, backgroundColor)}>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${secondaryColor}18 0%, transparent 54%), ${backgroundColor}`}} />
    {items.map(renderCard)}
    <div style={{position: 'absolute', left: dimensions.width * 0.08, bottom: dimensions.height * 0.09, color, fontSize: Math.max(10, Math.min(dimensions.width, dimensions.height) * 0.04), fontWeight: 700, letterSpacing: '0.14em'}}>REMOTIONS / LAYOUTS</div>
  </div>;
};
