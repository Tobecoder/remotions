import type {SVGProps} from 'react';
import {CardEntrance} from '../../../packages/animations/src';
import {clamp, during, mix} from '../../../packages/animations/src/reference-opening/motion';
import {MaterialAgent} from './MaterialCollection';

export const RecordingMicrophone = (props: SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 80 162" aria-label="麦克风">
  <rect x="15" width="50" height="94" rx="25" fill="#252934"/>
  {[17, 29, 41, 53, 65, 77].map(y => <path key={y} d={'M21 ' + y + 'H59'} stroke="#424653" strokeWidth="3.3" strokeLinecap="round"/>)}
  <path d="M3 61C3 101 17 120 40 120S77 101 77 61M40 120V153" fill="none" stroke="#3e4350" strokeWidth="6" strokeLinecap="round"/>
  <ellipse cx="40" cy="155" rx="33.6" ry="6.7" fill="#3e4350"/>
</svg>;

// The recording is silent. These strokes depict the original rhythm without sampling audio.
export const NarrationWaveform = ({width, height, color, progress = 1, offset = 0, step = 3.6}: {
  width: number; height: number; color: string; progress?: number; offset?: number; step?: number;
}) => {
  const count = Math.ceil(width / step);
  const path = Array.from({length: Math.ceil(count * clamp(progress))}, (_, index) => {
    const sample = index + offset;
    const phrase = Math.min(1, Math.abs(Math.sin(sample * .24) + .37 * Math.cos(sample * .097 + 1)) * 1.23);
    const syllable = .48 + .52 * Math.abs(Math.sin(sample * 1.72 + Math.sin(sample * .27)));
    const extent = Math.max(.48, phrase * syllable * (height / 2 - 1.5));
    return 'M' + (index * step + 1).toFixed(1) + ' ' + (height / 2 - extent).toFixed(1) + 'v' + (2 * extent).toFixed(1);
  }).join('');
  return <svg aria-hidden="true" width={width} height={height} viewBox={'0 0 ' + width + ' ' + height} style={{display: 'block'}}>
    <path d={path} stroke={color} strokeWidth={step * .59} strokeLinecap="round" fill="none"/>
  </svg>;
};

const tools = [
  {title: 'GPT-SoVITS', color: '#429d7b', stars: 64.1, notes: '用参考音频克隆声音，以及少样本微调音色', tags: ['中文', '英语', '日语', '韩语', '粤语']},
  {title: 'VoxCPM2', color: '#7961c7', stars: 40.8, notes: '可用参考音频克隆声音，也能通过文字描述设计全新音色', tags: ['30 种语言', '9 种中文方言']},
  {title: 'IndexTTS-2.5', color: '#4b78ba', stars: 24.8, notes: '用参考音频克隆声音，可精细控制情绪、语速和发音', tags: ['中文', '英语', '日语', '西班牙语', '阿拉伯语']},
] as const;

const cardWidth = 155;
const cardHeight = 251;
const lefts = [266, 434, 601];
// Measured at 30 FPS from first visible pose to the return to the slot.
const toolCardEntrances = [
  {start: 9408, countStart: 9413, countDuration: 25, lean: -1,
    offsets: [-151, -110, -76, -49, -29, -13, -2, 5, 9, 11, 10, 8, 3, 1, 0]},
  {start: 9415, countStart: 9419, countDuration: 25, lean: 0,
    offsets: [-159, -114, -74, -44, -21, -3, 4, 9, 11, 10, 8, 5, 2, 1, 0]},
  {start: 9421, countStart: 9426, countDuration: 24, lean: 1,
    offsets: [-153, -115, -80, -55, -33, -15, -3, 6, 10, 12, 11, 9, 6, 3, 1, 0]},
];
const dropAngles = [8.5, 6.5, 4.7, 2.9, 1.8, .9, .1, 0, -.5, -.8, -.6, -.4, -.2];
const cables = [
  [[140, 291], [218, 362], [344, 388], [344, 309]],
  [[140, 291], [235, 373], [502, 381], [512, 309]],
  [[140, 291], [248, 382], [659, 386], [679, 309]],
] as const;
const cablePath = (points: typeof cables[number]) =>
  'M' + points[0].join(' ') + 'C' + points.slice(1).map(point => point.join(' ')).join(' ');
const pointOnCable = (points: typeof cables[number], progress: number) => {
  const rest = 1 - progress;
  const weights = [rest ** 3, 3 * rest ** 2 * progress, 3 * rest * progress ** 2, progress ** 3];
  return [
    points.reduce((value, point, i) => value + point[0] * weights[i], 0),
    points.reduce((value, point, i) => value + point[1] * weights[i], 0),
  ];
};

const VoiceToolCard = ({frame, index, highlight}: {frame: number; index: number; highlight: number}) => {
  const tool = tools[index], entrance = toolCardEntrances[index];
  const end = 9832 + index * 4, exit = during(frame, end, end + 11);
  const dropFrame = frame - entrance.start;
  const dropY = entrance.offsets[dropFrame] ?? 0;
  const dropAngle = entrance.lean * (dropAngles[dropFrame] ?? 0);
  const waveformAt = [9510, 9526, 9542][index];
  const command = '温柔的女声，语速稍慢，带一点笑意';
  const typing = during(frame, 9629, 9664);
  const showCommand = index === 1 && frame >= 9629;
  const countProgress = clamp((frame - entrance.countStart) / entrance.countDuration);
  const count = (tool.stars * (1 - (1 - countProgress) ** 2.6)).toFixed(1);
  const y = index === 1 ? -highlight : 0;
  return <div data-voice-tool={tool.title} style={{
    position: 'absolute', inset: 0, zIndex: index === 1 ? 2 : 1,
    opacity: (1 - exit) * (index === 1 ? 1 : 1 - .56 * highlight),
  }}>
    <div style={{
      position: 'absolute', left: lefts[index], top: 58 + y, width: cardWidth, height: cardHeight,
      transform: 'perspective(610px) rotateY(' + (74 * exit) + 'deg) scale(' + (index === 1 ? 1 + .07 * highlight : 1) + ')',
    }}>
      <CardEntrance progress={1} x={0} y={dropY} rotation={dropAngle} width={cardWidth} height={cardHeight}
        background="#fcfcf5" borderRadius={11} boxShadow="0 9px 18px #30343e20">
        <div style={{position: 'absolute', top: 12, left: 12, width: 29, height: 3, borderRadius: 4, background: tool.color}}/>
        <div style={{position: 'absolute', top: 23, left: 12, fontSize: 19, fontWeight: 900, color: '#272932', letterSpacing: -.46}}>{tool.title}</div>
        <div data-voice-tool-stars style={{position: 'absolute', top: 48, left: 12, fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: tool.color}}>★ {count}k</div>
        <div style={{position: 'absolute', top: 72, left: 12, right: 12, fontSize: 10.3, lineHeight: '15.5px', fontWeight: 500, color: '#464851'}}>{tool.notes}</div>
        <div style={{position: 'absolute', top: 122, left: 12, right: 11, display: 'flex', flexWrap: 'wrap', gap: 3}}>
          {tool.tags.map(tag => <span key={tag} style={{padding: '2px 5px', borderRadius: 10, background: '#ededeb', color: '#494b51', fontSize: 8.9, lineHeight: '13px', fontWeight: 700}}>{tag}</span>)}
        </div>
        {showCommand && <div data-voice-command style={{
          position: 'absolute', left: 12, right: 12, top: 159, minHeight: 25, padding: '4px 6px', boxSizing: 'border-box',
          border: '1px solid #917fc0', borderRadius: 5, background: '#f5f1fc', color: '#292a33', fontSize: 9.5, lineHeight: '15px',
        }}>
          {command.slice(0, Math.floor(command.length * typing))}
          <span style={{background: tool.color, display: 'inline-block', width: 3, height: 9, marginLeft: 1, opacity: Number(frame % 25 < 15)}}/>
        </div>}
        <div style={{position: 'absolute', left: 13, top: 204}}>
          <NarrationWaveform width={129} height={35} step={2.8} color={tool.color}
            offset={index * 37 + (index === 1 ? 34 * during(frame, 9663, 9681) : 0)} progress={during(frame, waveformAt, waveformAt + 17)}/>
        </div>
      </CardEntrance>
    </div>
  </div>;
};

const documentLaunches = [{frame: 9716, firstPose: 1}, {frame: 9721, firstPose: 0}, {frame: 9727, firstPose: 0}];
// The reference uses the same vertical arc for the three different flight distances.
const documentFlight = [
  // Fraction across, heading height, angle.
  [0, 131, 10], [.005, 130, 9], [.018, 129, 9], [.044, 126, 8], [.086, 123, 8],
  [.149, 118, 7], [.235, 114, 4], [.352, 113, 1], [.502, 123, -1], [.65, 148, -3],
  [.766, 177, -5], [.854, 203, -7], [.915, 222, -8], [.957, 236, -9],
  [.982, 244, -9], [.995, 248, -9], [1, 249, -9],
] as const;

const VoiceToolDocuments = ({frame}: {frame: number}) => <>
  {tools.map((tool, index) => {
    const launch = documentLaunches[index];
    if (frame < launch.frame) return null;
    const age = frame - launch.frame + launch.firstPose;
    // The blue sheet reaches the same landing pose one frame sooner.
    const pose = documentFlight[age + Number(index === 2 && age >= 13)];
    if (!pose) return null;

    const [travel, y, angle] = pose;
    const x = mix(lefts[index] + 70, 111, travel);
    const scale = mix(1, .66, travel);
    return <div key={tool.title} data-voice-tool-document={tool.title} aria-hidden="true" style={{
      position: 'absolute', zIndex: 3, left: x - 15, top: y - 8, width: 44, height: 53,
      borderRadius: 2, background: '#fdfdf9', boxShadow: '0 3px 8px #30343e23',
      transformOrigin: '15px 8px', transform: `rotate(${angle}deg) scale(${scale})`,
    }}>
      <div style={{position: 'absolute', top: 6, left: 5, width: 20, height: 3, borderRadius: 2, background: tool.color}}/>
      {[31, 26, 28, 22, 25].map((width, line) =>
        <div key={line} style={{position: 'absolute', left: 5, top: 14 + line * 6, width, height: 2.4, borderRadius: 1, background: '#d8dad6'}}/>)}
    </div>;
  })}
</>;

export const NarrationTools = ({frame}: {frame: number}) => {
  const highlight = during(frame, 9580, 9595) * (1 - during(frame, 9686, 9701));
  const fade = 1 - during(frame, 9855, 9876);
  return <div data-narration-tools style={{position: 'absolute', inset: 0, opacity: fade}}>
    <svg width="800" height="450" style={{position: 'absolute', inset: 0}} aria-hidden="true">
      {cables.map((points, index) => {
        const p = during(frame, 9314 + index * 3, 9335 + index * 5);
        const pulseAt = 9491 + index * 10;
        const pulse = clamp((frame - pulseAt) / 25);
        const [pulseX, pulseY] = pointOnCable(points, pulse);
        return <g key={tools[index].title}>
          <path d={cablePath(points)} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} fill="none"
            stroke={tools[index].color} strokeWidth="2.2" opacity=".77" strokeLinecap="round"/>
          {frame >= pulseAt && frame < pulseAt + 26 && <g transform={'translate(' + (pulseX - 16) + ' ' + (pulseY - 8) + ')'}>
            <rect width="32" height="16" rx="4" fill="#fff9f0" stroke="#cb7a64" strokeWidth="1.4"/>
            <g transform="translate(3 3)"><NarrationWaveform width={26} height={10} step={2.4} color="#c97061" offset={index * 2}/></g>
          </g>}
        </g>;
      })}
    </svg>
    {tools.map((tool, index) => {
      const {start} = toolCardEntrances[index];
      const slot = during(frame, 9327 + index * 6, 9331 + index * 6) * (1 - during(frame, start + 3, start + 8));
      return <div key={tool.title}>
        <div style={{position: 'absolute', left: lefts[index], top: 58, width: cardWidth, height: cardHeight, border: '1px dashed #b6b7b1', borderRadius: 11, boxSizing: 'border-box', opacity: slot}}/>
        {frame >= start && frame <= 9843 + index * 4 && <VoiceToolCard frame={frame} index={index} highlight={highlight}/>}
      </div>;
    })}
    <VoiceToolDocuments frame={frame}/>
  </div>;
};

