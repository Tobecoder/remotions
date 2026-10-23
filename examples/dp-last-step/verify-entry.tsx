import {useEffect,useMemo} from 'react';
import {Composition,continueRender,delayRender,registerRoot,useCurrentFrame} from 'remotion';
import {Sample} from './src/Composition';
import {arrivedTokens} from './src/motion';

const Probe=()=>{
  const frame=useCurrentFrame();
  const handle=useMemo(()=>delayRender(`DP 3D layout ${frame}`),[frame]);
  useEffect(()=>{
    let released=false;
    const release=()=>{if(!released){released=true;continueRender(handle);}};
    let request:number;
    const inspect=()=>{
      const root=document.querySelector('[data-probe-root]')!;
      const canvas=root.querySelector('canvas');
      if(!canvas || Number(canvas.getAttribute('width'))!==1920){request=requestAnimationFrame(inspect);return;}
      const bounds=root.getBoundingClientRect();
      const checks=[...root.querySelectorAll('[data-sample-text]')].map(node=>{
        let opacity=1;
        for(let el:Element|null=node;el&&el!==root;el=el.parentElement) opacity*=Number(getComputedStyle(el).opacity);
        const box=node.getBoundingClientRect();
        return {text:node.textContent,visible:opacity>.05,clipped:opacity>.05&&(box.left<bounds.left-1 || box.right>bounds.right+1 || box.top<bounds.top-1 || box.bottom>bounds.bottom+1)};
      });
      const five=root.querySelector('[data-equation-part="5"]');
      console.log('DP20_REPORT:'+JSON.stringify({frame,checks,arrived:arrivedTokens(frame).length,fiveOpacity:five?Number(getComputedStyle(five).opacity):0,canvas:root.querySelector('canvas')?.getAttribute('width')}));
      release();
    };
    request=requestAnimationFrame(inspect);
    return()=>{cancelAnimationFrame(request);release();};
  },[frame,handle]);
  return null;
};
const Verified=()=> <div data-probe-root style={{position:'absolute',inset:0}}><Sample/><Probe/></div>;
registerRoot(()=> <Composition id="DP20-Verify" component={Verified} width={1920} height={1080} fps={30} durationInFrames={600}/>);
