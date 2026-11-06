import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {ExplodedLayers,TypewriterComparison} from '../../packages/animations/src';
import {ProgressRace} from './compositions/ProgressRace';
import {ScriptDocumentGuide} from './compositions/ScriptDocumentGuide';
import {SpotlightSequence} from './compositions/SpotlightSequence';
import {during,mix} from '../../packages/animations/src/reference-opening/motion';
import {PaperBackground,Subtitle,ScriptPage,MaterialsPage,VoicePage,CaptionsPage,AnimationPage,ScreenContent} from './OpeningScene';
import {PreparationFilm} from './PreparationScene';
import {NeuronPreview} from '../../packages/animations/src/reference-opening/NeuronPreview';
import {getAiComparisonThumbnailRect} from '../../packages/animations/src/reference-opening/TypewriterComparison';

const cover={width:'100%',height:'100%',objectFit:'cover' as const,display:'block'};
const windowOpacity=(time:number,start:number,end:number)=>during(time,start,start+.3)*(1-during(time,end-.3,end));
const ownText='我上期那条 16 分钟的讲解视频，\n是怎么从脚本到成片的？\n这期就拿它来复盘，\n继续聊聊用 Remotion 制作视频的方法。';
const aiText='在当今快速发展的时代，\n值得注意的是，\n这不仅仅是……更是……\n赋能 · 闭环 · 抓手\n让我们一起探索吧！';

const ScriptPages=()=> <div data-script-pages style={{position:'absolute',inset:0}}>{[0,1].map(i=><Img key={i} src={staticFile(`textures/script-body-${i}.jpg`)} style={{...cover,position:'absolute',left:0,top:`${i*50}%`,height:'50%'}}/>)}</div>;

const OverviewLayer=({index,time}:{index:number;time:number})=>index===4?<ScriptPage time={time}/>:index===3?<MaterialsPage time={time}/>:index===2?<CaptionsPage time={time}/>:index===1?<AnimationPage time={time}/>:<VoicePage time={time}/>;

const subtitles:readonly [number,string][]=[
  [58,'接下来我们就细拆'],[59.2,'上期视频制作的每个环节'],[63.6,'首先我会准备一份相当于逐字稿的脚本'],[66.9,'另外那些旁白不念出来'],[69.9,'但要在画面里展示的提示词或说明'],[72.6,'也会整理进脚本'],[73.7,'我的视频脚本主要自己写'],[75.4,'AI 辅助校验'],[76.5,'因为我觉得 AI 写的东西特别没有体感'],[79.3,'像 Vibe 知识大赏这种'],[81.1,'脚本还可以交给 AI 来写'],[83.1,'但分享自己的经验和方法论'],[85.1,'AI 写的根本没法看'],[86.8,'如果非要推荐一个 AI 写脚本的话'],[89.3,'那目前 Gemini 是一骑绝尘'],[91.5,'GPT 就是个差等生'],[93.3,'成天车轱辘话水字数'],[94.8,'还是重点聊两个大家比较关心的问题'],
];

export const ScriptScene=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  let subtitle=subtitles[0][1];for(const [at,text] of subtitles)if(time>=at)subtitle=text;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-script-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`,overflow:'hidden'}}>
      <PaperBackground time={time}/>
      <div data-script-phase="overview" style={{position:'absolute',inset:0,opacity:windowOpacity(time,58,61.8)}}>
        <div style={{position:'absolute',left:49,top:55,opacity:1-during(time,61.4,61.8)}}><div style={{fontSize:9,letterSpacing:2,fontWeight:700,color:'#ce7556',marginBottom:8}}>接下来</div><div style={{fontSize:31,lineHeight:'37px',fontWeight:900,color:'#292c33'}}>细拆上期的<br/>每个环节</div></div>
      </div>
      <div data-script-stack style={{position:'absolute',inset:0,opacity:windowOpacity(time,58,63.6)}}>
        <ExplodedLayers time={time} startAt={57.6} layers={['音效','制作视频和 Skill','旁白和 SRT','素材','脚本'].map((label,i)=>({id:String(i),label,content:(elapsed:number)=><OverviewLayer index={i} time={elapsed}/>}))} screen={elapsed=><ScreenContent time={elapsed}/>}/>
      </div>
      <div data-script-phase="document" style={{position:'absolute',inset:0,opacity:windowOpacity(time,61.8,73.8)}}><ScriptDocumentGuide time={time} startAt={61.8} chapterFrom={{number:'CHAPTER 01 / 06',title:'脚本',description:'逐字稿 · 素材备注 · 动画备注'}} document={<ScriptPages/>} scrollDistance={233}/></div>
      <div data-script-phase="comparison" style={{position:'absolute',inset:0,opacity:windowOpacity(time,73.7,87)}}>
        <TypewriterComparison time={time} startAt={73.7} ownText={ownText} aiText={aiText} ownThumbnail={<Img src={staticFile('textures/script-body-0.jpg')} style={cover}/>} aiThumbnail={<NeuronPreview time={time-79.1}/>}/>
        <div style={{position:'absolute',left:49,top:255,width:318,height:66,boxSizing:'border-box',padding:'16px 20px',borderRadius:9,background:'#fff',boxShadow:'0 7px 15px #30343e17',opacity:during(time,86.25,86.7)}}><div style={{fontSize:15,fontWeight:700,color:'#31363c'}}>分享经验与方法论</div><div style={{fontSize:8,marginTop:4,color:'#989b9d'}}>表达自己的真实体会</div></div>
      </div>
      <div data-script-phase="preview" style={{position:'absolute',inset:0,opacity:time>=79.1&&time<82.9?1:0}}><SpotlightSequence time={time} startAt={79.1} from={getAiComparisonThumbnailRect(time,73.7)} fromRadius={3} content={<NeuronPreview time={time-79.1}/>} badge="这种脚本，可以交给 AI 写"/></div>
      <div data-script-phase="takeaway" style={{position:'absolute',inset:0,opacity:windowOpacity(time,83.1,86.9)}}><SpotlightSequence time={time} startAt={83.1} from={{x:49,y:255,width:318,height:66}} content={p=><div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontWeight:900,fontSize:mix(17,43,p),whiteSpace:'nowrap',color:'#292c33'}}>经验 · 方法论</div>} badge="AI 写的根本没法看"/></div>
      <div data-script-phase="race" style={{position:'absolute',inset:0,opacity:windowOpacity(time,86.8,95.7)}}><ProgressRace time={time} startAt={86.8} title="AI 写脚本，谁更行？" firstLabel="Gemini" secondLabel="GPT" winnerLabel="一骑绝尘" slowLabel="差等生 · 车轱辘话水字数"/></div>
      <Subtitle time={time} text={subtitle}/>
    </div>
  </AbsoluteFill>;
};

export const ScriptFilm=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  return frame/fps<58?<PreparationFilm/>:<ScriptScene/>;
};
