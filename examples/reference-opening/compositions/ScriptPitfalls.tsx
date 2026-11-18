import type {ReactNode} from 'react';
import {CardEntrance,ContentCollapse,HighlightBox} from '../../../packages/animations/src';
import {during,mix} from '../../../packages/animations/src/reference-opening/motion';

type PromptCardProps={
  id:string;
  caption:string;
  width:number;
  height:number;
  from:{x:number;y:number};
  to:{x:number;y:number;scale:number};
  enter:number;
  collapse:number;
  rotation:number;
  children:ReactNode;
};

const PromptCard=({id,caption,width,height,from,to,enter,collapse,rotation,children}:PromptCardProps)=>(
  <ContentCollapse data-pitfall-prompt={id} from={{...from,scale:1}} to={to} progress={collapse}>
    <div style={{position:'absolute',top:-15,left:7,opacity:enter,color:'#77767d',fontSize:8,letterSpacing:.9}}>{caption}</div>
    <CardEntrance
      progress={enter} x={0} y={0} width={width} height={height}
      offset={{x:0,y:12}} rotation={mix(0,rotation,collapse)} borderRadius={7} boxShadow="0 9px 19px #24263121"
    >{children}</CardEntrance>
  </ContentCollapse>
);

const PromptText=({title,lead,children}:{title:string;lead:string;children:ReactNode})=>(
  <article style={{padding:'14px 26px',color:'#23242a',fontSize:12,lineHeight:'18px'}}>
    <strong style={{fontSize:14}}>{title}</strong>
    <div>{lead}</div>
    <div style={{position:'relative',marginTop:3,padding:'11px 14px',borderRadius:4,background:'#f7f7f8',fontFamily:'Consolas,"Microsoft YaHei",monospace'}}>
      <svg aria-hidden width="15" height="16" viewBox="0 0 15 16" style={{position:'absolute',top:6,right:7,color:'#6e7177'}}>
        <rect x="5" y="5" width="8" height="9" rx="1.2" fill="none" stroke="currentColor"/>
        <path d="M3 11H2V2H10v1" fill="none" stroke="currentColor" strokeLinejoin="round"/>
      </svg>
      {children}
    </div>
  </article>
);

const ProjectPrompt=()=>(
  <article style={{padding:'11px 17px',color:'#25262c',fontSize:6.7,lineHeight:'9.6px'}}>
    <strong style={{fontSize:8}}>3）创建 Remotion 项目</strong>
    <div>接下来，搭建一个长期维护的 Remotion 项目。</div>
    <div>比如，先建一个「动效库」文件夹，让 Agent 在这个目录里初始化项目：</div>
    <div style={{marginTop:7,padding:'6px 7px',background:'#f8f8f9',borderRadius:3}}>
      <div>这是以后持续使用的 Remotion 动效项目。请先完成项目初始化和依赖配置，再开始制作动画。</div>
      <p style={{margin:'6px 0'}}>1．初始化项目<br/>- 按官方推荐方式初始化，安装 Remotion、React、TypeScript 与 CLI。<br/>- 创建 effects 目录，将各个动画拆开放置，并注册到 Remotion Studio。<br/>- 保留现有项目结构和配置。</p>
      <p style={{margin:'6px 0'}}>2．依赖管理<br/>- 根据项目需要安装字体、图表和音频等依赖。<br/>- 保持 Remotion 及关联包版本一致，避免重复安装。</p>
      <p style={{margin:'6px 0'}}>3．验证环境<br/>- 检查 Remotion 渲染需要的 Chrome Headless Shell 和工具。<br/>- 启动 Studio，新建简单测试画面，确认预览和渲染都能正常运行。<br/>- 如有报错，先定位原因，按需修复。</p>
      <p style={{margin:'6px 0'}}>4．项目维护说明<br/>- 在项目中写明目录结构、依赖管理和维护方法。<br/>- 遇到环境和项目异常时，先定位，再修改。<br/>- 将素材和可复用组件放在对应目录里。</p>
      <div>完成后，简要说明配置结果，以及今后如何继续使用。</div>
    </div>
  </article>
);

