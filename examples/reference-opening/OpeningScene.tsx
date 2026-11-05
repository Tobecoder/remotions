import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChapterHeading, ExplodedLayers, FanCardDeck, SceneThumbnail, openingState} from '../../packages/animations/src/reference-opening';
import {during, mix} from '../../packages/animations/src/reference-opening/motion';

const texture=(name:string)=>staticFile(`textures/${name}.jpg`);
const imageStyle={width:'100%',height:'100%',objectFit:'cover' as const,display:'block'};
const Texture=({name}:{name:string})=><Img src={texture(name)} style={imageStyle}/>;

const PaperBackground=({time}:{time:number}) => {
  const blurOpacity=1-during(time,2.5,3.65);
  return <>
    <AbsoluteFill style={{background:'#f5f6ef'}}><Img src={texture('paper')} style={imageStyle}/></AbsoluteFill>
    <div style={{position:'absolute',inset:-30,filter:'blur(3px)',opacity:blurOpacity*.33,transform:`translateY(${-time*1.3}px) scale(1.02)`}}>
      {[[-32,24,137,111,-5],[188,28,140,115,4],[328,-53,217,140,-3],[588,-36,207,106,5],[728,103,134,160,-4],[66,313,195,148,-7],[300,371,149,119,4],[500,335,215,147,-5],[604,270,124,82,3]].map(([x,y,w,h,rotation],i)=><div key={i} style={{position:'absolute',left:x,top:y,width:w,height:h,transform:`rotate(${rotation}deg)`,background:'#fff',padding:7,boxShadow:'0 7px 9px #34393417',opacity:.7}}><div style={{height:'70%',background:i%3===0?'#aab0b5':'#e0e0d7',overflow:'hidden'}}>{i%3!==0?<Texture name={`screen-${i%3}`}/>:null}</div><div style={{height:3,background:'#b9bcba',width:'65%',margin:'10px auto'}}/><div style={{height:2,background:'#b9bcba',width:'43%',margin:'5px auto'}}/></div>)}
    </div>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 42%,transparent 35%,#c9ccbd0d 100%)'}}/>
  </>;
};

const ScriptPage=()=> <Texture name="script"/>;

const MaterialsPage=()=> <div style={{height:'100%',background:'#fff',padding:13,boxSizing:'border-box'}}>
  <div style={{fontSize:10,fontWeight:800,marginBottom:10}}>素材 · 用画面把内容讲清楚</div>
  <div style={{display:'flex',gap:9,height:124}}>{[0,1,4].map(i=><div key={i} style={{flex:1,overflow:'hidden',borderRadius:2}}><Texture name={`skill-${i}`}/></div>)}</div>
  <div style={{display:'flex',gap:7,marginTop:11}}>{['画面参考','内容素材','示例演示'].map(t=><div key={t} style={{fontSize:6,background:'#f6f4ed',padding:'4px 12px',color:'#777'}}>{t}</div>)}</div>
</div>;

