import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AudioPulseBadge, BlurredCollage, BranchingPaths, ChapterCardRow, ChapterHeading, ConstraintRelease, ConstraintSwitches, CardEntrance, FocusLayer, ExplodedLayers, FanCardDeck, PerspectivePanel, RisingCurve, ContentCollapse, TargetReticle, TetheredMotion} from '../../../packages/animations/src';
import {pathCardLayout} from '../../../packages/animations/src/reference-opening/continuation-motion';
import {during, tiltedPose} from '../../../packages/animations/src/reference-opening/motion';
import type {MaterialId} from './catalog';
import {AgentPipeline,TypewriterComparison,CardSpotlight,ProgressRow,DocumentWindow,HighlightBox,CollapsingTitle} from '../../../packages/animations/src';
import {PreparationArtwork} from './PreparationArtwork';
import {PanelScroll,LiveWaveform,LiveTimeline,LiveCaptionLines} from '../../../packages/animations/src/reference-opening/LivePanelContent';
import {NeuronPreview} from '../../../packages/animations/src/reference-opening/NeuronPreview';
import {getAiComparisonThumbnailRect} from '../../../packages/animations/src/reference-opening/TypewriterComparison';

const colors=['#405c81','#76a8b2','#c78661','#a99ac1','#cb9e66'];

const DemoDocument=({title='把复杂内容讲清楚',kind=0,time}:{title?:string;kind?:number;time?:number})=><div style={{width:'100%',height:'100%',background:'#fff',padding:20,boxSizing:'border-box'}}>
  <div style={{fontSize:7,letterSpacing:2,color:'#ba7657',fontWeight:700,marginBottom:12}}>REMOTIONS / LIBRARY</div>
  <div style={{fontSize:24,fontWeight:800,color:'#30323a',marginBottom:15}}>{title}</div>
  {time!==undefined&&kind===1?<LiveWaveform time={time} height={75}/>:time!==undefined&&kind===3?<LiveTimeline time={time}/>:time!==undefined&&kind===2?<div style={{height:90}}><LiveCaptionLines time={time} lines={['先有旁白，再配画面','让字幕跟上阅读节奏']}/></div>:kind===1?<svg width="310" height="75" viewBox="0 0 310 75">{Array.from({length:100},(_,i)=>{const h=4+Math.sin(i*.13)**2*Math.sin(Math.PI*i/99)*65;return <rect key={i} x={i*3.1} y={(75-h)/2} width="1.3" height={h} fill="#405c81"/>;})}</svg>:<div style={{display:'flex',gap:10}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:78,borderRadius:5,background:colors[(i+kind)%colors.length]+'24',border:`1px solid ${colors[(i+kind)%colors.length]}33`,padding:12,color:colors[(i+kind)%colors.length]}}><div style={{fontSize:21,fontWeight:800}}>{String(i+1).padStart(2,'0')}</div><div style={{height:3,background:'currentColor',opacity:.3,marginTop:9,width:'70%'}}/></div>)}</div>}
  <div style={{display:'flex',gap:8,marginTop:12}}>{[88,62,40].map(w=><div key={w} style={{height:3,width:w,background:'#dce0e3'}}/>)}</div>
</div>;

const FanArtwork=({index}:{index:number})=><div style={{position:'relative',width:'100%',height:'100%',background:colors[index],overflow:'hidden'}}>
  <svg viewBox="0 0 100 130" width="100%" height="100%"><circle cx={25+index*10} cy="35" r="26" fill="#ffffff50"/><path d={`M-10 ${100-index*7}L${50+index*5} 45L120 140H-10Z`} fill="#ffffff27"/><path d="M0 125L100 70V130H0Z" fill="#00000012"/><text x="13" y="112" fill="#fff" fontSize="30" fontWeight="800" fontFamily="sans-serif">0{index+1}</text></svg>
</div>;