const ProjectFolder=({time}:{time:number})=>(
  <svg viewBox="0 0 180 112" width="180" height="112" aria-label="蓝色项目文件夹"
    style={{position:'absolute',left:99,top:59,opacity:during(time,151.22,151.56),transform:`translateY(${mix(8,0,during(time,151.22,151.56))}px)`}}>
    <path d="M79 10l12-6q3-2 7 0l24 15-10 8Z" fill="#a5c6ec"/>
    <path d="M5 43 76 6q4-2 8 1l88 51q6 4 0 8l-67 37q-4 2-9-1L5 51q-6-4 0-8Z" fill="#b5cce9" opacity=".74"/>
    <path d="M6 40 77 4q4-2 8 1l86 51q7 4 1 7l-69 39q-4 2-8-1L6 49q-7-5 0-9Z" fill="#d5e5fb" fillOpacity=".91" stroke="#c6d9ee"/>
  </svg>
);

const ResultClip=({time}:{time:number})=>{
  const folder=during(time,151.11,151.33);
  const labels=['Node.js','npm','FFmpeg','FFprobe'];
  return <div style={{position:'relative',height:'100%',overflow:'hidden',borderRadius:4,background:'#f2f2f5',color:'#25303e'}}>
    <div style={{position:'absolute',top:3,left:8,right:8,display:'flex',justifyContent:'space-between',paddingBottom:3,borderBottom:'1px solid #e5e5ec',color:'#777b88',fontSize:3.8}}>
      <b>REMOTION 教程</b><span>制作准备 · 检查和配置</span>
    </div>
    <div data-pitfall-result-phase="environment" style={{position:'absolute',inset:0,opacity:1-folder}}>
      <div style={{position:'absolute',left:18,top:19,fontSize:4.2,color:'#778397',letterSpacing:.8}}>STEP 2 · 检查环境</div>
      <strong style={{position:'absolute',left:18,top:26,fontSize:10.4}}>让 Agent 检查基础运行环境</strong>
      <div style={{position:'absolute',left:18,top:48,width:169,height:68,borderRadius:4,background:'#171f31',color:'#dbe5f3',boxSizing:'border-box',padding:'4px 6px',fontFamily:'Consolas,"Microsoft YaHei",monospace',fontSize:5.2,lineHeight:'8px'}}>
        <div style={{color:'#9fb1ca',borderBottom:'1px solid #ffffff21'}}>agent · environment</div>
        <div>› 检查 Remotion 的基础运行环境</div>
        {labels.map((label,i)=><div key={label} style={{opacity:during(time,148.78+i*.12,149.1+i*.12)}}><span style={{color:'#72cbb1'}}>✓ </span>{label} <span style={{marginLeft:8,color:'#94a6bf'}}>已安装</span></div>)}
        <div style={{color:'#72cbb1',opacity:during(time,149.45,149.64)}}>环境已就绪 _</div>
      </div>
      <div style={{position:'absolute',left:201,top:54,width:105,padding:'5px 6px',boxSizing:'border-box',boxShadow:'0 2px 6px #24263116',borderRadius:3,background:'#fff',fontSize:5.1,lineHeight:'9px',opacity:during(time,149.19,149.66)}}>
        <div style={{color:'#858995'}}>环境检查的注意事项</div>
        <div>✓ 已满足的环境无需重复安装</div>
        <div>✓ 不随意升级现有环境</div>
        <div>✓ 先定位原因，再进行修复</div>
      </div>
    </div>
    <div data-pitfall-result-phase="project" style={{position:'absolute',inset:0,opacity:folder}}>
      <div style={{position:'absolute',left:18,top:19,fontSize:4.2,color:'#778397',letterSpacing:.8}}>STEP 3 · 创建项目</div>
      <strong style={{position:'absolute',left:18,top:26,fontSize:10.4}}>搭建一个长期维护的 Remotion 项目</strong>
      <ProjectFolder time={time}/>
    </div>
    <div style={{position:'absolute',left:0,right:0,bottom:5,textAlign:'center'}}>
      <span style={{padding:'2px 4px',borderRadius:2,background:'#303542',color:'#fff',fontSize:6.2}}>
        {time<151.2?'接着让 Agent 检查电脑的基础运行环境':time<152.1?'接下来建议大家搭建一个':'长期维护的 Remotion 项目'}
      </span>
    </div>
  </div>;
};

