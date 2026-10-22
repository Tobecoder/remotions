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

export type SocialSafeZonesProps = Pick<OverlayProps, 'width' | 'height' | 'color' | 'backgroundColor'> & {
  platform?: 'instagram' | 'tiktok';
  /** Optional shaded guide in addition to the reconstructed interface. */
  showSafeArea?: boolean;
  /** UI-only reference, independently drawn; not a calibrated platform capture. */
  username?: string;
  caption?: string;
};

type IconName = 'heart' | 'comment' | 'share' | 'bookmark' | 'home' | 'search' | 'person' | 'more' | 'back' | 'music' | 'camera';
const InterfaceIcon = ({name, x, y, size = 64, fill = 'none'}: {name: IconName; x: number; y: number; size?: number; fill?: string}) => {
  const paths: Record<IconName, string> = {
    heart: 'M12 21 C7 17 2 13 2 8 C2 2 9 1 12 6 C15 1 22 2 22 8 C22 13 17 17 12 21 Z',
    comment: 'M21 11 C21 6 17 3 12 3 C7 3 3 6 3 11 C3 16 7 19 12 19 L19 22 L18 17 C20 15 21 13 21 11 Z',
    share: 'M3 4 L22 2 L15 22 L11 13 Z M11 13 L22 2',
    bookmark: 'M5 3 H19 V22 L12 17 L5 22 Z',
    home: 'M2 11 L12 2 L22 11 M5 9 V22 H10 V15 H14 V22 H19 V9',
    search: 'M16 16 L22 22 M19 10 A9 9 0 1 1 1 10 A9 9 0 1 1 19 10',
    person: 'M16 7 A4 4 0 1 1 8 7 A4 4 0 1 1 16 7 M3 23 C3 12 21 12 21 23',
    more: 'M4 12 H4.1 M12 12 H12.1 M20 12 H20.1',
    back: 'M15 3 L6 12 L15 21',
    music: 'M9 17 V4 L21 2 V15 M9 17 C9 22 1 23 1 19 C1 15 9 14 9 17 M21 15 C21 20 13 21 13 17 C13 13 21 12 21 15',
    camera: 'M2 7 H7 L9 3 H15 L17 7 H22 V21 H2 Z M17 13 A5 5 0 1 1 7 13 A5 5 0 1 1 17 13',
  };
  return <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" overflow="visible"><path d={paths[name]} fill={fill} stroke="currentColor" strokeWidth={name === 'more' ? 3.8 : 1.9} strokeLinecap="round" strokeLinejoin="round" /></svg>;
};

/** Independent vector interface reconstruction over transparent footage, at a fixed 9:16 ratio. */
export const SocialSafeZones = ({
  width = 1080, height = 1920, color = '#fff', backgroundColor, platform = 'instagram',
  showSafeArea = false, username = 'yourname', caption = '这里是视频描述 · 更多',
}: SocialSafeZonesProps) => {
  const tiktok = platform === 'tiktok';
  return <svg role="img" aria-label={`${tiktok ? 'TikTok' : 'Instagram Reels'} 社交视频界面参考`} width={dimension(width)} height={dimension(height)} viewBox="0 0 1080 1920" style={{display: 'block', backgroundColor, pointerEvents: 'none', color}}>
    {showSafeArea && <g data-overlay-part="safe-area" fill="#f59e0b" fillOpacity="0.18"><path fillRule="evenodd" d="M0 0 H1080 V1920 H0 Z M64 290 V1440 H900 V290 Z" /><rect x="64" y="290" width="836" height="1150" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="14 12" /></g>}
    <g data-overlay-part="platform-interface" fill={color} fontFamily="Arial, sans-serif" style={{filter: 'drop-shadow(0 2px 3px #0008)'}}>
      {tiktok ? <>
        <InterfaceIcon name="back" x={34} y={67} size={48} />
        <rect x="115" y="52" width="910" height="86" rx="43" fill="none" stroke={color} strokeOpacity="0.45" strokeWidth="2" />
        <InterfaceIcon name="search" x={142} y={77} size={35} /><text x="200" y="107" fontSize="30" opacity="0.8">搜索</text><text x="905" y="107" fontSize="30">搜索</text>
      </> : <>
        <text x="48" y="120" fontSize="58" fontWeight="700">Reels</text><path d="M219 93 l14 14 14 -14" stroke={color} fill="none" strokeWidth="5" /><InterfaceIcon name="camera" x={967} y={70} size={60} />
      </>}
      <g data-overlay-part="action-rail">
        {tiktok && <><circle cx="980" cy="980" r="40" fill="#d8dde4" /><InterfaceIcon name="person" x={955} y={954} size={50} fill="#9ca3af" /><circle cx="980" cy="1020" r="16" fill="#fe2c55" /><text x="970" y="1031" fontSize="31">+</text></>}
        <InterfaceIcon name="heart" x={948} y={tiktok ? 1100 : 1140} size={64} fill={tiktok ? 'currentColor' : 'none'} /><text x="980" y={tiktok ? 1205 : 1245} textAnchor="middle" fontSize="27">12.8K</text>
        <InterfaceIcon name="comment" x={950} y={tiktok ? 1260 : 1295} size={62} fill={tiktok ? 'currentColor' : 'none'} /><text x="980" y={tiktok ? 1365 : 1400} textAnchor="middle" fontSize="27">328</text>
        <InterfaceIcon name={tiktok ? 'bookmark' : 'share'} x={952} y={tiktok ? 1420 : 1450} size={60} fill={tiktok ? 'currentColor' : 'none'} /><text x="980" y={tiktok ? 1525 : 1555} textAnchor="middle" fontSize="27">2,106</text>
        <InterfaceIcon name={tiktok ? 'share' : 'more'} x={950} y={tiktok ? 1580 : 1605} size={60} />
        <rect x="954" y="1770" width="56" height="56" rx={tiktok ? 28 : 8} fill="none" stroke={color} strokeWidth="4" /><InterfaceIcon name="music" x={969} y={1785} size={26} />
      </g>
      {!tiktok && <><circle cx="82" cy="1572" r="31" fill="#d8dde4" /><InterfaceIcon name="person" x={61} y={1552} size={42} fill="#9ca3af" /></>}
      <text x={tiktok ? 40 : 134} y={tiktok ? 1600 : 1588} fontSize="34" fontWeight="700">{tiktok ? '@' : ''}{username}</text>
      {!tiktok && <><rect x="382" y="1544" width="120" height="56" rx="9" fill="none" stroke={color} strokeWidth="2" /><text x="442" y="1582" textAnchor="middle" fontSize="26">关注</text></>}
      <text x="40" y="1682" fontSize="30">{caption}</text>
      <InterfaceIcon name="music" x={43} y={1735} size={28} /><text x="90" y="1762" fontSize="27">原创音频 · {username}</text>
      <g data-overlay-part="bottom-navigation" fill={color}>
        <rect y="1830" width="1080" height="90" fill="#121212" />
        <InterfaceIcon name="home" x={80} y={1850} size={48} />
        <InterfaceIcon name={tiktok ? 'search' : 'share'} x={290} y={1850} size={46} />
        <rect x="515" y="1847" width="56" height="48" rx="10" fill="none" stroke={color} strokeWidth="3" /><path d="M543 1857 V1885 M529 1871 H557" stroke={color} strokeWidth="3" />
        <InterfaceIcon name="comment" x={721} y={1850} size={46} /><InterfaceIcon name="person" x={940} y={1850} size={46} />
      </g>
    </g>
  </svg>;
};
