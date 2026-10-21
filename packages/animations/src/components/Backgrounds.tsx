import {useId} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type BackgroundProps = {
  /** Canvas width in pixels. */
  width?: number;
  /** Canvas height in pixels. */
  height?: number;
  /** Primary accent used by the animated shapes. */
  color?: string;
  /** Secondary accent used to create depth between layers. */
  secondaryColor?: string;
  /** Base color behind the animated shapes. */
  backgroundColor?: string;
  /** Animation speed multiplier. */
  speed?: number;
};

const getDimensions = (width: number, height: number) => ({
  width: Math.max(1, width),
  height: Math.max(1, height),
});

const getPhase = (frame: number, fps: number, durationInSeconds: number, speed: number) => interpolate(
  frame,
  [0, fps * durationInSeconds],
  [0, Math.PI * 2 * speed],
  {extrapolateLeft: 'extend', extrapolateRight: 'extend'},
);

const getWavePath = (width: number, baseline: number, amplitude: number, phase: number, cycles: number) => {
  const points = 18;
  const coordinates = Array.from({length: points + 1}, (_, index) => {
    const progress = index / points;
    const x = progress * width;
    const y = baseline + Math.sin(progress * Math.PI * 2 * cycles + phase) * amplitude;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return `M ${coordinates.join(' L ')}`;
};

const getLiquidBandPath = (width: number, height: number, band: number, phase: number) => {
  const points = 20;
  const baseline = height * (0.12 + band * 0.17);
  const amplitude = height * (0.055 + band * 0.008);
  const thickness = height * (0.12 + band * 0.012);
  const top = Array.from({length: points + 1}, (_, index) => {
    const progress = index / points;
    const x = progress * width;
    const y = baseline + Math.sin(progress * Math.PI * 2 * 1.3 + phase + band * 0.8) * amplitude
      + Math.cos(progress * Math.PI * 2 * 0.7 - phase * 0.65) * amplitude * 0.45;
    return [x, y] as const;
  });
  const bottom = [...top].reverse().map(([x, y]) => [x, y + thickness] as const);
  return `M ${[...top, ...bottom].map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L ')} Z`;
};

/** A flowing two-color background made from animated liquid contour bands. */
export const LiquidContours = ({
  width = 1920,
  height = 1080,
  color = '#a891ff',
  secondaryColor = '#5ed8c8',
  backgroundColor = '#10101b',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, 8, speed);
  return <svg role="img" aria-label="流动液态轮廓背景" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <circle cx={dimensions.width * 0.78} cy={dimensions.height * 0.22} r={dimensions.height * 0.34} fill={secondaryColor} opacity="0.12" />
    <circle cx={dimensions.width * 0.16} cy={dimensions.height * 0.78} r={dimensions.height * 0.28} fill={color} opacity="0.1" />
    <g>
      {Array.from({length: 5}, (_, index) => <path key={index} d={getLiquidBandPath(dimensions.width, dimensions.height, index, phase)} fill={index % 2 === 0 ? color : secondaryColor} opacity={0.24 + index * 0.08} />)}
    </g>
  </svg>;
};

/** A seamless wave field that drifts upward across the frame. */
export const MovingWaves = ({
  width = 1920,
  height = 1080,
  color = '#75d8cf',
  secondaryColor = '#9c83ff',
  backgroundColor = '#0e1420',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gradientId = `moving-waves-fade-${useId().replaceAll(':', '')}`;
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, 8, speed);
  return <svg role="img" aria-label="向上流动的波浪背景" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g fill="none" strokeLinecap="round">
      {Array.from({length: 6}, (_, index) => {
        const verticalDrift = ((phase / (Math.PI * 2)) * dimensions.height * (0.28 + index * 0.035)) % dimensions.height;
        const baseline = dimensions.height * (0.16 + index * 0.16) - verticalDrift;
        return <path key={index} d={getWavePath(dimensions.width, baseline, dimensions.height * (0.055 + index * 0.008), phase * (0.7 + index * 0.08) + index, 1.15 + index * 0.08)} stroke={index % 2 === 0 ? color : secondaryColor} strokeWidth={dimensions.height * (0.018 + index * 0.004)} opacity={0.26 + index * 0.08} />;
      })}
    </g>
    <rect width={dimensions.width} height={dimensions.height} fill={`url(#${gradientId})`} opacity="0.35" />
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={backgroundColor} stopOpacity="0.72" />
        <stop offset="0.48" stopColor={backgroundColor} stopOpacity="0" />
        <stop offset="1" stopColor={backgroundColor} stopOpacity="0.72" />
      </linearGradient>
    </defs>
  </svg>;
};

/** A slowly rotating radial starburst for energetic openings and transitions. */
export const RotatingStarburst = ({
  width = 1920,
  height = 1080,
  color = '#a891ff',
  secondaryColor = '#ffc58e',
  backgroundColor = '#110f19',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const rotation = interpolate(frame, [0, fps * 8], [0, 360 * speed], {extrapolateLeft: 'extend', extrapolateRight: 'extend'});
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.hypot(dimensions.width, dimensions.height) * 0.72;
  const rayCount = 28;
  const rayAngle = (Math.PI * 2) / rayCount;
  return <svg role="img" aria-label="旋转放射星芒背景" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g transform={`rotate(${rotation} ${centerX} ${centerY})`}>
      {Array.from({length: rayCount}, (_, index) => {
        const angle = index * rayAngle;
        const nextAngle = angle + rayAngle * 0.72;
        const point = (currentAngle: number, distance: number) => `${centerX + Math.cos(currentAngle) * distance},${centerY + Math.sin(currentAngle) * distance}`;
        return <path key={index} d={`M ${centerX},${centerY} L ${point(angle, radius)} L ${point(nextAngle, radius)} Z`} fill={index % 2 === 0 ? color : secondaryColor} opacity={0.12 + (index % 4) * 0.035} />;
      })}
      <circle cx={centerX} cy={centerY} r={Math.min(dimensions.width, dimensions.height) * 0.18} fill={backgroundColor} opacity="0.72" />
      <circle cx={centerX} cy={centerY} r={Math.min(dimensions.width, dimensions.height) * 0.06} fill={color} opacity="0.76" />
    </g>
  </svg>;
};
