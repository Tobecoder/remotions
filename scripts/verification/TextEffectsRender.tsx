import {useEffect, useState} from 'react';
import {Composition, registerRoot, staticFile, useDelayRender} from 'remotion';
// Verify native ESM dependencies through the public CJS build in a real renderer.
import {CircleMarker, CrossedOffText, CylinderText, SpinningTextWheel, StrikeThroughText, TextMarker} from '../../packages/animations/dist/index.cjs';

const faces = `@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:700;src:url('${staticFile('text-effects/cormorant-garamond-700.ttf')}')}@font-face{font-family:'Mona Sans';font-style:normal;font-weight:700;src:url('${staticFile('text-effects/mona-sans-700.ttf')}')}`;
const Fonts = () => {
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Loading local reference text fonts'));
  useEffect(() => {
    let released = false;
    const release = () => {if (!released) {released = true; continueRender(handle);}};
    Promise.all([document.fonts.load('700 80px "Cormorant Garamond"'), document.fonts.load('700 65px "Mona Sans"')]).then(() => document.fonts.ready).then(release).catch(cancelRender);
    return release;
  }, [handle, continueRender, cancelRender]);
  return <style>{faces}</style>;
};
const definitions = [
  {id: 'Circle', Component: CircleMarker}, {id: 'Cross', Component: CrossedOffText},
  {id: 'Strike', Component: StrikeThroughText}, {id: 'Marker', Component: TextMarker},
  {id: 'Wheel', Component: SpinningTextWheel}, {id: 'Cylinder', Component: CylinderText},
];
const Root = () => <>{definitions.flatMap(({id, Component}) => [false, true].map((portrait) => {
  const width = portrait ? 360 : 640;
  const height = portrait ? 640 : 260;
  const Scene = () => <><Fonts /><Component width={width} height={height} backgroundColor="#edf2f4" /></>;
  return <Composition key={`${id}-${portrait}`} id={`${id}${portrait ? 'Portrait' : 'Card'}`} component={Scene} width={width} height={height} fps={30} durationInFrames={id === 'Cylinder' ? 181 : 120} />;
}))}
  <Composition id="MultilineMarker" component={() => <><Fonts /><TextMarker width={360} height={640} text={Array(12).fill('让重要的信息被看见').join('\n')} markedText="重要的信息" progress={1} backgroundColor="#edf2f4" /></>} width={360} height={640} fps={30} durationInFrames={1} />
  <Composition id="ChineseWheel" component={() => <><Fonts /><SpinningTextWheel width={640} height={260} items={['星期五', '星期六', '星期日', '星期一', '星期二', '星期三', '星期四']} progress={1} backgroundColor="#edf2f4" /></>} width={640} height={260} fps={30} durationInFrames={1} />
  <Composition id="TextEffectsOverview" component={() => <><Fonts /><div style={{width: 1280, height: 720, padding: 24, boxSizing: 'border-box', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 16, backgroundColor: '#fff'}}>{definitions.map(({id, Component}) => <div key={id} style={{backgroundColor: '#edf2f4', borderRadius: 8, overflow: 'hidden'}}><Component width={400} height={276} progress={id === 'Cylinder' ? 0.18 : 1} /><div style={{fontFamily: 'Arial, Microsoft YaHei, sans-serif', fontSize: 20, fontWeight: 600, color: '#303133', padding: '6px 20px'}}>{({Circle: '圈画标记', Cross: '交叉划除', Strike: '删除线', Marker: '荧光标记', Wheel: '旋转文字轮', Cylinder: '圆柱文字'})[id]}</div></div>)}</div></>} width={1280} height={720} fps={30} durationInFrames={1} />
</>;
registerRoot(Root);
