import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {ConstraintRelease,ConstraintSwitches,RisingCurve,SectionCollapse,TargetReticle,TetheredMotion} from '../../packages/animations/src';
import {DocumentFocusGallery} from './compositions/DocumentFocusGallery';
import {during} from '../../packages/animations/src/reference-opening/motion';
import {FirstPointScene} from './ContinuationScene';
import {PaperBackground,Subtitle} from './OpeningScene';

const windowOpacity=(time:number,start:number,end:number)=>during(time,start,start+.4)*(1-during(time,end-.4,end));
const fullImage={width:'100%',height:'100%',objectFit:'cover' as const,display:'block'};
const Quote=()=> <div style={{padding:'15px 18px',height:'100%',boxSizing:'border-box',overflow:'hidden'}}>
  <div style={{fontFamily:'monospace',fontSize:8,letterSpacing:2,color:'#787d79',marginBottom:10}}>OPENAI · 官方说明</div>
  <div style={{fontSize:17,lineHeight:'24px',color:'#25272d'}}>Get more out of GPT-6 Astra by revisiting your skills, AGENTS.md, and task prompts.</div>
  <div style={{height:2,background:'#c56545',margin:'10px 0 13px'}}/>
  <div style={{fontFamily:'monospace',fontSize:8,letterSpacing:2,color:'#787d79',marginBottom:8}}>ANTHROPIC · 提示词指南</div>
  <div style={{fontSize:14,lineHeight:'22px',color:'#656b6b'}}>Existing Claude Opus 5 prompts should perform well.</div>
</div>;

export const SecondPointScene=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  const nav=1-during(time,51,51.45),gallery=windowOpacity(time,39.8,45.65);
  const text=time<27?'第二，先开枪后瞄准':time<29.1?'我自己的习惯是极简主义先行':time<31.4?'能不额外加Skill就先不加':time<33.5?'非必须的约束也先不加':time<36.1?'我管它三七二十一的先跑起来跑偏了':time<37.4?'再增加约束':time<39.8?'因为现在模型越来越聪明了':time<41?'OpenAI和Anthropic也在':time<42.3?'官方文档反复强调':time<45.6?'不要拿过去老模型的方法来用现在的模型':time<47.6?'而我自己的体验也是':time<48.9?'有时候减少了限制':time<51.1?'AI反而交出了一些让我惊喜的效果':'我制作讲解视频会先准备这些素材';
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-second-point-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`,overflow:'hidden'}}>
      <PaperBackground time={time}/>
      <div style={{position:'absolute',inset:0,opacity:nav}}>
        <SectionCollapse progress={1} label="没有标准答案" children={null}/>
        <div style={{position:'absolute',left:208,top:47,width:166,height:37,border:'0.7px solid #d68470',borderRadius:9,boxSizing:'border-box',padding:8}}><div style={{width:19,height:19,border:'.7px solid #d68470',borderRadius:'50%',textAlign:'center',lineHeight:'19px',fontSize:10,fontFamily:'monospace',color:'#ca7157'}}>2</div></div>
        <SectionCollapse progress={during(time,50.3,51)} label="先开枪，后瞄准" number="2" target={{x:208,y:47,width:166,height:37}}>
          <div data-second-point-title style={{position:'absolute',inset:0,opacity:during(time,25,25.4)*(1-gallery)}}><div style={{position:'absolute',left:49,top:105,fontSize:9,fontWeight:700,color:'#ca7157'}}>第二</div><div style={{position:'absolute',left:49,top:116,fontSize:36,fontWeight:900,letterSpacing:-1,color:'#272a30'}}>先开枪，后瞄准</div></div>
          <div data-second-phase="aim" style={{position:'absolute',inset:0,opacity:windowOpacity(time,25,33.85)}}><TargetReticle time={time} startAt={25}/><ConstraintSwitches time={time} startAt={25}/></div>
          <div data-second-phase="tether" style={{position:'absolute',inset:0,opacity:windowOpacity(time,33.4,37.35)}}><TetheredMotion time={time} startAt={33.4} spriteSrc={staticFile('characters/runner-v2.png')}/></div>
          <div data-second-phase="growth" style={{position:'absolute',inset:0,opacity:windowOpacity(time,37.2,39.95)}}><RisingCurve progress={during(time,37.35,39)}/></div>
          <div data-second-phase="documents" style={{position:'absolute',inset:0,opacity:gallery}}><DocumentFocusGallery time={time} startAt={39.8} documents={Array.from({length:5},(_,i)=>({id:String(i),content:<Img src={staticFile(`textures/document-${i}.jpg`)} style={fullImage}/>}))} caption={<><div style={{fontSize:13,letterSpacing:2,color:'#8c8e90',marginBottom:7}}>OpenAI · Anthropic</div><div style={{fontSize:26,fontWeight:800,color:'#303339'}}>官方文档<br/><span style={{color:'#ca6a4d'}}>反复强调</span></div></>} focusContent={<Quote/>}/></div>
          <div data-second-phase="release" style={{position:'absolute',inset:0,opacity:during(time,45.6,46)}}><div style={{position:'absolute',left:49,top:185,fontSize:14,color:'#95969a',fontWeight:600}}>我自己的体验</div><div style={{position:'absolute',left:49,top:205,fontSize:24,fontWeight:800,color:'#484b50'}}>限制少了</div><ConstraintRelease time={time} startAt={45.6} content={<Img src={staticFile('textures/screen-0.jpg')} style={fullImage}/>}/></div>
        </SectionCollapse>
      </div>
      <div data-before-work style={{position:'absolute',left:49,top:80,opacity:during(time,51.6,52.1)}}><div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#ca7157',marginBottom:9}}>开工之前</div><div style={{fontSize:25,fontWeight:800,color:'#292c32'}}>我会先准备这些素材</div></div>
      <Subtitle time={time} text={text}/>
    </div>
  </AbsoluteFill>;
};

export const BeforeWorkScene=()=>useCurrentFrame()<750?<FirstPointScene/>:<SecondPointScene/>;
