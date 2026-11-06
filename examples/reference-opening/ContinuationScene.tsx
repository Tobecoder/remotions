import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {AudioPulseBadge,BranchingPaths,ChapterCardRow,ChapterHeading,SceneThumbnail} from '../../packages/animations/src';
import {pathCardLayout} from '../../packages/animations/src/reference-opening/continuation-motion';
import {during,mix} from '../../packages/animations/src/reference-opening/motion';
import {OpeningMethodVisual,OpeningScene,OpeningSkillVisual,PaperBackground,Subtitle} from './OpeningScene';

const skill={number:'02 / 03',title:'Skill 推荐',description:'大家最关心的'};
const sound={number:'03 / 03',title:'音效处理',description:'合成，不如找到'};
// Finish entering the sound chapter before its subtitle starts.
const soundCueAt=10.45;

const Miniature=({kind,progress=0,time}:{kind:'method'|'skill'|'sound';progress?:number;time:number})=>{
  const starts={method:{x:-42,y:-15,scale:.23},skill:{x:-92,y:-33,scale:.3},sound:{x:-72,y:-33,scale:.28}};
  const from=starts[kind],scale=mix(from.scale,kind==='method'?.34:kind==='skill'?.4:.48,progress);
  const x=mix(from.x,kind==='method'?-69:kind==='skill'?-115:-140,progress),y=mix(from.y,kind==='method'?-10:-46,progress);
  return <div style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`translate(${x}px,${y}px) scale(${scale})`}}>
    {kind==='method'?<OpeningMethodVisual time={10}/>:kind==='skill'?<OpeningSkillVisual time={10}/>:<AudioPulseBadge time={time}/>}
  </div>;
};

const PrinciplesHeader=({time}:{time:number})=><div data-principles-header style={{position:'absolute',inset:0,opacity:during(time,13.25,13.65)}}>
  <div style={{position:'absolute',left:49,top:47,display:'flex',gap:9}}>{[1,2].map(number=><div key={number} style={{width:number===1?150:166,height:37,border:`.7px solid ${number===1?'#d68470':'#aeb1ae'}`,borderRadius:9,boxSizing:'border-box',padding:8}}><div style={{width:19,height:19,border:`.7px solid ${number===1?'#d68470':'#aeb1ae'}`,borderRadius:'50%',textAlign:'center',lineHeight:'19px',fontSize:10,fontFamily:'monospace',color:number===1?'#ca7157':'#8d9297'}}>{number}</div></div>)}</div>
  <div style={{position:'absolute',left:49,top:105,color:'#ca7157',fontSize:9,fontWeight:700}}>第一</div>
  <div style={{position:'absolute',left:49,top:116,fontSize:36,fontWeight:900,letterSpacing:-1,color:'#272a30'}}>没有标准答案</div>
  <div style={{position:'absolute',left:49,top:169,fontSize:13,fontWeight:600,color:'#8f9296',opacity:during(time,14.9,15.3)}}>用代码做动画，没有固定套路</div>
</div>;

/** The continuation shares real material components and content with the opening, not flattened screenshots. */
export const ContinuationScene=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  const collect=during(time,12,12.85),overviewOut=1-during(time,13.15,13.5);
  const text=time<soundCueAt?'还有大家关心的Skill推荐':time<11.8?'音效怎么处理':time<13.2?'展开具体内容之前':time<15?'我想先分享两点：第一':time<17.2?'用代码做动画没有固定套路':time<19?'更没有什么标准答案':'我分享自己摸索的一些方法';
  const cardContent=(kind:'method'|'skill'|'sound')=><Miniature kind={kind} progress={collect} time={time}/>;
  const pathCards=pathCardLayout.map((layout,i)=>({...layout,id:`path-${i}`,content:<Img src={staticFile(`textures/path-${i}.jpg`)} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>}));
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-continuation-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`,overflow:'hidden'}}>
      <PaperBackground time={time}/>
      <div style={{position:'absolute',inset:0,opacity:overviewOut}}>
        <div style={{position:'absolute',left:200,top:mix(62,80,collect),width:400,textAlign:'center'}}>
          <div style={{fontSize:8,fontWeight:700,letterSpacing:1.4,color:'#ce7053',marginBottom:7}}>这期聊三件事</div><div style={{fontSize:mix(16,23,collect),fontWeight:800,color:'#24272d'}}>一条讲解视频的制作全流程拆解</div>
        </div>
        {time<11.95?<>
          <div style={{position:'absolute',inset:0,opacity:1-during(time,11.35,11.85)}}><ChapterHeading from={skill} to={sound} progress={during(time,10,soundCueAt)}/></div>
          <SceneThumbnail progress={1}><OpeningMethodVisual time={10}/></SceneThumbnail>
          <SceneThumbnail progress={during(time,10,soundCueAt)} target={{x:240,y:280,scale:.3}} card={{x:325,y:310,width:153,height:92}} number="02" caption="Skill 推荐"><OpeningSkillVisual time={10}/></SceneThumbnail>
          <div style={{position:'absolute',inset:0,opacity:during(time,10.1,soundCueAt)}}><SceneThumbnail progress={during(time,11.35,11.95)} target={{x:430,y:280,scale:.28}} card={{x:495,y:310,width:153,height:92}} number="03" caption="音效处理"><AudioPulseBadge time={time}/></SceneThumbnail></div>
        </>:<ChapterCardRow progress={collect} cards={[
          {id:'method',title:'制作方法',description:'从脚本到成片',content:cardContent('method')},
          {id:'skill',title:'Skill 推荐',description:'找素材 · 选零件',content:cardContent('skill')},
          {id:'sound',title:'音效处理',description:'合成，不如找到',content:cardContent('sound')},
        ]}/>}
      </div>
      <PrinciplesHeader time={time}/>
      <BranchingPaths time={time} startAt={14.9} cards={pathCards}/>
      <Subtitle time={time} text={text}/>
    </div>
  </AbsoluteFill>;
};

export const Opening20Scene=()=>useCurrentFrame()<300?<OpeningScene/>:<ContinuationScene/>;
