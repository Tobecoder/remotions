import {AbsoluteFill, Composition, registerRoot} from 'remotion';
// Deliberately exercise the published CommonJS build, including native dynamic imports.
import {Peel, Shine, TearApart} from '../../packages/animations/dist/index.cjs';

const graphic = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g"><stop stop-color="#0369a1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect width="640" height="360" rx="28" fill="url(#g)"/><path d="M245 285 305 75h30l60 210h-38l-12-48h-60l-12 48zm49-82h42l-21-81z" fill="white"/></svg>')}`;
const dimensions = {width: 640, height: 360};
const definitions = [{id: 'Peel', Component: Peel, frames: 60}, {id: 'Shine', Component: Shine, frames: 45}, {id: 'TearApart', Component: TearApart, frames: 45}];
const Root = () => <>{definitions.map(({id, Component, frames}) => {
  const Scene = () => <AbsoluteFill style={{backgroundColor: '#edf2f4'}}><Component {...dimensions} src={graphic} /></AbsoluteFill>;
  return <Composition key={id} id={id} component={Scene} {...dimensions} fps={30} durationInFrames={frames} />;
})}</>;
registerRoot(Root);
