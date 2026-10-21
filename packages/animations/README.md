# @remotions/animations

Ten reusable Remotion components: the audio-reactive `Oscilloscope`, `MirroredSpectrum`, and `VoiceNote`; the background effects `LiquidContours`, `MovingWaves`, `MovingZigzags`, and `RotatingStarburst`; and the visual effects `PulseRings`, `ParticleField`, and `ShimmerSweep`. Audio components accept an audio `src`, optional `color`, `width`, and `height`; add `<Audio src={src} />` separately when sound should play. Background and visual effects accept optional `color`, `secondaryColor`, `backgroundColor`, `speed`, `width`, and `height`.

```tsx
import {Audio} from '@remotion/media';
import {Oscilloscope} from '@remotions/animations';
import {staticFile} from 'remotion';

const src = staticFile('music.wav');
export const Scene = () => <><Audio src={src} /><Oscilloscope src={src} /></>;
```

```tsx
import {LiquidContours} from '@remotions/animations';

export const BackgroundScene = () => <LiquidContours width={1920} height={1080} />;
```

React 18+, Remotion 4.x and `@remotion/media-utils` 4.x are peer dependencies. Keep Remotion packages on matching exact versions in the host app. The workspace currently uses 4.0.536. This package is not yet published to npm.

The old general-purpose motion components have been removed from the public entry point and archived in the repository's `archive/v0.1-legacy` folder. MIT licensed; see LICENSE.
