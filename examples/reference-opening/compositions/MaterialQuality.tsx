import {Img,OffthreadVideo,Sequence,staticFile} from 'remotion';
import {CardEntrance,ContentCollapse} from '../../../packages/animations/src';
import {clamp,during,mix} from '../../../packages/animations/src/reference-opening/motion';
import {MaterialAgent,MaterialCollection} from './MaterialCollection';
import {UsageComparison} from './UsageComparison';

const ImageContent=({name}:{name:string})=><Img src={staticFile(`material-quality/${name}.jpg`)} style={{display:'block',width:'100%',height:'100%',objectFit:'cover'}}/>;
const motionAt=(time:number,points:readonly (readonly [number,number])[])=>{
  if(time<=points[0][0])return points[0][1];
  for(let i=1;i<points.length;i++)if(time<=points[i][0])return mix(points[i-1][1],points[i][1],during(time,points[i-1][0],points[i][0]));
  return points.at(-1)![1];
};
const hop=(time:number,start:number,end:number,height:number)=>time<start||time>=end?0:-Math.sin((time-start)/(end-start)*Math.PI)*height;
const originals=['outline','chart','map','clock','coffee'];
const manual=['workbuddy','city-map','portrait'];
const rejected=[['rejected-blur','录屏截图_03.png',205.4],['rejected-ui','界面_v1.png',205.97],['rejected-cover','封面图.png',206.53]] as const;

const Basket=({x,y,width,height,opacity}:{x:number;y:number;width:number;height:number;opacity:number})=><svg data-quality-basket width={width} height={height} viewBox="0 0 170 75" style={{position:'absolute',left:x,top:y,opacity}}>
  <path d="M3 3H167L149 65Q85 76 21 65Z" fill="#dfc59d" stroke="#b49a6a" strokeWidth="2"/>
  {[19,33,47].map((y,i)=><path key={y} d={`M${7+i*4} ${y}H${163-i*4}`} stroke="#b49a6a" strokeWidth="1" opacity=".65"/>)}
</svg>;

