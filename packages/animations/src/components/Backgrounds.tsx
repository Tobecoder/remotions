import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

import {useEffect, useRef} from 'react';

export type BackgroundProps = {
  /** Canvas width in pixels. */
  width?: number;
  /** Canvas height in pixels. */
  height?: number;
  /** Primary pattern color. */
  color?: string;
  /** Optional secondary pattern color. Defaults to the primary color. */
  secondaryColor?: string;
  /** Base color behind the animated pattern. */
  backgroundColor?: string;
  /** Animation speed multiplier. */
  speed?: number;
};

const getDimensions = (width: number, height: number) => ({
  width: Number.isFinite(width) ? Math.max(1, width) : 1,
  height: Number.isFinite(height) ? Math.max(1, height) : 1,
});

const getPhase = (frame: number, fps: number, speed: number) => interpolate(
  frame,
  [0, fps * 8],
  [0, Math.PI * 2 * speed],
  {extrapolateLeft: 'extend', extrapolateRight: 'extend'},
);

const fract = (value: number) => value - Math.floor(value);

const wrap = (value: number, period: number) => {
  if (!Number.isFinite(period) || period <= 0) return 0;
  const remainder = value % period;
  return remainder < 0 ? remainder + period : remainder;
};

const getBandScroll = (phase: number) => {
  const rawRows = phase / Math.PI;
  const wholeRows = Math.trunc(rawRows);
  return {
    wholeRows,
    fraction: rawRows - wholeRows,
  };
};

type Point = readonly [number, number];

const midpoint = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/** Build a closed, smooth SVG path from an organic set of points. */
const getSmoothClosedPath = (points: readonly Point[]) => {
  const first = midpoint(points[points.length - 1], points[0]);
  const commands = [`M ${first[0].toFixed(2)},${first[1].toFixed(2)}`];
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    const next = midpoint(point, points[(index + 1) % points.length]);
    commands.push(`Q ${point[0].toFixed(2)},${point[1].toFixed(2)} ${next[0].toFixed(2)},${next[1].toFixed(2)}`);
  }
  return `${commands.join(' ')} Z`;
};

const getOrganicContourPath = (
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  level: number,
  phase: number,
  seed: number,
) => {
  const points = 40;
  const inset = level * 0.085;
  const contour: Point[] = Array.from({length: points}, (_, index) => {
    const angle = (index / points) * Math.PI * 2;
    const low = Math.sin(angle * 2.1 + seed * 1.7 + phase * 0.34) * 0.1;
    const medium = Math.cos(angle * 3.4 - seed * 0.9 - phase * 0.2) * 0.06;
    const fine = Math.sin(angle * 5.2 + seed * 2.3 + phase * 0.11) * 0.025;
    const warp = 1 + low + medium + fine;
    const x = centerX + Math.cos(angle) * radiusX * (1 - inset) * warp
      + Math.sin(angle * 1.4 + seed + phase * 0.2) * width * 0.018;
    const y = centerY + Math.sin(angle) * radiusY * (1 - inset) * warp
      + Math.cos(angle * 1.7 - seed - phase * 0.16) * height * 0.015;
    return [x, y];
  });
  return getSmoothClosedPath(contour);
};

const getWaveBandPath = (
  width: number,
  baseline: number,
  amplitude: number,
  thickness: number,
  phase: number,
  cycles: number,
) => {
  const points = 44;
  const top = Array.from({length: points + 1}, (_, index) => {
    const progress = index / points;
    const x = -width * 0.08 + progress * width * 1.16;
    const y = baseline + Math.sin(progress * Math.PI * 2 * cycles + phase) * amplitude;
    return [x, y] as const;
  });
  const bottom = [...top].reverse().map(([x, y], index) => [x, y + thickness + Math.sin(index * 0.45 + phase) * amplitude * 0.08] as const);
  return `M ${[...top, ...bottom].map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L ')} Z`;
};

