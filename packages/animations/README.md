# @remotions/animations

Seventeen reusable Remotion components: the audio-reactive `Oscilloscope`, `MirroredSpectrum`, and `VoiceNote`; the caption styles `BasicCaptions`, `RoundedCaptions`, `MovingPillCaptions`, `PoppingWordCaptions`, and `WordHighlightCaptions`; the background effects `LiquidContours`, `MovingWaves`, `MovingZigzags`, `NotebookPaper`, `PaperTexture`, and `RotatingStarburst`; and the visual effects `PulseRings`, `ParticleField`, and `ShimmerSweep`. Audio components accept an audio `src`, optional `color`, `width`, and `height`; add `<Audio src={src} />` separately when sound should play. Caption components accept Remotion `Caption[]` data plus optional `color`, `secondaryColor`, `backgroundColor`, `fontSize`, `width`, and `height`. Background and visual effects accept optional `color`, `secondaryColor`, `backgroundColor`, `speed`, `width`, and `height`.

```tsx
import {Audio} from '@remotion/media';
import {Oscilloscope} from '@remotions/animations';
import {staticFile} from 'remotion';

const src = staticFile('music.wav');
export const Scene = () => <><Audio src={src} /><Oscilloscope src={src} /></>;
```

Caption styles use the standard Remotion caption shape:

```tsx
import type {Caption} from '@remotion/captions';
import {WordHighlightCaptions} from '@remotions/animations';

const captions: Caption[] = [
  {text: ' Hello', startMs: 0, endMs: 900, timestampMs: 450, confidence: null},
];

export const CaptionScene = () => <WordHighlightCaptions captions={captions} color="#8b5cf6" />;
```

```tsx
import {LiquidContours} from '@remotions/animations';

export const BackgroundScene = () => <LiquidContours width={1920} height={1080} />;
```

React 18+, Remotion 4.x, `@remotion/media-utils` 4.x and `@remotion/captions` 4.x are peer dependencies. Keep Remotion packages on matching exact versions in the host app. The workspace currently uses 4.0.536. This package is not yet published to npm.

The old general-purpose motion components have been removed from the public entry point and archived in the repository's `archive/v0.1-legacy` folder. MIT licensed; see LICENSE.
