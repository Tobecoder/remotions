import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlurredCollage, ChapterHeading, ExplodedLayers, FanCardDeck, openingState} from '../../packages/animations/src/reference-opening';
import {SceneThumbnail} from './compositions/SceneThumbnail';
import {during, mix, openingLayerStartAt, openingMethodCueAt} from '../../packages/animations/src/reference-opening/motion';
import {PanelScroll,LiveWaveform,LiveTimeline,LiveCaptionLines} from '../../packages/animations/src/reference-opening/LivePanelContent';

const texture=(name:string)=>staticFile(`textures/${name}.jpg`);
const imageStyle={width:'100%',height:'100%',objectFit:'cover' as const,display:'block'};
const Texture=({name}:{name:string})=><Img src={texture(name)} style={imageStyle}/>;

export const PaperBackground=({time}:{time:number}) => {
  return <BlurredCollage time={time} paper={<Texture name="paper"/>} cards={
    [[-32,24,137,111,-5],[188,28,140,115,4],[328,-53,217,140,-3],[588,-36,207,106,5],[728,103,134,160,-4],[66,313,195,148,-7],[300,371,149,119,4],[500,335,215,147,-5],[604,270,124,82,3]].map(([x,y,width,height,rotation],i)=>({
      id:String(i),x,y,width,height,rotation,
      content:<div style={{height:'100%',padding:7,boxSizing:'border-box',opacity:.7}}><div style={{height:'70%',background:i%3===0?'#aab0b5':'#e0e0d7',overflow:'hidden'}}>{i%3!==0?<Texture name={`screen-${i%3}`}/>:null}</div><div style={{height:3,background:'#b9bcba',width:'65%',margin:'10px auto'}}/><div style={{height:2,background:'#b9bcba',width:'43%',margin:'5px auto'}}/></div>,
    }))
  }/>;
};

export const ScriptPage=({time=0}:{time?:number})=> <PanelScroll time={time}><Texture name="script"/></PanelScroll>;

export const MaterialsPage=({time=0}:{time?:number})=> <div style={{height:'100%',background:'#fff',padding:13,boxSizing:'border-box'}}>
  <div style={{fontSize:10,fontWeight:800,marginBottom:10}}>素材 · 用画面把内容讲清楚</div>
  <div style={{display:'flex',gap:9,height:124}}>{[0,1,4].map((i,index)=><div key={i} style={{flex:1,overflow:'hidden',borderRadius:2}}><PanelScroll time={time-index*.2} distance={12}><Texture name={`skill-${i}`}/></PanelScroll></div>)}</div>
  <div style={{display:'flex',gap:7,marginTop:11}}>{['画面参考','内容素材','示例演示'].map(t=><div key={t} style={{fontSize:6,background:'#f6f4ed',padding:'4px 12px',color:'#777'}}>{t}</div>)}</div>
</div>;

