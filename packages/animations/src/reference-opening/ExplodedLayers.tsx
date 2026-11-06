import {useId, type ReactNode} from 'react';
import {PerspectivePanel} from './PerspectivePanel';
import {clamp, during, explodedLayerTiming, frontPose, mix, mixPose, tiltedPose, type PlanePose} from './motion';

export type ExplodedPanelContent=ReactNode|((elapsed:number)=>ReactNode);
export type ExplodedLayer = {id:string;label:string;content:ExplodedPanelContent;enterAt?:number;duration?:number};
export type ExplodedLayersProps = {
  time: number;
  startAt?: number;
  tiltProgress?: number;
  layers: readonly ExplodedLayer[];
  screen: ExplodedPanelContent;
  screenLabel?: string;
  spacing?: number;
  labelOpacity?: number;
  pose?: PlanePose;
  front?: PlanePose;
  panelWidth?: number;
  panelHeight?: number;
  canvasWidth?: number;
  canvasHeight?: number;
};

/** Layers are ordered nearest-to-screen first. The last layer is the base document. */
export const ExplodedLayers = ({time,startAt=0,tiltProgress:rawTilt,layers,screen,screenLabel='成片',spacing=35.6,labelOpacity=1,pose=tiltedPose,front=frontPose,panelWidth=360,panelHeight=202.5,canvasWidth=800,canvasHeight=450}: ExplodedLayersProps) => {
  const localTime=time-startAt;
  const tiltProgress=rawTilt===undefined?during(localTime,explodedLayerTiming.tiltStart,explodedLayerTiming.tiltEnd):clamp(rawTilt);
  const metalId=useId().replace(/:/g,'');
  const leftX=pose.x+pose.bx*panelHeight-4, leftY=pose.y+pose.by*panelHeight+3;
  const rightX=pose.x+pose.ax*panelWidth+9, rightY=pose.y+pose.ay*panelWidth-1;
  const anchors=layers.map((layer,index)=>{
    const isBase=index===layers.length-1;
    const enterAt=layer.enterAt??(isBase?explodedLayerTiming.tiltStart:explodedLayerTiming.firstLayer+(layers.length-2-index)*explodedLayerTiming.interval);
    const entry=during(localTime,enterAt,enterAt+(layer.duration??explodedLayerTiming.duration));
    const progress=isBase?tiltProgress:entry;
    const y=pose.y+spacing*(index+1);
    const from=isBase?front:{...pose,y:y+18};
    const to={...pose,y:y+mix(18,0,progress)};
    const current=mixPose(from,to,progress);
    const contentTime=Math.max(0,localTime-(isBase?explodedLayerTiming.tiltEnd:enterAt+(layer.duration??explodedLayerTiming.duration)));
    return {layer,progress,from,to,contentTime,leftX:current.x+current.bx*panelHeight-4,leftY:current.y+current.by*panelHeight+3,rightX:current.x+current.ax*panelWidth+9,rightY:current.y+current.ay*panelWidth-1};
  });
  const screenLabelProgress=during(tiltProgress,.75,1);
  return <div data-exploded-layers style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:front.x+panelWidth*.436,top:front.y+panelHeight,width:46,height:48,opacity:1-during(tiltProgress,0,.55),transformOrigin:'top',transform:`scaleY(${mix(1,0.3,tiltProgress)})`}}>
      <svg viewBox="0 0 46 48" width="46" height="48"><defs><linearGradient id={metalId}><stop stopColor="#b9bdc2"/><stop offset=".5" stopColor="#f5f6f7"/><stop offset="1" stopColor="#a5aab0"/></linearGradient></defs><path d="M17 0H30L33 37L43 41Q46 44 40 46H5Q0 44 4 41L14 37Z" fill={`url(#${metalId})`}/><ellipse cx="23" cy="45" rx="23" ry="2" fill="#c2c4c6"/></svg>
    </div>
    {[...anchors].reverse().map(({layer,progress,from,to,contentTime})=><PerspectivePanel key={layer.id} width={panelWidth} height={panelHeight} from={from} to={to} progress={progress} style={{opacity:progress}}><div data-layer-content={layer.id} style={{position:'relative',width:'100%',height:'100%'}}>{typeof layer.content==='function'?layer.content(contentTime):layer.content}</div></PerspectivePanel>)}
    <PerspectivePanel width={panelWidth} height={panelHeight} from={front} to={pose} progress={tiltProgress} borderColor="#303238" borderWidth={4.5} radius={mix(8,3,tiltProgress)} shadow={tiltProgress<0.5}>
      <div data-stack-screen-content style={{position:'relative',width:'100%',height:'100%'}}>{typeof screen==='function'?screen(Math.max(0,localTime-explodedLayerTiming.tiltEnd)):screen}</div>
    </PerspectivePanel>
    <svg width={canvasWidth} height={canvasHeight} style={{position:'absolute',inset:0,overflow:'visible',opacity:clamp(labelOpacity)}}>
      <line x1={leftX} y1={leftY} x2={leftX} y2={leftY+spacing*layers.length} stroke="#cfc6bb" strokeDasharray="2 3" strokeWidth=".7" opacity={screenLabelProgress}/>
      {anchors.map((anchor,index)=><g key={anchor.layer.id} data-layer-label={anchor.layer.id} opacity={anchor.progress}>
        <circle cx={anchor.leftX} cy={anchor.leftY} r="3" fill="#df745b"/>
        <circle cx={anchor.rightX} cy={anchor.rightY} r="1.3" fill="#55575a"/>
        <line x1={anchor.rightX+4} y1={anchor.rightY} x2={anchor.rightX+54} y2={anchor.rightY} stroke="#c9c9c3" strokeWidth=".6"/>
        <text x={anchor.rightX+61} y={anchor.rightY+4} fontSize="7" fill="#99999b" fontFamily="monospace">{String(layers.length-index).padStart(2,'0')}</text>
        <text x={anchor.rightX+77} y={anchor.rightY+4} fontSize="14" fontWeight="700" fill="#343438">{anchor.layer.label}</text>
      </g>)}
      <g opacity={screenLabelProgress}>
      <circle cx={rightX} cy={rightY} r="1.3" fill="#55575a"/><line x1={rightX+4} y1={rightY} x2={rightX+54} y2={rightY} stroke="#c9c9c3" strokeWidth=".6"/>
      <text x={rightX+61} y={rightY+5} fontSize="15" fontWeight="700" fill="#d66b4e">{screenLabel}</text>
      </g>
    </svg>
  </div>;
};
