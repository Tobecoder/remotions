import {useEffect, useMemo} from 'react';
import {Composition, registerRoot, useCurrentFrame, delayRender, continueRender} from 'remotion';
import {FullLesson} from './src/Lesson';
import {timing} from './src/shared';

const Probe = () => {
  const frame = useCurrentFrame();
  const handle = useMemo(() => delayRender(`DP layout ${frame}`), [frame]);
  useEffect(() => {
    let released=false;
    const release=()=>{if(!released){released=true;continueRender(handle);}};
    const request=requestAnimationFrame(() => {
    const canvas = document.querySelector('[data-lesson-root]')!;
    const bounds = canvas.getBoundingClientRect();
    const checks = [...canvas.querySelectorAll('[data-layout-check="title"], [data-layout-check="subtitle"], [data-layout-check="sum"], [data-layout-check="calculation"]')].map(node => {
      const box = node.getBoundingClientRect();
      return {name:node.getAttribute('data-layout-check'), text:node.textContent, bounds:{left:bounds.left,right:bounds.right,bottom:bounds.bottom},box:{left:box.left,right:box.right,bottom:box.bottom}, clipped:box.left < bounds.left-1 || box.right > bounds.right+1 || box.bottom > bounds.bottom+1};
    });
    const values = [...canvas.querySelectorAll('[data-dp-value]')].map(node => node.textContent);
    console.log('DP_VERIFY:'+JSON.stringify({frame,checks,values}));
    release();
    });
    return ()=>{cancelAnimationFrame(request);release();};
  }, [frame,handle]);
  return null;
};
const VerifyLesson = () => <div data-lesson-root style={{position:'absolute',inset:0}}><FullLesson/><Probe/></div>;
registerRoot(() => <Composition id="DP-Verify" component={VerifyLesson} width={1920} height={1080} fps={30} durationInFrames={timing.durationInFrames}/>);
