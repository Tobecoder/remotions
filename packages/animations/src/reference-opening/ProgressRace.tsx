import {during} from './motion';

export type ProgressRaceProps={time:number;startAt?:number;title?:string;firstLabel?:string;secondLabel?:string;winnerLabel?:string;slowLabel?:string};
export const ProgressRace=({time,startAt=0,title='两种方案，哪种更快？',firstLabel='方案 A',secondLabel='方案 B',winnerLabel='快速完成',slowLabel='仍在处理中'}:ProgressRaceProps)=>{
  const t=time-startAt,fast=during(t,2.5,3.6),slow=during(t,4.45,8.15),count=Math.round(6000*slow);
  const trackLeft=156,trackWidth=432;
  return <div data-progress-race style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:0,right:0,top:82,textAlign:'center',opacity:during(t,0,.3)}}><div style={{color:'#9c9d9f',fontSize:13,fontWeight:700,marginBottom:5}}>非要推荐一个</div><div style={{fontSize:23,fontWeight:800,color:'#292c33'}}>{title}</div></div>
    {[firstLabel,secondLabel].map((label,i)=><div key={i} data-race-row={i} style={{position:'absolute',left:53,top:178+i*104,width:696,height:82,borderRadius:14,background:'#fffffff0',boxShadow:'0 7px 15px #333a3214',opacity:during(t,.7+i*.5,1.05+i*.5),transform:`translateY(${(1-during(t,.7+i*.5,1.05+i*.5))*15}px)`}}>
      <div style={{position:'absolute',left:22,top:19,width:114,fontSize:28,lineHeight:'34px',whiteSpace:'nowrap',fontWeight:800,color:'#292d35'}}>{label}</div>
      <div style={{position:'absolute',left:trackLeft,top:29,width:trackWidth,height:20,borderRadius:12,background:'#eceee8',overflow:'hidden'}}><div data-race-bar={i} style={{width:`${100*(i ? .04*slow : fast)}%`,height:'100%',background:i?'#aaaeb9':'linear-gradient(90deg,#f59b7e,#e95230)',borderRadius:12,boxShadow:i?undefined:'0 0 12px #ef7e5f'}}/></div>
      {i===0?<><div data-race-winner style={{position:'absolute',left:604,top:10,width:54,height:54,borderRadius:'50%',background:'linear-gradient(135deg,#ffe7a5,#f0c24d)',boxShadow:'0 0 0 3px #fff0b6,0 2px 13px #dfb95570',textAlign:'center',lineHeight:'54px',fontSize:32,fontWeight:800,color:'#b87d16',opacity:during(t,3.7,3.95)}}>1</div><div style={{position:'absolute',left:trackLeft,top:54,padding:'3px 10px',fontSize:11,lineHeight:'14px',fontWeight:700,color:'#fff',borderRadius:12,background:'#df7652',opacity:during(t,3.7,3.95)}}>{winnerLabel}</div></>:<>
        <svg data-race-spinner width="48" height="48" viewBox="0 0 48 48" style={{position:'absolute',left:trackLeft+50,top:13,opacity:during(t,4.1,4.5),transform:`rotate(${Math.max(0,t-4.1)*180}deg)`}}><circle cx="24" cy="24" r="21" fill="#fff" stroke="#60626b" strokeWidth="2"/>{Array.from({length:8},(_,n)=><path key={n} d="M24 3V24" stroke="#60626b" strokeWidth="2" transform={`rotate(${n*45} 24 24)`}/>)}</svg>
        <div style={{position:'absolute',left:trackLeft+118,top:7,padding:'4px 8px',border:'1px solid #dedfd8',borderRadius:14,fontSize:9,lineHeight:'12px',fontWeight:700,color:'#63666b',background:'#fff',opacity:during(t,4.4,4.8)}}>{slowLabel}</div>
        <div data-race-count style={{position:'absolute',right:17,top:41,fontFamily:'monospace',fontSize:22,fontWeight:800,color:'#cd6661',opacity:during(t,4.4,4.8)}}>{count.toLocaleString('en-US')}</div>
        <div style={{position:'absolute',left:trackLeft,top:65,color:'#999ca2',fontSize:9,lineHeight:'12px',opacity:during(t,4.45,5)}}>{['总的来说','换句话说','也就是说','值得注意的是'].map((text,n)=><span key={text} style={{display:'inline-block',marginLeft:n?17:0,transform:`translateY(${Math.sin(t*2+n)*3}px)`}}>{text}</span>)}</div>
      </>}
    </div>)}
  </div>;
};