const getZigzagBandPath = (
  width: number,
  baseline: number,
  amplitude: number,
  thickness: number,
  phase: number,
  cycles: number,
) => {
  const points = Math.max(5, cycles * 2 + 1);
  const top = Array.from({length: points}, (_, index) => {
    const progress = index / (points - 1);
    const x = -width * 0.1 + progress * width * 1.2;
    const corner = index % 2 === 0 ? -amplitude : amplitude;
    const breathing = Math.sin(progress * Math.PI * 2 * 1.4 + phase) * amplitude * 0.14;
    return [x, baseline + corner + breathing] as const;
  });
  const bottom = [...top].reverse().map(([x, y], index) => [x, y + thickness + Math.sin(index * 0.7 + phase) * amplitude * 0.08] as const);
  return `M ${[...top, ...bottom].map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L ')} Z`;
};

// The reference element uses a procedural contour field instead of a handful
// of hand-drawn ribbons. Keeping the shader local makes the component usable
// without requiring the full @remotion/effects package in consumer projects.
const LIQUID_VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
in vec2 aUv;
out vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const LIQUID_FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform vec2 uResolution;
uniform vec4 uFirstColor;
uniform vec4 uSecondColor;
uniform float uSpacing;
uniform float uScale;
uniform float uComplexity;
uniform float uSeed;
uniform vec2 uOffset;
uniform float uPhase;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33 + uSeed * 0.013);
  return fract((p3.x + p3.y) * p3.z);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float total = 0.0;
  float persistence = mix(0.2, 0.58, uComplexity);
  mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    value += amplitude * valueNoise(p);
    total += amplitude;
    p = rotation * p * 2.03 + vec2(13.17, 7.31);
    amplitude *= persistence;
  }
  return value / total;
}

