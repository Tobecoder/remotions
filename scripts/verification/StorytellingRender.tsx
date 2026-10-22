import {Composition, registerRoot, staticFile} from 'remotion';
import {NewsArticleHighlight, OnScreenMessages, PolaroidPictures, SpeedLines} from '../../packages/animations/dist/index.cjs';

const photos = [
  {src: staticFile('storytelling/scene-blue.jpg'), caption: 'scene A', label: 'A'},
  {src: staticFile('storytelling/scene-pink.jpg'), caption: 'scene B', label: 'B'},
  {src: staticFile('storytelling/scene-blue.jpg'), caption: 'scene C', label: 'C', filter: 'hue-rotate(-65deg)'},
];
const font = `@font-face{font-family:Caveat;font-style:normal;font-weight:600;src:url('${staticFile('storytelling/caveat-600.ttf')}') format('truetype');}`;
const definitions = [
  {id: 'News', Component: NewsArticleHighlight, frames: 150},
  {id: 'Messages', Component: OnScreenMessages, frames: 162},
  {id: 'Polaroid', Component: PolaroidPictures, frames: 150},
  {id: 'Speed', Component: SpeedLines, frames: 45},
];
const Root = () => <>{definitions.flatMap(({id, Component, frames}) => [{width: 640, height: 260, name: 'Card'}, {width: 360, height: 640, name: 'Portrait'}].map(({width, height, name}) => {
  const Scene = () => <><style>{font}</style><Component width={width} height={height} backgroundColor={id === 'Speed' ? '#222831' : '#edf2f4'} {...(id === 'Polaroid' ? {photos} : {})} /></>;
  return <Composition key={`${id}${name}`} id={`${id}${name}`} component={Scene} width={width} height={height} fps={30} durationInFrames={frames} />;
}))}</>;
registerRoot(Root);
