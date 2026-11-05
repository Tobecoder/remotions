import {useId} from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {validateWindowInput, windowFocusState} from './windowFocus';
import type {FocusArea} from './windowFocus';

export type ScreenshotFocusDraftProps = {
  src: string;
  imageWidth: number;
  imageHeight: number;
  focus: FocusArea;
  alt?: string;
  accent?: string;
  note?: string;
};

/** Review-only material, not exported from the public animation library. */
export const ScreenshotFocusDraft = ({src, imageWidth, imageHeight, focus, alt = '文档截图', accent = '#cc6243', note = '让画面跟随讲解，把重点留给观众。'}: ScreenshotFocusDraftProps) => {
  validateWindowInput(imageWidth, imageHeight, focus);
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const state = windowFocusState(frame, fps, width, height, imageWidth, imageHeight, focus);
  const grain = `paper-${useId().replace(/:/g, '')}`;
  return <AbsoluteFill data-window-focus style={{background: '#f5f5ef', color: '#25292d', fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif', overflow: 'hidden'}}>
    <svg aria-hidden="true" width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.075, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
      <defs><filter id={grain}><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="9" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>
      <rect width="100%" height="100%" filter={`url(#${grain})`}/>
    </svg>
    <div data-window-card style={{position: 'absolute', left: state.x, top: state.y, width: state.width, height: state.height, opacity: state.opacity, borderRadius: width * 0.012, background: '#fff', overflow: 'hidden', boxShadow: `0 ${height * 0.024}px ${width * 0.03}px -${width * 0.012}px #292b253b, 0 2px 5px #292b2508`}}>
      <Img src={src} alt={alt} style={{display: 'block', width: '100%', height: '100%'}}/>
      <div data-window-highlight style={{position: 'absolute', left: `${focus.x * 100}%`, top: `${focus.y * 100}%`, width: `${focus.width * 100}%`, height: `${focus.height * 100}%`, opacity: state.mark, pointerEvents: 'none'}}>
        <div style={{position: 'absolute', inset: 0, background: '#ffe281', opacity: 0.42, transform: `scaleX(${state.mark})`, transformOrigin: 'left center', mixBlendMode: 'multiply'}}/>
        <span style={{position: 'absolute', left: -state.width * 0.011, top: 0, bottom: 0, width: Math.max(2, width * 0.0025), background: accent, borderRadius: 2}}/>
      </div>
    </div>
    {note && <div data-window-note style={{position: 'absolute', left: width * 0.07, bottom: height * 0.045, width: width * 0.86, textAlign: 'center', fontSize: width * 0.021, lineHeight: 1.5, color: '#666c66', opacity: state.mark}}>{note}</div>}
  </AbsoluteFill>;
};
