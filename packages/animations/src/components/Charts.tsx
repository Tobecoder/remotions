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

const palette = ['#409eff', '#67c23a', '#e6a23c', '#8b5cf6', '#f56c6c', '#13c2c2'];

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
  return source.slice(0, 8).map((item, index) => ({
    label: String(item.label ?? '').slice(0, 24),
    value: Number.isFinite(item.value) ? Math.max(0, item.value) : 0,
    color: item.color ?? palette[index % palette.length],
  }));
};

const svgStyle = {display: 'block', maxWidth: '100%'} as const;

const defaultData: readonly ChartDatum[] = [
  {label: '设计', value: 68},
  {label: '工程', value: 84},
  {label: '内容', value: 52},
  {label: '增长', value: 92},
];

const chartText = (size: number, color = '#303133') => ({
  fill: color,
  fontFamily: 'system-ui, sans-serif',
  fontSize: Math.max(8, size),
});

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
  const rowHeight = Math.max(18, (dimensions.height - top - bottom) / Math.max(1, items.length));
  const maxValue = Math.max(1, ...items.map((item) => item.value));
  const fontSize = Math.max(10, Math.min(dimensions.width, dimensions.height) * 0.045);

  return <svg role="img" aria-label="横向条形图" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={svgStyle}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {Array.from({length: 5}, (_, index) => {
      const x = left + (chartWidth * index) / 4;
      return <g key={`tick-${index}`}>
        <line x1={x} y1={top - 8} x2={x} y2={dimensions.height - bottom} stroke={secondaryColor} strokeOpacity="0.13" strokeWidth="1" />
        <text x={x} y={top - 16} textAnchor="middle" style={chartText(fontSize * 0.72, '#909399')}>{Math.round((maxValue * index) / 4)}</text>
      </g>;
    })}
    {items.map((item, index) => {
      const rowY = top + index * rowHeight;
      const barHeight = Math.max(8, rowHeight * 0.48);
      const rowProgress = interpolate(phase, [index * 0.08, 0.58 + index * 0.05], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      const barWidth = (item.value / maxValue) * chartWidth * rowProgress;
      return <g key={`${item.label}-${index}`}>
        <text x={left - 12} y={rowY + barHeight * 0.82} textAnchor="end" style={{...chartText(fontSize, '#606266'), fontWeight: 650}}>{item.label}</text>
        <rect x={left} y={rowY} width={chartWidth} height={barHeight} rx={barHeight / 2} fill={secondaryColor} fillOpacity="0.1" />
        <rect x={left} y={rowY} width={Math.max(0, barWidth)} height={barHeight} rx={barHeight / 2} fill={item.color ?? color} />
        <text x={left + chartWidth + 8} y={rowY + barHeight * 0.82} style={{...chartText(fontSize, '#303133'), fontWeight: 750}}>{Math.round(item.value)}</text>
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
  const minValue = Math.min(...items.map((item) => item.value), 0);
  const maxValue = Math.max(1, ...items.map((item) => item.value));
  const range = Math.max(1, maxValue - minValue);
  const points = items.map((item, index) => ({
    x: items.length === 1 ? left + innerWidth / 2 : left + (innerWidth * index) / (items.length - 1),
    y: top + innerHeight * (1 - (item.value - minValue) / range),
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const baseline = top + innerHeight;
  const areaPath = `${path} L ${points[points.length - 1]?.x ?? left} ${baseline} L ${points[0]?.x ?? left} ${baseline} Z`;
  const fontSize = Math.max(10, Math.min(dimensions.width, dimensions.height) * 0.04);

  return <svg role="img" aria-label="趋势折线图" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={svgStyle}>
    <defs>
      <linearGradient id="line-chart-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.26" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {Array.from({length: 4}, (_, index) => {
      const y = top + (innerHeight * index) / 3;
      return <line key={`grid-${index}`} x1={left} y1={y} x2={left + innerWidth} y2={y} stroke={secondaryColor} strokeOpacity="0.14" strokeWidth="1" />;
    })}
    <path d={areaPath} fill="url(#line-chart-area)" opacity={phase} />
    <path d={path} fill="none" stroke={color} strokeWidth={Math.max(2, dimensions.height * 0.014)} strokeLinecap="round" strokeLinejoin="round" pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset={1000 * (1 - phase)} />
    {items.map((item, index) => {
      const point = points[index];
      const pointPhase = interpolate(phase, [index * 0.08, 0.5 + index * 0.06], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
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
    {label: '产品', value: 42},
    {label: '研发', value: 28},
    {label: '内容', value: 18},
    {label: '其他', value: 12},
  ]);
  const phase = getProgress(frame, fps, durationInSeconds, speed, progress);
  const centerX = dimensions.width * 0.42;
  const centerY = dimensions.height * 0.52;
  const radius = Math.max(20, Math.min(dimensions.width, dimensions.height) * 0.29);
  const innerRadius = radius * 0.55;
  const total = Math.max(1, items.reduce((sum, item) => sum + item.value, 0));
  const fontSize = Math.max(10, Math.min(dimensions.width, dimensions.height) * 0.04);
  let angle = -Math.PI / 2;

  return <svg role="img" aria-label="占比饼图" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={svgStyle}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {items.map((item, index) => {
      const slice = (item.value / total) * Math.PI * 2;
      const startAngle = angle;
      angle += slice;
      const midAngle = startAngle + slice / 2;
      const animatedEnd = startAngle + slice * phase;
      const labelRadius = radius + Math.max(18, dimensions.width * 0.055);
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      const labelOpacity = interpolate(phase, [0.25 + index * 0.05, 0.75 + index * 0.04], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      return <g key={`${item.label}-${index}`}>
        <path d={arcPath(centerX, centerY, radius, startAngle, animatedEnd)} fill={item.color ?? color} stroke={backgroundColor} strokeWidth={Math.max(2, dimensions.height * 0.008)} />
        <text x={labelX} y={labelY} textAnchor={labelX < centerX ? 'end' : 'start'} dominantBaseline="middle" opacity={labelOpacity} style={{...chartText(fontSize, '#606266'), fontWeight: 650}}>{item.label} {Math.round((item.value / total) * 100)}%</text>
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
    {label: '北', value: 34},
    {label: '中', value: 58},
    {label: '南', value: 88},
    {label: '西', value: 72},
  ]);
  const phase = getProgress(frame, fps, durationInSeconds, speed, progress);
  const left = dimensions.width * 0.1;
  const right = dimensions.width * 0.07;
  const top = dimensions.height * 0.14;
  const bottom = dimensions.height * 0.2;
  const innerWidth = Math.max(1, dimensions.width - left - right);
  const innerHeight = Math.max(1, dimensions.height - top - bottom);
  const baseline = top + innerHeight;
  const maxValue = Math.max(1, ...items.map((item) => item.value));
  const slotWidth = innerWidth / Math.max(1, items.length);
  const barWidth = Math.max(6, slotWidth * 0.54);
  const fontSize = Math.max(10, Math.min(dimensions.width, dimensions.height) * 0.04);

  return <svg role="img" aria-label="纵向条形图" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={svgStyle}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {Array.from({length: 4}, (_, index) => {
      const y = top + (innerHeight * index) / 3;
      return <line key={`grid-${index}`} x1={left} y1={y} x2={left + innerWidth} y2={y} stroke={secondaryColor} strokeOpacity="0.14" strokeWidth="1" />;
    })}
    {items.map((item, index) => {
      const barProgress = interpolate(phase, [index * 0.08, 0.58 + index * 0.06], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      const barHeight = (item.value / maxValue) * innerHeight * barProgress;
      const x = left + slotWidth * index + (slotWidth - barWidth) / 2;
      return <g key={`${item.label}-${index}`}>
        <rect x={x} y={baseline - innerHeight} width={barWidth} height={innerHeight} rx={barWidth / 2} fill={secondaryColor} fillOpacity="0.08" />
        <rect x={x} y={baseline - barHeight} width={barWidth} height={Math.max(0, barHeight)} rx={barWidth / 2} fill={item.color ?? color} />
        <text x={x + barWidth / 2} y={Math.max(top + fontSize, baseline - barHeight - 9)} textAnchor="middle" style={{...chartText(fontSize, '#303133'), fontWeight: 750}}>{Math.round(item.value)}</text>
        <text x={x + barWidth / 2} y={baseline + bottom * 0.42} textAnchor="middle" style={chartText(fontSize * 0.9, '#606266')}>{item.label}</text>
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
