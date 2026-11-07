import type {ReactNode} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {AgentPipeline} from '../../../packages/animations/src';
import {PreparationArtwork} from '../../../packages/animations/src/reference-opening/PreparationArtwork';
import {during} from '../../../packages/animations/src/reference-opening/motion';
import {PreparationCards} from '../../reference-opening/compositions/PreparationCards';
import example from './example.json';

export type PreparationExampleCard={id:string;title:string;description?:string;kind?:number;artwork?:ReactNode};
export type PreparationExampleCopy=typeof example.defaultProps.copy;
export type PreparationCardsExampleProps={cards?:readonly PreparationExampleCard[];copy?:Partial<PreparationExampleCopy>;agentLabel?:string;toolLabel?:string;output?:ReactNode|((time:number)=>ReactNode)};

const OutputPage=({copy}:{copy:PreparationExampleCopy})=><div data-example-preparation-output style={{height:'100%',padding:12,boxSizing:'border-box',background:'#fff',color:'#30343e'}}>
  <div style={{fontFamily:'monospace',fontSize:6,letterSpacing:1,color:'#c77055'}}>{copy.outputEyebrow}</div>
  <div style={{fontSize:19,lineHeight:'24px',fontWeight:800,margin:'6px 0'}}>{copy.outputTitle}</div>
  <div style={{display:'flex',gap:6}}>{['#405c81','#76a8b2','#c78661'].map((color,index)=><div key={color} style={{flex:1,height:27,padding:5,boxSizing:'border-box',borderRadius:3,background:color+'22',color,fontFamily:'monospace',fontSize:9,fontWeight:700}}>0{index+1}</div>)}</div>
  <div style={{fontSize:7,lineHeight:'10px',marginTop:7,color:'#777d83'}}>{copy.outputDescription}</div>
</div>;

/** The original four-card sequence and Agent share the film's clock and handoff. */
export const PreparationCardsExample=({cards=example.defaultProps.cards,copy,agentLabel=example.defaultProps.agentLabel,toolLabel=example.defaultProps.toolLabel,output}:PreparationCardsExampleProps)=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps,caseTime=(frame+51.6*fps)/fps,text={...example.defaultProps.copy,...copy};
  if(cards.length>4)throw new Error('素材准备卡完整范例最多支持 4 张卡片，更多素材请使用 CardEntrance 自定义布局。');
  const items=cards.map((card,index)=>{
    const kind=card.kind??index;
    if(card.artwork===undefined&&(!Number.isInteger(kind)||kind<0||kind>3))throw new Error('默认插图 kind 必须为 0–3，也可以通过 artwork 提供自定义内容。');
    return {...card,artwork:card.artwork===undefined?<PreparationArtwork kind={kind}/>:card.artwork};
  });
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-component-example="preparation-cards" style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <div data-preparation-title style={{position:'absolute',left:49,top:80,opacity:during(caseTime,51.6,52.1)}}><div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#ca7157',marginBottom:9}}>{text.eyebrow}</div><div style={{fontSize:25,fontWeight:800,color:'#292c32'}}>{text.title}</div></div>
      <PreparationCards time={caseTime} startAt={51.6} cards={items}/>
      <AgentPipeline time={caseTime} startAt={55} agentLabel={agentLabel} toolLabel={toolLabel} output={output===undefined?<OutputPage copy={text}/>:typeof output==='function'?output(time):output}/>
    </div>
  </AbsoluteFill>;
};
