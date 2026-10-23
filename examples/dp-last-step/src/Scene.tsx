import {useEffect,useLayoutEffect,useMemo} from 'react';
import type {CSSProperties,ReactNode} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {BLUE,COLORS as C,GOLD,RADIUS,SUM,cameraState,phase,routePoint,stepX,stepY,timing,tokenState} from './motion';
import type {Point3,RouteGroup} from './motion';

const FONT='"Microsoft YaHei", "PingFang SC", Arial, sans-serif';
const MONO='Consolas, "Cascadia Code", monospace';
const WORLD_BACKGROUND=new THREE.Color(C.paper);

const Camera = ({frame}:{frame:number}) => {
  const {camera}=useThree();
  const state=cameraState(frame);
  useLayoutEffect(()=>{
    camera.position.set(...state.position);
    camera.lookAt(...state.target);
    (camera as THREE.OrthographicCamera).zoom=state.zoom;
    camera.updateProjectionMatrix();camera.updateMatrixWorld();
  },[camera,frame,state.position,state.target,state.zoom]);
  return null;
};

const RoundedBlock=({size,position,color}:{size:Point3;position:Point3;color:string})=>{
  const geometry=useMemo(()=>new RoundedBoxGeometry(...size,4,.065),[...size]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} position={position} castShadow receiveShadow>
    <meshStandardMaterial color={color} roughness={.72}/>
  </mesh>;
};

const StepNumber=({level}:{level:number})=>{
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
    const ctx=canvas.getContext('2d')!;
    ctx.fillStyle='#9a9d93';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='600 175px Consolas';ctx.fillText(String(level),128,135);
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
  },[level]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={[stepX(level),stepY(level)-.32,1.261]}>
    <planeGeometry args={[.40,.40]}/><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false}/>
  </mesh>;
};

const Route=({group,frame}:{group:RouteGroup;frame:number})=>{
  const amount=phase(frame,group.jump-18,20);
  const opacity=phase(frame,group.reveal+5,12)*.74;
  const geometry=useMemo(()=>{
    const points=Array.from({length:49},(_,i)=>new THREE.Vector3(...routePoint(group,group.source===3?1:0,i/48*Math.max(.001,amount))));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),64,.018,6,false);
  },[amount,group]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  if(opacity<=0) return null;
  return <mesh geometry={geometry}><meshBasicMaterial color={group.color} transparent opacity={opacity} depthWrite={false}/></mesh>;
};

const Token=({group,index,frame}:{group:RouteGroup;index:number;frame:number})=>{
  const state=tokenState(frame,group,index);
  if(state.opacity<=0) return null;
  return <group position={state.position} scale={state.scale}>
    <mesh castShadow>
      <sphereGeometry args={[RADIUS,40,32]}/>
      <meshPhysicalMaterial color={group.color} roughness={.27} metalness={.05} clearcoat={.55} clearcoatRoughness={.3} transparent={state.opacity<1} opacity={state.opacity}/>
    </mesh>
  </group>;
};

const Destination=({frame}:{frame:number})=> <>
  <mesh rotation={[-Math.PI/2,0,0]} position={[stepX(4),stepY(4)+.006,0]}>
    <planeGeometry args={[1.73,2.15]}/>
    <meshStandardMaterial color={frame>=BLUE.reveal?'#e3eee7':'#fbf1d8'} roughness={1}/>
  </mesh>
  {[GOLD,BLUE].flatMap(group=>Array.from({length:group.count},(_,index)=>{
    const token=tokenState(frame,group,index);
    if(!token.arrived) return null;
    const target=routePoint(group,index,1);
    return <mesh key={`${group.source}-${index}`} rotation={[-Math.PI/2,0,0]} position={[target[0],stepY(4)+.015,target[2]]}>
      <ringGeometry args={[.23,.25,48]}/><meshBasicMaterial color={token.arrived?group.color:'#c4ccbf'} transparent opacity={token.arrived?.7:.4} depthWrite={false}/>
    </mesh>;
  }))}
</>;

const World=({frame}:{frame:number})=> <>
  <Camera frame={frame}/>
  <color attach="background" args={[WORLD_BACKGROUND]}/>
  <ambientLight intensity={.85}/>
  <hemisphereLight args={['#ffffff','#d7cdb8',1.25]}/>
  <directionalLight position={[-3,9,7]} intensity={3.3} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-camera-far={35} shadow-normalBias={.035} shadow-bias={-.00015} shadow-radius={5}/>
  <directionalLight position={[7,5,-5]} intensity={.65} color="#ffffff"/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.065,0]} receiveShadow>
    <planeGeometry args={[200,200]}/><meshStandardMaterial color={C.paper} roughness={1}/>
  </mesh>
  <RoundedBlock size={[2,.14,2.5]} position={[-5,-.0,0]} color="#fffdf8"/>
  {[1,2,3,4].map(level=><group key={level}>
    <RoundedBlock size={[2,stepY(level),2.5]} position={[stepX(level),stepY(level)/2,0]} color="#fffdf8"/>
    <StepNumber level={level}/>
  </group>)}
  <Destination frame={frame}/>
  <Route group={GOLD} frame={frame}/><Route group={BLUE} frame={frame}/>
  {[0,1,2].map(i=><Token key={`gold${i}`} group={GOLD} index={i} frame={frame}/>)}
  {[0,1].map(i=><Token key={`blue${i}`} group={BLUE} index={i} frame={frame}/>)}
