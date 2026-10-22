/** Put demo-audio.wav in the public folder of the host Remotion project. */
import {Audio} from '@remotion/media';
import {MirroredSpectrum} from '@remotions/animations';
import {AbsoluteFill, staticFile} from 'remotion';

const src = staticFile('demo-audio.wav');

export const AudioComposition = () => <AbsoluteFill style={{backgroundColor: '#10111a', alignItems: 'center', justifyContent: 'center'}}>
  <Audio src={src} />
  <MirroredSpectrum src={src} color="#8ee5d2" />
</AbsoluteFill>;
