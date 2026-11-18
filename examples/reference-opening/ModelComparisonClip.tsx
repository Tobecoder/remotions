import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {clamp,during,mix} from '../../packages/animations/src/reference-opening/motion';
import {modelComparisonClipOffset} from './compositions/ModelComparisonPanel';

const toys={
  maid:{crop:[78,3,513,718],x:73,y:134,height:45,shadow:24},
  cloud:{crop:[750,113,619,585],x:160,y:116,height:43,shadow:30},
  chef:{crop:[1515,3,569,705],x:247,y:98,height:49,shadow:32},
} as const;

const Toy=({name,tilt,bob=0,squash=0}:{name:keyof typeof toys;tilt:number;bob?:number;squash?:number})=>{
  const {crop:[left,top,width,height],x,y,height:displayHeight,shadow}=toys[name];
  const scale=displayHeight/height,displayWidth=width*scale;
  return <>
    <div style={{position:'absolute',left:x-shadow/2,top:y-2,width:shadow,height:3,borderRadius:'50%',background:'#3e365d',filter:'blur(1px)',opacity:mix(.3,.16,clamp(-bob/4))}}/>
    <div style={{
      position:'absolute',left:x-displayWidth/2,top:y-displayHeight+bob,width:displayWidth,height:displayHeight,
      transformOrigin:'50% 100%',transform:`rotate(${tilt}deg) scale(${1+squash*.55},${1-squash})`,overflow:'hidden',
    }}>
      <Img src={staticFile('model-comparison/toys.png')} style={{
        position:'absolute',left:-left*scale,top:-top*scale,width:2172*scale,height:724*scale,maxWidth:'none',
      }}/>
    </div>
  </>;
};

const arc=(from:number,to:number,lift:number,p:number)=>mix(from,to,p)-4*p*(1-p)*lift;
const Egg=({x,y,angle=0,scale=1}:{x:number;y:number;angle?:number;scale?:number})=>(
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
    <path d="M-6 .3C-7-3-2-5.8 1.3-5 4-4.7 4.2-2.1 5.8-1 9 1 4 4.1 .5 4-3 4-5.4 3-6 .3Z"
      fill="#fff9e9" stroke="#efe1ce" strokeWidth=".4"/>
    <ellipse cy="-.6" rx="2.75" ry="2.5" fill="#eda426"/>
    <ellipse cx="-.7" cy="-1.6" rx="1.2" ry=".75" fill="#ffe888" opacity=".8"/>
  </g>
);

