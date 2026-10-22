import {describe, expect, it} from 'vitest';
import {clamp01, progressAtFrame, easeOutCubic, numberBetween, formatCount} from '../src/internal/math';

describe('motion math', () => {
  it('clamps progress to [0, 1]', () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(1.7)).toBe(1);
    expect(clamp01(0.6)).toBe(0.6);
  });
  it('honors frame delays and durations', () => {
    expect(progressAtFrame(10, 15, 30)).toBe(0);
    expect(progressAtFrame(30, 15, 30)).toBe(0.5);
    expect(progressAtFrame(80, 15, 30)).toBe(1);
  });
  it('never divides by zero', () => {
    expect(progressAtFrame(1, 0, 0)).toBe(1);
  });
  it('eases endpoints correctly', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
  it('bounds values and formats counters', () => {
    expect(numberBetween(180, 0, 100)).toBe(100);
    expect(formatCount(12500, 0, 'en-US')).toBe('12,500');
    expect(formatCount(4.2, 2, 'en-US')).toBe('4.20');
  });
});

// String segmentation follows grapheme clusters, not just Unicode code points.