const PathArtwork=({index}:{index:number})=><svg viewBox="0 0 160 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="160" height="90" fill={colors[index%colors.length]}/><circle cx={45+index%3*25} cy="35" r="24" fill="#ffffff44"/><path d="M0 90L60 35L120 90Z" fill="#ffffff28"/><path d="M70 90L120 54L170 90Z" fill="#ffffff44"/><text x="12" y="76" fontSize="13" fontFamily="sans-serif" fill="#fff">{['构思','素材','实验','结果'][index%4]}</text></svg>;


const GalleryDocument=({index}:{index:number})=><div style={{padding:16,boxSizing:'border-box',height:'100%',background:'#fff',color:'#30343e'}}><div style={{fontFamily:'monospace',fontSize:8,color:'#8d9296',marginBottom:8}}>REFERENCE / 0{index+1}</div><div style={{fontSize:19,fontWeight:800,marginBottom:13}}>{['从参考到方法','让结构更清楚','把证据放进画面','减少不必要的条件','重新组织信息'][index%5]}</div><div style={{height:40,background:colors[index%5]+'33',marginBottom:11}}/>{[95,78,88].map((w,i)=><div key={i} style={{width:`${w}%`,height:3,background:'#d8dde0',marginTop:5}}/>)}</div>;
const GalleryQuote=()=> <div style={{padding:22}}><div style={{fontFamily:'monospace',fontSize:9,letterSpacing:2,color:'#8b9093'}}>REFERENCE · 关键说明</div><div style={{fontSize:25,fontWeight:800,color:'#30343e',margin:'13px 0'}}>用一张引文卡，把重点讲清楚。</div><div style={{height:2,background:'#ca704e',marginBottom:14}}/><div style={{fontSize:16,color:'#83888e'}}>文字、图片或图表，都可以在这里突出展示。</div></div>;

const PerspectiveDemo=({time}:{time:number})=><PerspectivePanel from={{x:220,y:114,ax:1,ay:0,bx:0,by:1}} to={{...tiltedPose,x:355,y:128}} progress={during(time,.45,2.1)} borderColor="#30343d" borderWidth={4}><DemoDocument/></PerspectivePanel>;

const CardEntranceDemo=({time}:{time:number})=><>{Array.from({length:6},(_,i)=><CardEntrance key={i} progress={during(time,.15+i*.2,.6+i*.2)} x={60+(i%3)*240} y={65+Math.floor(i/3)*180} width={200} height={150} rotation={[-2,1,-1,2,-1,1][i]}><GalleryDocument index={i}/></CardEntrance>)}</>;

const SpotlightDemo=({time}:{time:number})=>{
  const from=getAiComparisonThumbnailRect(time+5.4),progress=during(time,0,.4)*(1-during(time,3,3.5));
  return <>
    <div style={{position:'absolute',left:49,top:122,fontSize:20,fontWeight:800,color:'#34383d'}}>从缩略图放大，讲完再归位</div>
    <div style={{position:'absolute',left:420,top:175,width:320,height:66,background:'#fff',borderRadius:9}}><div style={{position:'absolute',left:81,top:20,fontSize:15,fontWeight:700,color:'#34373d'}}>『Vibe 知识大赏』</div></div>
    <div data-spotlight-source-thumbnail style={{position:'absolute',left:from.x,top:from.y,width:from.width,height:from.height,borderRadius:3,overflow:'hidden'}}><NeuronPreview time={time}/></div>
    <CardSpotlight progress={progress} from={from} to={{x:232,y:138,width:336,height:189}} fromRadius={3} content={<NeuronPreview time={time}/>} />
  </>;
};

