import {CardEntrance, type CardEntranceProps} from './CardEntrance';
import {sampleFrames} from './motion';

export type DropCardProps = Omit<CardEntranceProps, 'progress' | 'offset' | 'fromScale'> & {
  frame: number;
  durationInFrames?: number;
  tilt?: number;
  offsets?: readonly number[];
};

const dropOffsets = [-151, -110, -76, -49, -29, -13, -2, 5, 9, 11, 10, 8, 3, 1, 0];
const dropAngles = [8.5, 6.5, 4.7, 2.9, 1.8, .9, .1, 0, -.5, -.8, -.6, -.4, -.2];

/** Drops through the slot, rebounds, and holds the settled card. The caller sets each card's start. */
export const DropCard = ({
  frame, durationInFrames, tilt = 0, offsets = dropOffsets, y, rotation = 0, ...card
}: DropCardProps) => {
  if (frame < 0 || !Number.isFinite(frame)) return null;
  const lastSample = Math.max(0, offsets.length - 1);
  const duration = durationInFrames ?? lastSample;
  const moving = lastSample > 0 && duration > 0 && Number.isFinite(duration) && frame < duration;
  const motionFrame = moving ? frame * (lastSample / duration) : lastSample;
  const dropY = moving ? sampleFrames(offsets, motionFrame) : 0;
  const angle = moving ? (tilt / dropAngles[0]) * sampleFrames(dropAngles, motionFrame) : 0;

  return <CardEntrance {...card} data-drop-card progress={1} y={y + dropY} rotation={rotation + angle}/>;
};