/** Standalone shot exported as an inset video for the main timeline. */
export const ModelComparisonClip=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
  const time=frame/fps+modelComparisonClipOffset;
  const tossStart=1.12, landAt=2.68, passAt=5.04;
  const toss=during(time,tossStart,landAt);
  const pass=during(time,passAt,5.51);
  const panToss=during(time,5.21,5.74);
  const flip=during(time,.99,1.23)*(1-during(time,1.26,1.62));
  const landing=during(time,2.59,2.76)*(1-during(time,2.76,3.07));
  const puff=during(time,2.66,2.86)*(1-during(time,4.67,5.08));
  const cloudTilt=7*landing-11*during(time,4.93,5.12)*(1-during(time,5.12,5.35));
  const panX=mix(212,147,panToss);
  const panY=arc(mix(84,73,flip),75,43,panToss);
  const promptSubtitle=time<1.66?'现在主流大模型的能力'
    :time<3.83?'其实已经形成了明显的梯队'
    :time<4.87?'就拿 Opus 5.5':'Astra 和 DeepSeek-v4 来举例';

  return <AbsoluteFill style={{background:'#f5f5fa',overflow:'hidden',fontFamily:'"Microsoft YaHei",sans-serif'}}>
    <div style={{position:'absolute',width:320,height:180,transformOrigin:'0 0',transform:`scale(${width/320},${height/180})`,
      background:'linear-gradient(180deg,#fcfcfd 0%,#f4f4f9 100%)'}}>
      <div style={{position:'absolute',left:10,right:10,top:5,display:'flex',justifyContent:'space-between',fontSize:3.6,color:'#625d67',borderBottom:'1px solid #ecebf0',paddingBottom:3}}>
        <b>REMOTION</b><span>模型与 Agent · 能力与局限</span>
      </div>
      <div style={{position:'absolute',left:18,top:20}}>
        <div style={{color:'#807b87',fontSize:4.5,letterSpacing:.8}}>MODELS</div>
        <div style={{color:'#242631',fontSize:9.8,fontWeight:800}}>主流大模型，已经形成明显的梯队</div>
      </div>

      {[
        {label:'DeepSeek-v4',x:73,y:134,at:5.22,tint:'#cbcfe2'},
        {label:'GPT Astra',x:160,y:116,at:4.82,tint:'#d8d6de'},
        {label:'Claude Opus 5.5',x:247,y:98,at:3.8,tint:'#e4d8d4'},
      ].map(({label,x,y,at,tint})=>
        <div key={label} style={{
          position:'absolute',left:x-34,top:y,width:68,height:160-y,borderTop:`1px solid ${tint}`,
          background:`linear-gradient(${tint},#ffffff00)`,textAlign:'center',
        }}>
          <span style={{
            display:'grid',placeItems:'center',margin:'2px 2px 0',height:17,borderRadius:2,background:'#ffffffd9',
            boxShadow:'0 1px 3px #594c671c',fontSize:5.6,fontWeight:700,color:'#39343b',opacity:during(time,at,at+.18),
          }}>· {label}</span>
        </div>
      )}
      <Toy name="maid" tilt={-2*Math.sin(time*4)-6*during(time,5.2,5.55)} bob={-.7*Math.sin(time*3)}/>
      <Toy name="cloud" tilt={cloudTilt+1.8*Math.sin(time*6)} bob={-1.1*Math.sin(time*5)} squash={.1*landing}/>
      <Toy name="chef" tilt={-9*flip+4*panToss} bob={-2*flip}/>

      <svg viewBox="0 0 320 180" width="320" height="180" style={{position:'absolute',inset:0}} aria-hidden>
        <g transform={`translate(${panX} ${panY}) rotate(${mix(-2,25,flip)+300*panToss})`}>
          <path d="M5 0h14" stroke="#211f24" strokeWidth="2.8" strokeLinecap="round"/>
          <ellipse rx="9" ry="4" cy="1.1" fill="#232126"/>
          <ellipse rx="8.6" ry="3.25" fill="#545052" stroke="#26242a" strokeWidth=".9"/>
          {time<tossStart?<Egg x={0} y={-1.1} scale={.8}/>:null}
        </g>
        <g opacity={(1-during(time,1,1.13))*(.52+.17*Math.sin(time*15))} fill="none" stroke="#62575e" strokeLinecap="round" strokeWidth="1.3">
          <path d="M210 80c3-2-4-4-1-7 1-1 2-1 2-3"/>
          <path d="M215 79c3-3-3-5 0-8 1-1 2-2 2-3"/>
        </g>
        <path d="M223 63l-4-5m8 2-2-7" fill="none" stroke="#edbc60" strokeWidth="1.8" strokeLinecap="round" opacity={flip}/>
        {toss>0&&time<landAt?<Egg x={mix(212,160,toss)} y={arc(80,77,36,toss)} angle={mix(-27,8,toss)}/>:null}
        {toss>.19&&toss<.8?<Egg x={mix(222,164,toss)} y={arc(73,77,33,toss)} scale={.66} angle={-35*toss}/>:null}
        {time>=landAt&&time<=passAt?<Egg x={160} y={76+3*landing} angle={4+cloudTilt}/>:null}
        {time>passAt?<Egg x={mix(160,73,pass)} y={arc(76,114,28,pass)} angle={-100*pass} scale={mix(1,.61,pass)}/>:null}
        <g opacity={puff} stroke="#58525e" strokeWidth=".9" strokeLinecap="round">
          <path d="M153 72l-2-2m7 1v-3m6 4 2-3" fill="none"/>
        </g>
      </svg>
      <div style={{position:'absolute',bottom:5,left:0,right:0,textAlign:'center'}}>
        <span style={{background:'#30333f',borderRadius:2,padding:'1.5px 4px',color:'#fff',fontSize:6.1,fontWeight:700}}>
          {promptSubtitle}
        </span>
      </div>
    </div>
  </AbsoluteFill>;
};
