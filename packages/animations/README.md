# @remotions/animations

Eleven typed, frame-driven React components for Remotion 4.x. Version 0.1.0 is not yet published to npm.

```tsx
import {FadeIn, CountUp} from '@remotions/animations';

export const Scene = () => (
  <FadeIn delayInFrames={10} durationInFrames={30}>
    <CountUp to={12800} suffix="+" durationInFrames={45} />
  </FadeIn>
);
```

Render within a Remotion Composition or Player. Timing uses video frames, not milliseconds.
`style` and `className` customize wrappers; wrapper style overrides take precedence over computed animation styles.

Exports: FadeIn, SlideIn, ScaleIn, SpringPop, Typewriter, WordReveal, WaveText, CountUp, ProgressBar, ProgressRing, CardReveal, splitGraphemes and all component prop types.

React 18+ and Remotion 4.x are peer dependencies. Keep Remotion runtime packages on matching exact versions in your app. ESM, CommonJS and corresponding TypeScript declarations are included.

See the [repository](https://github.com/Tobecoder/remotions) for the playground, component options and contribution instructions. MIT licensed; see LICENSE.
