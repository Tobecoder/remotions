import type {CSSProperties, ReactNode} from 'react';
import {mixPose, type PlanePose} from './motion';

export type PerspectivePanelProps = {
  children: ReactNode;
  width?: number;
  height?: number;
  from: PlanePose;
  to?: PlanePose;
  progress?: number;
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
  shadow?: boolean;
  style?: CSSProperties;
};

/** Projects live child content; child dimensions stay independent of screen-space pose. */
export const PerspectivePanel = ({children,width=360,height=202.5,from,to=from,progress=1,borderColor='transparent',borderWidth=0,radius=3,shadow=true,style}: PerspectivePanelProps) => {
  const pose = mixPose(from, to, progress);
  return <div data-perspective-panel style={{position:'absolute',left:0,top:0,width,height,transformOrigin:'0 0',transform:`matrix(${pose.ax},${pose.ay},${pose.bx},${pose.by},${pose.x},${pose.y})`,background:'#fff',borderRadius:radius,boxSizing:'border-box',border:`${borderWidth}px solid ${borderColor}`,boxShadow:shadow?'0 5px 5px #27292b12, 0 1px 2px #27292b12':undefined,...style}}>
    <div style={{width:'100%',height:'100%',overflow:'hidden',borderRadius:Math.max(0,radius-borderWidth)}}>{children}</div>
  </div>;
};