void main() {
  vec2 position = vUv * uResolution + uOffset;
  vec2 p = position / max(uScale, 0.001) + vec2(uSeed * 0.137, uSeed * 0.193);
  vec2 warp = vec2(fbm(p + vec2(5.2, 1.3)), fbm(p + vec2(1.7, 9.2))) - 0.5;
  mat2 roundRotation = mat2(0.7071, 0.7071, -0.7071, 0.7071);
  float roundedField = mix(valueNoise(p * 0.9), valueNoise(roundRotation * p * 0.78 + vec2(8.3, 2.7)), 0.45);
  float detailedField = fbm(p + warp * mix(0.35, 1.8, uComplexity));
  float field = mix(roundedField, detailedField, smoothstep(0.0, 1.0, uComplexity));
  float levels = max(max(uResolution.x, uResolution.y) / max(uSpacing, 0.001), 1.0);
  float wave = sin((field * levels + uPhase) * 6.28318530718);
  float edgeWidth = fwidth(wave) * 0.7;
  float selector = smoothstep(-edgeWidth, edgeWidth, wave);
  vec4 color = mix(uFirstColor, uSecondColor, selector);
  fragColor = vec4(color.rgb * color.a, color.a);
}`;

type LiquidShaderState = {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  position: number;
  uv: number;
  resolution: WebGLUniformLocation | null;
  firstColor: WebGLUniformLocation | null;
  secondColor: WebGLUniformLocation | null;
  spacing: WebGLUniformLocation | null;
  scale: WebGLUniformLocation | null;
  complexity: WebGLUniformLocation | null;
  seed: WebGLUniformLocation | null;
  offset: WebGLUniformLocation | null;
  phase: WebGLUniformLocation | null;
};

const compileLiquidShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create liquid contour shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message ?? 'Failed to compile liquid contour shader');
  }
  return shader;
};

const createLiquidShaderState = (canvas: HTMLCanvasElement): LiquidShaderState | null => {
  const gl = canvas.getContext('webgl2', {alpha: true, antialias: false, preserveDrawingBuffer: true});
  if (!gl) return null;
  const vertex = compileLiquidShader(gl, gl.VERTEX_SHADER, LIQUID_VERTEX_SHADER);
  const fragment = compileLiquidShader(gl, gl.FRAGMENT_SHADER, LIQUID_FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    throw new Error(gl.getProgramInfoLog(program) ?? 'Failed to link liquid contour shader');
  }
  const buffer = gl.createBuffer();
  if (!buffer) throw new Error('Failed to create liquid contour buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  const uv = gl.getAttribLocation(program, 'aUv');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(uv);
  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 16, 8);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return {
    gl,
    program,
    buffer,
    position,
    uv,
    resolution: gl.getUniformLocation(program, 'uResolution'),
    firstColor: gl.getUniformLocation(program, 'uFirstColor'),
    secondColor: gl.getUniformLocation(program, 'uSecondColor'),
    spacing: gl.getUniformLocation(program, 'uSpacing'),
    scale: gl.getUniformLocation(program, 'uScale'),
    complexity: gl.getUniformLocation(program, 'uComplexity'),
    seed: gl.getUniformLocation(program, 'uSeed'),
    offset: gl.getUniformLocation(program, 'uOffset'),
    phase: gl.getUniformLocation(program, 'uPhase'),
  };
};

type ParsedColor = [number, number, number, number];

const clampColor = (value: number) => Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;

const parseColorChannel = (value: string) => {
  const normalized = value.trim();
  if (normalized.endsWith('%')) {
    return clampColor(Number.parseFloat(normalized.slice(0, -1)) / 100);
  }
  return clampColor(Number.parseFloat(normalized) / 255);
};

const parseAlpha = (value: string | undefined) => {
  if (!value) return 1;
  const normalized = value.trim();
  if (normalized.endsWith('%')) {
    return clampColor(Number.parseFloat(normalized.slice(0, -1)) / 100);
  }
  return clampColor(Number.parseFloat(normalized));
};

const NAMED_COLORS: Record<string, string> = {
  black: '#000000',
  blue: '#0000ff',
  brown: '#a52a2a',
  cyan: '#00ffff',
  gray: '#808080',
  green: '#008000',
  grey: '#808080',
  magenta: '#ff00ff',
  orange: '#ffa500',
  pink: '#ffc0cb',
  purple: '#800080',
  red: '#ff0000',
  rebeccapurple: '#663399',
  transparent: '#00000000',
  white: '#ffffff',
  yellow: '#ffff00',
};

let cssColorContext: CanvasRenderingContext2D | null | undefined;

const getCssColorContext = () => {
  if (cssColorContext !== undefined) return cssColorContext;
  if (typeof document === 'undefined') {
    cssColorContext = null;
    return cssColorContext;
  }
  cssColorContext = document.createElement('canvas').getContext('2d');
  return cssColorContext;
};

const parseColorValue = (value: string, allowBrowserParser: boolean): ParsedColor | null => {
  const normalized = value.trim().toLowerCase();
  const named = NAMED_COLORS[normalized];
  if (named) return parseColorValue(named, false);

  const hexMatch = normalized.match(/^#([\da-f]{3,8})$/i);
  if (hexMatch) {
    const raw = hexMatch[1];
    const expanded = raw.length === 3 || raw.length === 4
      ? raw.split('').map((part) => `${part}${part}`).join('')
      : raw;
    if (expanded.length !== 6 && expanded.length !== 8) return null;
    const red = Number.parseInt(expanded.slice(0, 2), 16);
    const green = Number.parseInt(expanded.slice(2, 4), 16);
    const blue = Number.parseInt(expanded.slice(4, 6), 16);
    const alpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;
    return [red / 255, green / 255, blue / 255, alpha];
  }

  const functionMatch = normalized.match(/^rgba?\((.*)\)$/);
  if (functionMatch) {
    const body = functionMatch[1].trim();
    const parts = body.includes(',')
      ? body.split(',').map((part) => part.trim())
      : body.split(/[\s/]+/).filter(Boolean);
    if (parts.length >= 3) {
      return [
        parseColorChannel(parts[0]),
        parseColorChannel(parts[1]),
        parseColorChannel(parts[2]),
        parseAlpha(parts[3]),
      ];
    }
  }

  if (allowBrowserParser) {
    const context = getCssColorContext();
    if (context) {
      context.fillStyle = '#000000';
      context.fillStyle = normalized;
      const serialized = context.fillStyle;
      if (serialized !== '#000000' || normalized === 'black') {
        return parseColorValue(serialized, false);
      }
    }
  }
  return null;
};

export const parseColor = (value: string): ParsedColor => parseColorValue(value, true) ?? [0, 0, 0, 1];

const drawLiquidContours = (state: LiquidShaderState, width: number, height: number, phase: number, color: string, secondColor: string) => {
  const {gl} = state;
  gl.viewport(0, 0, width, height);
  gl.useProgram(state.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, state.buffer);
  gl.enableVertexAttribArray(state.position);
  gl.vertexAttribPointer(state.position, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(state.uv);
  gl.vertexAttribPointer(state.uv, 2, gl.FLOAT, false, 16, 8);
  if (state.resolution) gl.uniform2f(state.resolution, width, height);
  if (state.firstColor) gl.uniform4f(state.firstColor, ...parseColor(color));
  if (state.secondColor) gl.uniform4f(state.secondColor, ...parseColor(secondColor));
  if (state.spacing) gl.uniform1f(state.spacing, Math.max(18, height * 0.18));
  if (state.scale) gl.uniform1f(state.scale, Math.max(100, Math.min(width, height) * 0.9));
  if (state.complexity) gl.uniform1f(state.complexity, 0.35);
  if (state.seed) gl.uniform1f(state.seed, 4);
  if (state.offset) gl.uniform2f(state.offset, phase * 10, phase * 6);
  if (state.phase) gl.uniform1f(state.phase, 3.23 + phase * 0.28);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.useProgram(null);
};

/** A flowing two-color background made from animated liquid contour bands. */
export const LiquidContours = ({
  width = 1920,
  height = 1080,
  color = '#70b7e8',
  secondaryColor = color,
  backgroundColor = '#dff0ff',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, speed);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderRef = useRef<LiquidShaderState | null>(null);
  const secondColor = secondaryColor === color ? backgroundColor : secondaryColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let shader: LiquidShaderState | null = null;
    try {
      shader = createLiquidShaderState(canvas);
    } catch {
      shader = null;
    }
    shaderRef.current = shader;
    return () => {
      if (!shader) return;
      shader.gl.deleteBuffer(shader.buffer);
      shader.gl.deleteProgram(shader.program);
      if (shaderRef.current === shader) shaderRef.current = null;
    };
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    if (shaderRef.current) {
      drawLiquidContours(shaderRef.current, dimensions.width, dimensions.height, phase, color, secondColor);
    }
  }, [color, dimensions.height, dimensions.width, phase, secondColor]);

  const clusters = [
    [dimensions.width * 0.19, dimensions.height * 0.35, dimensions.width * 0.35, dimensions.height * 0.72, 1],
    [dimensions.width * 0.78, dimensions.height * 0.28, dimensions.width * 0.42, dimensions.height * 0.7, 4],
    [dimensions.width * 0.49, dimensions.height * 0.83, dimensions.width * 0.48, dimensions.height * 0.55, 8],
  ] as const;
  return <div style={{position: 'relative', width: dimensions.width, height: dimensions.height, maxWidth: '100%', overflow: 'hidden', backgroundColor}}>
    <svg aria-hidden="true" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%'}}>
      <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
      <g>
        {clusters.flatMap(([centerX, centerY, radiusX, radiusY, seed]) => Array.from({length: 7}, (_, level) => {
          const driftX = Math.sin(phase * 0.42 + seed) * dimensions.width * 0.035;
          const driftY = Math.cos(phase * 0.34 + seed) * dimensions.height * 0.028;
          return <path
            key={`${seed}-${level}`}
            d={getOrganicContourPath(dimensions.width, dimensions.height, centerX + driftX, centerY + driftY, radiusX, radiusY, level, phase, seed)}
            fill={level % 2 === 0 ? color : backgroundColor}
            opacity={level % 2 === 0 ? 0.98 : 1}
          />;
        }))}
      </g>
    </svg>
    <canvas ref={canvasRef} role="img" aria-label="流动液态轮廓背景" width={dimensions.width} height={dimensions.height} data-frame={frame} style={{position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%'}} />
  </div>;
};

/** A seamless, dense wave background that flows upward across the frame. */
export const MovingWaves = ({
  width = 1920,
  height = 1080,
  color = '#70b7e8',
  secondaryColor = color,
  backgroundColor = '#dff0ff',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, speed);
  const spacing = Math.max(18, dimensions.height * 0.105);
  const thickness = Math.max(10, dimensions.height * 0.06);
  const amplitude = spacing * 0.34;
  const {fraction, wholeRows} = getBandScroll(phase);
  const waveCount = Math.ceil(dimensions.height / spacing) + 3;
  return <svg role="img" aria-label="向上流动的波浪背景" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {Array.from({length: waveCount}, (_, index) => {
      const bandIndex = index + wholeRows;
      const baseline = (index - fraction - 1) * spacing;
      return <path
        key={index}
        d={getWaveBandPath(dimensions.width, baseline, amplitude, thickness, phase * 0.22 + bandIndex * 0.18, 5.4)}
        fill={wrap(bandIndex, 4) === 0 ? secondaryColor : color}
        opacity="0.98"
      />;
    })}
  </svg>;
};

/** A seamless zigzag background that drifts upward in repeating bands. */
export const MovingZigzags = ({
  width = 1920,
  height = 1080,
  color = '#70b7e8',
  secondaryColor = color,
  backgroundColor = '#dff0ff',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, speed);
  const spacing = Math.max(24, dimensions.height * 0.12);
  const thickness = Math.max(8, dimensions.height * 0.055);
  const amplitude = spacing * 0.36;
  const {fraction, wholeRows} = getBandScroll(phase);
  const bandCount = Math.ceil(dimensions.height / spacing) + 4;

  return <svg role="img" aria-label="向上流动的折线背景" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    {Array.from({length: bandCount}, (_, index) => {
      const bandIndex = index + wholeRows;
      const baseline = (index - fraction - 1) * spacing;
      return <path
        key={index}
        d={getZigzagBandPath(dimensions.width, baseline, amplitude, thickness, phase * 0.2 + bandIndex * 0.22, 8)}
        fill={wrap(bandIndex, 4) === 0 ? secondaryColor : color}
        opacity="0.94"
      />;
    })}
  </svg>;
};

/** A softly drifting notebook grid for tutorials, notes, and explainer scenes. */
export const NotebookPaper = ({
  width = 1920,
  height = 1080,
  color = '#8db8da',
  secondaryColor = color,
  backgroundColor = '#fbfdff',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, speed);
  const gridSize = Math.max(22, Math.min(48, dimensions.width * 0.045));
  const offsetX = Math.sin(phase * 0.6) * gridSize * 0.08;
  const offsetY = wrap((phase / (Math.PI * 2)) * gridSize, gridSize);
  const columns = Math.ceil(dimensions.width / gridSize) + 3;
  const rows = Math.ceil(dimensions.height / gridSize) + 3;
  const marginX = Math.max(28, dimensions.width * 0.12);

  return <svg role="img" aria-label="笔记网格纸张背景" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g transform={`translate(${offsetX} ${-offsetY})`} stroke={color} strokeWidth="1" opacity="0.22">
      {Array.from({length: columns}, (_, index) => {
        const x = index * gridSize;
        return <line key={`column-${index}`} x1={x} y1="0" x2={x} y2={dimensions.height + gridSize * 2} />;
      })}
      {Array.from({length: rows}, (_, index) => {
        const y = index * gridSize;
        return <line key={`row-${index}`} x1="0" y1={y} x2={dimensions.width} y2={y} />;
      })}
    </g>
    <line x1={marginX} y1="0" x2={marginX} y2={dimensions.height} stroke={secondaryColor} strokeWidth={Math.max(1, dimensions.width * 0.002)} opacity="0.28" />
    <rect x={marginX + 1} y="0" width={Math.max(1, dimensions.width * 0.006)} height={dimensions.height} fill={secondaryColor} opacity="0.035" />
  </svg>;
};

/** A quiet, procedural paper grain with a slowly shifting seed. */
export const PaperTexture = ({
  width = 1920,
  height = 1080,
  color = '#9eb8cf',
  secondaryColor = '#d3b58d',
  backgroundColor = '#fbfaf6',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const phase = getPhase(frame, fps, speed);
  const grainCount = Math.max(36, Math.min(112, Math.round((dimensions.width * dimensions.height) / 5200)));
  const grain = Array.from({length: grainCount}, (_, index) => {
    const seed = index + 1;
    const baseX = fract(Math.sin(seed * 19.13) * 31741.37);
    const baseY = fract(Math.sin(seed * 31.71 + 8.2) * 19281.91);
    const drift = phase * 0.11 + seed * 0.37;
    const x = fract(baseX + Math.sin(drift) * 0.008) * dimensions.width;
    const y = fract(baseY + Math.cos(drift * 0.83) * 0.006) * dimensions.height;
    const length = Math.max(1.5, Math.min(dimensions.width, dimensions.height) * (0.008 + (seed % 4) * 0.003));
    const radius = Math.max(0.8, Math.min(dimensions.width, dimensions.height) * (0.0025 + (seed % 3) * 0.001));
    const opacity = 0.1 + (seed % 5) * 0.022;
    return {index, x, y, length, radius, opacity};
  });

  return <svg role="img" aria-label="纸张纹理背景" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g strokeLinecap="round">
      {grain.map((item) => <line
        key={item.index}
        x1={item.x}
        y1={item.y}
        x2={item.x + item.length}
        y2={item.y + Math.sin(item.index * 0.8 + phase) * item.length * 0.42}
        stroke={item.index % 5 === 0 ? secondaryColor : color}
        strokeWidth={Math.max(0.8, item.length * 0.22)}
        opacity={item.opacity}
      />)}
      {grain.filter((item) => item.index % 2 === 0).map((item) => <circle
        key={`grain-dot-${item.index}`}
        cx={item.x}
        cy={item.y}
        r={item.radius}
        fill={item.index % 5 === 0 ? secondaryColor : color}
        opacity={item.opacity * 0.7}
      />)}
    </g>
    <rect width={dimensions.width} height={dimensions.height} fill={color} opacity="0.018" />
  </svg>;
};

/** A slowly rotating radial starburst for energetic openings and transitions. */
export const RotatingStarburst = ({
  width = 1920,
  height = 1080,
  color = '#70b7e8',
  secondaryColor = color,
  backgroundColor = '#dff0ff',
  speed = 1,
}: BackgroundProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dimensions = getDimensions(width, height);
  const rotation = interpolate(frame, [0, fps * 8], [0, 360 * speed], {extrapolateLeft: 'extend', extrapolateRight: 'extend'});
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.hypot(dimensions.width, dimensions.height) * 1.25;
  const rayCount = 24;
  const rayAngle = (Math.PI * 2) / rayCount;
  const point = (angle: number) => `${centerX + Math.cos(angle) * radius},${centerY + Math.sin(angle) * radius}`;
  return <svg role="img" aria-label="旋转放射星芒背景" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none" style={{display: 'block', maxWidth: '100%'}}>
    <rect width={dimensions.width} height={dimensions.height} fill={backgroundColor} />
    <g transform={`rotate(${rotation} ${centerX} ${centerY})`}>
      {Array.from({length: rayCount / 2}, (_, index) => {
        const angle = index * rayAngle * 2;
        return <path
          key={index}
          d={`M ${centerX},${centerY} L ${point(angle - rayAngle * 0.02)} L ${point(angle + rayAngle * 0.82)} Z`}
          fill={index % 3 === 0 ? secondaryColor : color}
        />;
      })}
    </g>
  </svg>;
};
