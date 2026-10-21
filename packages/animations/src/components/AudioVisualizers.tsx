import {createSmoothSvgPath, useWindowedAudioData, visualizeAudio, visualizeAudioWaveform} from '@remotion/media-utils';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type AudioVisualizerProps = {
  /** A WAV URL from staticFile(), an object URL, or a CORS-enabled remote file. */
  src: string;
  color?: string;
  width?: number;
  height?: number;
};

const MIN_BAR_WIDTH = 1;
const AUDIO_BAR_GAP = 5;

const getBarLayout = (availableWidth: number, requestedBars: number) => {
  const safeWidth = Math.max(MIN_BAR_WIDTH, availableWidth);
  const barCount = Math.max(
    1,
    Math.min(requestedBars, Math.floor((safeWidth + AUDIO_BAR_GAP) / (MIN_BAR_WIDTH + AUDIO_BAR_GAP))),
  );
  const barWidth = Math.max(
    MIN_BAR_WIDTH,
    (safeWidth - AUDIO_BAR_GAP * (barCount - 1)) / barCount,
  );
  return {barCount, barWidth};
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
  const svgWidth = Math.max(1, width);
  const svgHeight = Math.max(1, height);
  const waveform = visualizeAudioWaveform({
    audioData, frame, fps, dataOffsetInSeconds, numberOfSamples: 128, windowInSeconds: 0.28,
  });
  const path = createSmoothSvgPath({points: waveform.map((amplitude, index) => ({
    x: index * svgWidth / Math.max(1, waveform.length - 1),
    y: svgHeight / 2 - amplitude * svgHeight * 0.4,
  }))});
  return <svg role="img" aria-label="随音频变化的示波曲线" width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{maxWidth: '100%', overflow: 'visible'}}>
    <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke={color} strokeOpacity="0.16" strokeWidth="2" />
    <path d={path} fill="none" stroke={color} strokeOpacity="0.2" strokeWidth="22" strokeLinecap="round" />
    <path d={path} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
};

/** Frequency bands reflected across a central axis. */
export const MirroredSpectrum = ({src, color = '#8ee5d2', width = 1000, height = 360}: AudioVisualizerProps) => {
  const {frame, fps, audioData, dataOffsetInSeconds} = useAudioWindow(src);
  if (!audioData) return null;
  const svgWidth = Math.max(1, width);
  const svgHeight = Math.max(1, height);
  const rawBands = visualizeAudio({audioData, frame, fps, dataOffsetInSeconds, numberOfSamples: 64, optimizeFor: 'speed'}).slice(0, 48);
  const {barCount, barWidth} = getBarLayout(svgWidth, rawBands.length);
  const bands = rawBands.slice(0, barCount);
  const half = svgHeight / 2;
  const availableBarHeight = Math.max(1, half - 8);
  return <svg role="img" aria-label="随音频变化的镜像频谱" width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{maxWidth: '100%', overflow: 'visible'}}>
    {bands.map((level, index) => {
      const safeLevel = Math.max(0, level);
      const barHeight = Math.max(1, Math.min(availableBarHeight, Math.sqrt(safeLevel) * availableBarHeight * 1.5));
      const segmentHeight = Math.max(1, barHeight - 2);
      const x = index * (barWidth + AUDIO_BAR_GAP);
      return <g key={index} fill={color} opacity={0.55 + level * 0.45}>
        <rect x={x} y={half - barHeight} width={barWidth} height={segmentHeight} rx={barWidth / 2} />
        <rect x={x} y={half + 2} width={barWidth} height={segmentHeight} rx={barWidth / 2} opacity="0.48" />
      </g>;
    })}
    <line x1="0" y1={half} x2={svgWidth} y2={half} stroke={color} strokeOpacity="0.35" strokeWidth="2" />
  </svg>;
};

/** A compact message-like audiogram for voice clips. */
export const VoiceNote = ({src, color = '#ffc685', width = 900, height = 250}: AudioVisualizerProps) => {
  const {frame, fps, audioData, dataOffsetInSeconds} = useAudioWindow(src);
  if (!audioData) return null;
  const svgWidth = Math.max(1, width);
  const svgHeight = Math.max(1, height);
  const waveform = visualizeAudioWaveform({
    audioData, frame, fps, dataOffsetInSeconds, numberOfSamples: 64, windowInSeconds: 2.2,
  });
  const bars = waveform.map((value) => Math.max(7, Math.abs(value) * 126));
  const controlCenter = Math.min(86, Math.max(18, svgWidth * 0.18));
  const controlRadius = Math.min(48, Math.max(10, svgWidth * 0.12));
  const waveformStart = Math.min(155, controlCenter + controlRadius + Math.min(21, svgWidth * 0.05));
  const rightPadding = Math.min(45, Math.max(8, svgWidth * 0.06));
  const {barCount, barWidth} = getBarLayout(svgWidth - waveformStart - rightPadding, bars.length);
  const visibleBars = bars.slice(0, barCount).map((barHeight) => Math.min(Math.max(7, svgHeight * 0.7), barHeight));
  return <svg role="img" aria-label="随音频变化的语音条" width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{maxWidth: '100%'}}>
    <rect x="1" y="1" width={Math.max(1, svgWidth - 2)} height={Math.max(1, svgHeight - 2)} rx="38" fill="#23212e" stroke="#4a425b" strokeWidth="2" />
    <circle cx={controlCenter} cy={svgHeight / 2} r={controlRadius} fill={color} />
    <path d={`M ${controlCenter - 11} ${svgHeight / 2 - controlRadius * 0.44} L ${controlCenter - 11} ${svgHeight / 2 + controlRadius * 0.44} L ${controlCenter + controlRadius * 0.52} ${svgHeight / 2} Z`} fill="#201a24" />
    {visibleBars.map((barHeight, index) => <rect key={index} x={waveformStart + index * (barWidth + AUDIO_BAR_GAP)} y={(svgHeight - barHeight) / 2} width={barWidth} height={barHeight} rx={barWidth / 2} fill={color} opacity={index < visibleBars.length / 2 ? 0.96 : 0.46} />)}
  </svg>;
};
