# @remotions/animations

Twenty-six reusable Remotion components: the audio-reactive `Oscilloscope`, `MirroredSpectrum`, and `VoiceNote`; the caption styles `BasicCaptions`, `RoundedCaptions`, `MovingPillCaptions`, `PoppingWordCaptions`, and `WordHighlightCaptions`; the data charts `HorizontalBarChart`, `LineChart`, `NumberCounter`, `PieChart`, and `VerticalBarChart`; the background effects `LiquidContours`, `MovingWaves`, `MovingZigzags`, `NotebookPaper`, `PaperTexture`, and `RotatingStarburst`; the visual effects `PulseRings`, `ParticleField`, and `ShimmerSweep`; and the layout transitions `PictureInPictureTransition`, `SlideToSplitScreen`, `RotatingCards`, and `ProductCollection`. Audio components accept an audio `src`, optional `color`, `width`, and `height`; add `<Audio src={src} />` separately when sound should play. Caption components accept Remotion `Caption[]` data plus optional `color`, `secondaryColor`, `backgroundColor`, `fontSize`, `width`, and `height`. Chart components accept optional `ChartDatum[]` data, `color`, `secondaryColor`, `backgroundColor`, `speed`, `progress`, `width`, and `height`. Background, visual effects, and layouts accept optional `color`, `secondaryColor`, `backgroundColor`, `speed`, `width`, and `height`.

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

Chart components use the same frame-driven timing and can share one data shape:

```tsx
import {LineChart} from '@remotions/animations';
import type {ChartDatum} from '@remotions/animations';

const data: ChartDatum[] = [
  {label: '一月', value: 34},
  {label: '二月', value: 48},
  {label: '三月', value: 71},
];

export const ChartScene = () => <LineChart data={data} color="#409eff" />;
```

Layouts are frame-driven transitions that can be used with the default panels or your own React content:

```tsx
import {PictureInPictureTransition} from '@remotions/animations';

export const LayoutScene = () => (
  <PictureInPictureTransition width={1920} height={1080} insetPosition="bottom-right">
    <ProductScene />
  </PictureInPictureTransition>
);
```

`SlideToSplitScreen` accepts `children` and `secondary` scenes, while `RotatingCards` keeps the library's own `cards` array implementation. `ProductCollection` is the source-style three-card layout and supports `fadeOut={false}` for a visible held end frame. All four layouts support `durationInSeconds`, `speed`, and an optional controlled `progress` value. For `PictureInPictureTransition`, `padding` is the final pixel margin from the canvas edge on all four sides; when omitted, the source-style top-right inset is preserved.

React 18+, Remotion 4.x, `@remotion/media-utils` 4.x and `@remotion/captions` 4.x are peer dependencies. Keep Remotion packages on matching exact versions in the host app. The workspace currently uses 4.0.536. This package is not yet published to npm.

The old general-purpose motion components have been removed from the public entry point and archived in the repository's `archive/v0.1-legacy` folder. MIT licensed; see LICENSE.