export const ScriptPitfalls=({time}:{time:number})=>{
  const heading=during(time,139.75,140.25);
  const screen=during(time,148.48,148.88);
  const line=during(time,149.08,149.56);
  return <div data-script-pitfalls style={{position:'absolute',inset:0,color:'#282c34'}}>
    <div data-pitfall-heading style={{position:'absolute',left:46,top:103,opacity:heading}}>
      <div style={{color:'#b65b4b',letterSpacing:.9,fontSize:9,fontWeight:600}}>踩过的坑</div>
      <div style={{fontSize:21,fontWeight:800,marginTop:1}}>写在脚本里的提示词，被略过了</div>
    </div>
    <PromptCard id="environment" caption="检查电脑环境配置" width={642} height={251}
      from={{x:79,y:117}} to={{x:47,y:158,scale:.407}}
      enter={during(time,141.73,142.24)} collapse={during(time,143.72,144.42)} rotation={-1.25}
    >
      <PromptText title="2）检查系统环境" lead="接着让 Agent 检查电脑的基础运行环境：">
        <div>请帮我检查并配置 Remotion 所需的系统环境。</div>
        <ol style={{margin:'15px 0',paddingLeft:22}}>
          <li>检查 Node.js、npm 是否已安装，版本是否兼容。</li>
          <li>检查 FFmpeg、FFprobe 是否已安装，如有缺失再配置。</li>
          <li>已满足要求的环境不要重复安装，也不要随意升级。</li>
          <li>如果发现环境问题，先定位原因，再进行修复。</li>
        </ol>
        <div>完成后，简要报各项工具的版本、安装状态和环境是否已就绪。</div>
      </PromptText>
    </PromptCard>
    <PromptCard id="project" caption="初始化 Remotion 项目" width={339} height={310}
      from={{x:231,y:86}} to={{x:79,y:270,scale:.451}}
      enter={during(time,143.98,144.54)} collapse={during(time,146.34,146.93)} rotation={-.6}
    ><ProjectPrompt/></PromptCard>
    <svg aria-hidden width="72" height="6" style={{position:'absolute',left:331,top:231}}>
      <path d={`M1 3H${mix(1,70,line)}`} stroke="#c9867c" strokeDasharray="1.2 3.2" strokeLinecap="round" opacity={line}/>
    </svg>
    <CardEntrance data-pitfall-result progress={screen} x={409} y={158} width={339} height={190}
      offset={{x:0,y:0}} borderRadius={9} background="#252630" boxShadow="0 6px 12px #25263030" style={{padding:6,boxSizing:'border-box'}}
    ><ResultClip time={time}/></CardEntrance>
    <HighlightBox progress={during(time,151.03,151.49)} x={405} y={154} width={347} height={198} radius={13} color="#d15854" strokeWidth={1.4}/>
    <div data-pitfall-skipped style={{position:'absolute',left:409,top:124,borderRadius:15,padding:'5px 10px',background:'#d34c48',boxShadow:'0 3px 8px #b9584e35',color:'#fff',fontSize:13,fontWeight:700,opacity:during(time,149.42,149.77)}}>Opus 直接略过</div>
    <div data-pitfall-result-note style={{position:'absolute',left:603,top:124,borderRadius:15,padding:'4px 8px',background:'#fffffff0',border:'1px solid #d6d4cd',fontSize:11,fontWeight:700,opacity:during(time,151.18,151.57)}}>视频里只剩几个要点</div>
  </div>;
};