const VoicePage=()=> <div style={{height:'100%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
  <svg width="310" height="104" viewBox="0 0 310 104"><line x1="0" x2="310" y1="52" y2="52" stroke="#d7d7d4"/>{Array.from({length:155},(_,i)=>{const envelope=(Math.sin(i*.121)**2*.55+Math.sin(i*.043)**8*.45)*Math.sin(Math.PI*i/154);const height=4+envelope*91;return <rect key={i} x={i*2} y={52-height/2} width="1.2" height={height} fill="#35383b"/>;})}</svg>
</div>;

const CaptionsPage=()=> <div style={{height:'100%',background:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12}}>
  {['我上期那条16分钟的讲解视频','是怎么从脚本到成片的'].map(text=><div key={text} style={{fontSize:16,fontWeight:700,color:'white',padding:'7px 12px',borderRadius:3,background:'#303540'}}>{text}</div>)}
</div>;

const AnimationPage=()=> <div style={{height:'100%',background:'linear-gradient(115deg,#fff 20%,#fff8e9 78%,#fff 100%)',padding:18,boxSizing:'border-box'}}>
  <div style={{fontSize:10,fontWeight:700,marginBottom:15}}>Animation · 逐帧编排</div>
  <svg width="320" height="116" viewBox="0 0 320 116"><path d="M12 93C90 93 95 35 160 35S250 93 307 93" fill="none" stroke="#9da3a5" strokeWidth=".8"/><line x1="12" x2="307" y1="94" y2="94" stroke="#686d70" strokeWidth="1"/>{Array.from({length:9},(_,i)=><g key={i}><path d={`M${14+i*36},90l4 4-4 4-4-4Z`} fill={i%2?'#3d4146':'#e37651'}/><line x1={14+i*36} x2={14+i*36} y1="94" y2={97+i%3*2} stroke="#51565c" strokeWidth=".7"/></g>)}</svg>
</div>;

/** Contents can be replaced independently of the camera/stack animation. */
const ScreenContent=({time}:{time:number})=> {
  const moments=[0,.9,1.8,3.05,3.9,4.7,5.8,6.7,7.6];
  let current=0;
  moments.forEach((at,index)=>{if(time>=at)current=index;});
  return <div style={{position:'relative',width:'100%',height:'100%',background:'#f8f8fc'}}>{moments.map((_,i)=><div key={i} data-screen-frame={i} style={{position:'absolute',inset:0,opacity:Number(i===current)}}><Texture name={`screen-${i}`}/></div>)}</div>;
};

const Subtitle=({time}:{time:number})=>{
  const text=time<1.9?'我上期那条16分钟的讲解视频':time<4.5?'是怎么从脚本到成片的':time<5.8?'这期就拿它来复盘':time<8.6?'继续聊聊用Remotion制作视频的方法':'还有大家关心的Skill推荐';
  return <div style={{position:'absolute',left:0,right:0,bottom:20,display:'flex',justifyContent:'center'}}><div style={{padding:'5px 12px 6px',borderRadius:4,background:'#2b3241f2',boxShadow:'0 2px 4px #1b233519',color:'#fff',fontSize:15,fontWeight:700,lineHeight:'20px'}}>{text}</div></div>;
};

const skillNames=['lemo-opuscar','huashu-slides','illustration','handdraw','og-style'];

export const OpeningScene=()=>{
  const frame=useCurrentFrame();
  const {fps,width,height}=useVideoConfig();
  const time=frame/fps;
  const state=openingState(time);
  const layers=[
    {id:'animation',label:'动画',content:<AnimationPage/>,enterAt:5.4,duration:.55},
    {id:'captions',label:'字幕',content:<CaptionsPage/>,enterAt:5.0,duration:.55},
    {id:'voice',label:'配音',content:<VoicePage/>,enterAt:4.65,duration:.55},
    {id:'materials',label:'素材',content:<MaterialsPage/>,enterAt:4.3,duration:.55},
    {id:'script',label:'脚本',content:<ScriptPage/>,enterAt:2.55,duration:.75},
  ];
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
        <ExplodedLayers time={time} tiltProgress={state.tilt} layers={layers} opaquePaper screen={<ScreenContent time={time}/>} labelOpacity={1-during(time,8.5,8.83)}/>
      </SceneThumbnail>
      <FanCardDeck x={300} cardHeight={122} spread={64} progress={state.fan} cards={skillNames.map((caption,i)=>({id:caption,caption,content:<Texture name={`skill-${i}`}/>}))}/>
      <div style={{position:'absolute',left:405,top:224,opacity:during(state.fan,.3,.9),transform:`translateY(${mix(9,0,state.fan)}px)`,background:'#30343f',border:'1px solid #ffffff29',padding:'10px 18px',borderRadius:5,color:'#fff',boxShadow:'0 6px 10px #22252c19',fontSize:14,fontFamily:'monospace',fontWeight:700}}><span style={{color:'#e77a52',fontSize:11,marginRight:7}}>◆</span>SKILL.md</div>
      <Subtitle time={time}/>
    </div>
  </AbsoluteFill>;
};
