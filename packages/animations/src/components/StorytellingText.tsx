import {useLayoutEffect, useRef, useState} from 'react';

/** Preserve explicit lines (including empty ones) before estimating soft wraps. */
export const estimateTextLines = (text: string, width: number, fontSize: number) => text.split(/\r\n?|\n|\u2028|\u2029/u).reduce((lines, paragraph) => {
  const ems = Array.from(paragraph).reduce((sum, char) => sum + (char === '\t' ? 2.6 : /[^\u0000-\u007f]|[MW]/u.test(char) ? 1 : 0.65), 0);
  return lines + Math.max(1, Math.ceil(ems * fontSize / width));
}, 0);

/** A deterministic server-rendering fallback; the browser refines it with actual font metrics. */
export const estimateCaptionFontSize = (text: string) => {
  let low = 0;
  let high = 44;
  for (let attempt = 0; attempt < 16; attempt++) {
    const size = (low + high) / 2;
    if (estimateTextLines(text, 312, size) * size * 1.1 <= 76) low = size;
    else high = size;
  }
  return estimateTextLines(text, 312, 44) * 44 * 1.1 <= 76 ? 44 : Math.floor(low * 100) / 100;
};

/** Measure unscaled flow height, so a fitted stage includes every real line and gap. */
export const useConversationHeight = (textKey: string, fontFamily: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    let active = true;
    const measure = () => {if (active && ref.current) setHeight(Math.ceil(ref.current.offsetHeight));};
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (ref.current) observer?.observe(ref.current);
    void document.fonts?.ready.then(measure);
    return () => {active = false; observer?.disconnect();};
  }, [textKey, fontFamily]);
  return {ref, height};
};

/** Keep the paper geometry and short captions unchanged; fit longer text inside its margin. */
export const FittedPhotoCaption = ({text = '', fontFamily}: {text?: string; fontFamily: string}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(() => estimateCaptionFontSize(text));
  useLayoutEffect(() => {
    let active = true;
    const measure = () => {
      const box = boxRef.current;
      const content = textRef.current;
      if (!active || !box || !content || box.clientWidth === 0) return;
      const original = content.style.fontSize;
      const fits = (size: number) => {
        content.style.fontSize = `${size}px`;
        // Reserve space for font ascenders/descenders, beyond its line boxes.
        return content.scrollHeight <= box.clientHeight - 8 && content.scrollWidth <= content.clientWidth;
      };
      let size = 44;
      if (!fits(size)) {
        let low = 0;
        let high = 44;
        for (let attempt = 0; attempt < 16; attempt++) {
          const candidate = (low + high) / 2;
          if (fits(candidate)) low = candidate;
          else high = candidate;
        }
        size = Math.floor(low * 100) / 100;
      }
      content.style.fontSize = original;
      setFontSize(size);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (boxRef.current) observer?.observe(boxRef.current);
    void document.fonts?.ready.then(measure);
    document.fonts?.addEventListener('loadingdone', measure);
    return () => {active = false; observer?.disconnect(); document.fonts?.removeEventListener('loadingdone', measure);};
  }, [text, fontFamily]);
  return <div ref={boxRef} data-story-caption="" style={{fontFamily, fontWeight: 600, height: 84, marginTop: 8, paddingInline: 32, boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
    <span ref={textRef} data-story-caption-text="" style={{display: 'block', width: '100%', minWidth: 0, fontSize, lineHeight: 1.1, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', tabSize: 4}}>{text}</span>
  </div>;
};
