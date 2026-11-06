import type {ReactNode} from 'react';
import {during,mix} from './motion';
import {ChapterHeading,type HeadingContent} from './ChapterHeading';
import {DocumentWindow} from './DocumentWindow';
import {HighlightBox} from './HighlightBox';
import {CollapsingTitle} from './CollapsingTitle';

export type ScriptDocumentGuideCopy={narrationTitle:string;narrationDescription:string;instructionLead:ReactNode;instructionTitle:ReactNode;instructionDescription:ReactNode;compactDescription:ReactNode;summary:ReactNode;documentTitle:ReactNode};
export type ScriptDocumentGuideProps={time:number;startAt?:number;document:ReactNode;eyebrow?:string;chapterFrom?:HeadingContent;scrollDistance?:number;copy?:Partial<ScriptDocumentGuideCopy>};
const defaultCopy:ScriptDocumentGuideCopy={narrationTitle:'逐字稿',narrationDescription:'旁白念的每一句',instructionLead:'画面里展示的',instructionTitle:'提示词 · 说明',instructionDescription:'旁白不念，但要出现在画面里',compactDescription:'要在画面里展示的内容',summary:'都要写进脚本',documentTitle:'脚本 · 上期 Remotion 视频'};

/** Scenario choreography composed from independent document, highlight and title components. */
export const ScriptDocumentGuide=({time,startAt=0,document,eyebrow='01 · 脚本里写什么',chapterFrom,scrollDistance=0,copy}:ScriptDocumentGuideProps)=>{
  const elapsed=time-startAt,t=elapsed-(chapterFrom?1.8:0),enter=during(t,0,.4),small=during(t,3.5,4.2),list=during(t,8.7,9.2),highlight=during(t,6.3,6.9);
  const text={...defaultCopy,...copy},heading={number:eyebrow,title:text.narrationTitle,description:text.narrationDescription},scale=mix(1,18/42,small);
  const instructionColor=`rgb(${Math.round(mix(206,43,list))},${Math.round(mix(107,46,list))},${Math.round(mix(75,52,list))})`;
  const distance=Math.max(0,Number.isFinite(scrollDistance)?scrollDistance:0),scroll=during(t,1,6.3);
  return <div data-script-guide style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:49,top:90,fontSize:9,letterSpacing:2,fontWeight:700,color:'#c87559',opacity:small}}>{eyebrow}</div>
    <div style={{position:'absolute',left:49,top:136,width:19,height:19,borderRadius:'50%',background:'#d66b4e',color:'#fff',fontSize:11,lineHeight:'19px',textAlign:'center',opacity:small}}>1</div>
    <div data-script-chapter={chapterFrom?'true':undefined} data-script-narration style={{position:'absolute',left:mix(49,75,small),top:mix(124,135-20*(18/42),small),width:275,height:145,opacity:chapterFrom?during(elapsed,0,.3):enter,transform:`scale(${scale})`,transformOrigin:'0 0',clipPath:`inset(${14*small}px 0 0 0)`}}>
      <ChapterHeading x={0} y={0} from={chapterFrom??heading} to={heading} progress={chapterFrom?during(t,-.3,.4):1}/>
    </div>
    <CollapsingTitle data-script-instruction progress={list} style={{opacity:during(t,4,4.6)}} lead={text.instructionLead} title={<span data-script-instruction-title style={{color:instructionColor}}>{text.instructionTitle}</span>} description={text.instructionDescription} compactDescription={text.compactDescription}/>
    <div data-script-list style={{position:'absolute',left:49,top:191,opacity:list}}><div style={{position:'absolute',width:19,height:19,borderRadius:'50%',background:'#d66b4e',color:'#fff',fontSize:11,lineHeight:'19px',textAlign:'center'}}>2</div><div style={{position:'absolute',left:222,top:-55,width:7,height:86,borderRight:'1px solid #a6a8a5',borderTop:'1px solid #a6a8a5',borderBottom:'1px solid #a6a8a5'}}/></div>
    <div style={{position:'absolute',left:49,top:267,borderRadius:18,padding:'6px 13px',fontSize:12,fontWeight:700,color:'#fff',background:'#d87552',opacity:during(t,9,9.4)}}>{text.summary}</div>
    <DocumentWindow data-script-window enterProgress={enter} scrollProgress={scroll} scrollDistance={distance} title={text.documentTitle} overlay={<HighlightBox data-script-highlight progress={highlight}/>}>{document}</DocumentWindow>
  </div>;
};
