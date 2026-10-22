import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {estimateCaptionFontSize, estimateTextLines, FittedPhotoCaption} from '../src/components/StorytellingText';

describe('storytelling multiline text', () => {
  it.each(['\n', '\r\n', '\r'])('counts each explicit line with separator %j', (separator) => {
    expect(estimateTextLines(Array(20).fill('这是一行消息').join(separator), 840, 40)).toBe(20);
  });

  it('preserves empty paragraphs and soft-wraps each paragraph independently', () => {
    expect(estimateTextLines('第一行\n\n第三行\n', 840, 40)).toBe(4);
    expect(estimateTextLines(`${'字'.repeat(42)}\n${'字'.repeat(42)}`, 840, 40)).toBe(4);
  });

  it('keeps the short reference caption at its original size', () => {
    expect(estimateCaptionFontSize('scene A')).toBe(44);
    const output = renderToStaticMarkup(<FittedPhotoCaption text="scene A" fontFamily="Caveat" />);
    expect(output).toContain('font-size:44px');
  });

  it.each(['这是较长的中文注释，需要完整显示全部文字，不能裁切上下边缘。', 'W'.repeat(100), '第一行\r\n\r\n第三行\n第四行'])('fits a long caption without truncating its text: %j', (text) => {
    const size = estimateCaptionFontSize(text);
    expect(size).toBeGreaterThan(0);
    expect(size).toBeLessThan(44);
    expect(estimateTextLines(text, 312, size) * size * 1.1).toBeLessThanOrEqual(76);
    const output = renderToStaticMarkup(<FittedPhotoCaption text={text} fontFamily="Caveat" />);
    expect(output).toContain('white-space:pre-wrap');
    expect(output).not.toContain('overflow:hidden');
    expect(output).toContain(text);
  });
});
