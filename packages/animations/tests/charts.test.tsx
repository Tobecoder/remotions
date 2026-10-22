import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {HorizontalBarChart, LineChart, NumberCounter, PieChart, VerticalBarChart} from '../src';

const clock = vi.hoisted(() => ({frame: 0}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: 30}),
}));

const charts = [
  ['HorizontalBarChart', <HorizontalBarChart width={640} height={260} />],
  ['LineChart', <LineChart width={640} height={260} />],
  ['NumberCounter', <NumberCounter width={640} height={200} />],
  ['PieChart', <PieChart width={640} height={260} />],
  ['VerticalBarChart', <VerticalBarChart width={640} height={260} />],
] as const;

describe('data chart components', () => {
  it.each(charts)('%s is frame-driven and emits finite markup', (_, component) => {
    clock.frame = 0;
    const first = renderToStaticMarkup(component);
    clock.frame = 45;
    const later = renderToStaticMarkup(component);

    expect(first).toContain('role="img"');
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(later).not.toBe(first);
  });

  it('supports controlled progress and custom labels', () => {
    const data = [
      {label: '一', value: 10},
      {label: '~', value: 20},
    ];
    const start = renderToStaticMarkup(<HorizontalBarChart width={320} height={180} data={data} progress={0} />);
    const end = renderToStaticMarkup(<HorizontalBarChart width={320} height={180} data={data} progress={1} />);
    expect(start).toContain('>一</text>');
    expect(start).toContain('>~</text>');
    expect(start).not.toBe(end);
  });

  it('keeps invalid dimensions and values finite', () => {
    const markup = renderToStaticMarkup(<PieChart width={Number.NaN} height={Number.POSITIVE_INFINITY} data={[{label: '坏数据', value: Number.NaN}]} />);
    expect(markup).not.toMatch(/NaN|Infinity/);
    expect(markup).toContain('width="1"');
    expect(markup).toContain('height="1"');
  });

  it('counts to the requested number at the controlled end frame', () => {
    const markup = renderToStaticMarkup(<NumberCounter from={12} to={128} suffix="%" progress={1} />);
    expect(markup).toContain('128%');
    expect(markup).toContain('累计完成');
  });
});
