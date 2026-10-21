import {
  CardReveal, CountUp, FadeIn, ProgressBar, ProgressRing,
  ScaleIn, SlideIn, SpringPop, Typewriter, WaveText, WordReveal,
} from '@remotions/animations';
import type {CSSProperties, ReactNode} from 'react';

export type Category = 'Entrance' | 'Typography' | 'Data' | 'UI';
export type DemoId =
  | 'fade' | 'slide' | 'scale' | 'spring' | 'typewriter' | 'words'
  | 'count' | 'bar' | 'ring' | 'card' | 'wave';
export type Demo = {id: DemoId; name: string; category: Category; description: string; tag: string};

export const catalog: Demo[] = [
  {id: 'fade', name: 'Fade In', category: 'Entrance', description: 'Soft opacity introduction', tag: '01'},
  {id: 'slide', name: 'Slide In', category: 'Entrance', description: 'Directional reveal', tag: '02'},
  {id: 'scale', name: 'Scale In', category: 'Entrance', description: 'Subtle size transition', tag: '03'},
  {id: 'spring', name: 'Spring Pop', category: 'Entrance', description: 'Physics-based bounce', tag: '04'},
  {id: 'typewriter', name: 'Typewriter', category: 'Typography', description: 'Frame-driven typing effect', tag: '05'},
  {id: 'words', name: 'Word Reveal', category: 'Typography', description: 'Staggered word entrance', tag: '06'},
  {id: 'wave', name: 'Wave Text', category: 'Typography', description: 'Springy letter sequence', tag: '07'},
  {id: 'count', name: 'Count Up', category: 'Data', description: 'Animated metric counter', tag: '08'},
  {id: 'bar', name: 'Progress Bar', category: 'Data', description: 'Dynamic progress indicator', tag: '09'},
  {id: 'ring', name: 'Progress Ring', category: 'Data', description: 'Circular data visual', tag: '10'},
  {id: 'card', name: 'Card Reveal', category: 'UI', description: 'Dimensional card entrance', tag: '11'},
];

export type PreviewProps = {
  id: DemoId;
  headline: string;
  accent: string;
  durationInFrames: number;
  delayInFrames: number;
};

const centerpiece: CSSProperties = {fontSize: 90, fontWeight: 750, letterSpacing: -5, lineHeight: 1.15, textAlign: 'center'};

// The Player and the video render the SAME composition; every effect is computed from frames.
export const PreviewComposition = ({id, headline, accent, durationInFrames, delayInFrames}: PreviewProps) => {
  let visual: ReactNode;
  const title = <span style={centerpiece}>{headline}</span>;
  const common = {durationInFrames, delayInFrames};
  switch (id) {
    case 'fade': visual = <FadeIn {...common}>{title}</FadeIn>; break;
    case 'slide': visual = <SlideIn {...common} direction="up" distance={100}>{title}</SlideIn>; break;
    case 'scale': visual = <ScaleIn {...common} fromScale={0.25}>{title}</ScaleIn>; break;
    case 'spring': visual = <SpringPop {...common}>{title}</SpringPop>; break;
    case 'typewriter': visual = <Typewriter {...common} text={headline} style={{...centerpiece, fontSize: 78}} />; break;
    case 'words': visual = <WordReveal {...common} text={headline} staggerInFrames={5} style={{...centerpiece, fontSize: 78}} />; break;
    case 'wave': visual = <WaveText {...common} text={headline} staggerInFrames={3} style={{...centerpiece, fontSize: 70}} />; break;
    case 'count': visual = <CountUp {...common} to={12800} suffix="+" style={{...centerpiece, fontSize: 116, color: accent}} />; break;
    case 'bar': visual = <div style={{width: '65%'}}><div style={{fontWeight: 700, fontSize: 34, marginBottom: 20}}>Loading the future...</div><ProgressBar {...common} value={86} width="100%" height={24} fillColor={accent} trackColor="#292b3c" /></div>; break;
    case 'ring': visual = <ProgressRing {...common} value={86} size={240} strokeWidth={20} fillColor={accent} trackColor="#292b3c" />; break;
    case 'card': visual = <CardReveal {...common} style={{background: '#252338', padding: 48, minWidth: 400, borderRadius: 30, border: '1px solid #686380', boxShadow: '0 40px 90px rgba(0,0,0,.35)'}}><div style={{fontSize: 22, color: accent, marginBottom: 16}}>✦  FEATURED</div><div style={{fontSize: 60, fontWeight: 800, letterSpacing: -3}}>{headline}</div><div style={{fontSize: 22, marginTop: 18, color: '#bbb7d0'}}>Your next big idea, in motion.</div></CardReveal>; break;
    default: visual = null;
  }
  return <div style={{width: '100%', height: '100%', background: 'radial-gradient(ellipse at 50% 18%, #252239 0%, #11111b 58%, #090a10 100%)', color: '#f7f5ff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 60, boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif'}}>
    <div style={{position: 'absolute', top: 35, left: 42, color: '#77728e', fontSize: 15, letterSpacing: 5, fontWeight: 800}}>REMOTIONS / 001</div>
    <div style={{position: 'absolute', bottom: 35, right: 42, color: accent, fontSize: 14, letterSpacing: 4, fontWeight: 800}}>MADE TO MOVE ↗</div>
    {visual}
  </div>;
};

export const snippetFor = (id: DemoId, headline: string, accent: string, durationInFrames: number, delayInFrames = 0): string => {
  const safe = JSON.stringify(headline);
  const safeAccent = JSON.stringify(accent);
  switch (id) {
    case 'fade': return `import { FadeIn } from '@remotions/animations';\n\n<FadeIn durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}}><h1>{${safe}}</h1></FadeIn>`;
    case 'slide': return `import { SlideIn } from '@remotions/animations';\n\n<SlideIn direction="up" distance={100} durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}}>\n  <h1>{${safe}}</h1>\n</SlideIn>`;
    case 'scale': return `import { ScaleIn } from '@remotions/animations';\n\n<ScaleIn fromScale={0.25} durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}}>\n  <h1>{${safe}}</h1>\n</ScaleIn>`;
    case 'spring': return `import { SpringPop } from '@remotions/animations';\n\n<SpringPop durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}}><h1>{${safe}}</h1></SpringPop>`;
    case 'typewriter': return `import { Typewriter } from '@remotions/animations';\n\n<Typewriter text={${safe}} durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}} cursor />`;
    case 'words': return `import { WordReveal } from '@remotions/animations';\n\n<WordReveal text={${safe}} staggerInFrames={5} durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}} />`;
    case 'wave': return `import { WaveText } from '@remotions/animations';\n\n<WaveText text={${safe}} staggerInFrames={3} durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}} />`;
    case 'count': return `import { CountUp } from '@remotions/animations';\n\n<CountUp to={12800} suffix="+" durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}} />`;
    case 'bar': return `import { ProgressBar } from '@remotions/animations';\n\n<ProgressBar value={86} fillColor={${safeAccent}} durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}} />`;
    case 'ring': return `import { ProgressRing } from '@remotions/animations';\n\n<ProgressRing value={86} fillColor={${safeAccent}} durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}} />`;
    case 'card': return `import { CardReveal } from '@remotions/animations';\n\n<CardReveal durationInFrames={${durationInFrames}} delayInFrames={${delayInFrames}}>\n  <div>{${safe}}</div>\n</CardReveal>`;
  }
};
