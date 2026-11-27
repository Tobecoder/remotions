import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ResourceCredits,type ResourceCreditsProps} from '../../reference-opening/compositions/ResourceCredits';
export type ResourceCreditsExampleProps=Omit<ResourceCreditsProps,'time'|'startAt'>;
export const ResourceCreditsExample=(props:ResourceCreditsExampleProps)=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
 return <AbsoluteFill style={{background:'#f5f6ef',fontFamily:'"Microsoft YaHei",sans-serif',overflow:'hidden'}}><div style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}><ResourceCredits {...props} time={frame/fps}/></div></AbsoluteFill>;
};
