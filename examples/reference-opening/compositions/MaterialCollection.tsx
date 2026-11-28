import type {ReactNode} from 'react';
import {Img,staticFile} from 'remotion';
import {CardEntrance,ChapterHeading,ContentCollapse,FileIntoContainer,HighlightBox} from '../../../packages/animations/src';
import {clamp,during,mix} from '../../../packages/animations/src/reference-opening/motion';

const MaterialImage=({name}:{name:string})=><Img src={staticFile(`material-collection/${name}.jpg`)} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>;

const WindowCard=({id,title,x,y,width,height,progress,rotation=0,children}:{id:string;title?:string;x:number;y:number;width:number;height:number;progress:number;rotation?:number;children:ReactNode})=>(
  <CardEntrance data-material-window={id} x={x} y={y} width={width} height={height} progress={progress} rotation={rotation}
    offset={{x:0,y:8}} borderRadius={6} boxShadow="0 8px 15px #31343c20"
  >
    {title!==undefined&&<div style={{height:15,borderBottom:'1px solid #e4e5e1',display:'flex',alignItems:'center',gap:3,padding:'0 6px',boxSizing:'border-box',fontSize:5.5,color:'#94968f',fontFamily:'monospace'}}>
      {['#e98476','#efce6c','#92bc8e'].map(color=><i key={color} style={{width:4,height:4,borderRadius:'50%',background:color}}/>)}<span style={{marginLeft:4}}>{title}</span>
    </div>}
    <div style={{position:'absolute',inset:title===undefined?4:'19px 5px 5px',overflow:'hidden',borderRadius:2}}>{children}</div>
  </CardEntrance>
);

/** Isolated character artwork; the case owns the movement, turn and clock. */
export const MaterialAgent=({time,x,y,height=84,opacity=1,tablet=false,shadow=true,squash=0,facing=1,tilt=0,egg=false}:{time:number;x:number;y:number;height?:number;opacity?:number;tablet?:boolean;shadow?:boolean;squash?:number;facing?:number;tilt?:number;egg?:boolean})=>{
  const pose=tablet?'tablet':facing<0?'left':'front';
  const artwork=pose==='tablet'?{name:'agent-tablet',aspect:220/214}:pose==='left'?{name:'agent-left',aspect:244/209}:{name:'agent',aspect:240/214};
  const width=height*artwork.aspect;
  return <div data-material-agent style={{position:'absolute',left:x-width/2,top:y-height,width,height,opacity}}>
    {shadow&&<div style={{position:'absolute',left:width*.12,top:height-2,width:width*.76,height:5,borderRadius:'50%',background:'#4c4c58',filter:'blur(2px)',opacity:.25}}/>}
    <div data-material-agent-facing={facing} data-material-agent-pose={pose} data-material-tablet={tablet||undefined} style={{position:'absolute',inset:0,overflow:'hidden',transformOrigin:'50% 100%',transform:`translateY(${-Math.sin(time*5)*1.5}px) rotate(${tilt+Math.sin(time*3)*2}deg) scale(${1+squash*.55},${1-squash})`}}>
      <Img src={staticFile(`material-collection/${artwork.name}.png`)} style={{width:'100%',height:'100%',display:'block'}}/>
    </div>
    {egg&&<svg data-material-agent-thinking width={width} height={29} viewBox="0 0 90 29" style={{position:'absolute',left:0,top:-10,overflow:'visible'}} aria-label="思考中的煎蛋与热气"><path d="M25 15Q23 10 28 6M40 13Q36 7 41 2M52 13Q49 7 55 2M64 15Q61 10 66 5" fill="none" stroke="#85858a" strokeWidth="3"/><path d="M18 23Q20 16 29 18Q36 12 43 16Q50 13 55 19Q69 16 72 24Q57 31 43 27Q26 31 18 23" fill="#fff7dd" stroke="#e6d9ad" strokeWidth="1"/><ellipse cx="47" cy="22" rx="10" ry="5" fill="#ffc632"/></svg>}
  </div>;
};

const ScriptRecording=({time}:{time:number})=><div style={{height:'111%',transform:`translateY(${-14*during(time,181.4,187.3)}px)`}}><MaterialImage name="script"/></div>;
const EditorRecording=({time}:{time:number})=><MaterialImage name={time<185.3?'editor-green':'editor-black'}/>;

