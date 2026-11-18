import {useId} from 'react';
import {CardEntrance} from '../../../packages/animations/src';
import {during,mix} from '../../../packages/animations/src/reference-opening/motion';

const models=[
  {name:'Claude',color:'#af583b',at:1.24,x:54,width:59},
  {name:'Codex',color:'#323741',at:2.36,x:119,width:56},
  {name:'DeepSeek',color:'#3d53a5',at:3.52,x:181,width:77},
] as const;

const Egg=({x,y,angle=0,scale=1}:{x:number;y:number;angle?:number;scale?:number})=>(
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
    <ellipse cy="1.4" rx="6.2" ry="4.1" fill="#c7bbc3" opacity=".34"/>
    <path d="M-6 .3C-7-3-2-5.8 1.3-5 4-4.7 4.2-2.1 5.8-1 9 1 4 4.1 .5 4-3 4-5.4 3-6 .3Z" fill="#fff8e4"/>
    <ellipse cy="-.6" rx="2.75" ry="2.5" fill="#ecae39"/>
    <ellipse cx="-.7" cy="-1.6" rx="1.2" ry=".75" fill="#ffe888" opacity=".8"/>
  </g>
);

/** The demonstration within the reference. The figures and props are replacement vector artwork. */
const ModelDemonstration=({time}:{time:number})=>{
  const id=useId();
  const paint=(name:string)=>`url(#${id}-${name})`;
  const first=during(time,1.1,2.45);
  const second=during(time,4.64,5.78);
  const firstAir=first>0&&first<1;
  const launch=4*first*(1-first);
  const nextLaunch=4*second*(1-second);
  const recoil=Math.sin((time-2.3)*22)*Math.max(0,1-Math.abs(time-2.55)*3);
  const pan=during(time,4.86,5.77);
  const lift=Math.sin(Math.PI*first);
  const label=(name:string,x:number,y:number,at:number)=>(
    <g opacity={during(time,at,at+.24)}>
      <rect x={x-32} y={y} width="64" height="15" rx="2" fill="#fff" stroke="#e5e1e1"/>
      <text x={x} y={y+9.7} textAnchor="middle" fontSize="5.7" fontWeight="700" fill="#302930">{name}</text>
    </g>
  );
  return <svg data-model-demonstration viewBox="0 0 309 168" width="100%" height="100%" style={{display:'block'}} aria-label="三个模型的玩偶演示">
    <defs>
      <linearGradient id={`${id}-screen`} x2="0" y2="1"><stop stopColor="#fbfaf9"/><stop offset="1" stopColor="#efeff7"/></linearGradient>
      <linearGradient id={`${id}-step`} x2="0" y2="1"><stop stopColor="#dbdae5"/><stop offset=".75" stopColor="#f5f5f9"/><stop offset="1" stopColor="#f4f4f8" stopOpacity="0"/></linearGradient>
      <linearGradient id={`${id}-cloud`} x1=".22" x2=".72" y2="1"><stop stopColor="#ad99fc"/><stop offset=".48" stopColor="#646ce8"/><stop offset="1" stopColor="#20399d"/></linearGradient>
      <linearGradient id={`${id}-chef`} x1=".15" x2=".8" y2="1"><stop stopColor="#ffab6c"/><stop offset=".45" stopColor="#f77837"/><stop offset="1" stopColor="#b83917"/></linearGradient>
      <linearGradient id={`${id}-white`} x1=".2" x2=".6" y2="1"><stop stopColor="#fffdf7"/><stop offset=".53" stopColor="#f3edec"/><stop offset="1" stopColor="#c8b9bd"/></linearGradient>
      <linearGradient id={`${id}-hair`} x1=".2" x2=".85" y2="1"><stop stopColor="#6993cd"/><stop offset=".45" stopColor="#354f85"/><stop offset="1" stopColor="#111d42"/></linearGradient>
      <radialGradient id={`${id}-face`} cx=".36" cy=".22" r=".85"><stop stopColor="#fff4e7"/><stop offset="1" stopColor="#edb7a1"/></radialGradient>
    </defs>
    <rect width="309" height="168" fill={paint('screen')}/>
    <text x="10" y="7" fill="#282c36" fontSize="3.5" fontWeight="700" letterSpacing=".5">REMOTION</text>
    <text x="298" y="7" fill="#595762" fontSize="3.5" textAnchor="end">模型与 Agent · 能力与局限</text>
    <path d="M10 11H299" stroke="#e7e5e9" strokeWidth=".5"/>
    <text x="18" y="23" fill="#807b87" fontSize="4.5" letterSpacing=".7">模型能力</text>
    <text x="18" y="35" fill="#242631" fontSize="9.3" fontWeight="800">主流大模型，已经形成明显的梯队</text>

    {[{x:38,y:124},{x:121,y:107},{x:204,y:90}].map(({x,y})=>(
      <g key={x}><rect x={x} y={y} width="67" height={155-y} fill={paint('step')}/><path d={`M${x} ${y}h67`} stroke="#c7c5d3" strokeWidth=".8"/></g>
    ))}
    <g transform="translate(71 123)">
      <ellipse rx="16" ry="1.5" fill="#667194" opacity=".28"/>
      <path d="M-15-6c-5-8-1-16 2-20-1-7 4-13 11-13 8-1 13 4 13 10 6 4 8 12 5 20l-4 7H-11Z" fill={paint('hair')} stroke="#25385f" strokeWidth=".8"/>
      <path d="M-10-5c0-7 4-10 10-10s11 4 12 10L8-2H-7Z" fill="#344f89"/>
      <path d="m-6-7 5 5 6-5-2-5h-6z" fill={paint('white')}/>
      <path d="M-10-23q1-7 8-9 7 1 11 7v6c-1 6-4 8-9 8s-9-3-10-9Z" fill={paint('face')}/>
      <path d="M-12-22c1-11 8-13 14-12 5 1 8 5 8 10-6 0-10-4-13-6-1 4-5 7-9 8Z" fill={paint('hair')}/>
      <path d="M-9-32q8-6 15 0m-15-1-2 3m16-4 2 3" stroke="#e1e9fb" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
      <ellipse cx="-4.5" cy="-21" rx="1.5" ry="2.1" fill="#263253"/>
      <ellipse cx="4.5" cy="-21" rx="1.5" ry="2.1" fill="#263253"/>
      <path d="M-2-16q2 2 4 0" fill="none" stroke="#944e57" strokeWidth=".7"/>
      <path d="M-7-2v2m13-2v2" stroke="#142341" strokeWidth="3.2" strokeLinecap="round"/>
    </g>

    <g transform={`translate(154 106) rotate(${recoil*6})`}>
      <ellipse rx="19" ry="1.6" fill="#374976" opacity=".3"/>
      <path d="M-19-17c0-4 3-6 6-7 1-7 5-11 10-11 5-5 13-1 14 5 6 2 9 6 8 11 4 2 4 8 0 11-3 2-6 0-7-1l-2 4c1 4-5 7-8 3l-2-2-4 3c-4 3-9 1-8-3l-2-4c-4 3-8 0-8-4 0-2 1-4 3-5Z" fill={paint('cloud')}/>
      <path d="m-10-22 4 4-4 4m10 0 7-1" stroke="#eef1ff" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M-13-26c1-5 5-8 9-8" stroke="#ded6ff" strokeWidth="1" opacity=".55" fill="none" strokeLinecap="round"/>
      {first===1&&second===0?<Egg x={0} y={-35} angle={-5}/>:null}
    </g>

    <g transform={`translate(237 89) rotate(${-lift*7})`}>
      <ellipse rx="20" ry="1.8" fill="#9c5c46" opacity=".23"/>
      <path d="M-16-8v-11q0-7 7-7H8q8 0 8 6v5l5 1v6h-5v7h-8v-4h-8v4h-8v-5h-7v-2Z" fill={paint('chef')}/>
      <path d="M-13-22v-5c-6-2-6-9-2-12 2-2 5-2 8-2 4-5 10-4 13-1 6-1 11 2 13 6 2 5-1 8-6 9l-1 7q-12-4-25-2Z" fill={paint('white')} stroke="#d9cdd0" strokeWidth=".55"/>
      <path d="M-9-35q-2 5-1 9m8-11q-1 5 1 11m7-11q2 5 1 12" fill="none" stroke="#c8babe" strokeWidth=".8" opacity=".7"/>
      <path d="M-13-24q13-2 25 2" fill="none" stroke="#baa7a9" strokeWidth=".7"/>
      <path d="M-10-15v3m8-4v3" stroke="#442628" strokeWidth="1.9" strokeLinecap="round"/>
    </g>

    <g transform={`translate(${mix(207,162,pan)} ${mix(72,78,pan)-27*Math.sin(Math.PI*pan)-5*lift}) rotate(${mix(17,185,pan)+lift*27})`}>
      <path d="M4 0h16" stroke="#25232a" strokeWidth="2.8" strokeLinecap="round"/>
      <ellipse rx="8.4" ry="3.8" fill="#242329"/>
      <ellipse cy="-.6" rx="6.7" ry="2.5" fill="#4c4850"/>
      <path d="M-6-1.5q4-2 9-1" fill="none" stroke="#88808a" strokeWidth=".65"/>
    </g>
    {firstAir?<Egg x={mix(223,154,first)} y={mix(66,71,first)-37*launch} angle={mix(-28,13,first)}/>:null}
    {firstAir&&first<.65?<Egg x={mix(225,168,first)} y={mix(60,71,first)-51*launch} scale={.78} angle={20-70*first}/>:null}
    {second>0?<Egg x={mix(154,75,second)} y={mix(71,113,second)-41*nextLaunch} angle={second*-95}/>:null}

    {label('· Claude Opus 5.5',237,93,3.67)}
    {label('· GPT Astra',154,110,4.77)}
    <rect x={time<3.55?111:106} y="151" width={time<3.55?87:97} height="12" rx="2" fill="#30333f"/>
    <text x="154.5" y="159.4" fill="white" fontSize="6.5" fontWeight="700" textAnchor="middle">{time<3.55?'其实已经形成了明显的梯队':'Astra 和 DeepSeek-v4 来举例'}</text>
  </svg>;
};

