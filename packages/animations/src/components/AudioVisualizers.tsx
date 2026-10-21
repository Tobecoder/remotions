import {createSmoothSvgPath, useWindowedAudioData, visualizeAudio, visualizeAudioWaveform} from '@remotion/media-utils';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type AudioVisualizerProps = {
  /** A local staticFile() URL, object URL, or CORS-enabled remote audio URL. */
  src: string;
  color?: string;
  width?: number;
  height?: number;
};

const useAudioWindow = (src: string) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({src, frame, fps, windowInSeconds: 4});
  return {frame, fps, audioData, dataOffsetInSeconds};
};

/** A smooth, signed waveform centered on a quiet reference line. */
export const Oscilloscope = ({src, color = '#b29aff', width = 1000, height = 320}: AudioVisualizerProps) => {
  const {frame, fps, audioData, dataOffsetInSeconds} = useAudioWindow(src);
  if (!audioData) return null;
  const waveform = visualizeAudioWaveform({
    audioData, frame, fps, dataOffsetInSeconds, numberOfSamples: 128, windowInSeconds: 0.28,
  });
  const path = createSmoothSvgPath({points: waveform.map((amplitude, index) => ({
    x: index * width / (waveform.length - 1),
    y: height / 2 - amplitude * height * 0.4,
  }))});
  return <svg role="img" aria-label="随音频变化的示波曲线" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{maxWidth: '100%', overflow: 'visible'}}>
    <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeOpacity="0.16" strokeWidth="2" />
    <path d={path} fill="none" stroke={color} strokeOpacity="0.2" strokeWidth="22" strokeLinecap="round" />
    <path d={path} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
};

/** Frequency bands reflected across a central axis. */
export const MirroredSpectrum = ({src, color = '#8ee5d2', width = 1000, height = 360}: AudioVisualizerProps) => {
  const {frame, fps, audioData, dataOffsetInSeconds} = useAudioWindow(src);
  if (!audioData) return null;
  const bands = visualizeAudio({audioData, frame, fps, dataOffsetInSeconds, numberOfSamples: 64, optimizeFor: 'speed'}).slice(0, 48);
  const gap = 5;
  const barWidth = (width - gap * (bands.length - 1)) / bands.length;
  const half = height / 2;
  return <svg role="img" aria-label="随音频变化的镜像频谱" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{maxWidth: '100%', overflow: 'visible'}}>
    {bands.map((level, index) => {
      const barHeight = Math.max(4, Math.min(half - 8, Math.sqrt(level) * (half - 8) * 1.5));
      const x = index * (barWidth + gap);
      return <g key={index} fill={color} opacity={0.55 + level * 0.45}>
        <rect x={x} y={half - barHeight} width={barWidth} height={barHeight - 2} rx={barWidth / 2} />
        <rect x={x} y={half + 2} width={barWidth} height={barHeight - 2} rx={barWidth / 2} opacity="0.48" />
      </g>;
    })}
    <line x1="0" y1={half} x2={width} y2={half} stroke={color} strokeOpacity="0.35" strokeWidth="2" />
  </svg>;
};

/** A compact message-like audiogram for voice clips. */
export const VoiceNote = ({src, color = '#ffc685', width = 900, height = 250}: AudioVisualizerProps) => {
  const {frame, fps, audioData, dataOffsetInSeconds} = useAudioWindow(src);
  if (!audioData) return null;
  const waveform = visualizeAudioWaveform({
    audioData, frame, fps, dataOffsetInSeconds, numberOfSamples: 64, windowInSeconds: 2.2,
  });
  const bars = waveform.map((value) => Math.max(7, Math.abs(value) * 126));
  const gap = 5;
  const barWidth = (width - 200 - gap * (bars.length - 1)) / bars.length;
  return <svg role="img" aria-label="随音频变化的语音条" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{maxWidth: '100%'}}>
    <rect x="1" y="1" width={width - 2} height={height - 2} rx="38" fill="#23212e" stroke="#4a425b" strokeWidth="2" />
    <circle cx="86" cy={height / 2} r="48" fill={color} />
    <path d={`M 75 ${height / 2 - 21} L 75 ${height / 2 + 21} L 111 ${height / 2} Z`} fill="#201a24" />
    {bars.map((barHeight, index) => <rect key={index} x={155 + index * (barWidth + gap)} y={(height - barHeight) / 2} width={barWidth} height={barHeight} rx={barWidth / 2} fill={color} opacity={index < bars.length / 2 ? 0.96 : 0.46} />)}
  </svg>;
};
