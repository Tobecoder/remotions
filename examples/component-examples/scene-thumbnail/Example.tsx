import type {ReactNode} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ChapterHeading,ExplodedLayers,FanCardDeck,type HeadingContent} from '../../../packages/animations/src';
import {LiveCaptionLines,LiveTimeline,LiveWaveform,PanelScroll} from '../../../packages/animations/src/reference-opening/LivePanelContent';
import {during,mix,openingLayerStartAt,openingState} from '../../../packages/animations/src/reference-opening/motion';
import {SceneThumbnail} from '../../reference-opening/compositions/SceneThumbnail';
import example from './example.json';

export type SceneThumbnailContext={time:number;progress:number};
type SceneContent=ReactNode|((context:SceneThumbnailContext)=>ReactNode);
export type SceneThumbnailExampleProps={from?:HeadingContent;to?:HeadingContent;caption?:string;number?:string;overview?:Partial<typeof example.defaultProps.overview>;content?:SceneContent;nextContent?:SceneContent};
const colors=['#405c81','#76a8b2','#c78661','#a99ac1','#cb9e66'];

const DocumentPage=({title,kind=0}:{title:string;kind?:number})=><div style={{height:'100%',padding:18,boxSizing:'border-box',background:'#fff',color:'#30343e'}}>
  <div style={{fontSize:8,fontWeight:700,letterSpacing:2,color:'#c77055',marginBottom:12}}>从脚本到成片</div>
  <div style={{fontSize:24,fontWeight:800,marginBottom:15}}>{title}</div>
  <div style={{display:'flex',gap:9}}>{[0,1,2].map(index=><div key={index} style={{flex:1,height:65,padding:9,boxSizing:'border-box',borderRadius:4,background:colors[(index+kind)%colors.length]+'25',color:colors[(index+kind)%colors.length]}}><div style={{fontSize:18,fontWeight:800}}>0{index+1}</div><div style={{height:3,width:'70%',marginTop:8,background:'currentColor',opacity:.4}}/></div>)}</div>
  {[92,72,83].map((width,index)=><div key={index} style={{height:3,width:`${width}%`,marginTop:7,background:'#dce0e3'}}/>)}
</div>;

const MethodVisual=({time}:{time:number})=><ExplodedLayers time={time} startAt={openingLayerStartAt} labelOpacity={1-during(time,8.5,8.83)} screen={<DocumentPage title="一条完整的讲解视频"/>} layers={[
  {id:'animation',label:'动画',content:elapsed=><div style={{height:'100%',background:'#fff',padding:18,boxSizing:'border-box'}}><div style={{fontSize:10,fontWeight:700,marginBottom:15}}>Animation · 逐帧编排</div><LiveTimeline time={elapsed}/></div>},
  {id:'captions',label:'字幕',content:elapsed=><div style={{height:'100%',background:'#fff'}}><LiveCaptionLines time={elapsed} lines={['先有旁白，再配画面','让字幕跟上阅读节奏']}/></div>},
  {id:'voice',label:'配音',content:elapsed=><div style={{height:'100%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><LiveWaveform time={elapsed}/></div>},
  {id:'materials',label:'素材',content:elapsed=><PanelScroll time={elapsed} distance={12}><DocumentPage title="图片与画面素材" kind={2}/></PanelScroll>},
  {id:'script',label:'脚本',content:elapsed=><PanelScroll time={elapsed}><DocumentPage title="从一个清楚的问题开始" kind={1}/></PanelScroll>},
]}/>;

const NextVisual=({progress}:{progress:number})=><>
  <FanCardDeck x={300} cardHeight={122} spread={64} progress={progress} cards={['结构','图形','字幕','声音','流程'].map((caption,index)=>({id:caption,caption,content:<svg viewBox="0 0 72 92" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="72" height="92" fill={colors[index]}/><circle cx="40" cy="26" r="20" fill="#ffffff44"/><path d="M0 92L35 36L80 92Z" fill="#ffffff33"/><text x="9" y="81" fontSize="22" fontWeight="800" fill="#fff">0{index+1}</text></svg>}))}/>
  <div data-example-next-badge style={{position:'absolute',left:405,top:224,opacity:during(progress,.3,.9),transform:`translateY(${mix(9,0,progress)}px)`,background:'#30343f',border:'1px solid #ffffff29',padding:'10px 18px',borderRadius:5,color:'#fff',boxShadow:'0 6px 10px #22252c19',fontSize:14,fontFamily:'monospace',fontWeight:700}}><span style={{color:'#e77a52',fontSize:11,marginRight:7}}>◆</span>SKILL.md</div>
</>;

/** The original thumbnail and heading share one progress; source artwork keeps running. */
export const SceneThumbnailExample=({from=example.defaultProps.from,to=example.defaultProps.to,caption=example.defaultProps.caption,number=example.defaultProps.number,overview,content,nextContent}:SceneThumbnailExampleProps)=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps,caseTime=time+7.5,state=openingState(caseTime),text={...example.defaultProps.overview,...overview};
  const renderContent=(value:SceneContent,progress:number)=>typeof value==='function'?value({time,progress}):value;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-component-example="scene-thumbnail" style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <ChapterHeading from={from} to={to} progress={state.thumbnail}/>
      <div data-example-chapter-overview style={{position:'absolute',left:280,top:62,width:240,textAlign:'center',opacity:during(caseTime,8.5,8.93)}}><div style={{fontSize:8,fontWeight:700,letterSpacing:1.4,color:'#ce7053',marginBottom:7}}>{text.eyebrow}</div><div style={{fontSize:16,fontWeight:800,color:'#24272d'}}>{text.title}</div></div>
      <SceneThumbnail progress={state.thumbnail} caption={caption} number={number}>{content===undefined?<MethodVisual time={caseTime}/>:renderContent(content,state.thumbnail)}</SceneThumbnail>
      {nextContent===undefined?<NextVisual progress={state.fan}/>:<div data-example-next-content style={{position:'absolute',inset:0,opacity:during(state.fan,0,.55)}}>{renderContent(nextContent,state.fan)}</div>}
    </div>
  </AbsoluteFill>;
};
