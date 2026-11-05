/** @vitest-environment jsdom */
import type {CSSProperties,ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it,vi} from 'vitest';

const clock=vi.hoisted(()=>({frame:0}));
vi.mock('remotion',()=>({
  useCurrentFrame:()=>clock.frame,
  useVideoConfig:()=>({fps:30,width:1920,height:1080,durationInFrames:300}),
  staticFile:(file:string)=>file,
  AbsoluteFill:({children,style}:{children?:ReactNode;style?:CSSProperties})=><div style={style}>{children}</div>,
  Img:({src,style}:{src:string;style?:CSSProperties})=><img src={src} style={style}/>,
}));
import {OpeningScene} from '../../../examples/reference-opening/OpeningScene';
import {during,openingLayerStartAt,tiltedPose} from '../src/reference-opening/motion';
import {MaterialDemo} from '../../../apps/catalog/src/MaterialDemo';
import {ExplodedLayers} from '../src/reference-opening/ExplodedLayers';
const at=(frame:number)=>{
  clock.frame=frame;
  return new DOMParser().parseFromString(renderToStaticMarkup(<OpeningScene/>),'text/html');
};

describe('ten-second example paper layering',()=>{
  const catalogueAt=(frame:number)=>{
    clock.frame=frame;
    return new DOMParser().parseFromString(renderToStaticMarkup(<MaterialDemo id="exploded-layers"/>),'text/html');
  };
  const panels=(document:Document)=>Array.from(document.querySelectorAll<HTMLElement>('[data-exploded-layers] > [data-perspective-panel]'));
  const matrix=(panel:HTMLElement)=>panel.style.transform.match(/matrix\(([^)]+)\)/)![1].split(',').map(Number);
  const frames=[0,12,18,24,36,54,61,69,77,84,91,99,116,126];

  it('matches the catalogue fading, tilt, vertical motion and labels with only an overall start offset',()=>{
    for(const frame of frames){
      const catalogue=catalogueAt(frame),example=at(frame+Math.round(openingLayerStartAt*30));
      const expected=panels(catalogue),actual=panels(example);
      expect(actual).toHaveLength(expected.length);
      actual.forEach((panel,index)=>{
        expect(Number(panel.style.opacity||1)).toBeCloseTo(Number(expected[index].style.opacity||1),7);
        const a=matrix(panel),b=matrix(expected[index]);
        // Only the horizontal placement differs between the two layouts.
        for(const axis of [0,1,2,3,5])expect(a[axis]).toBeCloseTo(b[axis],7);
      });
      const labels=catalogue.querySelectorAll('[data-layer-label]'),exampleLabels=example.querySelectorAll('[data-layer-label]');
      exampleLabels.forEach((label,index)=>{
        expect(label.getAttribute('data-layer-label')).toBe(labels[index].getAttribute('data-layer-label'));
        expect(Number(label.getAttribute('opacity'))).toBeCloseTo(Number(labels[index].getAttribute('opacity')),7);
      });
    }
  });
  it('keeps the component defaults equal to the approved catalogue recipe',()=>{
    // Frozen values from the approved catalogue, independent of the new defaults.
    const starts=[3.3,2.8,2.3,1.8,.4];
    for(const frame of frames){
      const time=frame/30;
      const fixture=new DOMParser().parseFromString(renderToStaticMarkup(<ExplodedLayers time={time} tiltProgress={during(time,.4,1.2)} front={{x:220,y:94,ax:1,ay:0,bx:0,by:1}} pose={{...tiltedPose,x:291}} screen={<span/>} layers={starts.map((enterAt,index)=>({id:String(index),label:String(index),enterAt,duration:.55,content:<span/>}))}/>),'text/html');
      const expected=panels(fixture),actual=panels(catalogueAt(frame));
      actual.forEach((panel,index)=>{
        expect(Number(panel.style.opacity||1)).toBeCloseTo(Number(expected[index].style.opacity||1),7);
        matrix(panel).forEach((value,axis)=>expect(value).toBeCloseTo(matrix(expected[index])[axis],7));
      });
    }
  });
  it('shows one screenshot at a time, including source-frame changes',()=>{
    for(const frame of [0,27,28,29,30,54,55,92,93,117,142,175,202,229,299]){
      const images=at(frame).querySelectorAll<HTMLElement>('[data-screen-frame]');
      expect(Array.from(images).filter(el=>Number(el.style.opacity)>0)).toHaveLength(1);
    }
  });
});