export const MaterialQuality=({time,archiveEndFrame=6706,archiveMediaDir='material-quality'}:{time:number;archiveEndFrame?:number;archiveMediaDir?:string})=>{
  const outgoing=during(time,203.33,204.33);
  const spread=during(time,207.2,207.8);
  const basketX=motionAt(time,[[203.65,830],[203.7,693],[203.8,529],[203.9,408],[204,334],[204.1,292],[204.2,266],[204.5,258],[205,188],[207.2,188],[207.8,242]]);
  const basketY=mix(296,275,spread);
  const galleryExit=during(time,212.4,213.2);
  const agentX=motionAt(time,[[203,288],[203.3,288],[203.5,345],[203.7,280],[204,155],[204.3,210],[204.5,212],[205,132],[207.2,132],[207.533333,203],[207.8,200],[212.4,200],[212.733333,271.5],[213,344.6],[213.1,350]]);
  const groundY=mix(319,346,during(time,203.7,204.4))-26*spread-4*during(time,212.4,213);
  const agentY=groundY+hop(time,203.32,203.62,13)+hop(time,203.9,204.18,36)+hop(time,204.22,204.56,25);
  const agentHeight=mix(mix(mix(84,98,during(time,203.7,204.7)),84,spread),116,during(time,212.4,213));
  const shadowWidth=mix(58,agentHeight,during(time,203.3,204.4));
  const actor=(local=false)=><>
    <div data-quality-agent-shadow style={{position:'absolute',left:(local?350:agentX)-(local?145:0)-shadowWidth/2,top:groundY-(local?135:0)+mix(-2,3,during(time,203.3,204.4)),width:shadowWidth,height:5,borderRadius:'50%',background:'#4c4c58',filter:'blur(2px)',opacity:.25}}/>
    <MaterialAgent time={time} x={(local?350:agentX)-(local?145:0)} y={agentY-(local?135:0)} height={agentHeight} shadow={false}/>
  </>;
  const meterFade=1-during(time,218.3,218.57);
  const dock=during(time,220.433333,220.933333);
  return <div data-material-quality style={{position:'absolute',inset:0}}>
    {time<204.34&&<ContentCollapse data-quality-outgoing progress={outgoing} to={{x:-880,y:0,scale:1}} opacity={1-during(time,204.18,204.34)}>
      <MaterialCollection time={203.3} showAgent={false}/>
    </ContentCollapse>}
    {time<212.95&&<ContentCollapse data-quality-gallery progress={galleryExit} to={{x:400,y:-30,scale:1.15}} opacity={1-during(time,212.5,212.95)}>
      <div data-quality-grid style={{position:'absolute',inset:0,opacity:during(time,207.2,207.45)}}>
        {Array.from({length:8},(_,i)=><div key={i} data-quality-slot={i} style={{position:'absolute',left:413+(i%4)*107,top:143+Math.floor(i/4)*69,width:98,height:56,boxSizing:'border-box',border:'1px dashed #aaa99c',borderRadius:4}}/>)}
      </div>
      {originals.map((name,i)=>{
        const p=during(time,207.23+i*.055,207.43+i*.055);
        const targetX=413+(i%4)*107,targetY=143+Math.floor(i/4)*69;
        const w=mix(53,98,p),h=mix(32,56,p);
        const x=mix(basketX+28+i*17,targetX,p),y=mix(basketY-25-(i%3)*2,targetY,p)-38*Math.sin(p*Math.PI);
        return <CardEntrance key={name} data-quality-original={name} progress={during(time,203.65+i*.03,203.85+i*.03)} x={x} y={y} width={w} height={h} rotation={mix([-8,5,-3,8,-5][i],0,p)} borderRadius={3} boxShadow="0 2px 4px #30323a16"><ImageContent name={name}/></CardEntrance>;
      })}
      <Basket x={basketX} y={basketY} width={mix(170,158,spread)} height={mix(75,64,spread)} opacity={during(time,203.65,203.9)}/>
      {rejected.map(([name,label,start],i)=>{
        const exit=during(time,i<2?rejected[i+1][2]+.02:207.03,i<2?rejected[i+1][2]+.27:207.27);
        if(time<start||exit===1)return null;
        return <div key={name} data-quality-rejected={name} style={{position:'absolute',left:312+65*exit,top:114+265*exit,width:277,height:183,opacity:1-exit,transform:`rotate(${12*exit}deg)`,transformOrigin:'50% 50%'}}>
          <CardEntrance progress={during(time,start,start+.13)} x={0} y={0} width={277} height={168} offset={{x:0,y:7}} borderRadius={6} style={{border:'1.5px solid #bd5461',padding:4,boxSizing:'border-box'}}><ImageContent name={name}/></CardEntrance>
          <div style={{position:'absolute',top:174,width:'100%',textAlign:'center',fontFamily:'monospace',fontSize:9,color:'#62636b'}}>{label}</div>
        </div>;
      })}
      {manual.map((name,i)=>{
        const start=210.57+i*.56;
        return <CardEntrance key={name} data-quality-manual={name} progress={during(time,start,start+.13)} x={520+i*107} y={212} width={98} height={56} borderRadius={4} offset={{x:0,y:6}} style={{border:'1.4px solid #bf594d',boxSizing:'border-box'}}><ImageContent name={name}/></CardEntrance>;
      })}
      {time>=210.4&&<svg data-quality-cursor width="23" height="27" viewBox="0 0 23 27" style={{position:'absolute',left:motionAt(time,[[210.4,675],[210.6,560],[211.08,560],[211.2,665],[211.64,665],[211.76,783.7]]),top:motionAt(time,[[210.4,325],[210.6,239],[211.08,239],[211.2,237],[211.64,237],[211.76,241.3]])}}><path d="M3 2V23L9 17L13 26L17 24L13 15H22Z" fill="#252830" stroke="white" strokeWidth="1.6"/></svg>}
    </ContentCollapse>}
    {time<212.4&&actor()}
    {time>=212.4&&time<218.57&&<div data-quality-meter style={{position:'absolute',inset:0,opacity:meterFade,transform:`translateX(${agentX-350}px)`}}><UsageComparison time={time} startAt={212.4} content={actor(true)}/></div>}
    {time>=218.3&&<div data-quality-archive style={{position:'absolute',inset:0,opacity:during(time,218.3,218.57)}}>
      <div style={{position:'absolute',left:50,top:87,fontSize:23,fontWeight:800,color:'#292b34'}}>视频里的<span style={{color:'#c24c35'}}>小玩偶</span>，是怎么弄的？</div>
      <div data-quality-main-video style={{position:'absolute',left:mix(108,50,dock),top:mix(126,137,dock),width:mix(584,317,dock),height:mix(328.5,178.3,dock),borderRadius:10,border:'6px solid #2e3039',boxSizing:'border-box',overflow:'hidden',background:'#f5f5fa'}}>
        {time<221.1?<Sequence from={6549} durationInFrames={84} layout="none"><OffthreadVideo muted src={staticFile('material-quality/main-early.mp4')} style={{width:'100%',height:'100%',display:'block',objectFit:'cover'}}/></Sequence>:<Sequence from={6633} durationInFrames={archiveEndFrame-6633} layout="none"><OffthreadVideo muted src={staticFile(`${archiveMediaDir}/main-late.mp4`)} style={{width:'100%',height:'100%',display:'block',objectFit:'cover'}}/></Sequence>}
      </div>
      <div style={{position:'absolute',left:50,top:324,fontSize:10,fontWeight:700,letterSpacing:1,color:'#929397',opacity:during(time,220.6,220.85)}}>上期视频里的三个小玩偶</div>
      {[0,1,2,3].map(i=>{
        const enter=during(time,220.63+i*.13,220.76+i*.13);
        const x=392+(i%2)*188,y=137+Math.floor(i/2)*109;
        return <CardEntrance key={i} data-quality-archive-card={i} progress={enter} x={x} y={y} width={179} height={101} offset={{x:0,y:0}} borderRadius={8} style={{padding:0,overflow:'hidden'}}>
          {time<221.1?<ImageContent name={`archive-${i}`}/>:<Sequence from={6633} durationInFrames={archiveEndFrame-6633} layout="none"><OffthreadVideo muted src={staticFile(`${archiveMediaDir}/archive-${i}.mp4`)} style={{width:'100%',height:'100%',display:'block',objectFit:'cover'}}/></Sequence>}
        </CardEntrance>;
      })}
      <div data-quality-actors-badge style={{position:'absolute',left:492,top:88,padding:'9px 13px',borderRadius:30,fontSize:17,fontWeight:800,color:'white',background:'#d3482d',boxShadow:'0 5px 9px #d3482d55',opacity:during(time,222.2,222.3),transform:`scale(${mix(.75,1,during(time,222.2,222.33))})`}}>都是老演员了</div>
    </div>}
  </div>;
};
