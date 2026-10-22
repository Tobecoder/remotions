import {useId} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type ChartDatum = {
  label: string;
  value: number;
  color?: string;
};

export type ChartProps = {
  /** Canvas width in pixels. */
  width?: number;
  /** Canvas height in pixels. */
  height?: number;
  /** Primary chart color. */
  color?: string;
  /** Secondary chart color used for accents and guides. */
  secondaryColor?: string;
  /** Canvas background color. */
  backgroundColor?: string;
  /** Duration of the entrance animation in seconds. */
  durationInSeconds?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Optional externally controlled progress from 0 to 1. */
  progress?: number;
  /** Data displayed by the chart. */
  data?: readonly ChartDatum[];
};

type ChartDimensions = {width: number; height: number};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const getDimensions = (width: number, height: number): ChartDimensions => ({
  width: Number.isFinite(width) ? Math.max(1, width) : 1,
  height: Number.isFinite(height) ? Math.max(1, height) : 1,
});

const getProgress = (frame: number, fps: number, durationInSeconds: number, speed: number, progress?: number) => {
  if (progress !== undefined && Number.isFinite(progress)) return clamp(progress);
  const safeFps = Number.isFinite(fps) ? Math.max(1, fps) : 30;
  const safeDuration = Number.isFinite(durationInSeconds) ? Math.max(0.1, durationInSeconds) : 4;
  const safeSpeed = Number.isFinite(speed) ? Math.max(0, speed) : 1;
  return interpolate(frame * safeSpeed, [0, safeFps * safeDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

const sanitizeData = (data: readonly ChartDatum[] | undefined, fallback: readonly ChartDatum[]) => {
  const source = data && data.length > 0 ? data : fallback;
  return source.map((item) => ({
    label: String(item.label ?? ''),
    value: Number.isFinite(item.value) ? item.value : 0,
    color: item.color,
  }));
};

const svgStyle = {display: 'block', maxWidth: '100%'} as const;

const defaultData: readonly ChartDatum[] = [
  {label: '设计', value: 68, color: '#409eff'},
  {label: '工程', value: 84, color: '#67c23a'},
  {label: '内容', value: 52, color: '#e6a23c'},
  {label: '增长', value: 92, color: '#8b5cf6'},
];

const chartText = (size: number, color = '#303133') => ({
  fill: color,
  fontFamily: 'system-ui, sans-serif',
  fontSize: Math.max(8, size),
});

type StaggeredProgressOptions = {
  startBase?: number;
  startSpread?: number;
  endBase?: number;
  endSpread?: number;
};

const getStaggeredProgress = (
  phase: number,
  index: number,
  itemCount: number,
  {startBase = 0, startSpread = 0.24, endBase = 0.58, endSpread = 0.15}: StaggeredProgressOptions = {},
) => {
  const normalizedIndex = itemCount <= 1 ? 0 : index / (itemCount - 1);
  const start = Math.min(0.9, startBase + normalizedIndex * startSpread);
  const end = Math.min(1, Math.max(start + 0.02, endBase + normalizedIndex * endSpread));
  return interpolate(phase, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

/** A directly labeled horizontal bar chart that grows in staggered rows. */
export const HorizontalBarChart = ({
  width = 960,
  height = 540,
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#f7fbff',
  durationInSeconds = 4,
  speed = 1,
  progress,
  data,
}: ChartProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const items = sanitizeData(data, defaultData);
  const phase = getProgress(frame, fps, durationInSeconds, speed, progress);
  const left = dimensions.width * 0.21;
  const right = dimensions.width * 0.1;
  const top = dimensions.height * 0.16;
  const bottom = dimensions.height * 0.12;
  const chartWidth = Math.max(1, dimensions.width - left - right);
  const availableHeight = Math.max(1, dimensions.height - top - bottom);
  const rowHeight = availableHeight / Math.max(1, items.length);
  const domainMin = Math.min(0, ...items.map((item) => item.value));
  const domainMax = Math.max(0, ...items.map((item) => item.value));
  const domainRange = Math.max(1, domainMax - domainMin);
  const valueToX = (value: number) => left + ((value - domainMin) / domainRange) * chartWidth;
  const baselineX = valueToX(0);
  const baseFontSize = Math.min(dimensions.width, dimensions.height) * 0.045;
  const fontSize = Math.max(8, Math.min(baseFontSize, rowHeight * 0.72));

  return <svg role="img" aria-label="横向条形图" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={svgStyle}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {Array.from({length: 5}, (_, index) => {
      const x = left + (chartWidth * index) / 4;
      return <g key={`tick-${index}`}>
        <line x1={x} y1={top - 8} x2={x} y2={dimensions.height - bottom} stroke={secondaryColor} strokeOpacity="0.13" strokeWidth="1" />
        <text x={x} y={top - 16} textAnchor="middle" style={chartText(fontSize * 0.72, '#909399')}>{Math.round(domainMin + (domainRange * index) / 4)}</text>
      </g>;
    })}
    <line x1={baselineX} y1={top - 8} x2={baselineX} y2={dimensions.height - bottom} stroke={color} strokeOpacity="0.34" strokeWidth="1.5" />
    {items.map((item, index) => {
      const rowY = top + index * rowHeight;
      const barHeight = rowHeight * 0.48;
      const rowProgress = getStaggeredProgress(phase, index, items.length, {endSpread: 0.15});
      const valueX = valueToX(item.value);
      const animatedValueX = baselineX + (valueX - baselineX) * rowProgress;
      const barX = Math.min(baselineX, animatedValueX);
      const barWidth = Math.abs(animatedValueX - baselineX);
      const valueLabelX = item.value < 0 ? Math.max(4, animatedValueX - 8) : Math.min(dimensions.width - 4, animatedValueX + 8);
      return <g key={`${item.label}-${index}`}>
        <text x={left - 12} y={rowY + barHeight * 0.82} textAnchor="end" style={{...chartText(fontSize, '#606266'), fontWeight: 650}}>{item.label}</text>
        <rect x={left} y={rowY} width={chartWidth} height={barHeight} rx={barHeight / 2} fill={secondaryColor} fillOpacity="0.1" />
        <rect x={barX} y={rowY} width={Math.max(0, barWidth)} height={barHeight} rx={barHeight / 2} fill={item.color ?? color} />
        <text x={valueLabelX} y={rowY + barHeight * 0.82} textAnchor={item.value < 0 ? 'end' : 'start'} style={{...chartText(fontSize, '#303133'), fontWeight: 750}}>{Math.round(item.value)}</text>
      </g>;
    })}
  </svg>;
};

/** A rising line chart with an animated area, path, and point labels. */
export const LineChart = ({
  width = 960,
  height = 540,
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#f7fbff',
  durationInSeconds = 4,
  speed = 1,
  progress,
  data,
}: ChartProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const items = sanitizeData(data, [
    {label: '一月', value: 34},
    {label: '二月', value: 48},
    {label: '三月', value: 42},
    {label: '四月', value: 71},
    {label: '五月', value: 66},
    {label: '六月', value: 92},
  ]);
  const phase = getProgress(frame, fps, durationInSeconds, speed, progress);
  const left = dimensions.width * 0.1;
  const right = dimensions.width * 0.08;
  const top = dimensions.height * 0.14;
  const bottom = dimensions.height * 0.2;
  const innerWidth = Math.max(1, dimensions.width - left - right);
  const innerHeight = Math.max(1, dimensions.height - top - bottom);
  const domainMin = Math.min(0, ...items.map((item) => item.value));
  const domainMax = Math.max(0, ...items.map((item) => item.value));
  const range = Math.max(1, domainMax - domainMin);
  const points = items.map((item, index) => ({
    x: items.length === 1 ? left + innerWidth / 2 : left + (innerWidth * index) / (items.length - 1),
    y: top + innerHeight * (1 - (item.value - domainMin) / range),
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const baseline = top + innerHeight * (1 - (0 - domainMin) / range);
  const areaPath = `${path} L ${points[points.length - 1]?.x ?? left} ${baseline} L ${points[0]?.x ?? left} ${baseline} Z`;
  const fontSize = Math.max(10, Math.min(dimensions.width, dimensions.height) * 0.04);
  const gradientId = `line-chart-area-${useId().replace(/:/g, '')}`;

  return <svg role="img" aria-label="趋势折线图" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={svgStyle}>
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.26" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {Array.from({length: 4}, (_, index) => {
      const y = top + (innerHeight * index) / 3;
      return <line key={`grid-${index}`} x1={left} y1={y} x2={left + innerWidth} y2={y} stroke={secondaryColor} strokeOpacity="0.14" strokeWidth="1" />;
    })}
    <path d={areaPath} fill={`url(#${gradientId})`} opacity={phase} />
    <path d={path} fill="none" stroke={color} strokeWidth={Math.max(2, dimensions.height * 0.014)} strokeLinecap="round" strokeLinejoin="round" pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset={1000 * (1 - phase)} />
    {items.map((item, index) => {
      const point = points[index];
      const pointPhase = getStaggeredProgress(phase, index, items.length, {startSpread: 0.4, endBase: 0.5, endSpread: 0.3});
      return <g key={`${item.label}-${index}`} opacity={pointPhase}>
        <circle cx={point.x} cy={point.y} r={Math.max(3, dimensions.height * 0.022)} fill={backgroundColor} stroke={color} strokeWidth={Math.max(2, dimensions.height * 0.01)} />
        <text x={point.x} y={point.y - Math.max(9, dimensions.height * 0.05)} textAnchor="middle" style={{...chartText(fontSize, '#303133'), fontWeight: 750}}>{Math.round(item.value)}</text>
        <text x={point.x} y={dimensions.height - bottom * 0.36} textAnchor="middle" style={chartText(fontSize * 0.85, '#909399')}>{item.label}</text>
      </g>;
    })}
  </svg>;
};

const arcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
  const startX = centerX + Math.cos(startAngle) * radius;
  const startY = centerY + Math.sin(startAngle) * radius;
  const endX = centerX + Math.cos(endAngle) * radius;
  const endY = centerY + Math.sin(endAngle) * radius;
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
};

/** A labeled donut chart whose slices grow from the center. */
export const PieChart = ({
  width = 960,
  height = 540,
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#f7fbff',
  durationInSeconds = 4,
  speed = 1,
  progress,
  data,
}: ChartProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const items = sanitizeData(data, [
    {label: '产品', value: 42, color: '#409eff'},
    {label: '研发', value: 28, color: '#67c23a'},
    {label: '内容', value: 18, color: '#e6a23c'},
    {label: '其他', value: 12, color: '#8b5cf6'},
  ]);
  const phase = getProgress(frame, fps, durationInSeconds, speed, progress);
  const centerX = dimensions.width * 0.42;
  const centerY = dimensions.height * 0.52;
  const radius = Math.max(20, Math.min(dimensions.width, dimensions.height) * 0.29);
  const innerRadius = radius * 0.55;
  const pieWeights = items.map((item) => Math.max(0, item.value));
  const total = Math.max(1, pieWeights.reduce((sum, value) => sum + value, 0));
  const fontSize = Math.max(10, Math.min(dimensions.width, dimensions.height) * 0.04);
  let angle = -Math.PI / 2;

  return <svg role="img" aria-label="占比饼图" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={svgStyle}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {items.map((item, index) => {
      const weight = pieWeights[index];
      const slice = (weight / total) * Math.PI * 2;
      const startAngle = angle;
      angle += slice;
      const midAngle = startAngle + slice / 2;
      const animatedEnd = startAngle + slice * phase;
      const labelRadius = radius + Math.max(18, dimensions.width * 0.055);
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      const labelOpacity = getStaggeredProgress(phase, index, items.length, {startBase: 0.25, startSpread: 0.15, endBase: 0.75, endSpread: 0.12});
      const isFullSlice = slice >= Math.PI * 2 - 1e-6;
      return <g key={`${item.label}-${index}`}>
        {isFullSlice && phase >= 1 - 1e-6 ? <circle data-pie-full="true" cx={centerX} cy={centerY} r={radius} fill={item.color ?? color} stroke={backgroundColor} strokeWidth={Math.max(2, dimensions.height * 0.008)} /> : <path d={arcPath(centerX, centerY, radius, startAngle, animatedEnd)} fill={item.color ?? color} stroke={backgroundColor} strokeWidth={Math.max(2, dimensions.height * 0.008)} />}
        <text x={labelX} y={labelY} textAnchor={labelX < centerX ? 'end' : 'start'} dominantBaseline="middle" opacity={labelOpacity} style={{...chartText(fontSize, '#606266'), fontWeight: 650}}>{item.label} {Math.round((weight / total) * 100)}%</text>
      </g>;
    })}
    <circle cx={centerX} cy={centerY} r={innerRadius} fill={backgroundColor} />
    <text x={centerX} y={centerY - fontSize * 0.1} textAnchor="middle" style={{...chartText(fontSize * 1.25, '#303133'), fontWeight: 800}}>数据</text>
    <text x={centerX} y={centerY + fontSize * 1.25} textAnchor="middle" style={chartText(fontSize * 0.72, secondaryColor)}>占比</text>
  </svg>;
};

/** A vertical bar chart with staggered columns and values above each bar. */
export const VerticalBarChart = ({
  width = 960,
  height = 540,
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#f7fbff',
  durationInSeconds = 4,
  speed = 1,
  progress,
  data,
}: ChartProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const items = sanitizeData(data, [
    {label: '北', value: 34, color: '#409eff'},
    {label: '中', value: 58, color: '#67c23a'},
    {label: '南', value: 88, color: '#e6a23c'},
    {label: '西', value: 72, color: '#8b5cf6'},
  ]);
  const phase = getProgress(frame, fps, durationInSeconds, speed, progress);
  const left = dimensions.width * 0.1;
  const right = dimensions.width * 0.07;
  const top = dimensions.height * 0.14;
  const bottom = dimensions.height * 0.2;
  const innerWidth = Math.max(1, dimensions.width - left - right);
  const innerHeight = Math.max(1, dimensions.height - top - bottom);
  const domainMin = Math.min(0, ...items.map((item) => item.value));
  const domainMax = Math.max(0, ...items.map((item) => item.value));
  const domainRange = Math.max(1, domainMax - domainMin);
  const valueToY = (value: number) => top + (domainMax === domainMin ? 1 : (domainMax - value) / domainRange) * innerHeight;
  const baseline = valueToY(0);
  const slotWidth = innerWidth / Math.max(1, items.length);
  const barWidth = Math.max(1, slotWidth * 0.54);
  const baseFontSize = Math.min(dimensions.width, dimensions.height) * 0.04;
  const fontSize = Math.max(8, Math.min(baseFontSize, slotWidth * 0.72));

  return <svg role="img" aria-label="纵向条形图" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={svgStyle}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {Array.from({length: 4}, (_, index) => {
      const y = top + (innerHeight * index) / 3;
      return <line key={`grid-${index}`} x1={left} y1={y} x2={left + innerWidth} y2={y} stroke={secondaryColor} strokeOpacity="0.14" strokeWidth="1" />;
    })}
    {items.map((item, index) => {
      const barProgress = getStaggeredProgress(phase, index, items.length, {endSpread: 0.18});
      const x = left + slotWidth * index + (slotWidth - barWidth) / 2;
      const valueY = valueToY(item.value);
      const animatedValueY = baseline + (valueY - baseline) * barProgress;
      const barTop = Math.min(baseline, animatedValueY);
      const animatedBarHeight = Math.abs(animatedValueY - baseline);
      const labelY = item.value < 0 ? Math.min(dimensions.height - bottom * 0.12, baseline + animatedBarHeight + fontSize) : Math.max(top + fontSize, barTop - 9);
      return <g key={`${item.label}-${index}`}>
        <rect x={x} y={top} width={barWidth} height={innerHeight} rx={barWidth / 2} fill={secondaryColor} fillOpacity="0.08" />
        <rect x={x} y={barTop} width={barWidth} height={Math.max(0, animatedBarHeight)} rx={barWidth / 2} fill={item.color ?? color} />
        <text x={x + barWidth / 2} y={labelY} textAnchor="middle" style={{...chartText(fontSize, '#303133'), fontWeight: 750}}>{Math.round(item.value)}</text>
        <text x={x + barWidth / 2} y={top + innerHeight + bottom * 0.42} textAnchor="middle" style={chartText(fontSize * 0.9, '#606266')}>{item.label}</text>
      </g>;
    })}
  </svg>;
};

export type NumberCounterProps = Omit<ChartProps, 'data'> & {
  /** Starting number. */
  from?: number;
  /** Ending number. */
  to?: number;
  /** Number of decimal places. */
  decimals?: number;
  /** Prefix placed before the number. */
  prefix?: string;
  /** Suffix placed after the number. */
  suffix?: string;
  /** Small label shown below the number. */
  label?: string;
};

/** A smoothly animated number counter for metrics and data-led titles. */
export const NumberCounter = ({
  width = 640,
  height = 200,
  color = '#409eff',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#f7fbff',
  durationInSeconds = 4,
  speed = 1,
  progress,
  from = 0,
  to = 128,
  decimals = 0,
  prefix = '',
  suffix = '',
  label = '累计完成',
}: NumberCounterProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getProgress(frame, fps, durationInSeconds, speed, progress);
  const safeFrom = Number.isFinite(from) ? from : 0;
  const safeTo = Number.isFinite(to) ? to : safeFrom;
  const safeDecimals = Number.isFinite(decimals) ? Math.max(0, Math.min(6, Math.floor(decimals))) : 0;
  const value = interpolate(phase, [0, 1], [safeFrom, safeTo], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const numberSize = Math.max(28, Math.min(dimensions.width * 0.18, dimensions.height * 0.5));
  const formatted = `${prefix}${value.toFixed(safeDecimals)}${suffix}`;

  return <div role="img" aria-label={`${label}${formatted}`} style={{alignItems: 'center', backgroundColor, color: '#303133', display: 'flex', flexDirection: 'column', height: dimensions.height, justifyContent: 'center', overflow: 'hidden', position: 'relative', width: dimensions.width, fontFamily: 'system-ui, sans-serif'}}>
    <div style={{color, fontSize: numberSize, fontVariantNumeric: 'tabular-nums', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1}}>{formatted}</div>
    <div style={{color: secondaryColor, fontSize: Math.max(11, numberSize * 0.18), fontWeight: 700, letterSpacing: '0.12em', marginTop: Math.max(10, numberSize * 0.12)}}>{label}</div>
    <div style={{background: secondaryColor, borderRadius: 999, bottom: Math.max(18, dimensions.height * 0.13), height: Math.max(3, dimensions.height * 0.018), opacity: 0.18, overflow: 'hidden', position: 'absolute', width: '54%'}}><div style={{background: color, borderRadius: 999, height: '100%', transform: `scaleX(${phase})`, transformOrigin: 'left center', width: '100%'}} /></div>
  </div>;
};
