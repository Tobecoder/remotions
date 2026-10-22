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

  it('preserves signed and long data while honoring the component color', () => {
    const data = Array.from({length: 9}, (_, index) => ({
      label: index === 0 ? '负值' : `项${index}`,
      value: index === 0 ? -10 : index * 10,
    }));
    const markup = renderToStaticMarkup(<HorizontalBarChart width={640} height={360} data={data} color="#ff0000" progress={1} />);

    expect(markup).toContain('>负值</text>');
    expect(markup).toContain('>-10</text>');
    expect(markup).toContain('>项8</text>');
    expect(markup).toContain('fill="#ff0000"');
  });

  it('renders a complete circle for a single 100 percent pie slice', () => {
    const markup = renderToStaticMarkup(<PieChart data={[{label: '全部', value: 100}]} progress={1} />);

    expect(markup).toContain('data-pie-full="true"');
    expect(markup).toContain('>全部 100%</text>');
  });

  it('uses unique gradient IDs for multiple line charts', () => {
    const markup = renderToStaticMarkup(<><LineChart color="#f00" /><LineChart color="#00f" /></>);
    const ids = [...markup.matchAll(/id="(line-chart-area-[^"]+)"/g)].map((match) => match[1]);

    expect(new Set(ids).size).toBe(2);
    expect(ids.every((id) => markup.includes(`url(#${id})`))).toBe(true);
  });

  it('keeps signed vertical bars finite', () => {
    const markup = renderToStaticMarkup(<VerticalBarChart width={320} height={220} data={[{label: '负', value: -20}, {label: '正', value: 40}]} progress={1} />);

    expect(markup).not.toMatch(/NaN|Infinity/);
    expect(markup).toContain('>-20</text>');
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