</>;

export const projectPoint = (position:Point3,frame:number,width=1920,height=1080) => {
  const state=cameraState(frame);
  const camera=new THREE.OrthographicCamera(-width/2,width/2,height/2,-height/2,.1,100);
  camera.position.set(...state.position);camera.lookAt(...state.target);camera.zoom=state.zoom;
  camera.updateProjectionMatrix();camera.updateMatrixWorld();
  const p=new THREE.Vector3(...position).project(camera);
  return {x:(p.x+1)*width/2,y:(1-p.y)*height/2};
};
const WorldLabel=({point,frame,children,style}:{point:Point3;frame:number;children:ReactNode;style?:CSSProperties})=>{
  const p=projectPoint(point,frame);
  return <div data-sample-text style={{position:'absolute',left:p.x,top:p.y,fontFamily:FONT,...style}}>{children}</div>;
};

const Equation=({frame}:{frame:number})=>{
  const visible=phase(frame,SUM.start,15);
  const entries=[{text:'3',start:SUM.three,color:C.goldInk},{text:'+',start:SUM.plus,color:C.muted},{text:'2',start:SUM.two,color:C.blue},{text:'=',start:SUM.equals,color:C.muted},{text:'5',start:SUM.five,color:C.green}];
  return <div data-sample-text data-sample-equation style={{position:'absolute',left:1260,top:655,width:550,opacity:visible}}>
    <div style={{fontSize:27,color:C.muted,marginBottom:15,letterSpacing:2}}>两类走法，不重不漏</div>
    <div style={{display:'flex',alignItems:'baseline',gap:17,fontFamily:MONO,fontSize:104,fontWeight:700,lineHeight:1.2}}>
      {entries.map(v=><span key={v.text} data-equation-part={v.text} style={{color:v.color,opacity:phase(frame,v.start,5),transform:`translateY(${(1-phase(frame,v.start,8))*12}px)`}}>{v.text}</span>)}
    </div>
    <div style={{fontSize:30,color:C.ink,opacity:phase(frame,SUM.five+8,12),marginTop:16}}>到第 4 级，共 5 种走法</div>
  </div>;
};

export default function Scene(){
  const frame=useCurrentFrame();const {width,height,fps}=useVideoConfig();
  const active=timing.cues.find(c=>frame/fps>=c.start && frame/fps<c.end);
  return <AbsoluteFill style={{backgroundColor:C.paper,fontFamily:FONT,color:C.ink,overflow:'hidden'}}>
    <ThreeCanvas width={width} height={height} orthographic camera={{position:[-8,6.5,12],zoom:133,near:.1,far:100}} shadows dpr={1} gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.12;gl.outputColorSpace=THREE.SRGBColorSpace;gl.shadowMap.type=THREE.PCFSoftShadowMap;}}>
      <World frame={frame}/>
    </ThreeCanvas>
    <div data-sample-text style={{position:'absolute',left:108,top:60,fontSize:23,letterSpacing:4,color:C.muted}}>动态规划入门 / 最后一步</div>
    <div data-sample-text style={{position:'absolute',left:104,top:106,fontSize:72,fontWeight:800,letterSpacing:-1}}>到第 4 级，最后一步怎么走？</div>
    <div data-sample-text style={{position:'absolute',left:110,top:209,fontSize:31,color:C.muted}}>每次只能走 1 级或 2 级</div>
    <WorldLabel point={[stepX(4),stepY(4),0]} frame={frame} style={{marginLeft:225,marginTop:-20,fontSize:37,fontWeight:700}}>第 4 级</WorldLabel>
    <WorldLabel point={[stepX(3),stepY(3),0]} frame={frame} style={{marginLeft:-400,marginTop:-155,opacity:phase(frame,GOLD.reveal,12),color:C.goldInk}}>
      <div style={{fontSize:31,fontWeight:700}}>第 3 级已有 <strong style={{fontSize:52}}>3</strong> 种</div>
      <div style={{fontSize:27,marginTop:5}}>最后走 1 级 ↗</div>
    </WorldLabel>
    <WorldLabel point={[stepX(2),stepY(2),0]} frame={frame} style={{marginLeft:-330,marginTop:-60,opacity:phase(frame,BLUE.reveal,12),color:C.blue}}>
      <div style={{fontSize:31,fontWeight:700}}>第 2 级已有 <strong style={{fontSize:52}}>2</strong> 种</div>
      <div style={{fontSize:27,marginTop:5}}>最后走 2 级 ⤴</div>
    </WorldLabel>
    <div data-sample-text style={{position:'absolute',left:110,top:830,fontSize:26,color:C.muted,opacity:phase(frame,GOLD.reveal+15,15)}}><span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:C.gold,marginRight:12}}/>一颗棋子，代表一种走法</div>
    <Equation frame={frame}/>
    <div data-sample-text style={{position:'absolute',left:100,top:949,width:1720,textAlign:'center',fontSize:44,fontWeight:600,lineHeight:1.5,minHeight:70}}>{active?.text??(frame>SUM.five+25?'最后一步的两类来源，合起来就是答案。':'')}</div>
  </AbsoluteFill>;
}
