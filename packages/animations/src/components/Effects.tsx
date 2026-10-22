import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type EffectProps = {
  /** Canvas width in pixels. */
  width?: number;
  /** Canvas height in pixels. */
  height?: number;
  /** Primary effect color. */
  color?: string;
  /** Optional accent color. Defaults to the primary color. */
  secondaryColor?: string;
  /** Base color behind the effect. */
  backgroundColor?: string;
  /** Animation speed multiplier. */
  speed?: number;
};
const getDimensions = (width: number, height: number) => ({
  width: Number.isFinite(width) ? Math.max(1, width) : 1,
  height: Number.isFinite(height) ? Math.max(1, height) : 1,
});

const getPhase = (frame: number, fps: number, speed: number, seconds = 6) => {
  const duration = Math.max(1, fps * seconds);
  const normalized = (frame * Math.max(0, speed)) / duration;
  return ((normalized % 1) + 1) % 1;
};

const fract = (value: number) => value - Math.floor(value);

/** Expanding rings that pulse from the center of a frame. */
export const PulseRings = ({
  width = 1920,
  height = 1080,
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#f4f8ff',
  speed = 1,
}: EffectProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, speed, 4.5);
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const maxRadius = Math.hypot(dimensions.width, dimensions.height) * 0.54;
  const strokeWidth = Math.max(1, Math.min(dimensions.width, dimensions.height) * 0.012);

  return <svg role="img" aria-label="中心扩散光环效果" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <circle cx={centerX} cy={centerY} r={Math.max(4, maxRadius * 0.08 + Math.sin(phase * Math.PI * 2) * maxRadius * 0.018)} fill={color} opacity="0.16" />
    {Array.from({length: 4}, (_, index) => {
      const ringPhase = (phase + index / 4) % 1;
      const radius = maxRadius * (0.08 + ringPhase * 0.92);
      const opacity = (1 - ringPhase) * 0.72;
      return <circle
        key={index}
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={index % 2 === 0 ? color : secondaryColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />;
    })}
    <circle cx={centerX} cy={centerY} r={Math.max(2, strokeWidth * 1.8)} fill={secondaryColor} opacity="0.88" />
  </svg>;
};

/** A deterministic particle field with gentle orbital drift. */
export const ParticleField = ({
  width = 1920,
  height = 1080,
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#f8fbff',
  speed = 1,
}: EffectProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, speed, 8);
  const count = Math.max(18, Math.min(52, Math.round((dimensions.width * dimensions.height) / 7200)));
  const particles = Array.from({length: count}, (_, index) => {
    const seed = index + 1;
    const baseX = fract(Math.sin(seed * 17.31) * 43758.5453);
    const baseY = fract(Math.sin(seed * 29.17 + 4.3) * 24634.6345);
    const orbit = phase * Math.PI * 2 + seed * 0.63;
    const x = fract(baseX + Math.sin(orbit) * (0.025 + (seed % 4) * 0.008)) * dimensions.width;
    // Keep both axes on the same phase so the 8-second cycle closes exactly.
    const y = fract(baseY + Math.cos(orbit) * (0.018 + (seed % 3) * 0.009)) * dimensions.height;
    const radius = Math.max(1.2, Math.min(dimensions.width, dimensions.height) * (0.006 + (seed % 5) * 0.002));
    const opacity = 0.34 + (seed % 5) * 0.1;
    return {index, x, y, radius, opacity};
  });

  return <svg role="img" aria-label="漂移粒子效果" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g opacity="0.42">
      {particles.filter((particle) => particle.index % 4 === 0).map((particle) => <line
        key={`line-${particle.index}`}
        x1={particle.x}
        y1={particle.y}
        x2={particle.x + dimensions.width * 0.06}
        y2={particle.y - dimensions.height * 0.04}
        stroke={secondaryColor}
        strokeWidth={Math.max(0.5, particle.radius * 0.35)}
      />)}
    </g>
    {particles.map((particle) => <g key={particle.index}>
      <circle cx={particle.x} cy={particle.y} r={particle.radius * 3.2} fill={particle.index % 3 === 0 ? secondaryColor : color} opacity={particle.opacity * 0.12} />
      <circle cx={particle.x} cy={particle.y} r={particle.radius} fill={particle.index % 3 === 0 ? secondaryColor : color} opacity={particle.opacity} />
    </g>)}
  </svg>;
};

/** A diagonal highlight that sweeps across a quiet grid. */
export const ShimmerSweep = ({
  width = 1920,
  height = 1080,
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#f4f8ff',
  speed = 1,
}: EffectProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, speed, 5.5);
  const beamWidth = Math.max(24, dimensions.width * 0.13);
  const skew = dimensions.height * 0.24;
  const columns = Math.max(8, Math.ceil(dimensions.width / 56));
  const rows = Math.max(5, Math.ceil(dimensions.height / 52));
  const sweepStart = dimensions.width * 0.2;
  const effectiveSpeed = Math.max(0, speed);
  const cycleFrames = Math.max(2, Math.round((fps * 5.5) / Math.max(0.001, effectiveSpeed)));
  // Include the beam width and diagonal skew. The extra one-frame margin
  // keeps the old beam outside the viewport on the last rendered frame.
  const baseTravel = dimensions.width + beamWidth + skew - sweepStart;
  const sweepTravel = baseTravel * (cycleFrames / (cycleFrames - 1));
  const sweepX = interpolate(phase, [0, 1], [sweepStart, sweepStart + sweepTravel]);

  const renderBeam = (beamX: number, key: string) => <g key={key}>
    <path d={`M ${beamX - beamWidth},0 L ${beamX + beamWidth},0 L ${beamX + beamWidth - skew},${dimensions.height} L ${beamX - beamWidth - skew},${dimensions.height} Z`} fill={color} opacity="0.1" />
    <path d={`M ${beamX - beamWidth * 0.28},0 L ${beamX + beamWidth * 0.28},0 L ${beamX + beamWidth * 0.28 - skew},${dimensions.height} L ${beamX - beamWidth * 0.28 - skew},${dimensions.height} Z`} fill={secondaryColor} opacity="0.2" />
    <path d={`M ${beamX - 2},0 L ${beamX + 2},0 L ${beamX + 2 - skew},${dimensions.height} L ${beamX - 2 - skew},${dimensions.height} Z`} fill="#ffffff" opacity="0.7" />
  </g>;

  return <svg role="img" aria-label="光泽扫过效果" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g stroke={color} opacity="0.1" strokeWidth="1">
      {Array.from({length: columns + 1}, (_, index) => <line key={`column-${index}`} x1={(index / columns) * dimensions.width} y1="0" x2={(index / columns) * dimensions.width} y2={dimensions.height} />)}
      {Array.from({length: rows + 1}, (_, index) => <line key={`row-${index}`} x1="0" y1={(index / rows) * dimensions.height} x2={dimensions.width} y2={(index / rows) * dimensions.height} />)}
    </g>
    {renderBeam(sweepX, 'primary-beam')}
    {renderBeam(sweepX - sweepTravel, 'wrapped-beam')}
  </svg>;
};