const collage=[
  {id:'chart',x:67,y:81,width:151,height:90,rotation:-6.5,enterAt:180.43},
  {id:'history',x:280,y:51,width:151,height:90,rotation:3.5,enterAt:180.56},
  {id:'desk',x:581,y:72,width:151,height:90,rotation:-3,enterAt:180.69},
  {id:'workspace',x:54,y:247,width:151,height:90,rotation:6,enterAt:180.83},
  {id:'neurons',x:456,y:307,width:151,height:90,rotation:3,enterAt:181.1},
  {id:'voice',x:601,y:270,width:151,height:90,rotation:-6,enterAt:180.97},
] as const;

const archiveItems=[
  ...collage.map(item=>({...item,title:undefined as string|undefined,enterEnd:item.enterAt+.23})),
  {id:'script-recording',title:'脚本录屏.mov',x:177,y:155,width:233,height:150,rotation:-2.5,enterAt:180.7,enterEnd:180.94},
  {id:'editor-recording',title:'抠像演示.mov',x:410,y:135,width:217,height:142,rotation:3,enterAt:180.84,enterEnd:181.07},
] as const;
const archiveStarts:Record<string,number>={chart:188.1,history:188.23,desk:188.36,workspace:188.5,voice:188.63,neurons:188.76,'script-recording':189.1,'editor-recording':189.33};

export type MaterialFilingOverrides={
  localCards?: Partial<Record<typeof collage[number]['id']|'script-recording'|'editor-recording',ReactNode>>;
  webCards?: readonly ReactNode[];
  folderLabel?: string;
  folderRows?: readonly (readonly [string,string])[];
};

const defaultFolderRows=[['截图/','12'],['录屏/','3'],['参考图/','6']] as const;

const Lock=({open,opacity}:{open:number;opacity:number})=><svg data-material-lock data-unlock={open} width="42" height="50" viewBox="0 0 42 50" style={{position:'absolute',left:94,top:52,opacity,overflow:'visible',filter:'drop-shadow(0 3px 3px #6663)'}} aria-label={open===1?'已解锁':'锁定'}>
  {/* Lift the free left end; the open shackle leans above the body's right side. */}
  <path d="M10 24V14C10 0 32 0 32 14V24" fill="none" stroke="#a2a6af" strokeWidth="5" strokeLinecap="round" transform={`translate(${10*open} ${-10*open}) rotate(${30*open} 32 24)`}/>
  <rect x="5" y="21" width="32" height="26" rx="4" fill={open>.5?'#3c9e78':'#d95d62'}/><circle cx="21" cy="31" r="3" fill="white"/><path d="M21 32V38" stroke="white" strokeWidth="2.5"/>
</svg>;

const Chat=()=><div style={{padding:'3px 3px'}}>{[126,94,147,94].map((width,index)=><div key={index} style={{height:14,width,margin:'4px 0',marginLeft:index%2?'auto':0,borderRadius:5,background:index%2?'#dce5fa':'#eef0e9'}}/>)}</div>;
const EditingApp=()=><><div style={{height:82}}><MaterialImage name="desk"/></div><div style={{display:'flex',gap:2,flexWrap:'wrap',width:146,marginTop:4}}>{Array.from({length:12},(_,i)=><div key={i} style={{width:22,height:9,background:i<6?'#d5e0f1':'#f1dacb'}}/>)}</div></>;
const DesignApp=()=><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'59px 59px',gap:4}}>{['#f7dcd2','#dfe5f7','#dcefe5','#f3e9c9'].map(color=><div key={color} style={{background:color,borderRadius:2}}/>)}</div>;
const ComputerUse=()=> <div data-material-computer-use style={{height:'100%'}}><MaterialImage name="computer-use"/></div>;

