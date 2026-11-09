import type {ReactNode} from 'react';
import {CardEntrance,DocumentWindow,HighlightBox} from '../../../packages/animations/src';
import {during,mix} from '../../../packages/animations/src/reference-opening/motion';

export type ScriptMaterialNotesProps={time:number;assets:readonly ReactNode[]};
const orange='#dc7351';
const Marker=({number}:{number:number})=><span style={{display:'inline-flex',width:25,height:25,borderRadius:'50%',alignItems:'center',justifyContent:'center',background:orange,color:'#fff',marginRight:8,fontSize:15}}>{number}</span>;

/** Case choreography: question overview, evidence grid, annotation and Agent confirmation. */
export const ScriptMaterialNotes=({time:t,assets}:ScriptMaterialNotesProps)=>{
  const overview=1-during(t,5.7,6.2),gather=during(t,15,16),lift=during(t,20,21),exit=during(t,29.2,30.3),confirm=during(t,26,27);
  const headingOpacity=during(t,6,6.5)*(1-during(t,19.5,20.5));
  const note=(text:string,at:number)=><div style={{height:20,margin:'4px 0',paddingLeft:8,borderLeft:`2px solid ${orange}`,background:'#f7ece6',color:'#a5563d',fontFamily:'monospace',fontSize:8,opacity:during(t,at,at+.6)}}>{text}</div>;
  return <div data-script-material-notes style={{position:'absolute',inset:0,color:'#292c33'}}>
    {[0,1].map(i=><div key={i} data-question-summary={i} style={{position:'absolute',left:49+i*270,top:43,width:260,height:38,borderRadius:9,border:`1px solid ${i?'#bbbdb6':'#d59b89'}`,boxSizing:'border-box',padding:'8px 9px',fontSize:11,fontWeight:700,background:i===0?`rgba(255,255,255,${exit})`:'transparent'}}><span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:18,height:18,borderRadius:'50%',border:`1px solid ${i?'#92968e':orange}`,color:i?'#92968e':orange,marginRight:7}}> {i+1} </span>{i===0&&<span style={{opacity:exit}}>要备注：段落下标注可用素材</span>}</div>)}
    <div data-notes-phase="overview" style={{position:'absolute',inset:0,opacity:overview}}>
      {[0,1].map(i=><CardEntrance key={i} progress={during(t,.3+i*1.7,1+i*1.7)} x={49+i*348} y={115} width={327} height={204} borderRadius={12} offset={{x:0,y:20}}>
        <div style={{margin:20,height:133,background:'#f7f7f3',padding:14,boxSizing:'border-box'}}>
          {i===0?<><div style={{width:150}}>{[140,125,150,104].map((w,n)=><div key={n} style={{height:5,width:w,background:'#d8dbd5',marginBottom:7}}/>)}</div><div style={{fontFamily:'monospace',fontSize:9,background:'#f6e9e2',padding:7,color:'#b3684c'}}>› 可用素材：demo.mp4、2.png</div></>:<><div style={{display:'flex',gap:8}}>{['#f5e0d5','#e3e1f4','#dceee3'].map((c,n)=><div key={c} style={{width:75,height:55,background:c,border:'4px solid white',fontSize:7,color:'#999'}}>SHOT 0{n+1}</div>)}</div><div style={{fontSize:9,marginTop:14,color:'#b3684c'}}>› 动画规划：分屏、依次出现、对比标记……</div></>}
        </div><div style={{position:'absolute',left:17,bottom:10,fontSize:18,fontWeight:800}}><Marker number={i+1}/>{i===0?'要不要备注对应素材？':'要不要写每一段的动画要求？'}</div>
      </CardEntrance>)}
    </div>
    <div data-notes-phase="explanation" style={{position:'absolute',inset:0,opacity:1-exit}}>
      <div style={{position:'absolute',left:49,top:105,opacity:headingOpacity}}>
        <div style={{fontSize:9,letterSpacing:2,color:orange,opacity:gather}}>我的建议</div>
        <div style={{fontSize:23,fontWeight:800}}>{gather<.5?'上期：大量截图、录屏':'在脚本对应段落，标注可用素材'}</div>
        <div style={{fontSize:17,fontWeight:700,color:'#93978f',opacity:1-gather,marginTop:5}}>我几乎没怎么标注</div>
      </div>
      <div data-notes-model-callout style={{position:'absolute',left:440,top:142,opacity:during(t,10,10.5)*(1-during(t,14.8,15.2)),textAlign:'center'}}><div style={{fontSize:11,color:orange}}>也还行</div><div style={{padding:'9px 12px',borderRadius:8,background:'#303642',color:'white',fontSize:14,fontWeight:700}}>• 因为 Opus 5.5 足够强</div></div>
      <DocumentWindow data-notes-document title="脚本.md" x={49} y={mix(180,130,lift)} width={378} height={mix(208,258,lift)} enterProgress={during(t,15.1,15.8)}>
        <div style={{fontSize:10,lineHeight:'17px',padding:5,color:'#30343a'}}>
          <strong>01. 脚本</strong><br/>首先，我会准备一份相当于逐字稿的脚本；那些旁白不念出来、<br/>但要在画面里展示的提示词或说明，也会整理进脚本。
          {note('› 可用素材：remotion-course-zh-part1.mp4、agenda.png',20)}
          <div>我的视频脚本主要自己写，AI 辅助校验……</div><div style={{height:10}}/>
          <strong>02. 素材</strong><br/>讲解类视频，通常会涉及大量的截图、录屏等素材……
          {note('› 可用素材：script-sample-1.mov',22)}
          <div>这些内容，放在对应的讲解段落旁边。</div>
          <div style={{height:14}}/><strong>03. 配音和字幕</strong><br/>素材与脚本的对应关系，交给 Agent 辅助匹配。
        </div>
      </DocumentWindow>
      <div style={{position:'absolute',left:470,top:105,fontSize:11,fontWeight:700,opacity:during(t,23,23.5)}}>{t<26?'手动标注太繁琐了':'›_  Agent 帮忙匹配，你来确认'}</div>
      {assets.slice(0,21).map((asset,i)=>{
        const x=mix(49+(i%7)*103,470+(i%3)*97,gather),y=mix(198+Math.floor(i/7)*64,130+Math.floor(i/3)*47,gather);
        const enter=during(t,6.2+i*.065,6.65+i*.065),extra=(i<6?1:1-during(t,14.8,15.2)*(1-during(t,22,23)))*(i<18?1:1-gather);
        return <div key={i} style={{position:'absolute',left:x,top:y,width:mix(92,87,gather),height:mix(53,40,gather),opacity:enter*extra*(i<6?1:mix(1,.45,confirm))}}>
          <CardEntrance progress={enter} x={0} y={0} width={mix(92,87,gather)} height={mix(53,40,gather)} offset={{x:0,y:9}} borderRadius={3} style={{padding:3,boxSizing:'border-box'}}>{asset}</CardEntrance>
          {i<6&&<HighlightBox progress={during(t,26+i*.11,26.6+i*.11)} x={-2} y={-2} width={mix(96,91,gather)} height={mix(57,44,gather)} radius={5} strokeWidth={1.2}/>}
        </div>;
      })}
      <svg data-notes-matches width="800" height="450" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        {[0,1,2].map(i=><g key={i} opacity={during(t,26+i*.35,26.6+i*.35)}><path d={`M 426 ${190+i*64} C 450 ${190+i*64},450 ${i===1?197:150},${513+i*97} ${i===1?197:150}`} fill="none" stroke={orange} strokeWidth="1" pathLength="1" strokeDasharray="1" strokeDashoffset={1-during(t,26+i*.35,26.6+i*.35)}/><circle cx="411" cy={187+i*64} r="9" fill="#379574"/><text x="411" y={191+i*64} textAnchor="middle" fill="white" fontSize="12">✓</text></g>)}
      </svg>
    </div>
    <div data-notes-phase="next-question" style={{position:'absolute',left:49,top:105,opacity:during(t,30,30.6)}}><div style={{fontSize:24,fontWeight:800}}>分段的动画要求？</div><div style={{fontSize:19,fontWeight:700,color:'#92968f',marginTop:7}}>几乎不写，只在个别地方备注</div></div>
  </div>;
};
