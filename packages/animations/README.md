# @remotions/animations

Three audio-reactive Remotion components: `Oscilloscope`, `MirroredSpectrum`, and `VoiceNote`. Each accepts an audio `src`, optional `color`, `width`, and `height`. The components read audio data at the current Remotion frame; add `<Audio src={src} />` separately when sound should play.

```tsx
import {Audio} from '@remotion/media';
import {Oscilloscope} from '@remotions/animations';
import {staticFile} from 'remotion';

const src = staticFile('music.wav');
export const Scene = () => <><Audio src={src} /><Oscilloscope src={src} /></>;
```

React 18+, Remotion 4.x and `@remotion/media-utils` 4.x are peer dependencies. Keep Remotion packages on matching exact versions in the host app. The workspace currently uses 4.0.536. This package is not yet published to npm.

The old general-purpose motion components have been removed from the public entry point and archived in the repository's `archive/v0.1-legacy` folder. MIT licensed; see LICENSE.
