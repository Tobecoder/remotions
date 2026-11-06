/** @vitest-environment jsdom */
import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {ProgressRow} from '../src';
import {ProgressRace} from '../../../examples/reference-opening/compositions/ProgressRace';

const dom=(node:ReactNode)=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');

describe('independent progress row',()=>{
  it('uses caller progress and content independently of elapsed time or other rows',()=>{
    const scene=dom(<><ProgressRow label="下载" progress={.25} time={100} color="#409eff" status="waiting" caption={<span>校验素材</span>} value="25%"/><ProgressRow label="编码" progress={.75} time={0} color="#67c23a" y={282}/></>);
    const rows=scene.querySelectorAll<HTMLElement>('[data-progress-row]');
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector<HTMLElement>('[data-progress-fill]')!.style.width).toBe('25%');
    expect(rows[1].querySelector<HTMLElement>('[data-progress-fill]')!.style.width).toBe('75%');
    expect(rows[0].querySelector('[data-progress-caption]')!.textContent).toBe('校验素材');
    expect(rows[0].querySelector('[data-progress-value]')!.textContent).toBe('25%');
    expect(rows[0].querySelector('[data-progress-status="waiting"]')).not.toBeNull();
    expect(rows[1].querySelector('[data-progress-status]')).toBeNull();
    expect(rows[1].textContent).not.toMatch(/6000|总的来说|快速完成/);
  });
  it('lets the caller choose completion and handles invalid progress without invalid fill sizes',()=>{
    for(const [progress,width] of [[-1,'0%'],[NaN,'0%'],[Infinity,'0%'],[2,'100%']] as const){
      const scene=dom(<ProgressRow label="处理" progress={progress} status="complete" badge="好" value="100%"/>);
      expect(scene.querySelector<HTMLElement>('[data-progress-fill]')!.style.width).toBe(width);
      expect(scene.querySelector('[data-progress-status="complete"]')!.textContent).toBe('好');
      expect(scene.querySelector('[data-progress-status="waiting"]')).toBeNull();
      const row=scene.querySelector<HTMLElement>('[data-progress-row]')!,value=scene.querySelector<HTMLElement>('[data-progress-value]')!,badge=scene.querySelector<HTMLElement>('[data-progress-status="complete"]')!;
      expect(parseFloat(row.style.width)-parseFloat(value.style.right)).toBeLessThan(parseFloat(badge.style.left));
    }
  });
  it('keeps a waiting marker inside the track for a smaller row and can seek its animation deterministically',()=>{
    for(const progress of [0,.5,1]){
      const scene=dom(<ProgressRow label="处理中" progress={progress} width={348} status="waiting" time={2}/>);
      const row=scene.querySelector<HTMLElement>('[data-progress-row]')!,track=scene.querySelector<HTMLElement>('[data-progress-fill]')!.parentElement!,spinner=scene.querySelector<SVGElement>('[data-progress-status="waiting"]')!;
      expect(parseFloat(spinner.style.left)).toBeGreaterThanOrEqual(parseFloat(track.style.left));
      expect(parseFloat(spinner.style.left)+Number(spinner.getAttribute('width'))).toBeLessThanOrEqual(parseFloat(track.style.left)+parseFloat(track.style.width));
      expect(parseFloat(track.style.left)+parseFloat(track.style.width)).toBeLessThan(parseFloat(row.style.width));
    }
    const render=(time:number)=>renderToStaticMarkup(<ProgressRow label="处理中" progress={.4} status="waiting" time={time}/>);
    const remembered=render(.5);render(10);expect(render(.5)).toBe(remembered);
  });
  it('keeps scenario-specific copy and counting configurable in the composed comparison',()=>{
    const scene=dom(<ProgressRace time={9} firstLabel="方案 X" secondLabel="方案 Y" eyebrow="任务对比" countTo={120} phrases={[]}/>);
    expect(scene.querySelector('[data-race-count]')!.textContent).toBe('120');
    expect(scene.body.textContent).toContain('任务对比');
    expect(scene.body.textContent).not.toContain('总的来说');
    expect(scene.querySelectorAll('[data-progress-row]')).toHaveLength(2);
  });
});
