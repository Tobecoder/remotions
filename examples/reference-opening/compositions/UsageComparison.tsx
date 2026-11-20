import type {ReactNode} from 'react';
import {UsageMeter} from '../../../packages/animations/src';
import {clamp,during,mix} from '../../../packages/animations/src/reference-opening/motion';

export type UsageComparisonProps={time:number;startAt?:number;label?:string;peakValue?:number;finalValue?:number;content?:ReactNode};

/** One shared complete effect: fast count, slowing count, old bars down and new bar down from above. */
export const UsageComparison=({time,startAt=0,label='tokens',peakValue=75600,finalValue=100000,content}:UsageComparisonProps)=>{
  const t=Math.round((time-startAt)*30)/30;
  const samples:readonly (readonly [number,number])[]=[[0,0],[4/30,7200],[8/30,14400],[10/30,18000],[12/30,21600],[14/30,27000],[18/30,34200],[33/30,61200],[38/30,72000],[40/30,75600],[54/30,78000],[63/30,79440],[78/30,82000],[141/30,92560],[177/30,98640],[185/30,100000]];
  let count=t<=0?0:100000;
  for(let i=1;i<samples.length;i++)if(t<=samples[i][0]){const [a,av]=samples[i-1],[b,bv]=samples[i];count=mix(av,bv,clamp((t-a)/(b-a)));break;}
  count=count<=75600?Math.round(count/1800)*1800:Math.min(100000,75600+Math.round((count-75600)/160)*160);
  const value=count<=75600?count/75600*peakValue:mix(peakValue,finalValue,(count-75600)/(100000-75600));
  const green=t>=1.8;
  const position=(points:readonly (readonly [number,number])[])=>{
    if(t<=points[0][0])return points[0][1];
    for(let i=1;i<points.length;i++)if(t<=points[i][0])return mix(points[i-1][1],points[i][1],during(t,points[i-1][0],points[i][0]));
    return points.at(-1)![1];
  };
  const redY=position([[1.333333,80],[1.6,95.4],[1.7,117.1],[1.8,172.5],[2,280],[2.2,340]]);
  const greenY=position([[1.4,-80],[1.6,-40],[1.7,-2],[1.8,40],[2,73],[2.2,79]]);
  return <div data-usage-comparison style={{position:'absolute',inset:0}}>
    <UsageMeter x={145} y={135} time={t} value={value} label={label} color={green?'#3b9f79':'#c34c5c'} indicators={[
      {id:'heavy',x:275,y:redY,height:74,segments:5,color:'#c34c5c',opacity:1-during(t,1.7,2.2)},
      {id:'light',x:275,y:greenY,width:20,height:37,segments:1,color:'#3b9f79',opacity:during(t,1.4,1.9)},
    ]}>{content}</UsageMeter>
  </div>;
};
