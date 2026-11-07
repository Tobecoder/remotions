import type {ReactNode} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {SpotlightSequence} from '../../reference-opening/compositions/SpotlightSequence';
import {NeuronPreview} from '../../../packages/animations/src/reference-opening/NeuronPreview';
import {getAiComparisonThumbnailRect} from '../../../packages/animations/src/reference-opening/TypewriterComparison';
import example from './example.json';

export type SpotlightExampleContext={time:number;expanded:number};
export type CardSpotlightExampleProps={title?:string;sourceTitle?:string;sourceDescription?:string;badge?:ReactNode;content?:ReactNode|((context:SpotlightExampleContext)=>ReactNode)};

/** Both views share the same clock; the original sequence owns zoom, hold and return. */
export const CardSpotlightExample=({title=example.defaultProps.title,sourceTitle=example.defaultProps.sourceTitle,sourceDescription=example.defaultProps.sourceDescription,badge=example.defaultProps.badge,content}:CardSpotlightExampleProps)=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  const from=getAiComparisonThumbnailRect(time+5.4);
  const renderContent=(expanded:number)=>content===undefined?<NeuronPreview time={time}/>:typeof content==='function'?content({time,expanded}):content;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-component-example="card-spotlight-return" style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <div style={{position:'absolute',left:49,top:122,fontSize:20,fontWeight:800,color:'#34383d'}}>{title}</div>
      <div data-example-source-card style={{position:'absolute',left:420,top:175,width:320,height:66,background:'#fff',borderRadius:9,boxShadow:'0 7px 15px #30343e17'}}>
        <div style={{position:'absolute',left:81,top:17,fontSize:15,fontWeight:700,color:'#34373d'}}>{sourceTitle}<div style={{marginTop:4,fontSize:8,fontWeight:400,color:'#92969a'}}>{sourceDescription}</div></div>
      </div>
      <div data-example-source-thumbnail style={{position:'absolute',left:from.x,top:from.y,width:from.width,height:from.height,borderRadius:3,overflow:'hidden'}}>{renderContent(0)}</div>
      <SpotlightSequence time={time} from={from} fromRadius={3} content={renderContent} badge={badge}/>
    </div>
  </AbsoluteFill>;
};
