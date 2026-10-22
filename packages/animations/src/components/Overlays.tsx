import type {CSSProperties} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type OverlayProps = {
  width?: number;
  height?: number;
  color?: string;
  secondaryColor?: string;
  /** Transparent by default, so the component can sit above footage. */
  backgroundColor?: string;
  /** Complete entrance, hold, and exit cycle, in seconds. */
  durationInSeconds?: number;
  speed?: number;
  /** Position in the complete animation cycle, from 0 to 1. */
  progress?: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const dimension = (value: number) => Number.isFinite(value) ? Math.max(1, value) : 1;
const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;
const wipeEase = Easing.bezier(0.65, 0, 0.35, 1);
const settle = Easing.out(Easing.cubic);

/** Normalized timing keeps short cycles and different FPS on the same visual path. */
const useTimeline = (duration: number, speed: number, progress?: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (progress !== undefined && Number.isFinite(progress)) return clamp(progress);
  const lastFrame = Math.max(1, Math.round(Math.max(0.1, finite(duration, 4)) * Math.max(1, finite(fps, 30))) - 1);
  return clamp(frame * Math.max(0, finite(speed, 1)) / lastFrame);
};

const envelope = (time: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number, easing = wipeEase) => interpolate(
  time, [enterStart, enterEnd, exitStart, exitEnd], [0, 1, 1, 0],
  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: [easing, Easing.linear, easing]},
);

const containerStyle = (width: number, height: number, backgroundColor?: string): CSSProperties => ({
  position: 'relative', width: dimension(width), height: dimension(height),
  backgroundColor, overflow: 'hidden', pointerEvents: 'none',
});

export type LocationLowerThirdProps = OverlayProps & {
  location?: string;
  /** Optional extra detail. Omitted in the reference-style single-line default. */
  venue?: string;
};

/** A large pin draws in first, followed by a left-to-right text reveal. */
export const LocationLowerThird = ({
  width = 680, height = 138, color = '#2563eb', secondaryColor = '#18181b',
  backgroundColor, durationInSeconds = 4, speed = 1, progress,
  location = 'Berlin, Germany', venue,
}: LocationLowerThirdProps) => {
  const time = useTimeline(durationInSeconds, speed, progress);
  const pin = envelope(time, 0, 0.135, 0.88, 1, settle);
  const ink = envelope(time, 0.04, 0.15, 0.875, 0.965, settle);
  const hole = envelope(time, 0.085, 0.18, 0.85, 0.94, settle);
  const reveal = envelope(time, 0.118, 0.32, 0.74, 0.91, settle);
  const textOpacity = envelope(time, 0.118, 0.185, 0.82, 0.925, Easing.linear);
  return <svg role="img" aria-label="地点下三分之一叠加" width={dimension(width)} height={dimension(height)} viewBox="0 0 680 138" style={{display: 'block', backgroundColor, pointerEvents: 'none'}}>
    <g data-overlay-part="pin" opacity={pin} transform={`translate(56 ${4 - (1 - pin) * 10}) translate(52 126) scale(${0.88 + pin * 0.12}) translate(-52 -126)`}>
      <svg width="104" height="130" viewBox="0 0 64 80" overflow="visible" style={{filter: 'drop-shadow(0 6px 8px #18181b24)'}}>
        <path d="M32 4 C16 4 5 16 5 31 C5 47 22 68 32 76 C42 68 59 47 59 31 C59 16 48 4 32 4 Z" fill={color} fillOpacity={ink} stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - pin} />
        <circle cx="32" cy="30" r={9 * hole} fill="#eff6ff" />
      </svg>
    </g>
    <foreignObject x="184" y="3" width="440" height="132">
      <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'Arial, Helvetica, sans-serif'}}>
        <div data-overlay-part="location" dir="auto" style={{clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, opacity: textOpacity, color: secondaryColor, fontSize: 54, fontWeight: 700, letterSpacing: -1, lineHeight: '82px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{location}</div>
        {venue && <div style={{color: secondaryColor, opacity: textOpacity * 0.65, fontSize: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{venue}</div>}
      </div>
    </foreignObject>
  </svg>;
};

export type NameLowerThirdProps = OverlayProps & {name?: string; role?: string};

/** Two solid, square-ended title bars wipe in and retract with a short stagger. */
export const NameLowerThird = ({
  width = 534, height = 132, color = '#2563eb', secondaryColor = '#18181b',
  backgroundColor, durationInSeconds = 4, speed = 1, progress,
  name = 'Alex Morgan', role = 'Creative Developer',
}: NameLowerThirdProps) => {
  const time = useTimeline(durationInSeconds, speed, progress);
  const nameReveal = envelope(time, 0, 0.168, 0.807, 0.975);
  const roleReveal = envelope(time, 0.034, 0.202, 0.773, 0.941);
  const scale = Math.min(dimension(width) / 534, dimension(height) / 132);
  const barStyle = (reveal: number, fill: string): CSSProperties => ({
    height: 66, padding: '0 24px', boxSizing: 'border-box', display: 'flex', alignItems: 'center',
    width: 'max-content', maxWidth: 534, overflow: 'hidden', whiteSpace: 'nowrap',
    backgroundColor: fill, color: '#fff', fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 34, fontWeight: 700, letterSpacing: 1, lineHeight: 1,
    clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
  });
  return <div role="img" aria-label="姓名下三分之一叠加" style={containerStyle(width, height, backgroundColor)}>
    <div style={{position: 'absolute', left: (dimension(width) - 534 * scale) / 2, top: (dimension(height) - 132 * scale) / 2, width: 534, height: 132, transform: `scale(${scale})`, transformOrigin: 'top left'}}>
      <div data-overlay-part="name-bar" style={barStyle(nameReveal, color)}><span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{name}</span></div>
      <div data-overlay-part="role-bar" style={barStyle(roleReveal, secondaryColor)}><span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{role}</span></div>
    </div>
  </div>;
};
