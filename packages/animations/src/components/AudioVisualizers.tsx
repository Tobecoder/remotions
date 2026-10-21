import {
  createSmoothSvgPath,
  getWaveformPortion,
  useWindowedAudioData,
  visualizeAudio,
} from '@remotion/media-utils';
import {useId} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type AudioVisualizerProps = {
  /** A WAV URL from staticFile(), an object URL, or a CORS-enabled remote file. */
  src: string;
  color?: string;
  width?: number;
  height?: number;
};

const AUDIO_WINDOW_IN_SECONDS = 10;
const DEFAULT_DURATION_IN_FRAMES = 180;
const DEFAULT_WAVEFORM_SAMPLES = 64;
const DEFAULT_SPECTRUM_BARS = 65;
const MIN_BAR_WIDTH = 2;
const MAX_BAR_GAP = 8;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getSafeSize = (value: number | undefined, fallback: number) =>
  Math.max(1, Number.isFinite(value) ? value! : fallback);

const getBarLayout = (availableWidth: number, requestedBars: number, requestedGap = MAX_BAR_GAP) => {
  const safeWidth = getSafeSize(availableWidth, 1);
  const gapLimit = clamp(requestedGap, 0, MAX_BAR_GAP);
  const maximumBars = Math.max(
    1,
    Math.floor((safeWidth + gapLimit) / (MIN_BAR_WIDTH + gapLimit)),
  );
  const barCount = Math.max(1, Math.min(requestedBars, maximumBars));
  const gap = barCount > 1
    ? Math.min(gapLimit, Math.max(0, (safeWidth - MIN_BAR_WIDTH * barCount) / (barCount - 1)))
    : 0;
  const barWidth = Math.max(
    MIN_BAR_WIDTH,
    (safeWidth - gap * (barCount - 1)) / barCount,
  );
  return {barCount, barWidth, gap};
};

const useAudioWindow = (src: string, frameOverride?: number) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames = DEFAULT_DURATION_IN_FRAMES} = useVideoConfig();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({
    src,
    frame: frameOverride ?? frame,
    fps,
    windowInSeconds: AUDIO_WINDOW_IN_SECONDS,
  });
  return {
    frame,
    fps,
    durationInFrames,
    durationInSeconds: Math.max(1 / fps, durationInFrames / fps),
    audioData,
    dataOffsetInSeconds,
  };
};

const getWaveform = ({
  audioData,
  dataOffsetInSeconds,
  startTimeInSeconds,
  durationInSeconds,
  numberOfSamples,
  outputRange,
  normalize = false,
}: {
  audioData: Parameters<typeof getWaveformPortion>[0]['audioData'] | null | undefined;
  dataOffsetInSeconds: number | undefined;
  startTimeInSeconds: number;
  durationInSeconds: number;
  numberOfSamples: number;
  outputRange: 'zero-to-one' | 'minus-one-to-one';
  normalize?: boolean;
}) => {
  if (!audioData) return [];
  return getWaveformPortion({
    audioData,
    dataOffsetInSeconds,
    durationInSeconds,
    numberOfSamples,
    outputRange,
    startTimeInSeconds,
    normalize,
  }).map((sample) => sample.amplitude);
};

/**
 * Give a static voice-note waveform a little of the irregularity of speech.
 * The source envelope remains the main signal; the small deterministic texture
 * keeps repeated tones from turning into a visibly repeated picket fence.
 */
const getOrganicVoiceWaveform = (waveform: number[]) => {
  if (waveform.length < 2) return waveform;

  return waveform.map((sample, index) => {
    const previous = waveform[index - 1] ?? sample;
    const next = waveform[index + 1] ?? sample;
    const localAverage = (previous + sample + next) / 3;
    const localChange = Math.abs(next - previous);
    const hash = Math.sin((index + 1) * 12.9898 + 78.233) * 43758.5453;
    const texture = hash - Math.floor(hash);
    const phrase = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(index * 0.26 + Math.sin(index * 0.09) * 1.6));
    const articulation = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(index * 1.17 + texture * 2.5));
    const contour = clamp(localAverage * 0.48 + sample * 0.22 + localChange * 1.1 + 0.04, 0, 1);
    const voiceShape = contour * 0.62 + phrase * 0.38;
    return clamp(voiceShape * (0.8 + texture * 0.36) * articulation, 0, 1);
  });
};

