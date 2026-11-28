import type {ReactNode} from 'react';
import {sampleFrames} from './motion';

export type ImpactRecoilProps = {
  frame: number;
  strength?: number;
  durationInFrames?: number;
  samples?: readonly number[];
  children: (recoil: number) => ReactNode;
};

const recoilSamples = [1, -.41, -.66, .63, .3, -.6, .03, .46, -.18, -.23, .2, .07, -.07];

/** Supplies the signed recoil without adding a wrapper or choosing an axis for the caller. */
export const ImpactRecoil = ({
  frame, strength = 1, durationInFrames, samples = recoilSamples, children,
}: ImpactRecoilProps) => {
  const duration = durationInFrames ?? samples.length;
  const displacement = duration > 0 && Number.isFinite(duration) && Number.isFinite(strength)
    ? strength * sampleFrames(samples, frame * (samples.length / duration)) : 0;
  return <>{children(displacement === 0 ? 0 : displacement)}</>;
};
