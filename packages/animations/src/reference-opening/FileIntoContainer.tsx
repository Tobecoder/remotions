import type {HTMLAttributes, ReactNode} from 'react';
import {ContentCollapse} from './ContentCollapse';
import {clamp, during, mix} from './motion';

export type FileIntoContainerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  progress: number;
  from: {x: number; y: number; width: number};
  to: {x: number; y: number};
  liftHeight?: number;
};

/** Lifts the item toward the opening, then drops it behind the caller's container artwork. */
export const FileIntoContainer = ({
  children, progress, from, to, liftHeight = 128, ...attributes
}: FileIntoContainerProps) => {
  const p = clamp(progress);
  if (p === 1) return null;

  const lift = during(p, 0, .57);
  const drop = during(p, .57, 1);
  const scale = mix(mix(1, .5, lift), .025, drop);
  const centerX = mix(from.x + from.width / 2, to.x, lift);
  const top = mix(mix(from.y, to.y - liftHeight, lift), to.y, drop);

  return <ContentCollapse {...attributes} data-file-into-container
    progress={1} to={{x: centerX - from.width * scale / 2, y: top, scale}}>
    {children}
  </ContentCollapse>;
};
