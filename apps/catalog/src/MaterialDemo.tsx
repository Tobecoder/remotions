import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AudioPulseBadge, BlurredCollage, BranchingPaths, ChapterCardRow, ChapterHeading, ExplodedLayers, FanCardDeck, PerspectivePanel, SceneThumbnail, SectionCollapse} from '../../../packages/animations/src';
import {pathCardLayout} from '../../../packages/animations/src/reference-opening/continuation-motion';
import {during, tiltedPose} from '../../../packages/animations/src/reference-opening/motion';
import type {MaterialId} from './catalog';

const colors=['#405c81','#76a8b2','#c78661','#a99ac1','#cb9e66'];

const DemoDocument=({title='把复杂内容讲清楚',kind=0}:{title?:string;kind?:number})=><div style={{width:'100%',height:'100%',background:'#fff',padding:20,boxSizing:'border-box'}}>
  <div style={{fontSize:7,letterSpacing:2,color:'#ba7657',fontWeight:700,marginBottom:12}}>REMOTIONS / LIBRARY</div>
  <div style={{fontSize:24,fontWeight:800,color:'#30323a',marginBottom:15}}>{title}</div>
  {kind===1?<svg width="310" height="75" viewBox="0 0 310 75">{Array.from({length:100},(_,i)=>{const h=4+Math.sin(i*.13)**2*Math.sin(Math.PI*i/99)*65;return <rect key={i} x={i*3.1} y={(75-h)/2} width="1.3" height={h} fill="#405c81"/>;})}</svg>:<div style={{display:'flex',gap:10}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:78,borderRadius:5,background:colors[(i+kind)%colors.length]+'24',border:`1px solid ${colors[(i+kind)%colors.length]}33`,padding:12,color:colors[(i+kind)%colors.length]}}><div style={{fontSize:21,fontWeight:800}}>{String(i+1).padStart(2,'0')}</div><div style={{height:3,background:'currentColor',opacity:.3,marginTop:9,width:'70%'}}/></div>)}</div>}
  <div style={{display:'flex',gap:8,marginTop:12}}>{[88,62,40].map(w=><div key={w} style={{height:3,width:w,background:'#dce0e3'}}/>)}</div>
</div>;

const FanArtwork=({index}:{index:number})=><div style={{position:'relative',width:'100%',height:'100%',background:colors[index],overflow:'hidden'}}>
  <svg viewBox="0 0 100 130" width="100%" height="100%"><circle cx={25+index*10} cy="35" r="26" fill="#ffffff50"/><path d={`M-10 ${100-index*7}L${50+index*5} 45L120 140H-10Z`} fill="#ffffff27"/><path d="M0 125L100 70V130H0Z" fill="#00000012"/><text x="13" y="112" fill="#fff" fontSize="30" fontWeight="800" fontFamily="sans-serif">0{index+1}</text></svg>
</div>;

const PathArtwork=({index}:{index:number})=><svg viewBox="0 0 160 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="160" height="90" fill={colors[index%colors.length]}/><circle cx={45+index%3*25} cy="35" r="24" fill="#ffffff44"/><path d="M0 90L60 35L120 90Z" fill="#ffffff28"/><path d="M70 90L120 54L170 90Z" fill="#ffffff44"/><text x="12" y="76" fontSize="13" fontFamily="sans-serif" fill="#fff">{['构思','素材','实验','结果'][index%4]}</text></svg>;

const PerspectiveDemo=({time}:{time:number})=><PerspectivePanel from={{x:220,y:114,ax:1,ay:0,bx:0,by:1}} to={{...tiltedPose,x:355,y:128}} progress={during(time,.45,2.1)} borderColor="#30343d" borderWidth={4}><DemoDocument/></PerspectivePanel>;

const LayersDemo=({time}:{time:number})=><ExplodedLayers time={time} front={{x:220,y:94,ax:1,ay:0,bx:0,by:1}} pose={{...tiltedPose,x:291}} screen={<DemoDocument title="一条完整的讲解视频"/>} layers={[
  {id:'animation',label:'动画',content:<DemoDocument title="逐帧编排" kind={3}/>},
  {id:'captions',label:'字幕',content:<DemoDocument title="跟着内容讲清楚" kind={2}/>},
  {id:'voice',label:'配音',content:<DemoDocument title="声音与节奏" kind={1}/>},
  {id:'materials',label:'素材',content:<DemoDocument title="图片与画面素材" kind={4}/>},
  {id:'script',label:'脚本',content:<DemoDocument title="从一个清楚的问题开始"/>},
]}/>;

