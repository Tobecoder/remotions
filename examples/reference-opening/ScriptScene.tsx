import {useId} from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {CardSpotlight,ChapterHeading,ExplodedLayers,ProgressRace,ScriptDocumentGuide,TypewriterComparison} from '../../packages/animations/src';
import {during,mix} from '../../packages/animations/src/reference-opening/motion';
import {PaperBackground,Subtitle} from './OpeningScene';
import {PreparationFilm} from './PreparationScene';

const cover={width:'100%',height:'100%',objectFit:'cover' as const,display:'block'};
const windowOpacity=(time:number,start:number,end:number)=>during(time,start,start+.3)*(1-during(time,end-.3,end));
const ownText='我上期那条 16 分钟的讲解视频，\n是怎么从脚本到成片的？\n这期就拿它来复盘，\n继续聊聊用 Remotion 制作视频的方法。';
const aiText='在当今快速发展的时代，\n值得注意的是，\n这不仅仅是……更是……\n赋能 · 闭环 · 抓手\n让我们一起探索吧！';

const ScriptPages=({time}:{time:number})=>{
  const scroll=during(time,68.7,69.3);
  return <div data-script-page-scroll style={{position:'absolute',inset:0}}>{[0,1].map(i=><Img key={i} src={staticFile(`textures/script-body-${i}.jpg`)} style={{...cover,position:'absolute',inset:0,opacity:i?scroll:1-scroll,transform:`translateY(${i?28*(1-scroll):-28*scroll}px)`}}/>)}</div>;
};

/** Original code illustration inside the sample video card, not a reference clip. */
const NeuronPreview=({time}:{time:number})=>{
  const id=`neuron-${useId().replace(/:/g,'')}`,t=Math.max(0,time);
  const count=t<.6?'':t<1?'1':t<1.5?'50':t<2?'8400万':t<2.5?'390亿':'860亿';
  return <svg data-neuron-preview width="100%" height="100%" viewBox="0 0 336 189" preserveAspectRatio="xMidYMid meet" style={{display:'block',background:'#080e1b'}}>
    <defs><radialGradient id={id}><stop stopColor="#17294a"/><stop offset="1" stopColor="#060b16"/></radialGradient></defs><rect width="336" height="189" fill={`url(#${id})`}/>
    {Array.from({length:28},(_,i)=>{
      const angle=i*2.399963,x=168+Math.cos(angle)*(25+(i%8)*18),y=88+Math.sin(angle)*(15+(i%6)*12),r=1+(i%3)*.6;
      return <g key={i} opacity={mix(.15,.7,during(t,.1+i*.025,.7+i*.025))*(.8+.2*Math.sin(t*2+i))} stroke="#9caed7" strokeWidth=".55"><circle cx={x} cy={y} r={r} fill="#6c8bb8"/>{Array.from({length:5},(_,n)=>{const a=n*Math.PI*.4+i,len=8+(n+i)%4*4;return <path key={n} d={`M${x} ${y}l${Math.cos(a)*len} ${Math.sin(a)*len}m${-Math.cos(a)*len*.35} ${-Math.sin(a)*len*.35}l${Math.cos(a+.7)*len*.4} ${Math.sin(a+.7)*len*.4}`} fill="none"/>;})}</g>;
    })}
    <text data-neuron-count x="168" y="99" textAnchor="middle" fill="#f1f4ff" fontFamily="Georgia,serif" fontSize="32">{count}</text>
    {count&&<text x="168" y="115" textAnchor="middle" fill="#afbdd3" fontSize="6" letterSpacing="2">人脑中的神经元</text>}
    <text x="168" y="172" textAnchor="middle" fill="#d9dfeb" fontSize="7">在每个人的大脑里……</text>
  </svg>;
};

const OverviewLayer=({index}:{index:number})=>index===4?<Img src={staticFile('textures/script.jpg')} style={cover}/>:index===3?<div style={{display:'flex',gap:8,padding:16,height:'100%',boxSizing:'border-box',background:'#fff'}}>{[0,1,4].map(i=><Img key={i} src={staticFile(`textures/skill-${i}.jpg`)} style={{width:'30%',height:'100%',objectFit:'cover'}}/>)}</div>:<div style={{padding:20,boxSizing:'border-box',height:'100%',background:'#fff'}}><div style={{fontSize:13,fontWeight:700,marginBottom:20}}>{['音效与声音','视频制作与 Skill','旁白和 SRT'][index]}</div><svg viewBox="0 0 320 100" width="100%" height="100"><path d={index===0?'M5 50Q15 10 25 50T65 50T105 50T145 50T185 50T225 50T265 50T305 50':'M8 72H310M8 30H260M8 47H290'} fill="none" stroke={index===0?'#879ba7':'#c4c8c5'} strokeWidth={index===0?3:5}/></svg></div>;