/** Reference-owned sequence; all timings, arrangement and app content stay in the case. */
export const MaterialCollection=({time,showAgent=true,filing}:{
  time:number;showAgent?:boolean;filing?:MaterialFilingOverrides;
})=>{
  const webExit=during(time,193.2,194.4);
  const appsEnter=during(time,193.3,194.5);
  const ready=during(time,201.5,201.9);
  let agentX=mix(398,273,during(time,187.75,188.45));
  agentX=mix(agentX,545,during(time,190.05,191.25));
  agentX=mix(agentX,110,during(time,193.15,194.3));
  agentX=mix(agentX,288,during(time,194.3,194.95));
  const agentY=319;
  const fall=clamp((time-185.13)/.52);
  const bounce=time>=185.65&&time<186.05?-14*Math.sin((time-185.65)/.4*Math.PI):0;
  const squash=.18*during(time,185.6,185.67)*(1-during(time,185.7,185.85));
  const hop=(start:number,end:number,height:number)=>time>=start&&time<end?-height*Math.sin((time-start)/(end-start)*Math.PI):0;
  const walkHop=hop(187.72,188.42,33)+hop(189.76,190.22,25)+hop(190.33,190.72,16)+hop(190.8,191.2,12);
  const facing=time>=187.63&&time<189.7?-1:1;
  const folderX=mix(150,173,during(time,187.75,190));
  const folderY=mix(205,214,during(time,187.75,190));
  const folderOpacity=during(time,187.53,187.8);
  const cameraScale=1+.12*during(time,182.6,185.4)*(1-during(time,188.05,189.8));
  const cameraX=-14*during(time,182.6,185.4)*(1-during(time,188.05,189.8));
  const folderRows=filing?.folderRows??defaultFolderRows;
  const webCard=(index:number)=>filing?.webCards?.[index]??<MaterialImage name={`web-${index}`}/>;
  return <div data-material-collection style={{position:'absolute',inset:0}}>
    <div data-material-chapter style={{position:'absolute',inset:0,opacity:1-during(time,180.5,180.73)}}>
      <ChapterHeading from={{number:'CHAPTER 02 / 05',title:'素材',description:'截图 / 录屏 / 小动画'}} to={{number:'CHAPTER 02 / 05',title:'素材',description:'截图 / 录屏 / 小动画'}} progress={0} x={60} y={128}/>
      {['script','history','desk'].map((name,index)=><div key={name} style={{position:'absolute',left:456,top:220-index*35,width:260,height:150,padding:7,boxSizing:'border-box',borderRadius:3,background:'#fff',boxShadow:'0 6px 10px #3332',transformOrigin:'0 0',transform:'matrix(.86,.43,-.86,.43,0,0)'}}><MaterialImage name={name}/></div>)}
    </div>
    <ContentCollapse data-material-local-stage progress={webExit} to={{x:-660,y:0,scale:1}} opacity={1-during(time,193.6,194)} style={{zIndex:1}}>
      <div data-material-collage data-material-camera style={{position:'absolute',inset:0,transformOrigin:'400px 225px',transform:cameraScale===1&&cameraX===0?undefined:`translateX(${cameraX}px) scale(${cameraScale})`}}>
        {archiveItems.map(({id,title,x,y,width,height,rotation,enterAt,enterEnd})=>{
          const start=archiveStarts[id];
          const progress=clamp((time-start)/(id==='script-recording'?.36:.3));
          const parallax=during(time,182.6,185.4)*(1-during(time,188.05,189.8));
          const dy=({history:-5,desk:-4,workspace:-8,neurons:-12,voice:-16,'script-recording':-8,'editor-recording':-6} as Record<string,number>)[id]??0;
          const dx=id==='script-recording'?6:id==='editor-recording'?-4:0;
          // Convert the mouth from stage space into the moving collage's space.
          const mouthX=400+(folderX+53-400-cameraX)/cameraScale;
          const mouthY=225+(folderY-225)/cameraScale;
          return <FileIntoContainer key={id} data-material-archive={id} data-archive-progress={progress}
            progress={progress} from={{x:x+dx*parallax,y:y+dy*parallax,width}} to={{x:mouthX,y:mouthY+48}}
          >
            <WindowCard id={id} title={title} x={0} y={0} width={width} height={height} rotation={mix(rotation,0,progress)} progress={during(time,enterAt,enterEnd)}>
              {filing?.localCards?.[id]??(id==='script-recording'?<ScriptRecording time={time}/>:id==='editor-recording'?<EditorRecording time={time}/>:<MaterialImage name={id}/>)}
            </WindowCard>
          </FileIntoContainer>;
        })}
      </div>
      {/* Reference depth: the complete folder silhouette covers cards even before filing. */}
      <svg data-material-folder-back width="106" height="104" viewBox="0 0 106 104" style={{position:'absolute',left:folderX,top:folderY,opacity:folderOpacity}} aria-hidden>
        <path d="M3 19Q3 13 9 13H41L48 20H96Q102 20 102 26V86H3Z" fill="#58a9e8"/>
      </svg>
      <svg data-material-folder width="106" height="104" viewBox="0 0 106 104" style={{position:'absolute',left:folderX,top:folderY,opacity:folderOpacity}} aria-label="素材文件夹">
        <rect x="3" y="31" width="99" height="57" rx="5" fill="#81bff0"/><text x="53" y="103" textAnchor="middle" fontWeight="700" fontSize="9" fill="#34373b">{filing?.folderLabel??'素材/'}</text>
      </svg>
      <div data-material-folder-list style={{position:'absolute',left:285,top:218,width:117,padding:'4px 7px',boxSizing:'border-box',borderRadius:5,background:'#ffffffed',boxShadow:'0 5px 10px #31343c18',fontSize:9,fontWeight:700,opacity:during(time,191.4,191.8)}}>
        {folderRows.map(([label,count],index)=><div key={index} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',opacity:during(time,191.4+index*.18,191.6+index*.18),borderBottom:index===folderRows.length-1?'none':'1px solid #e2e2de'}}><span>{label}</span><span style={{fontWeight:400,color:'#8b8f96'}}>{count}</span></div>)}
      </div>
    </ContentCollapse>

    <ContentCollapse data-material-web-stage progress={webExit} to={{x:-660,y:0,scale:1}} opacity={1-during(time,193.6,194)}>
      <WindowCard id="web-gallery" title="https://…" x={509} y={55} width={226} height={133} progress={during(time,189.6,189.95)}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,height:'100%'}}>
          {Array.from({length:6},(_,index)=><div key={index} style={{overflow:'hidden',borderRadius:3,opacity:index<3?1-.92*during(time,190.5+index*.22,190.6+index*.22):1}}>{webCard(index)}</div>)}
        </div>
      </WindowCard>
      {[0,1,2].map(index=>{
        const start=190.5+index*.22,p=clamp((time-start)/.55);
        if(p===0||p===1)return null;
        return <ContentCollapse key={index} data-material-web-capture={index} progress={p} from={{x:514+index*73,y:74,scale:1}} to={{x:folderX+48,y:folderY+33,scale:.06}}><div style={{width:68,height:48,overflow:'hidden',border:'2px solid white',borderRadius:3}}>{webCard(index)}</div></ContentCollapse>;
      })}
    </ContentCollapse>

    <ContentCollapse data-material-apps progress={appsEnter} from={{x:700,y:0,scale:1}} to={{x:0,y:0,scale:1}} opacity={during(time,193.1,193.5)}>
      {['聊天','剪辑','设计'].map((title,index)=>{
        const x=30+index*248;
        const unlockEnd=index===1?199.15:index===2?200.25:200.65;
        const unlock=during(time,unlockEnd-.4,unlockEnd);
        return <div key={title} data-material-app={index} style={{position:'absolute',inset:0}}>
          <WindowCard id={`app-${index}`} title={title} x={x} y={118} width={228} height={155} progress={1}>
            {index===0?<Chat/>:index===1?<EditingApp/>:<><div style={{opacity:1-during(time,199.5,199.8)}}><DesignApp/></div><div style={{position:'absolute',inset:0,background:'#fff',opacity:during(time,199.5,199.8)}}><ComputerUse/></div></>}
          </WindowCard>
          <div style={{position:'absolute',left:x,top:118,width:228,height:155}}><Lock open={unlock} opacity={1-during(time,unlockEnd+.1,unlockEnd+.5)}/></div>
          <HighlightBox data-material-app-ready={index} progress={ready} x={x-1} y={117} width={230} height={157} radius={8} color="#4d9e83" shadowColor="#4d9e8310" strokeWidth={1.4}/>
        </div>;
      })}
      <svg data-material-mcp width="800" height="190" style={{position:'absolute',left:0,top:0,opacity:during(time,198.5,198.8),transform:`translateY(${mix(-124,0,during(time,198.5,198.9))}px)`}} aria-label="MCP 接入剪辑窗口">
        <path d="M416 -10C448 35 492 65 476 110" fill="none" stroke="#30323c" strokeWidth="3.5"/>
        <rect x="467" y="105" width="18" height="16" rx="3" fill="#30323c"/><path d="M471 121v6m10-6v6" stroke="#8b8d97" strokeWidth="3"/>
        <text x="494" y="106" fontSize="9" fontFamily="monospace" fontWeight="700" fill="#343740">MCP</text>
      </svg>
      <div style={{position:'absolute',left:610,top:279,fontSize:9,fontFamily:'monospace',fontWeight:700,opacity:during(time,199.5,199.8)}}>Computer<br/>Use</div>
    </ContentCollapse>
    {showAgent&&<><div data-material-agent-shadow style={{position:'absolute',zIndex:2,left:agentX-29,top:agentY-2,width:58,height:5,borderRadius:'50%',background:'#4c4c58',filter:'blur(2px)',opacity:time<185.13?0:mix(.06,.25,fall)}}/>
    <ContentCollapse data-material-agent-drop progress={fall**1.6} from={{x:0,y:-330,scale:1}} to={{x:0,y:0,scale:1}} opacity={time<185.13?0:1} style={{zIndex:2}}>
      <MaterialAgent time={time} x={agentX} y={agentY+bounce+walkHop} shadow={false} squash={squash} facing={facing} tilt={walkHop*.13} tablet={time>=191.15&&time<193.1} egg={time>=196.6&&time<198.25}/>
    </ContentCollapse>
    </>}
  </div>;
};
