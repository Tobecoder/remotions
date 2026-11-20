import {CardEntrance,DocumentWindow} from '../../../packages/animations/src';
import {clamp,during,mix} from '../../../packages/animations/src/reference-opening/motion';

const TiredWhale=({time}:{time:number})=>(
  <svg data-planning-whale viewBox="0 0 120 100" width="90" height="75" style={{position:'absolute',left:648,top:269,opacity:during(time,170.4,170.8),transform:`rotate(${3*Math.sin(time*2)}deg)`}} aria-label="看得头晕的蓝色鲸鱼示意">
    <defs><linearGradient id="planning-whale-blue" x2=".7" y2="1"><stop stopColor="#b0dcff"/><stop offset="1" stopColor="#4b8fe2"/></linearGradient></defs>
    <path d="M78 62Q102 76 103 48Q115 43 114 55Q119 64 108 72Q99 90 78 78" fill="#5c9ce8"/>
    <ellipse cx="52" cy="58" rx="38" ry="31" fill="url(#planning-whale-blue)"/>
    <ellipse cx="46" cy="74" rx="29" ry="19" fill="#f7f0e7"/>
    <path d="M20 51Q1 38 8 65L21 73M74 56Q96 43 90 64L78 75" fill="#80b6ee"/>
    <path d="M46 28Q37 9 47 11Q55 13 51 29M53 27Q53 2 65 10Q71 17 55 29" fill="#8cbfee"/>
    <g fill="none" stroke="#375b9b" strokeWidth="2"><path d="M29 52c-10-11-13 6-5 4 7-2-4-11-3-3M61 49c-9-11-14 5-6 4 7-1-3-10-3-3"/><path d="M40 66q6-8 11 0"/></g>
    <ellipse cx="27" cy="64" rx="6" ry="3" fill="#ef969e"/><ellipse cx="66" cy="61" rx="6" ry="3" fill="#ef969e"/>
    <path d="M39 75v13m7-14v16m7-16v13" stroke="#d9d3cd" fill="none"/>
    <path d="m13 28 4 2-1 5 4-4 4 2-2-5 4-3-5 1-1-5-2 5Z" fill="#e8c776"/>
  </svg>
);

/** Case-owned shot count, long planning document and chapter-closing question. */
export const ScriptPlanningVerdict=({time}:{time:number})=>{
  const count=Math.round(386*during(time,160.05,163.6));
  const verdict=during(time,163.1,163.5);
  const gridOpacity=(1-during(time,165.15,165.6));
  const aiOpacity=during(time,165.55,165.95)*(1-during(time,174.95,175.4));
  return <div data-script-planning-verdict style={{position:'absolute',inset:0,color:'#282c34'}}>
    <div data-planning-grid style={{position:'absolute',inset:0,opacity:gridOpacity}}>
      <div style={{position:'absolute',left:49,top:94,fontSize:23,fontWeight:800,opacity:during(time,159.75,160.1)}}>提前规划好每一段的动画？</div>
      <div data-planning-count={count} style={{position:'absolute',right:49,top:101,color:'#90939b',fontSize:12,opacity:during(time,160,160.3)}}>镜头 <b style={{color:'#282c34',fontSize:19,fontFamily:'monospace'}}>{count}</b> / 386</div>
      <div style={{opacity:mix(1,.23,verdict)}}>
        {Array.from({length:40},(_,index)=><CardEntrance key={index} data-planning-shot={index+1}
          progress={during(time,160.05+index*.055,160.28+index*.055)}
          x={49+(index%8)*89} y={143+Math.floor(index/8)*48} width={82} height={42}
          offset={{x:0,y:5}} borderRadius={4} boxShadow="0 3px 7px #393b3810"
        >
          <div style={{padding:'4px 5px',fontSize:5.5,color:'#91948f',fontFamily:'monospace'}}>SHOT {String(index+1).padStart(3,'0')}</div>
          <div style={{margin:'0 5px',height:19,borderRadius:2,background:'#eef0e9'}}/>
        </CardEntrance>)}
      </div>
      <div data-planning-verdict-stamp style={{position:'absolute',left:291,top:235,padding:'12px 39px',borderRadius:13,background:'#e95731',color:'#fff',fontSize:34,fontWeight:800,boxShadow:'0 12px 20px #ad5e3c21',opacity:verdict,transform:`rotate(-3deg) scale(${mix(1.14,1,verdict)})`}}>没有必要</div>
    </div>
    <div data-planning-ai style={{position:'absolute',inset:0,opacity:aiOpacity}}>
      <div style={{position:'absolute',left:46,top:116}}>
        <div style={{fontSize:17,fontWeight:700,color:'#92959c'}}>有人说</div>
        <div style={{fontSize:28,fontWeight:800,marginTop:4}}>让 AI 来规划</div>
        <div style={{fontSize:20,fontWeight:700,marginTop:12,opacity:during(time,167.5,168)}}>再自己修改确认</div>
      </div>
      <DocumentWindow data-ai-planning-document title="AI 写的一份动画规划.md" x={390} y={95} width={252} height={294}
        enterProgress={during(time,165.6,166)} scrollProgress={clamp((time-166.2)/9.4)} scrollDistance={1800}
      >
        {Array.from({length:50},(_,index)=><div key={index} data-ai-planning-shot={index+1} style={{height:45,boxSizing:'border-box',padding:'0 3px'}}>
          <div style={{fontSize:8,fontWeight:700,marginBottom:5}}>镜头 {index+1} · 动画规划</div>
          {[.92,.83,.69].map((width,line)=><div key={line} style={{height:3,marginBottom:3,borderRadius:2,background:'#e0e2df',width:`${(width-.1*Math.sin(index*1.7+line))*100}%`}}/>)}
        </div>)}
      </DocumentWindow>
      <div data-planning-reaction style={{position:'absolute',left:566,top:124,padding:'10px 15px',borderRadius:'13px 13px 13px 2px',background:'#2d303c',color:'#fff',fontSize:23,fontWeight:800,opacity:during(time,170.2,170.6),boxShadow:'0 5px 12px #34343d16'}}>啊，真的吗？</div>
      <TiredWhale time={time}/>
      <div style={{position:'absolute',left:635,top:361,padding:'4px 9px',borderRadius:20,border:'1px solid #d9d7cf',background:'#fffffff0',fontSize:11,fontWeight:700,opacity:during(time,171.8,172.2)}}>看一遍都费劲</div>
    </div>
    <div data-planning-final-question style={{position:'absolute',left:0,right:0,top:139,textAlign:'center',opacity:during(time,175.35,175.8)}}>
      <div style={{fontSize:36,fontWeight:800,lineHeight:'49px'}}>那怎么控制<br/>整个视频的<span style={{color:'#d75f3e'}}>动画效果</span>？</div>
      <div data-planning-later style={{display:'inline-block',marginTop:24,padding:'6px 11px',borderRadius:20,border:'1px solid #e7d5c9',background:'#ffffffe8',color:'#cf6a48',fontSize:12,fontWeight:800,opacity:during(time,178,178.4)}}>➜ 后面聊 · 04 制作视频</div>
    </div>
  </div>;
};
