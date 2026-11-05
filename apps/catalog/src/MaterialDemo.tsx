import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChapterHeading, ExplodedLayers, FanCardDeck, PerspectivePanel, SceneThumbnail} from '../../../packages/animations/src';
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

const PerspectiveDemo=({time}:{time:number})=><PerspectivePanel from={{x:220,y:114,ax:1,ay:0,bx:0,by:1}} to={{...tiltedPose,x:355,y:128}} progress={during(time,.45,2.1)} borderColor="#30343d" borderWidth={4}><DemoDocument/></PerspectivePanel>;

const LayersDemo=({time}:{time:number})=><ExplodedLayers time={time} tiltProgress={during(time,.4,1.2)} front={{x:220,y:94,ax:1,ay:0,bx:0,by:1}} pose={{...tiltedPose,x:291}} screen={<DemoDocument title="一条完整的讲解视频"/>} layers={[
  {id:'animation',label:'动画',enterAt:3.3,content:<DemoDocument title="逐帧编排" kind={3}/>},
  {id:'captions',label:'字幕',enterAt:2.8,content:<DemoDocument title="跟着内容讲清楚" kind={2}/>},
  {id:'voice',label:'配音',enterAt:2.3,content:<DemoDocument title="声音与节奏" kind={1}/>},
  {id:'materials',label:'素材',enterAt:1.8,content:<DemoDocument title="图片与画面素材" kind={4}/>},
  {id:'script',label:'脚本',enterAt:.4,content:<DemoDocument title="从一个清楚的问题开始"/>},
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
    case 'perspective-panel':content=<PerspectiveDemo time={time}/>;break;
    case 'exploded-layers':content=<LayersDemo time={time}/>;break;
    case 'scene-thumbnail':content=<ThumbnailDemo time={time}/>;break;
    case 'fan-card-deck':content=<FanCardDeck x={156} y={114} cardWidth={112} cardHeight={166} spread={94} progress={during(time,.2,1.7)} cards={['脚本','画面','配音','字幕','动画'].map((caption,i)=>({id:caption,caption,content:<FanArtwork index={i}/>}))}/>;break;
    case 'chapter-heading':content=<><div style={{position:'absolute',left:160,top:139,height:150,width:2,background:'#ce705340'}}/><ChapterHeading x={195} y={135} from={{number:'01 / 03',title:'制作方法',description:'从脚本到成片'}} to={{number:'02 / 03',title:'Skill 推荐',description:'大家最关心的'}} progress={during(time,.8,2)}/></>;break;
  }
  const zoom=id==='perspective-panel'?1.7:id==='exploded-layers'?1.2:id==='chapter-heading'?1.3:1;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei",sans-serif'}}><div data-demo-frame={frame} data-demo-id={id} style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`,background:'radial-gradient(ellipse at 55% 45%,#fff 0%,#f3f4ec 100%)'}}><div style={{position:'absolute',inset:0,transformOrigin:'400px 225px',transform:`scale(${zoom})`}}>{content}</div></div></AbsoluteFill>;
};
