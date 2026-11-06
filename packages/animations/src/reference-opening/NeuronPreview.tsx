import {useId} from 'react';
import {during,mix} from './motion';

const countStops=[[0,0],[.6,1],[1,50],[1.5,84_000_000],[2,39_000_000_000],[2.5,86_000_000_000]] as const;
const getCount=(time:number)=>{
  for(let i=1;i<countStops.length;i++){
    const [end,value]=countStops[i], [start,previous]=countStops[i-1];
    if(time<end)return Math.floor(mix(previous,value,during(time,start,end)));
  }
  return 86_000_000_000;
};
const formatCount=(value:number)=>value<10_000?value.toLocaleString('en-US'):value<100_000_000?`${Number((value/10_000).toFixed(1)).toLocaleString('en-US')}万`:`${Number((value/100_000_000).toFixed(1)).toLocaleString('en-US')}亿`;

/** Frame-driven illustration shared by the thumbnail and its enlarged view. */
export const NeuronPreview=({time}:{time:number})=>{
  const id=`neuron-${useId().replace(/:/g,'')}`,t=Math.max(0,time),value=getCount(t),count=t<.1?'':formatCount(value);
  return <svg data-neuron-preview data-neuron-value={value} width="100%" height="100%" viewBox="0 0 336 189" preserveAspectRatio="xMidYMid meet" style={{display:'block',background:'#080e1b'}}>
    <defs><radialGradient id={id}><stop stopColor="#17294a"/><stop offset="1" stopColor="#060b16"/></radialGradient></defs><rect width="336" height="189" fill={`url(#${id})`}/>
    {Array.from({length:28},(_,i)=>{
      const angle=i*2.399963,x=168+Math.cos(angle)*(25+(i%8)*18),y=88+Math.sin(angle)*(15+(i%6)*12),r=1+(i%3)*.6;
      return <g key={i} opacity={mix(.15,.7,during(t,.1+i*.025,.7+i*.025))*(.8+.2*Math.sin(t*2+i))} stroke="#9caed7" strokeWidth=".55"><circle cx={x} cy={y} r={r} fill="#6c8bb8"/>{Array.from({length:5},(_,n)=>{const a=n*Math.PI*.4+i,len=8+(n+i)%4*4;return <path key={n} d={`M${x} ${y}l${Math.cos(a)*len} ${Math.sin(a)*len}m${-Math.cos(a)*len*.35} ${-Math.sin(a)*len*.35}l${Math.cos(a+.7)*len*.4} ${Math.sin(a+.7)*len*.4}`} fill="none"/>;})}</g>;
    })}
    <text data-neuron-count x="168" y="99" textAnchor="middle" fill="#f1f4ff" fontFamily="Georgia,serif" fontSize="32">{count}</text>
    {count&&<text x="168" y="115" textAnchor="middle" fill="#afbdd3" fontSize="6" letterSpacing="2">人脑中的神经元</text>}
    <text x="168" y="172" textAnchor="middle" fill="#d9dfeb" fontSize="7">在每个人的大脑里……</text>
  </svg>;
};