const subtitles:readonly [number,string][]=[
  [58,'接下来我们就细拆'],[59.2,'上期视频制作的每个环节'],[63,'首先我会准备一份相当于逐字稿的脚本'],[66.3,'另外那些旁白不念出来'],[69.3,'但要在画面里展示的提示词或说明'],[72,'也会整理进脚本'],[73.7,'我的视频脚本主要自己写'],[75.4,'AI 辅助校验'],[76.5,'因为我觉得 AI 写的东西特别没有体感'],[79.3,'像 Vibe 知识大赏这种'],[81.1,'脚本还可以交给 AI 来写'],[83.1,'但分享自己的经验和方法论'],[85.1,'AI 写的根本没法看'],[86.8,'如果非要推荐一个 AI 写脚本的话'],[89.3,'那目前 Gemini 是一骑绝尘'],[91.5,'GPT 就是个差等生'],[93.3,'成天车轱辘话水字数'],[94.8,'还是重点聊两个大家比较关心的问题'],
];

export const ScriptScene=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  let subtitle=subtitles[0][1];for(const [at,text] of subtitles)if(time>=at)subtitle=text;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-script-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`,overflow:'hidden'}}>
      <PaperBackground time={time}/>
      <div data-script-phase="overview" style={{position:'absolute',inset:0,opacity:windowOpacity(time,58,63.2)}}>
        <div style={{position:'absolute',left:49,top:55,opacity:1-during(time,62.1,62.5)}}><div style={{fontSize:9,letterSpacing:2,fontWeight:700,color:'#ce7556',marginBottom:8}}>接下来</div><div style={{fontSize:31,lineHeight:'37px',fontWeight:900,color:'#292c33'}}>细拆上期的<br/>每个环节</div></div>
        <ExplodedLayers time={time} startAt={57.6} layers={['音效','制作视频和 Skill','旁白和 SRT','素材','脚本'].map((label,i)=>({id:String(i),label,content:<OverviewLayer index={i}/>}))} screen={<Img src={staticFile('textures/screen-0.jpg')} style={cover}/>}/>
      </div>
      <div data-script-chapter style={{position:'absolute',inset:0,opacity:during(time,62.3,62.8)*(1-during(time,63.1,63.5))}}><ChapterHeading x={49} y={124} from={{number:'CHAPTER 01 / 06',title:'脚本',description:'逐字稿 · 素材备注 · 动画备注'}} to={{number:'CHAPTER 01 / 06',title:'脚本',description:'逐字稿 · 素材备注 · 动画备注'}} progress={0}/></div>
      <div data-script-phase="document" style={{position:'absolute',inset:0,opacity:windowOpacity(time,63,73.8)}}><ScriptDocumentGuide time={time} startAt={63} document={<ScriptPages time={time}/>}/></div>
      <div data-script-phase="comparison" style={{position:'absolute',inset:0,opacity:windowOpacity(time,73.7,87)}}>
        <TypewriterComparison time={time} startAt={73.7} ownText={ownText} aiText={aiText} ownThumbnail={<Img src={staticFile('textures/script-body-0.jpg')} style={cover}/>} aiThumbnail={<NeuronPreview time={3}/>}/>
        <div style={{position:'absolute',left:49,top:255,width:318,height:66,boxSizing:'border-box',padding:'16px 20px',borderRadius:9,background:'#fff',boxShadow:'0 7px 15px #30343e17',opacity:during(time,86.25,86.7)}}><div style={{fontSize:15,fontWeight:700,color:'#31363c'}}>分享经验与方法论</div><div style={{fontSize:8,marginTop:4,color:'#989b9d'}}>表达自己的真实体会</div></div>
      </div>
      <div data-script-phase="preview" style={{position:'absolute',inset:0,opacity:windowOpacity(time,79.1,82.9)}}><CardSpotlight time={time} startAt={79.1} from={{x:420,y:175,width:320,height:66}} content={<NeuronPreview time={time-79.1}/>} badge="这种脚本，可以交给 AI 写"/></div>
      <div data-script-phase="takeaway" style={{position:'absolute',inset:0,opacity:windowOpacity(time,83.1,86.9)}}><CardSpotlight time={time} startAt={83.1} from={{x:49,y:255,width:318,height:66}} content={p=><div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontWeight:900,fontSize:mix(17,43,p),whiteSpace:'nowrap',color:'#292c33'}}>经验 · 方法论</div>} badge="AI 写的根本没法看"/></div>
      <div data-script-phase="race" style={{position:'absolute',inset:0,opacity:windowOpacity(time,86.8,95.7)}}><ProgressRace time={time} startAt={86.8} title="AI 写脚本，谁更行？" firstLabel="Gemini" secondLabel="GPT" winnerLabel="一骑绝尘" slowLabel="差等生 · 车轱辘话水字数"/></div>
      <Subtitle time={time} text={subtitle}/>
    </div>
  </AbsoluteFill>;
};

export const ScriptFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  return frame/fps<58?<PreparationFilm/>:<ScriptScene/>;
};