export const ModelComparisonPanel=({time}:{time:number})=>{
  const enter=during(time,.34,.9);
  const connector=during(time,.52,.94);
  return <div data-model-comparison style={{position:'absolute',inset:0}}>
    <svg width={57} height={7} viewBox="0 0 57 7" style={{position:'absolute',left:385,top:192}} aria-hidden>
      <path d={`M2 3.5H${mix(2,49,connector)}`} stroke="#bd735e" strokeDasharray="1.2 3.2" strokeLinecap="round" opacity={connector}/>
    </svg>
    <CardEntrance data-model-comparison-window progress={enter} x={444} y={124} width={320} height={180} offset={{x:14,y:0}} fromScale={.96} background="#252730" borderRadius={9} boxShadow="0 7px 15px #24263120" style={{padding:6,boxSizing:'border-box'}}>
      <div style={{width:'100%',height:'100%',overflow:'hidden',borderRadius:4}}>
        <ModelDemonstration time={time}/>
      </div>
    </CardEntrance>
    <div style={{position:'absolute',left:444,top:318,fontSize:9,letterSpacing:1.2,color:'#858289',opacity:enter}}>做出来的动画</div>
    {models.map(({name,color,at,x,width})=>{
      const progress=during(time,at,at+.3);
      return <div key={name} data-comparison-model={name} style={{
        position:'absolute',left:x,top:283,width,height:24,boxSizing:'border-box',
        display:'grid',placeItems:'center',border:`1px solid ${color}38`,borderRadius:14,
        background:'#fffdf9',color,fontSize:12,fontWeight:700,opacity:progress,
        transform:`translateY(${mix(5,0,progress)}px)`,
      }}>{name}</div>;
    })}
  </div>;
};
