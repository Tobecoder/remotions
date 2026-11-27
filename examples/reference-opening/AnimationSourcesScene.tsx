import {AbsoluteFill,Img,OffthreadVideo,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {CardEntrance} from '../../packages/animations/src';
import {clamp,during,mix} from '../../packages/animations/src/reference-opening/motion';
import {EditorWalkthroughFilm} from './EditorWalkthroughScene';
import {PaperBackground,Subtitle} from './OpeningScene';
import {ResourceCredits} from './compositions/ResourceCredits';

export const animationSourcesSubtitles:readonly [number,string][]=[
 [8046,'你可能想问'],[8082,'为什么不用代码来做动画素材呢'],[8157,'因为视频模型做出来的动作更流畅自然'],[8241,'其实更主要的是'],
 [8277,'到处领各家视频平台的鸡蛋'],[8340,'之前薅得最开心的是千问'],[8400,'一天领十个积分'],[8439,'一条十秒的视频才花两积分'],
 [8504,'不过现在没那么大方了'],[8549,'薅点小积分，做点小素材'],[8621,'还是很有意思的'],[8657,''],
];
const insetStyle={width:'100%',height:'100%',display:'block',objectFit:'cover' as const};
const enterAt=(f:number,start:number,length=10)=>f<start?0:1-(1-clamp((f-start+1)/length))**3;
export const AnimationSourcesGallery=({frame:f,holdLastFrame=false}:{frame:number;holdLastFrame?:boolean})=><div data-sources-gallery style={{position:'absolute',inset:0}}><div style={{position:'absolute',left:0,right:0,top:68,fontSize:24,fontWeight:800,textAlign:'center',color:'#292b34',opacity:during(f,8549,8558)}}>薅点小积分，<span style={{color:'#b84a32'}}>做点小素材</span></div>
  {['Claude Code 炸 Codex','DeepSeek 砸 WorkBuddy','豆包打哈欠'].map((label,i)=>{
    const start=[8553,8575,8597][i],p=enterAt(f,start),contentAt=[8557,8582,8618][i];
    return <div key={i} data-sources-gallery-item={i}>
      <CardEntrance progress={p} x={46+i*245} y={136} width={220} height={165} offset={{x:0,y:16}} borderRadius={12} style={{padding:3,boxSizing:'border-box'}}>
        <div style={{width:'100%',height:'100%',opacity:enterAt(f,contentAt,5)}}>
          {holdLastFrame
            ? <Img src={staticFile('animation-sources/gallery-'+i+'-last.png')} style={insetStyle}/>
            : <Sequence from={start} durationInFrames={8733-start} layout="none"><OffthreadVideo muted src={staticFile('animation-sources/gallery-'+i+'.mp4')} style={insetStyle}/></Sequence>}
        </div>
      </CardEntrance>
      <div style={{position:'absolute',left:46+i*245,top:313+mix(16,0,p),width:220,fontSize:12,fontWeight:800,textAlign:'center',color:'#292b34',opacity:p,transform:'translateZ(0)'}}>{label}</div>
    </div>;
  })}
</div>;
const FlatToy=({time}:{time:number})=><svg viewBox="0 0 260 146" style={{width:'100%',height:'100%'}}><ellipse cx="130" cy="132" rx="37" ry="5" fill="#e1e2df"/><g fill="#727aeb"><rect x="90" y="20" width="80" height="84" rx="30"/><rect x="104" y="96" width="14" height="28" rx="4"/><rect x="142" y="96" width="14" height="28" rx="4"/><rect x="77" y={71+Math.sin(time*8)*8} width="23" height="9" rx="4"/><rect x="160" y={71-Math.sin(time*8)*8} width="23" height="9" rx="4"/></g><path d="M113 56L125 65 113 74M137 73H147" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const AnimationSources=({time}:{time:number})=>{
 const {width,height}=useVideoConfig(),f=Math.round(time*30),compareExit=(1-during(f,8240,8248))**2,creditsExit=(1-during(f,8549,8558))**2;
 return <div data-animation-sources style={{position:'absolute',inset:0}}>
  {f<8061&&<div data-sources-outgoing style={{position:'absolute',left:0,top:0,width:800,height:395,overflow:'hidden',opacity:1-during(f,8048,8060),filter:`blur(${mix(0,4,during(f,8048,8060))}px)`,transform:`scale(${mix(1,1.09,during(f,8048,8060))})`}}><div style={{width,height,transformOrigin:'0 0',transform:`scale(${800/width},${450/height})`}}><EditorWalkthroughFilm holdLastFrame/></div></div>}
  {f<8252&&<div data-sources-comparison style={{position:'absolute',inset:0,opacity:compareExit}}>
   <div style={{position:'absolute',left:0,right:0,top:100,textAlign:'center',opacity:during(f,8053,8061)}}><div style={{fontSize:16,color:'#92959e',fontWeight:800,marginBottom:3}}>你可能想问</div><div style={{fontSize:29,fontWeight:800,color:'#292b34'}}>为什么不用代码来做？</div></div>
   <CardEntrance data-sources-code progress={enterAt(f,8084)} x={107} y={179} width={276} height={176} offset={{x:0,y:20}} borderRadius={13} style={{opacity:enterAt(f,8084)*(1-.55*during(f,8156,8159))}}><div style={{position:'absolute',left:10,top:10,fontSize:9,fontWeight:800,letterSpacing:1,color:'#8a8d95'}}>代码画 · 动作僵硬</div><div style={{position:'absolute',left:5,top:24,width:266,height:146}}><FlatToy time={time}/></div></CardEntrance>
   <CardEntrance data-sources-video progress={enterAt(f,8157)} x={417} y={179} width={276} height={176} offset={{x:0,y:20}} borderRadius={13}><div style={{position:'absolute',left:10,top:10,fontSize:9,fontWeight:800,letterSpacing:1,color:'#c45c40'}}>视频模型 · 流畅自然</div><div style={{position:'absolute',left:5,top:24,width:266,height:146}}><Sequence from={8157} durationInFrames={95} layout="none"><OffthreadVideo muted src={staticFile('animation-sources/comparison.mp4')} style={insetStyle}/></Sequence></div></CardEntrance>
  </div>}
  {f>=8241&&f<8558&&<div data-sources-credits style={{position:'absolute',inset:0,opacity:creditsExit}}><ResourceCredits time={time} startAt={8241/30} copy={{eyebrow:'其实更主要的是',title:'到处领平台的「鸡蛋」',platform:'千问',description:'之前薅得最开心',dailyLabel:'每天领',changedLabel:'现在没那么大方了'}} icon={<Img src={staticFile('animation-sources/platform.jpg')} style={insetStyle}/>}/></div>}
  {f>=8549&&<AnimationSourcesGallery frame={f}/>}
 </div>;
};
export const AnimationSourcesFilm=()=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
 if(frame<8046)return <EditorWalkthroughFilm/>;
 let subtitle=animationSourcesSubtitles[0][1];for(const [at,text] of animationSourcesSubtitles)if(frame>=at)subtitle=text;
 return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}><div data-animation-sources-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}><PaperBackground time={time}/><AnimationSources time={time}/>{subtitle&&<Subtitle time={time} text={subtitle}/>}</div></AbsoluteFill>;
};
