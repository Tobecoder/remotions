import type {ReactNode} from 'react';
import {during,mix} from './motion';
import {ChapterHeading,type HeadingContent} from './ChapterHeading';

export type ScriptDocumentGuideProps={time:number;startAt?:number;document:ReactNode;eyebrow?:string;chapterFrom?:HeadingContent;scrollDistance?:number};
export const ScriptDocumentGuide=({time,startAt=0,document,eyebrow='01 · 脚本里写什么',chapterFrom,scrollDistance=0}:ScriptDocumentGuideProps)=>{
  const elapsed=time-startAt,t=elapsed-(chapterFrom?1.8:0),enter=during(t,0,.4),small=during(t,3.5,4.2),list=during(t,8.7,9.2),highlight=during(t,6.3,6.9);
  const heading={number:eyebrow,title:'逐字稿',description:'旁白念的每一句'},scale=mix(1,18/42,small);
  const distance=Math.max(0,Number.isFinite(scrollDistance)?scrollDistance:0),scroll=during(t,1,6.3);
  return <div data-script-guide style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:49,top:90,fontSize:9,letterSpacing:2,fontWeight:700,color:'#c87559',opacity:small}}>{eyebrow}</div>
    <div style={{position:'absolute',left:49,top:136,width:19,height:19,borderRadius:'50%',background:'#d66b4e',color:'#fff',fontSize:11,lineHeight:'19px',textAlign:'center',opacity:small}}>1</div>
    <div data-script-chapter={chapterFrom?'true':undefined} data-script-narration style={{position:'absolute',left:mix(49,75,small),top:mix(124,135-20*(18/42),small),width:275,height:145,opacity:chapterFrom?during(elapsed,0,.3):enter,transform:`scale(${scale})`,transformOrigin:'0 0',clipPath:`inset(${14*small}px 0 0 0)`}}>
      <ChapterHeading x={0} y={0} from={chapterFrom??heading} to={heading} progress={chapterFrom?during(t,-.3,.4):1}/>
    </div>
    <div data-script-instruction style={{position:'absolute',left:49,top:199,opacity:during(t,4,4.6)*(1-list),fontWeight:800,fontSize:30,lineHeight:'36px',color:'#292c32'}}>画面里展示的<br/><span style={{color:'#ce6b4b'}}>提示词 · 说明</span><div style={{fontSize:12,fontWeight:500,lineHeight:'20px',color:'#999b9e',marginTop:10}}>旁白不念，但要出现在画面里</div></div>
    <div data-script-list style={{position:'absolute',left:49,top:191,opacity:list}}><div style={{position:'absolute',width:19,height:19,borderRadius:'50%',background:'#d66b4e',color:'#fff',fontSize:11,lineHeight:'19px',textAlign:'center'}}>2</div><div style={{marginLeft:26,fontSize:18,fontWeight:800,color:'#2b2e34'}}>提示词 · 说明</div><div style={{margin:'5px 0 0 26px',fontSize:8,color:'#94969a'}}>要在画面里展示的内容</div><div style={{position:'absolute',left:222,top:-55,width:7,height:86,borderRight:'1px solid #a6a8a5',borderTop:'1px solid #a6a8a5',borderBottom:'1px solid #a6a8a5'}}/></div>
    <div style={{position:'absolute',left:49,top:267,borderRadius:18,padding:'6px 13px',fontSize:12,fontWeight:700,color:'#fff',background:'#d87552',opacity:during(t,9,9.4)}}>都要写进脚本</div>
    <div data-script-window style={{position:'absolute',left:316,top:105,width:445,height:272,background:'#fff',borderRadius:10,overflow:'hidden',boxShadow:'0 8px 17px #33363c1d',opacity:enter,transform:`translateX(${mix(24,0,enter)}px)`}}>
      <div style={{height:25,borderBottom:'1px solid #eeeeec',display:'flex',alignItems:'center',gap:4,padding:'0 9px',boxSizing:'border-box'}}>{['#ee8e7f','#e9c675','#9cb49b'].map(color=><span key={color} style={{width:5,height:5,borderRadius:'50%',background:color}}/>)}<span style={{marginLeft:6,color:'#8c8f93',fontFamily:'monospace',fontSize:7}}>脚本 · 上期 Remotion 视频</span></div>
      <div data-script-scroll-viewport style={{position:'absolute',left:9,right:9,top:30,bottom:9,overflow:'hidden'}}><div data-script-scroll-content data-scroll-progress={scroll} style={{position:'relative',width:'100%',height:`calc(100% + ${distance}px)`,transform:`translateY(${-distance*scroll}px)`}}>{document}</div></div>
      <div data-script-highlight style={{position:'absolute',left:118,top:64,width:219,height:160,border:'1.5px solid #d87552',borderRadius:6,boxShadow:'0 0 0 3px #dd80531b',boxSizing:'border-box',opacity:highlight,transform:`scaleX(${highlight})`,transformOrigin:'0 0'}}/>
    </div>
  </div>;
};