const LayersDemo=({time}:{time:number})=><ExplodedLayers time={time} front={{x:220,y:94,ax:1,ay:0,bx:0,by:1}} pose={{...tiltedPose,x:291}} screen={elapsed=><DemoDocument title="一条完整的讲解视频" kind={3} time={elapsed}/>} layers={[
  {id:'animation',label:'动画',content:elapsed=><DemoDocument title="逐帧编排" kind={3} time={elapsed}/>},
  {id:'captions',label:'字幕',content:elapsed=><DemoDocument title="跟着内容讲清楚" kind={2} time={elapsed}/>},
  {id:'voice',label:'配音',content:elapsed=><DemoDocument title="声音与节奏" kind={1} time={elapsed}/>},
  {id:'materials',label:'素材',content:elapsed=><PanelScroll time={elapsed} distance={12}><DemoDocument title="图片与画面素材" kind={4}/></PanelScroll>},
  {id:'script',label:'脚本',content:elapsed=><PanelScroll time={elapsed}><DemoDocument title="从一个清楚的问题开始"/></PanelScroll>},
]}/>;

/** Every card mounts one standalone material, independently of the ten-second scene. */
export const MaterialDemo=({id}:{id:MaterialId})=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  let content;
  switch(id){
    case 'document-window':content=<DocumentWindow x={200} y={80} width={400} height={290} title="操作指南" enterProgress={during(time,0,.4)} scrollProgress={during(time,.8,4.4)} scrollDistance={240}><div style={{padding:'12px 24px',fontSize:10,lineHeight:'18px',color:'#484d55'}}><div style={{fontSize:15,fontWeight:700,marginBottom:10}}>把操作步骤整理清楚</div>{Array.from({length:20},(_,i)=><p key={i} style={{margin:'0 0 4px'}}>第 {i+1} 步：准备内容，核对信息，再展示当前要完成的操作。</p>)}</div></DocumentWindow>;break;
    case 'highlight-box':content=<><div style={{position:'absolute',left:200,top:80,width:400,height:280,borderRadius:10,overflow:'hidden',boxShadow:'0 8px 17px #33363c1d'}}><DemoDocument title="需要关注的区域"/></div><HighlightBox progress={during(time,.5,1.2)} x={220} y={174} width={350} height={94} color="#409eff" shadowColor="#409eff22"/></>;break;
    case 'collapsing-title':content=<CollapsingTitle progress={during(time,1.2,2.2)} title="核心概念" lead="接下来说明" description="先展开讲清楚" compactDescription="归纳为一条要点" from={{x:140,y:220}} to={{x:100,y:120}}/>;break;
    case 'typewriter-comparison':content=<TypewriterComparison time={time} ownText={'先把问题讲清楚。\n再用一个例子展开。\n保留真实的经验与体会。'} aiText={'这是一个重要的时代。\n换句话说，值得注意的是，\n让我们一起探索更多可能。'} ownThumbnail={<PreparationArtwork kind={0}/>} aiThumbnail={<PathArtwork index={2}/>}/>;break;
    case 'card-spotlight':content=<SpotlightDemo time={time}/>;break;
    case 'progress-row':{const progress=during(time,.4,4.4);content=<ProgressRow label="素材准备" progress={progress} color="#409eff" time={time} status={progress>=1?'complete':'waiting'} caption={<span style={{fontSize:11,color:'#7c8593'}}>收集并整理画面素材</span>} value={`${Math.round(progress*100)}%`}/>;break;}
    case 'agent-pipeline':content=<AgentPipeline time={time} output={<DemoDocument title="一条完整的讲解视频"/>}/>;break;
    case 'target-reticle':content=<TargetReticle time={time}/>;break;
    case 'constraint-switches':content=<ConstraintSwitches time={time+2.2}/>;break;
    case 'tethered-motion':content=<TetheredMotion time={time} spriteSrc="/characters/runner-v2.png"/>;break;
    case 'rising-curve':content=<RisingCurve progress={during(time,.2,1.8)}/>;break;
    case 'card-entrance':content=<CardEntranceDemo time={time}/>;break;
    case 'focus-layer':content=<FocusLayer progress={during(time,.6,1.4)} rect={{x:105,y:168,width:600,height:183}} foreground={<GalleryQuote/>}/>;break;
    case 'constraint-release':content=<><div style={{position:'absolute',left:49,top:116,fontSize:36,fontWeight:900,color:'#272a30'}}>减少限制，释放画面</div><ConstraintRelease time={time} content={<GalleryDocument index={0}/>}/></>;break;
    case 'content-collapse':content=<ContentCollapse progress={during(time,1.65,2.4)} to={{x:60,y:45,scale:.3}}><div style={{position:'absolute',left:160,top:100,width:480,height:250,borderRadius:12,overflow:'hidden',boxShadow:'0 8px 20px #30343e18'}}><DemoDocument title="任意内容，收拢到指定位置"/></div></ContentCollapse>;break;
    case 'audio-pulse-badge':content=<AudioPulseBadge time={time} x={400} y={225}/>;break;
    case 'chapter-card-row':content=<ChapterCardRow progress={during(time,.5,1.35)} cards={['制作方法','Skill 推荐','音效处理'].map((title,i)=>({id:String(i),title,description:['从脚本到成片','找素材 · 选零件','合成，不如找到'][i],content:i===2?<div style={{position:'absolute',left:'50%',top:'50%'}}><AudioPulseBadge time={time} x={0} y={0} size={38}/></div>:<PathArtwork index={i}/>}))}/>;break;
    case 'branching-paths':content=<><div style={{position:'absolute',left:49,top:90,fontSize:36,fontWeight:900,color:'#272a30'}}>没有标准答案</div><div style={{position:'absolute',left:49,top:143,fontSize:13,color:'#8f9296'}}>用画面讲清楚不同的选择</div><BranchingPaths time={time} cards={pathCardLayout.map((layout,i)=>({...layout,id:`path-${i}`,content:<PathArtwork index={i}/>}))}/></>;break;
    case 'blurred-collage':content=<BlurredCollage time={time} cards={[
      [-32,24,137,111,-5],[188,28,140,115,4],[328,-53,217,140,-3],[588,-36,207,106,5],[728,103,134,160,-4],[66,313,195,148,-7],[300,371,149,119,4],[500,335,215,147,-5],[604,270,124,82,3],
    ].map(([x,y,width,height,rotation],i)=>({id:String(i),x,y,width,height,rotation,content:<div style={{width:360,height:202.5,transformOrigin:'0 0',transform:`scale(${width/360},${height/202.5})`}}><DemoDocument title={['内容脚本','图片与画面','章节设计'][i%3]} kind={i%5}/></div>}))}/>;break;
    case 'perspective-panel':content=<PerspectiveDemo time={time}/>;break;
    case 'exploded-layers':content=<LayersDemo time={time}/>;break;
    case 'fan-card-deck':content=<FanCardDeck x={156} y={114} cardWidth={112} cardHeight={166} spread={94} progress={during(time,.2,1.7)} cards={['脚本','画面','配音','字幕','动画'].map((caption,i)=>({id:caption,caption,content:<FanArtwork index={i}/>}))}/>;break;
    case 'chapter-heading':content=<><div style={{position:'absolute',left:160,top:139,height:150,width:2,background:'#ce705340'}}/><ChapterHeading
      x={195} y={135}
      intro={{eyebrow:'REMOTION 教程 · 第二期',title:<>一条讲解视频的<br/>制作<span style={{color:'#ca6041'}}>全流程</span>拆解</>,description:'以上期16分钟的视频为例 · 从脚本到成片'}}
      introProgress={during(time,1.2,1.9)}
      from={{number:'01 / 03',title:'制作方法',description:'从脚本到成片'}}
      to={{number:'02 / 03',title:'Skill 推荐',description:'大家最关心的'}}
      progress={during(time,3.2,4)}
    /></>;break;
  }
  const zoom=id==='perspective-panel'?1.7:id==='exploded-layers'?1.2:id==='chapter-heading'?1.3:1;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei",sans-serif'}}><div data-demo-frame={frame} data-demo-id={id} style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`,background:'radial-gradient(ellipse at 55% 45%,#fff 0%,#f3f4ec 100%)'}}><div style={{position:'absolute',inset:0,transformOrigin:'400px 225px',transform:`scale(${zoom})`}}>{content}</div></div></AbsoluteFill>;
};