export const VoicePage=({time=0}:{time?:number})=> <div style={{height:'100%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
  <LiveWaveform time={time}/>
</div>;

export const CaptionsPage=({time=0}:{time?:number})=> <div style={{height:'100%',background:'#fff'}}>
  <LiveCaptionLines time={time} lines={['我上期那条16分钟的讲解视频','是怎么从脚本到成片的']}/>
</div>;

export const AnimationPage=({time=0}:{time?:number})=> <div style={{height:'100%',background:'linear-gradient(115deg,#fff 20%,#fff8e9 78%,#fff 100%)',padding:18,boxSizing:'border-box'}}>
  <div style={{fontSize:10,fontWeight:700,marginBottom:15}}>Animation · 逐帧编排</div>
  <LiveTimeline time={time}/>
</div>;

/** Contents can be replaced independently of the camera/stack animation. */
export const ScreenContent=({time}:{time:number})=> {
  const moments=[0,.9,1.8,3.05,3.9,4.7,5.8,6.7,7.6];
  let current=0;
  moments.forEach((at,index)=>{if(time>=at)current=index;});
  return <div style={{position:'relative',width:'100%',height:'100%',background:'#f8f8fc'}}>{moments.map((_,i)=><div key={i} data-screen-frame={i} style={{position:'absolute',inset:0,opacity:Number(i===current)}}><Texture name={`screen-${i}`}/></div>)}</div>;
};

export const Subtitle=({time,text:override}:{time:number;text?:string})=>{
  const text=override??(time<openingMethodCueAt?'我上期那条16分钟的讲解视频':time<4.5?'是怎么从脚本到成片的':time<5.8?'这期就拿它来复盘':time<8.6?'继续聊聊用Remotion制作视频的方法':'还有大家关心的Skill推荐');
  return <div style={{position:'absolute',left:0,right:0,bottom:20,display:'flex',justifyContent:'center'}}><div style={{padding:'5px 12px 6px',borderRadius:4,background:'#2b3241f2',boxShadow:'0 2px 4px #1b233519',color:'#fff',fontSize:15,fontWeight:700,lineHeight:'20px'}}>{text}</div></div>;
};

const skillNames=['lemo-opuscar','huashu-slides','illustration','handdraw','og-style'];

export const OpeningMethodVisual=({time,labelOpacity=1-during(time,8.5,8.83)}:{time:number;labelOpacity?:number})=>{
  const layers=[
    {id:'animation',label:'动画',content:(elapsed:number)=><AnimationPage time={elapsed}/>},
    {id:'captions',label:'字幕',content:(elapsed:number)=><CaptionsPage time={elapsed}/>},
    {id:'voice',label:'配音',content:(elapsed:number)=><VoicePage time={elapsed}/>},
    {id:'materials',label:'素材',content:(elapsed:number)=><MaterialsPage time={elapsed}/>},
    {id:'script',label:'脚本',content:(elapsed:number)=><ScriptPage time={elapsed}/>},
  ];
  return <ExplodedLayers time={time} startAt={openingLayerStartAt} layers={layers} screen={<ScreenContent time={time}/>} labelOpacity={labelOpacity}/>;
};

export const OpeningSkillVisual=({time}:{time:number})=>{
  const progress=openingState(time).fan;
  return <><FanCardDeck x={300} cardHeight={122} spread={64} progress={progress} cards={skillNames.map((caption,i)=>({id:caption,caption,content:<Texture name={`skill-${i}`}/>}))}/>
    <div style={{position:'absolute',left:405,top:224,opacity:during(progress,.3,.9),transform:`translateY(${mix(9,0,progress)}px)`,background:'#30343f',border:'1px solid #ffffff29',padding:'10px 18px',borderRadius:5,color:'#fff',boxShadow:'0 6px 10px #22252c19',fontSize:14,fontFamily:'monospace',fontWeight:700}}><span style={{color:'#e77a52',fontSize:11,marginRight:7}}>◆</span>SKILL.md</div>
  </>;
};

export const OpeningScene=()=>{
  const frame=useCurrentFrame();
  const {fps,width,height}=useVideoConfig();
  const time=frame/fps;
  const state=openingState(time);
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-opening-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`,overflow:'hidden'}}>
      <PaperBackground time={time}/>
      <ChapterHeading
        intro={{eyebrow:'REMOTION 教程 · 第二期',title:<>一条讲解视频的<br/>制作<span style={{color:'#ca6041'}}>全流程</span>拆解</>,description:'以上期16分钟的视频为例 · 从脚本到成片'}}
        introProgress={state.chapter}
        from={{number:'01 / 03',title:'制作方法',description:'从脚本到成片'}}
        to={{number:'02 / 03',title:'Skill 推荐',description:'大家最关心的'}}
        progress={state.thumbnail}
      />
      <div style={{position:'absolute',left:280,top:62,width:240,textAlign:'center',opacity:during(time,8.5,8.93)}}>
        <div style={{fontSize:8,fontWeight:700,letterSpacing:1.4,color:'#ce7053',marginBottom:7}}>这期聊三件事</div><div style={{fontSize:16,fontWeight:800,color:'#24272d'}}>一条讲解视频的制作全流程拆解</div>
      </div>
      <SceneThumbnail progress={state.thumbnail}>
        <OpeningMethodVisual time={time}/>
      </SceneThumbnail>
      <OpeningSkillVisual time={time}/>
      <Subtitle time={time}/>
    </div>
  </AbsoluteFill>;
};