/** A smooth, signed waveform matching Remotion's transparent oscilloscope element. */
export const Oscilloscope = ({
  src,
  color = '#2563eb',
  width = 900,
  height = 300,
}: AudioVisualizerProps) => {
  const {frame, fps, audioData, dataOffsetInSeconds} = useAudioWindow(src);
  const svgWidth = getSafeSize(width, 900);
  const svgHeight = getSafeSize(height, 300);
  const lineWidth = clamp(svgWidth / 150, 1, 6);
  const waveform = getWaveform({
    audioData,
    dataOffsetInSeconds,
    durationInSeconds: 0.35,
    numberOfSamples: DEFAULT_WAVEFORM_SAMPLES,
    outputRange: 'minus-one-to-one',
    startTimeInSeconds: frame / fps - 0.35 / 2,
  });
  const horizontalStart = lineWidth * 2;
  const horizontalEnd = Math.max(horizontalStart, svgWidth - lineWidth * 4);
  const path = waveform.length > 0
    ? createSmoothSvgPath({
        points: waveform.map((value, index) => ({
          x: horizontalStart + (index / Math.max(1, waveform.length - 1)) * (horizontalEnd - horizontalStart),
          y: svgHeight / 2 + value * (svgHeight / 2) * 2,
        })),
      })
    : null;

  return (
    <svg
      role="img"
      aria-label="随音频变化的示波曲线"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{display: 'block', maxWidth: '100%', overflow: 'hidden'}}
    >
      <line
        x1={horizontalStart}
        y1={svgHeight / 2}
        x2={horizontalEnd}
        y2={svgHeight / 2}
        stroke={color}
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      {path ? (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={lineWidth}
        />
      ) : null}
    </svg>
  );
};

/** Frequency bands mirrored around the center, matching the official flex layout. */
export const MirroredSpectrum = ({
  src,
  color = '#2563eb',
  width = 900,
  height = 300,
}: AudioVisualizerProps) => {
  const {frame, fps, audioData, dataOffsetInSeconds} = useAudioWindow(src);
  const svgWidth = getSafeSize(width, 900);
  const svgHeight = getSafeSize(height, 300);
  const {barCount, gap} = getBarLayout(svgWidth, DEFAULT_SPECTRUM_BARS);
  const numberOfFrequencies = Math.ceil(barCount / 2);
  const frequencyData = audioData
    ? visualizeAudio({
        audioData,
        dataOffsetInSeconds,
        fps,
        frame,
        numberOfSamples: 256,
        optimizeFor: 'speed',
      })
    : [];
  const subset = frequencyData.slice(0, numberOfFrequencies);
  const frequenciesToDisplay = [
    ...subset.slice(barCount % 2).reverse(),
    ...subset,
  ].slice(0, barCount);

  return (
    <div
      role="img"
      aria-label="随音频变化的镜像频谱"
      style={{
        alignItems: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        gap,
        height: svgHeight,
        maxWidth: '100%',
        overflow: 'hidden',
        width: svgWidth,
      }}
    >
      {frequenciesToDisplay.map((value, index) => (
        <div
          key={index}
          data-audio-bar="true"
          style={{
            backgroundColor: color,
            borderRadius: 999,
            flex: 1,
            height: Math.max(4, Math.min(svgHeight, svgHeight * Math.sqrt(Math.max(0, value)) * 1.5)),
            minWidth: MIN_BAR_WIDTH,
          }}
        />
      ))}
    </div>
  );
};

/** A static waveform with a played/unplayed progress gradient, matching Voice Note. */
export const VoiceNote = ({
  src,
  color = '#2563eb',
  width = 900,
  height = 300,
}: AudioVisualizerProps) => {
  const gradientId = `remotions-waveform-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const {frame, durationInFrames, durationInSeconds, audioData, dataOffsetInSeconds} = useAudioWindow(src, 0);
  const svgWidth = getSafeSize(width, 900);
  const svgHeight = getSafeSize(height, 300);
  const {barCount, barWidth, gap} = getBarLayout(Math.max(1, svgWidth - 16), DEFAULT_WAVEFORM_SAMPLES, 5);
  const waveform = getOrganicVoiceWaveform(getWaveform({
    audioData,
    dataOffsetInSeconds,
    durationInSeconds,
    numberOfSamples: barCount,
    outputRange: 'zero-to-one',
    startTimeInSeconds: 0,
    normalize: true,
  }));
  const progress = clamp(frame / Math.max(1, durationInFrames - 1), 0, 1);
  const unplayedColor = '#cbd5e1';
  const maxBarHeight = svgHeight * 0.7;

  return (
    <svg
      role="img"
      aria-label="随音频变化的语音波形"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{display: 'block', maxWidth: '100%', overflow: 'hidden'}}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          x2={Math.max(1, svgWidth - 8)}
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} />
          <stop offset={`${progress * 100}%`} stopColor={color} />
          <stop offset={`${progress * 100}%`} stopColor={unplayedColor} />
          <stop offset="100%" stopColor={unplayedColor} />
        </linearGradient>
      </defs>
      {waveform.map((value, index) => {
        const barHeight = Math.max(8, Math.min(maxBarHeight, Math.pow(Math.max(0, value), 1.35) * maxBarHeight));
        const x = 8 + index * (barWidth + gap);
        return (
          <rect
            key={index}
            data-audio-bar="true"
            fill={`url(#${gradientId})`}
            height={barHeight}
            rx={Math.min(barWidth / 2, barHeight / 2)}
            width={barWidth}
            x={x}
            y={(svgHeight - barHeight) / 2}
          />
        );
      })}
    </svg>
  );
};
