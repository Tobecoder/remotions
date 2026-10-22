# @remotions/animations

Forty-two reusable Remotion components: the audio-reactive `Oscilloscope`, `MirroredSpectrum`, and `VoiceNote`; the caption styles `BasicCaptions`, `RoundedCaptions`, `MovingPillCaptions`, `PoppingWordCaptions`, and `WordHighlightCaptions`; the data charts `HorizontalBarChart`, `LineChart`, `NumberCounter`, `PieChart`, and `VerticalBarChart`; the background effects `LiquidContours`, `MovingWaves`, `MovingZigzags`, `NotebookPaper`, `PaperTexture`, and `RotatingStarburst`; the visual effects `PulseRings`, `ParticleField`, and `ShimmerSweep`; the content effects `WigglingCallout`, `Peel`, `Shine`, and `TearApart`; the layout transitions `PictureInPictureTransition`, `SlideToSplitScreen`, `RotatingCards`, and `ProductCollection`; and the overlays `LocationLowerThird` and `NameLowerThird`. Audio components accept an audio `src`, optional `color`, `width`, and `height`; add `<Audio src={src} />` separately when sound should play. Caption components accept Remotion `Caption[]` data plus optional `color`, `secondaryColor`, `backgroundColor`, `fontSize`, `width`, and `height`. Chart components accept optional `ChartDatum[]` data, `color`, `secondaryColor`, `backgroundColor`, `speed`, `progress`, `width`, and `height`. Bar and line charts preserve finite negative values and calculate a zero baseline; pie charts treat negative values as zero weights, use the actual positive weight total for percentages even when it is below one, and show an empty state when all weights are zero. An item color overrides the component color only when it is explicitly provided, and data items are not silently truncated; an explicit empty array renders an empty state, while dense data normalizes staggered timing, reduces row or column size, and samples labels while retaining labels for sparse positive pie slices to keep the drawing readable inside the canvas. Backgrounds, visual effects, and layouts accept optional colors, speed, width, and height. The two lower thirds also accept display text, a complete four-second entrance/hold/exit cycle, and controlled progress; progress 0.5 holds the fully visible state.

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

React 18+, Remotion 4.x, `@remotion/media-utils` 4.x and `@remotion/captions` 4.x are peer dependencies. Keep Remotion packages on matching exact versions in the host app. The workspace currently uses 4.0.537. This package is not yet published to npm.

The old general-purpose motion components have been removed from the public entry point and archived in the repository's `archive/v0.1-legacy` folder. MIT licensed; see LICENSE.

## Content effects

`Peel`, `Shine`, and `TearApart` apply the official `@remotion/effects` shaders directly to `CanvasImage`. They accept `src`, `width`, `height`, `backgroundColor`, `durationInSeconds`, `speed`, and controlled `progress`. The default durations are 2 seconds for Peel and 1.5 seconds for Shine and TearApart. `WigglingCallout` accepts `text`, `color`, and `secondaryColor` and settles after a single damped wiggle.

Use matching Remotion and effects versions (currently 4.0.537). Page curl requires WebGPU; the CanvasImage integration does not require the experimental HTML-in-canvas browser flag. Native effects are loaded with dynamic import so the CJS entry can still be required. The effect engine remains under the [Remotion License](https://www.remotion.dev/docs/effects/api#license); this package's wrapper code is MIT. The default image is a remotely hosted Remotion Elements demo asset and may be replaced with the caller's own image.

## Storytelling

`NewsArticleHighlight`, `OnScreenMessages`, `PolaroidPictures`, and `SpeedLines` follow the typography, spatial arrangement, and motion of the corresponding Remotion Elements references. All accept dimensions, optional transparent background, color, duration, speed, and controlled progress. Reference stages scale uniformly so text and photos keep their aspect ratio.

- `OnScreenMessages`: `messages: readonly {text: string; from: 'me' | 'them'}[]`, optional `incomingColor` and `fontFamily`; default 5.4 seconds. Blue/gray bubbles and their tails reveal in sequence and remain visible at the end.
- `NewsArticleHighlight`: `category`, `headline`, `summary`, exact-match `highlights`, `fontFamily`, and `fadeOut`; default 5 seconds. Independent SVG ink shapes reveal behind the text; no rough-notation runtime dependency is required.
- `PolaroidPictures`: `photos: readonly {src: string; caption?: string; alt?: string; label?: string; filter?: string}[]`, `captionFontFamily`, and `fadeOut`; default 5 seconds. The demo uses remote Elements images; provide your own images for production. Set `label` only when an overlay label is wanted. The host loads its chosen caption font before rendering; the catalog uses Caveat for Latin handwriting with Chinese fallback.
- `SpeedLines`: optional `lineCount` (1–256) and string `seed`; default 56 deterministic rays and a 1.5-second entrance/hold/exit.

Explicit empty message/photo arrays remain empty. Omitted arrays use the demo. News and photos exit at progress 1 by default; `fadeOut={false}` preserves a visible ending. Long conversations expand their fitted stage instead of dropping messages. The catalog loops complete news/photo/speed effects and holds the completed conversation.

Conversations preserve explicit line breaks and empty paragraphs, and fit their stage to the measured browser flow height. Long captions keep their text, shrink to fit the original paper margin, and reserve horizontal space where photos overlap. Short captions retain their 44px reference size. Load your chosen fonts before rendering, as above; layout also updates when fonts finish loading. Very long text necessarily appears smaller in a fixed viewport.

## Text effects

`CircleMarker`, `CrossedOffText`, `StrikeThroughText`, and `TextMarker` use the official `@remotion/rough-notation` primitives. Pass `text`, `markedText` (first literal occurrence), ink `color`, `textColor`, `fontFamily`, reference `fontSize`, dimensions, `durationInSeconds` (default 4), nonnegative `speed` multiplier, and controlled `progress`. Missing phrases stay unmarked; empty text stays empty. A uniformly fitted stage expands for multiline text. Load your chosen fonts in the host before rendering.

`SpinningTextWheel` accepts `items: readonly string[]`; the first option is the final highlighted selection. It preserves the source's 3D wheel, masked edges, and decelerating forward spin. Dimensions, font, color, duration, speed multiplier, and controlled progress are configurable. An explicit empty array stays empty; long options share a smaller font size.

`CylinderText` applies the native `@remotion/effects/cylinder` shader to an SVG text texture using `CanvasImage`, with the source's tilt, depth, and shading. It requires WebGPU, without the experimental HTML-in-canvas flag. Props: `text`, `color`, `backgroundColor`, system `fontFamily`, `width`, `height`, `tilt` (0–85 degrees), `speed` in revolutions per second (default 1/6; negative reverses; zero freezes), and `progress` (0–1 is one full revolution). SVG textures use system fonts and do not inherit page `@font-face` declarations.

Install matching Remotion, effects, and rough-notation versions (4.0.537 in this workspace). Native ESM modules load asynchronously with render barriers before first paint and one-time release on commit/unmount. The rough-notation package is MIT; native cylinder effects remain under the Remotion License. The catalog's local reference fonts use SIL OFL and are not shipped inside this npm package.
