import {CardEntrance} from '../../../packages/animations/src';
import {during} from '../../../packages/animations/src/reference-opening/motion';
import {SectionCollapse} from './SectionCollapse';

export const principlesBookmarkOpacity=(time:number)=>during(time,159.26,159.45);

/** Case-owned conclusion; reuse the same entrance and summary motion as earlier sections. */
export const ScriptPrinciples=({time}:{time:number})=>{
  const bookmarkOpacity=principlesBookmarkOpacity(time);
  return <div data-script-principles style={{position:'absolute',inset:0,color:'#282c34'}}>
    <SectionCollapse progress={during(time,158.65,159.22)} number="2"
      label="几乎不写 · 原则写进 AGENTS.md"
      target={{x:319,y:43,width:260,height:38}}
      transition={{contentTarget:{x:328.25,y:57.12,scale:.023},contentOpacity:1-bookmarkOpacity,bookmarkOpacity}}
    >
      <div data-principles-content style={{position:'absolute',inset:0}}>
        <div data-principles-heading style={{position:'absolute',left:46,top:103,opacity:during(time,153,153.4)}}>
          <div style={{fontSize:24,fontWeight:800}}>原则性的要求</div>
          <div style={{marginTop:7,color:'#93959c',fontSize:19,fontWeight:700}}>提前写清楚</div>
        </div>
        <CardEntrance data-principles-document progress={during(time,156.3,156.85)}
          x={315} y={123} width={441} height={151} offset={{x:0,y:10}}
          borderRadius={12} background="linear-gradient(135deg,#3b3f49,#22252e)"
          boxShadow="0 12px 20px #24263120"
        >
          <div style={{padding:'16px 22px',fontFamily:'Consolas,"Microsoft YaHei",monospace',fontSize:13,lineHeight:'24px',color:'#f6f6f5'}}>
            <div style={{fontSize:10,color:'#a5a9b2',marginBottom:8}}>AGENTS.md</div>
            <div data-principles-rule style={{color:'#dfb575',opacity:during(time,157.7,157.9)}}># 原则性要求</div>
            {['脚本里的提示词，必须完整展示在画面中','字幕始终单行','修改前先保存当前版本'].map((text,index)=>(
              <div key={text} data-principles-rule style={{opacity:during(time,157.9+index*.15,158.1+index*.15)}}>- {text}</div>
            ))}
          </div>
        </CardEntrance>
        <div data-principles-label style={{position:'absolute',left:315,top:97,padding:'5px 9px',borderRadius:16,
          background:'#dc623e',color:'#fff',boxShadow:'0 3px 9px #dc623e30',fontSize:12,fontWeight:700,
          opacity:during(time,156.4,156.85)}}>甚至写进项目的 AGENTS.md</div>
      </div>
    </SectionCollapse>
  </div>;
};
