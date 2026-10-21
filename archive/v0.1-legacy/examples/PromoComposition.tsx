/**
 * Example: import this in a Remotion application with @remotions/animations installed.
 * Place it in your own Remotion project and register with a Composition.
 */
import {AbsoluteFill} from 'remotion';
import {CountUp, SlideIn, ProgressBar} from '@remotions/animations';

export const PromoComposition = () => <AbsoluteFill style={{background: '#11111b', color: '#f8f7ff', padding: 80, display: 'flex', justifyContent: 'center', fontFamily: 'Arial, sans-serif'}}>
  <SlideIn delayInFrames={5} direction="up" durationInFrames={28}>
    <h1 style={{fontSize: 90, margin: 0, letterSpacing: -3}}>Make it move ✦</h1>
  </SlideIn>
  <div style={{fontSize: 55, color: '#ab97ff', marginTop: 45}}><CountUp to={12800} suffix="+" delayInFrames={27} durationInFrames={48} /></div>
  <div style={{marginTop: 40}}><ProgressBar value={86} width={850} height={20} delayInFrames={45} /></div>
</AbsoluteFill>;
