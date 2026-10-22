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

  it('treats an explicit empty data array as an empty state', () => {
    const emptyCharts = [
      renderToStaticMarkup(<HorizontalBarChart data={[]} progress={1} />),
      renderToStaticMarkup(<LineChart data={[]} progress={1} />),
      renderToStaticMarkup(<PieChart data={[]} progress={1} />),
      renderToStaticMarkup(<VerticalBarChart data={[]} progress={1} />),
    ];

    for (const markup of emptyCharts) {
      expect(markup).toContain('暂无数据');
      expect(markup).not.toContain('设计');
      expect(markup).not.toContain('一月');
      expect(markup).not.toContain('产品');
      expect(markup).not.toContain('北');
    }
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

  it('uses the complete positive total for fractional pie weights', () => {
    const fractional = renderToStaticMarkup(<PieChart data={[{label: 'A', value: 0.2}, {label: 'B', value: 0.3}]} progress={1} />);
    const single = renderToStaticMarkup(<PieChart data={[{label: 'A', value: 0.5}]} progress={1} />);

    expect(fractional).toContain('>A 40%</text>');
    expect(fractional).toContain('>B 60%</text>');
    expect(fractional).not.toContain('暂无有效占比数据');
    expect(single).toContain('data-pie-full="true"');
    expect(single).toContain('>A 100%</text>');
  });

  it('does not render zero-weight pie slice paths', () => {
    const full = renderToStaticMarkup(<PieChart data={[{label: 'A', value: 100}, {label: 'B', value: 0}]} progress={1} />);
    const split = renderToStaticMarkup(<PieChart data={[{label: 'A', value: 50}, {label: 'B', value: 0}, {label: 'C', value: 50}]} progress={1} />);

    expect((full.match(/<path\b/g) ?? []).length).toBe(0);
    expect((full.match(/data-pie-full="true"/g) ?? []).length).toBe(1);
    expect(full).toContain('B: 0%');
    expect((split.match(/<path\b/g) ?? []).length).toBe(2);
    expect(split).toContain('B: 0%');
  });

  it('uses unique gradient IDs for multiple line charts', () => {
    const markup = renderToStaticMarkup(<><LineChart color="#f00" /><LineChart color="#00f" /></>);
    const ids = [...markup.matchAll(/id="(line-chart-area-[^"]+)"/g)].map((match) => match[1]);

    expect(new Set(ids).size).toBe(2);
    expect(ids.every((id) => markup.includes(`url(#${id})`))).toBe(true);
  });

  it('uses varied colors for the default pie and vertical bar charts', () => {
    const pie = renderToStaticMarkup(<PieChart progress={1} />);
    const vertical = renderToStaticMarkup(<VerticalBarChart progress={1} />);
    const palette = ['#409eff', '#67c23a', '#e6a23c', '#8b5cf6'];

    for (const color of palette) {
      expect(pie).toContain(`fill="${color}"`);
      expect(vertical).toContain(`fill="${color}"`);
    }
  });

  it('normalizes staggered timing and keeps dense bars inside the canvas', () => {
    const makeData = (count: number) => Array.from({length: count}, (_, index) => ({label: `项${index}`, value: index + 1}));

    expect(() => renderToStaticMarkup(<HorizontalBarChart width={640} height={260} data={makeData(21)} progress={1} />)).not.toThrow();
    expect(() => renderToStaticMarkup(<LineChart width={640} height={260} data={makeData(26)} progress={1} />)).not.toThrow();
    expect(() => renderToStaticMarkup(<VerticalBarChart width={640} height={260} data={makeData(30)} progress={1} />)).not.toThrow();
    expect(() => renderToStaticMarkup(<PieChart width={640} height={260} data={makeData(51)} progress={1} />)).not.toThrow();

    const horizontal = renderToStaticMarkup(<HorizontalBarChart width={640} height={260} data={makeData(20)} progress={1} />);
    const rectTags = [...horizontal.matchAll(/<rect\b[^>]*>/g)].map((match) => match[0]);
    for (const rect of rectTags) {
      const y = Number(rect.match(/\sy="([^"]+)"/)?.[1]);
      const rectHeight = Number(rect.match(/\sheight="([^"]+)"/)?.[1]);
      if (Number.isFinite(y) && Number.isFinite(rectHeight)) {
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y + rectHeight).toBeLessThanOrEqual(260.000001);
      }
    }

    const horizontalLabels = horizontal.match(/>项\d+<\/text>/g) ?? [];
    const vertical = renderToStaticMarkup(<VerticalBarChart width={640} height={260} data={makeData(30)} progress={1} />);
    const verticalLabels = vertical.match(/>项\d+<\/text>/g) ?? [];
    expect(horizontalLabels.length).toBeGreaterThan(0);
    expect(horizontalLabels.length).toBeLessThan(20);
    expect(verticalLabels.length).toBeGreaterThan(0);
    expect(verticalLabels.length).toBeLessThan(30);
  });

  it('samples dense line and pie labels while retaining every item title', () => {
    const makeData = (count: number) => Array.from({length: count}, (_, index) => ({label: `项${index}`, value: index + 1}));
    const line = renderToStaticMarkup(<LineChart width={640} height={260} data={makeData(26)} progress={1} />);
    const pie = renderToStaticMarkup(<PieChart width={640} height={260} data={makeData(51)} progress={1} />);

    expect((line.match(/>项\d+<\/text>/g) ?? []).length).toBeLessThan(26);
    expect((pie.match(/>项\d+ \d+%<\/text>/g) ?? []).length).toBeLessThan(51);
    expect((line.match(/<title>/g) ?? []).length).toBe(26);
    expect((pie.match(/<title>/g) ?? []).length).toBe(51);
  });

  it('keeps the label for the only positive pie slice', () => {
    const data = Array.from({length: 10}, (_, index) => ({label: `项${index}`, value: index === 1 ? 100 : 0}));
    const markup = renderToStaticMarkup(<PieChart data={data} progress={1} />);

    expect(markup).toContain('>项1 100%</text>');
  });

  it('shows an empty state when pie weights are all zero or negative', () => {
    const zero = renderToStaticMarkup(<PieChart data={[{label: 'A', value: 0}, {label: 'B', value: 0}, {label: 'C', value: 0}]} progress={1} />);
    const negative = renderToStaticMarkup(<PieChart data={[{label: 'A', value: -10}, {label: 'B', value: -4}]} progress={1} />);

    expect(zero).toContain('暂无有效占比数据');
    expect(negative).toContain('暂无有效占比数据');
    expect(zero).not.toMatch(/>0%<\/text>/);
    expect(negative).not.toMatch(/>0%<\/text>/);
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
