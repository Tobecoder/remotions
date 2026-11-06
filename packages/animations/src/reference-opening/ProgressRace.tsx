import {during} from './motion';
import {ProgressRow,progressRowLayout} from './ProgressRow';

export type ProgressRaceProps={time:number;startAt?:number;title?:string;eyebrow?:string;firstLabel?:string;secondLabel?:string;winnerLabel?:string;slowLabel?:string;countTo?:number;phrases?:readonly string[]};
const defaultPhrases=['总的来说','换句话说','也就是说','值得注意的是'];

/** The accepted two-row choreography, composed from the reusable single-row presentation. */
export const ProgressRace=({time,startAt=0,title='两种方案，哪种更快？',eyebrow='非要推荐一个',firstLabel='方案 A',secondLabel='方案 B',winnerLabel='快速完成',slowLabel='仍在处理中',countTo=6000,phrases=defaultPhrases}:ProgressRaceProps)=>{
  const t=time-startAt,fast=during(t,2.5,3.6),slow=during(t,4.45,8.15),count=Math.round(Math.max(0,Number.isFinite(countTo)?countTo:6000)*slow);
  const markerProgress=(progressRowLayout.spinnerOffset+progressRowLayout.spinnerSize/2)/progressRowLayout.trackWidth;
  return <div data-progress-race style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:0,right:0,top:82,textAlign:'center',opacity:during(t,0,.3)}}><div style={{color:'#9c9d9f',fontSize:13,fontWeight:700,marginBottom:5}}>{eyebrow}</div><div style={{fontSize:23,fontWeight:800,color:'#292c33'}}>{title}</div></div>
    <ProgressRow data-race-row={0} label={firstLabel} progress={fast} color="linear-gradient(90deg,#f59b7e,#e95230)" glow="#ef7e5f" enterProgress={during(t,.7,1.05)} status="complete" statusProgress={during(t,3.7,3.95)} badge="1"
      caption={<div style={{padding:'3px 10px',fontSize:11,lineHeight:'14px',fontWeight:700,color:'#fff',borderRadius:12,background:'#df7652',opacity:during(t,3.7,3.95)}}>{winnerLabel}</div>}/>
    <ProgressRow data-race-row={1} label={secondLabel} y={282} progress={markerProgress*slow} color="#aaaeb9" enterProgress={during(t,1.2,1.55)} status="waiting" statusProgress={during(t,4.1,4.5)} time={Math.max(0,t-4.1)} markerProgress={markerProgress}
      annotation={<div style={{padding:'4px 8px',border:'1px solid #dedfd8',borderRadius:14,fontSize:9,lineHeight:'12px',fontWeight:700,color:'#63666b',background:'#fff',opacity:during(t,4.4,4.8)}}>{slowLabel}</div>}
      value={<span data-race-count style={{opacity:during(t,4.4,4.8)}}>{count.toLocaleString('en-US')}</span>}>
      <div style={{position:'absolute',left:progressRowLayout.trackLeft,top:65,color:'#999ca2',fontSize:9,lineHeight:'12px',opacity:during(t,4.45,5)}}>{phrases.map((text,n)=><span key={`${n}-${text}`} style={{display:'inline-block',marginLeft:n?17:0,transform:`translateY(${Math.sin(t*2+n)*3}px)`}}>{text}</span>)}</div>
    </ProgressRow>
  </div>;
};
