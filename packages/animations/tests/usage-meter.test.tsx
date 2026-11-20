/** @vitest-environment jsdom */
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect} from 'vitest';
import {UsageMeter} from '../src';
import {UsageComparison} from '../../../examples/reference-opening/compositions/UsageComparison';
const dom=(node:Parameters<typeof renderToStaticMarkup>[0])=>new DOMParser().parseFromString(renderToStaticMarkup(node),'text/html');
describe('independent usage meter and its complete transition',()=>{
  it('accepts independent data, content and indicators without video hooks',()=>{
    const doc=dom(<UsageMeter value={12345} label="已处理" indicators={[{id:'remaining',x:270,y:65,segments:4,progress:.5,color:'#139c78'}]}><span data-replacement>新插图</span></UsageMeter>);
    expect(doc.querySelector('[data-usage-value]')!.textContent).toBe('12,345');
    expect(doc.querySelector('[data-usage-label]')!.textContent).toBe('已处理');
    expect(doc.querySelector('[data-replacement]')!.textContent).toBe('新插图');
    expect([...doc.querySelectorAll('[data-usage-bar]')].map(bar=>bar.getAttribute('opacity'))).toEqual(['0','0','1','1']);
  });
  it('keeps malformed dimensions and data finite and fits narrow indicator stacks',()=>{
    const doc=dom(<UsageMeter value={NaN} width={Infinity} indicators={[{id:'tiny',x:NaN,y:Infinity,height:1,segments:32,progress:NaN,opacity:NaN}]}/>);
    expect(doc.body.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(doc.querySelector('[data-usage-value]')!.textContent).toBe('0');
  });
  it('flashes each filled block at a different phase and remains stable on backward seeks',()=>{
    const at=(time:number,blink=true)=>dom(<UsageMeter value={1200} time={time} blink={blink} indicators={[{id:'level',x:270,y:65,segments:5,progress:.6}]}/>);
    const filters=(doc:Document)=>[...doc.querySelectorAll<SVGElement>('[data-usage-bar]')].map(bar=>bar.style.filter);
    const first=at(0),later=at(.2);
    expect(new Set(filters(first)).size).toBeGreaterThan(1);
    expect(filters(later)).not.toEqual(filters(first));
    expect([...later.querySelectorAll('[data-usage-bar]')].map(bar=>bar.getAttribute('opacity'))).toEqual(['0','0','1','1','1']);
    at(5);expect(at(0).body.innerHTML).toBe(first.body.innerHTML);
    expect(filters(at(.2,false)).every(filter=>filter==='')).toBe(true);
  });
  it('preserves the observed overlap and continuous count with replaceable values',()=>{
    const at=(time:number)=>dom(<UsageComparison time={time} label="用量" peakValue={37800} finalValue={50000}/>);
    const peak=at(40/30),cross=at(1.8),last=at(6.2);
    expect(peak.querySelector('[data-usage-value]')!.textContent).toBe('37,800');
    expect(cross.querySelector('[data-usage-value]')!.textContent).toBe('39,000');
    for(const id of ['heavy','light'])expect(Number((cross.querySelector(`[data-usage-indicator="${id}"]`) as HTMLElement).style.opacity)).toBeGreaterThan(0);
    expect(last.querySelector('[data-usage-value]')!.textContent).toBe('50,000');
    const before=at(1.8).body.innerHTML;at(6.2);expect(at(1.8).body.innerHTML).toBe(before);
  });
});
