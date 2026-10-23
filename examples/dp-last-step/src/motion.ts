import timing from '../timing.json';

export {timing};
export type Point3 = [number, number, number];
export const COLORS = {paper:'#f6f4ef',ink:'#223633',muted:'#7d8781',gold:'#e7aa28',goldInk:'#a56a09',blue:'#397c8d',green:'#36745a'};
export const clamp = (n:number) => Math.max(0,Math.min(1,n));
export const smooth = (n:number) => {const p=clamp(n);return p*p*(3-2*p);};
export const phase = (frame:number,start:number,duration:number) => smooth((frame-start)/duration);
export const wordFrame = (cueIndex:number,needle:string) => {
  const cue=timing.cues[cueIndex];
  const position=cue.spoken.indexOf(needle);
  if(position<0) throw new Error(`Missing voice anchor ${needle}`);
  const word=timing.wordMarks.find(m=>m.cue===cue.id && m.characterPosition+m.characterCount>position);
  if(!word) throw new Error(`Missing actual speech timing ${needle}`);
  return Math.round(word.audioSeconds*timing.fps);
};
export const stepX = (step:number) => (step-2.5)*2;
export const stepY = (step:number) => step*.7;
export const RADIUS=.205;
export const GOLD={source:3,count:3,color:COLORS.gold,reveal:wordFrame(1,'第三级'),jump:wordFrame(1,'走一步'),duration:27,stagger:3};
export const BLUE={source:2,count:2,color:COLORS.blue,reveal:wordFrame(2,'第二级'),jump:wordFrame(2,'走两步'),duration:33,stagger:3};
export type RouteGroup = typeof GOLD;
export const SUM={start:wordFrame(3,'两类'),three:wordFrame(3,'三加二'),plus:wordFrame(3,'加'),two:wordFrame(3,'二'),equals:wordFrame(3,'等于'),five:wordFrame(3,'五')};

export const routePoint = (group:RouteGroup,index:number,p:number):Point3 => {
  const t=clamp(p);
  const sourceZ=group.source===3?(index-1)*.62:(index-.5)*.64;
  const targetIndex=group.source===3?index:index+3;
  const targetZ=(targetIndex-2)*.4;
  const targetX=stepX(4)+(targetIndex-2)*.3;
  return [stepX(group.source)+(targetX-stepX(group.source))*t,
    stepY(group.source)+RADIUS+(stepY(4)-stepY(group.source))*t+Math.sin(t*Math.PI)*(group.source===3?.72:1.18),
    sourceZ+(targetZ-sourceZ)*t];
};

export const tokenState = (frame:number,group:RouteGroup,index:number) => {
  const launch=group.jump+index*group.stagger;
  const p=clamp((frame-launch)/group.duration);
  const preparation=frame<launch ? Math.sin(clamp((frame-(launch-7))/7)*Math.PI)*.12 : 0;
  const after=frame-launch-group.duration;
  const impact=after>=0 && after<12 ? Math.sin(after/12*Math.PI)*.22 : 0;
  const stretch=0<p && p<1 ? Math.sin(p*Math.PI)*.10 : 0;
  const sy=1-preparation-impact+stretch;
  const position=routePoint(group,index,p);
  position[1]+=RADIUS*(sy-1);
  return {position,scale:[1/Math.sqrt(sy),sy,1/Math.sqrt(sy)] as Point3,p,
    opacity:phase(frame,group.reveal+index*2,10),arrived:frame>=launch+group.duration};
};

export const arrivedTokens = (frame:number) => [GOLD,BLUE].flatMap(g=>Array.from({length:g.count},(_,i)=>({group:g.source,index:i,...tokenState(frame,g,i)}))).filter(t=>t.arrived);

export const cameraState = (frame:number) => {
  const p=phase(frame,0,600);
  return {position:[-8+.35*p,6.5,12] as Point3,target:[.18,1.68,0] as Point3,zoom:133+4*p};
};