// Each pair covers one flight from push-off to its next floor contact.
const entryHop = [9178, 9192] as const;
const crossingHops = [[9226, 9233], [9233, 9240], [9240, 9247], [9247, 9254], [9254, 9260]] as const;
const reactionHop = [9281, 9295] as const;
const hops = [entryHop, ...crossingHops, reactionHop];
const landings = [entryHop[0], ...hops.map(([, land]) => land)];

export const NarrationAgent = ({frame}: {frame: number}) => {
  const arrive = during(frame, 9171, 9177);
  const entryDrop = 52 * (1 - during(frame, 9172, entryHop[0]));
  const entryX = mix(mix(833, 757, during(frame, 9170, entryHop[0])), 637, during(frame, ...entryHop));
  const crossing = during(frame, crossingHops[0][0], crossingHops[crossingHops.length - 1][1]);
  const leave = clamp((frame - 9851) / 21);
  const x = mix(mix(entryX, 98, crossing), -66, leave);
  const flight = hops.find(([takeoff, landing]) => frame > takeoff && frame < landing);
  const phase = flight ? (frame - flight[0]) / (flight[1] - flight[0]) : 0;
  const hopLift = 30 * 4 * phase * (1 - phase);
  const lift = entryDrop + hopLift + 23 * Math.sin(Math.PI * leave);
  const squash = Math.max(...landings.map(landing => .14 * (1 - clamp(Math.abs(frame - landing) / 2))));
  const tablet = frame >= 9701 && frame < 9772;
  const ground = 328;
  const floorShadow = frame < 9305;
  return <>
    {floorShadow && <div data-narration-agent-shadow style={{
      position: 'absolute', left: x - 39, top: ground - 2, width: 78, height: 5, borderRadius: '50%',
      background: '#4c4c58', filter: 'blur(2px)', opacity: .25 * arrive * (1 - .55 * clamp(lift / 45)),
    }}/>}
    <MaterialAgent time={frame / 30} x={x} y={ground - lift} height={91} opacity={arrive} tablet={tablet}
      shadow={!floorShadow} squash={squash} tilt={-4 * hopLift / 30 + 8 * Math.sin(Math.PI * leave)}/>
  </>;
};
