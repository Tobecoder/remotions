import {AbsoluteFill,Img,OffthreadVideo,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {GreenScreenFilm} from './GreenScreenScene';
import {PaperBackground,Subtitle} from './OpeningScene';
import {GreenScreenFlow} from './compositions/GreenScreenMaterials';
import {TutorialWalkthrough} from './compositions/TutorialWalkthrough';

export const editorWalkthroughSubtitles:readonly [number,string][]=[
 [7333,'你可以直接丢给Agent让它帮你处理'],[7336,'或者自己在剪辑软件里抠一下'],
 [7408,'先用蒙版把水印切掉'],[7471,'然后抠像，选择色度抠像'],[7551,'把绿色抠掉，抠的强度太高'],
 [7623,'容易把影子也抹没了'],[7674,'降低一点，还有绿色怎么办'],[7736,'在调整里找到HSL'],
 [7807,'把绿色的饱和度这里拉到最低'],[7877,''],[7884,'然后导出'],[7912,'视频编码选择Alpha'],[7973,'导出的就是透明底的动画素材了'],
];
const insetStyle={display:'block',width:'100%',height:'100%',objectFit:'cover' as const};
/** Explicit snapshot time keeps an outgoing shot independent of a trimmed composition clock. */
export const EditorWalkthroughFilm=({holdLastFrame=false}:{holdLastFrame?:boolean}={})=>{
 const currentFrame=useCurrentFrame(),frame=holdLastFrame?8045:currentFrame,{fps,width,height}=useVideoConfig(),time=frame/fps;
 if(frame<7333)return <GreenScreenFilm/>;
 let subtitle=editorWalkthroughSubtitles[0][1];for(const [at,text] of editorWalkthroughSubtitles)if(frame>=at)subtitle=text;
 return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
  <div data-editor-walkthrough-scene style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
   <PaperBackground time={time}/><GreenScreenFlow time={time} endFrame={8046} mediaDir="editor-walkthrough" frozen={holdLastFrame}/>
   <TutorialWalkthrough time={time} startAt={7333/30} previousStage={<Img src={staticFile('editor-walkthrough/previous-stage.jpg')} style={insetStyle}/>}>
    {!holdLastFrame?<Sequence from={7333} durationInFrames={713} layout="none"><OffthreadVideo muted src={staticFile('editor-walkthrough/editor-screen.mp4')} style={insetStyle}/></Sequence>:<Img src={staticFile('animation-sources/editor-screen-last.png')} style={insetStyle}/>}
   </TutorialWalkthrough>
   {subtitle&&<Subtitle time={time} text={subtitle}/>}
  </div>
 </AbsoluteFill>;
};
