import {getLength,getPointAtLength,getSubpaths} from '@remotion/paths';
import {clamp} from './motion';

export type BranchPoint={x:number;y:number};
export type BranchRoute={id:string;path:string;cardIds?:readonly string[];enterAt?:number;duration?:number};
export type BranchingPathsTiming={stampAt?:number;selectAt?:number;travelDuration?:number;resultAt?:number};
export type BranchingPathsPositions={stamp?:BranchPoint;routeLabel?:BranchPoint;resultLabel?:BranchPoint};
type CardReference={id:string;selected?:boolean};
type MeasuredRoute=BranchRoute & {length:number;from:BranchPoint;to:BranchPoint};

export const finiteBranchValue=(value:number|undefined,fallback:number)=>value!==undefined&&Number.isFinite(value)?value:fallback;
export const branchPoint=(point:BranchPoint,name:string)=>{
  if(!Number.isFinite(point.x)||!Number.isFinite(point.y))throw new Error(`${name} 必须包含有限的 x/y 坐标。`);
  return point;
};
const near=(a:BranchPoint,b:BranchPoint)=>Math.hypot(a.x-b.x,a.y-b.y)<.01;
const cubic=(a:number,b:number,c:number,d:number,p:number)=>(1-p)**3*a+3*(1-p)**2*p*b+3*(1-p)*p*p*c+p**3*d;
const originalPoint=(progress:number)=>{
  const p=clamp(progress)*2;
  return p<=1?{x:cubic(124,205,287,400,p),y:cubic(294,388,348,294,p)}:{x:cubic(400,513,580,678,p-1),y:cubic(294,240,206,294,p-1)};
};

const measureRoute=(route:BranchRoute):MeasuredRoute=>{
  try{
    if(!route.id||getSubpaths(route.path).length!==1)throw new Error('需要唯一名称和一条连续路径');
    const length=getLength(route.path),from=getPointAtLength(route.path,0),to=getPointAtLength(route.path,length);
    if(!Number.isFinite(length)||length<=0||!from||!to)throw new Error('路径长度必须大于 0');
    return {...route,length,from:branchPoint(from,'路线起点'),to:branchPoint(to,'路线终点')};
  }catch(error){
    throw new Error(`路线「${route.id}」无效：请提供一条连续、非零长度的 SVG 路径。`,{cause:error});
  }
};

/** One geometry source drives the route, its moving light and associated card selection. */
export const resolveBranchingGeometry=({routes,selectedRoute,from:providedFrom,to:providedTo,cards}:{routes?:readonly BranchRoute[];selectedRoute?:string|false;from?:BranchPoint;to?:BranchPoint;cards:readonly CardReference[]})=>{
  const measured=routes?.map(measureRoute);
  const from=branchPoint(providedFrom??measured?.[0]?.from??{x:124,y:294},'起点');
  const to=branchPoint(providedTo??measured?.[0]?.to??{x:678,y:294},'终点');
  if(near(from,to))throw new Error('多路径演示的起点与终点不能重合。');
  const originalLayout=from.x===124&&from.y===294&&to.x===678&&to.y===294;
  const mapPoint=(point:BranchPoint)=>{
    if(originalLayout)return point;
    const u=(point.x-124)/554,v=(point.y-294)/554,dx=to.x-from.x,dy=to.y-from.y;
    return {x:from.x+u*dx-v*dy,y:from.y+u*dy+v*dx};
  };
  const xy=(x:number,y:number)=>{const point=mapPoint({x,y});return `${point.x} ${point.y}`;};
  const originalRoutes:readonly BranchRoute[]=[
    {id:'upper',path:`M${xy(124,294)} Q${xy(400,114)} ${xy(678,294)}`,enterAt:0},
    {id:'middle',path:`M${xy(124,294)} Q${xy(400,244)} ${xy(678,294)}`,enterAt:.7},
    {id:'lower',path:`M${xy(124,294)} Q${xy(400,474)} ${xy(678,294)}`,enterAt:.35},
  ];
  const resolvedRoutes=measured??originalRoutes;
  if(new Set(resolvedRoutes.map(route=>route.id)).size!==resolvedRoutes.length)throw new Error('路线 id 不能重复。');
  const cardIds=new Set(cards.map(card=>card.id));
  if((routes!==undefined||selectedRoute!==undefined)&&cardIds.size!==cards.length)throw new Error('卡片 id 不能重复。');
  for(const route of measured??[]){
    if(!near(route.from,from)||!near(route.to,to))throw new Error(`路线「${route.id}」的起终点必须与演示起终点一致。`);
    for(const id of route.cardIds??[])if(!cardIds.has(id))throw new Error(`路线「${route.id}」引用了不存在的卡片「${id}」。`);
  }
  if(routes===undefined&&selectedRoute===undefined){
    return {routes:resolvedRoutes,from,to,mapPoint,selected:{
      path:`M${xy(124,294)} C${xy(205,388)} ${xy(287,348)} ${xy(400,294)} S${xy(580,206)} ${xy(678,294)}`,
      cardIds:new Set(cards.filter(card=>card.selected).map(card=>card.id)),
      pointAt:(progress:number)=>mapPoint(originalPoint(progress)),
    }};
  }
  const selected=typeof selectedRoute==='string'?resolvedRoutes.find(route=>route.id===selectedRoute):undefined;
  if(typeof selectedRoute==='string'&&!selected)throw new Error(`所选路线「${selectedRoute}」不存在。`);
  const selectedGeometry=selected?(measured?.find(route=>route.id===selected.id)??measureRoute(selected)):undefined;
  return {routes:resolvedRoutes,from,to,mapPoint,selected:selectedGeometry?{
    path:selectedGeometry.path,cardIds:new Set(selectedGeometry.cardIds??[]),
    pointAt:(progress:number):BranchPoint=>getPointAtLength(selectedGeometry.path,selectedGeometry.length*clamp(progress))!,
  }:undefined};
};
