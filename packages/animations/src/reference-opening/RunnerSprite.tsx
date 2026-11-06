import {Img} from 'remotion';

/** The atlas has eight run-cycle frames followed by eight non-looping brace frames. */
export const RunnerSprite=({src,time,pose}:{src:string;time:number;pose:'running'|'caught'})=>{
  const elapsed=Math.max(0,Number.isFinite(time)?time:0);
  const index=pose==='running'?Math.floor(elapsed*12)%8:8+Math.min(7,Math.floor(elapsed*18));
  return <div data-runner-sprite data-pose={pose} data-sprite-frame={index} style={{position:'absolute',inset:0,overflow:'hidden'}}>
    <Img src={src} style={{position:'absolute',width:'400%',height:'400%',maxWidth:'none',left:`${-(index%4)*100}%`,top:`${-Math.floor(index/4)*100}%`}}/>
  </div>;
};