const ThumbnailDemo=({time}:{time:number})=>{
  const p=during(time,1.1,2.5);
  return <>
    <SceneThumbnail progress={p} target={{x:56,y:265,scale:.28}} card={{x:58,y:265,width:224,height:145}} caption="制作方法">
      <div style={{position:'absolute',inset:0,background:'#f5f6ef',padding:70,boxSizing:'border-box'}}><div style={{color:'#ba7657',fontSize:12,letterSpacing:3}}>01 / 制作方法</div><div style={{fontSize:50,fontWeight:800,margin:'20px 0',color:'#30323a'}}>从脚本到成片</div><div style={{display:'flex',gap:18}}>{['脚本','素材','动画'].map((label,i)=><div key={label} style={{width:172,height:105,border:'1px solid #dfe2df',borderRadius:8,background:'#fff',padding:18,boxShadow:'0 6px 15px #3a3e4210'}}><div style={{fontSize:12,color:colors[i]}}>0{i+1}</div><div style={{fontSize:24,fontWeight:700,marginTop:14}}>{label}</div></div>)}</div></div>
    </SceneThumbnail>
    <div style={{position:'absolute',left:350,top:135,opacity:during(p,.4,1),transform:`translateY(${(1-p)*14}px)`}}><div style={{color:'#ba7657',fontSize:12,letterSpacing:3}}>02 / 下一章节</div><div style={{fontSize:40,fontWeight:800,marginTop:20,color:'#30323a'}}>接着讲下一件事</div><div style={{fontSize:16,color:'#8d9096',marginTop:17}}>上一节，留在画面里。</div></div>
  </>;
};

/** Every card mounts one standalone material, independently of the ten-second scene. */
export const MaterialDemo=({id}:{id:MaterialId})=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),time=frame/fps;
  let content;
  switch(id){
    case 'section-collapse':content=<SectionCollapse progress={during(time,1.65,2.4)} label="没有标准答案"><div style={{position:'absolute',left:49,top:116,fontSize:36,fontWeight:900,color:'#272a30'}}>没有标准答案</div><BranchingPaths time={7} cards={pathCardLayout.map((layout,i)=>({...layout,id:`path-${i}`,content:<PathArtwork index={i}/>}))}/></SectionCollapse>;break;
    case 'audio-pulse-badge':content=<AudioPulseBadge time={time} x={400} y={225}/>;break;
    case 'chapter-card-row':content=<ChapterCardRow progress={during(time,.5,1.35)} cards={['制作方法','Skill 推荐','音效处理'].map((title,i)=>({id:String(i),title,description:['从脚本到成片','找素材 · 选零件','合成，不如找到'][i],content:i===2?<div style={{position:'absolute',left:'50%',top:'50%'}}><AudioPulseBadge time={time} x={0} y={0} size={38}/></div>:<PathArtwork index={i}/>}))}/>;break;
    case 'branching-paths':content=<><div style={{position:'absolute',left:49,top:90,fontSize:36,fontWeight:900,color:'#272a30'}}>没有标准答案</div><div style={{position:'absolute',left:49,top:143,fontSize:13,color:'#8f9296'}}>用画面讲清楚不同的选择</div><BranchingPaths time={time} cards={pathCardLayout.map((layout,i)=>({...layout,id:`path-${i}`,content:<PathArtwork index={i}/>}))}/></>;break;
    case 'blurred-collage':content=<BlurredCollage time={time} cards={[
      [-32,24,137,111,-5],[188,28,140,115,4],[328,-53,217,140,-3],[588,-36,207,106,5],[728,103,134,160,-4],[66,313,195,148,-7],[300,371,149,119,4],[500,335,215,147,-5],[604,270,124,82,3],
    ].map(([x,y,width,height,rotation],i)=>({id:String(i),x,y,width,height,rotation,content:<div style={{width:360,height:202.5,transformOrigin:'0 0',transform:`scale(${width/360},${height/202.5})`}}><DemoDocument title={['内容脚本','图片与画面','章节设计'][i%3]} kind={i%5}/></div>}))}/>;break;
    case 'perspective-panel':content=<PerspectiveDemo time={time}/>;break;
    case 'exploded-layers':content=<LayersDemo time={time}/>;break;
    case 'scene-thumbnail':content=<ThumbnailDemo time={time}/>;break;
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
