/**
 * Keep joined emoji, skin-tone modifiers and combining marks in one visual unit.
 * Intl.Segmenter is part of modern browsers / Node 20+. This fallback supports
 * older runtimes, but does not combine complex grapheme clusters.
 */
export const splitGraphemes = (text: string): string[] => {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, {granularity: 'grapheme'});
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
};
