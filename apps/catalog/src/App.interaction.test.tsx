/** @vitest-environment jsdom */
import {afterAll, afterEach, beforeAll, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {App} from './App';
import {catalog} from './catalog';

const players=vi.hoisted(()=>new Map<string,{play:ReturnType<typeof vi.fn>;pause:ReturnType<typeof vi.fn>;seekTo:ReturnType<typeof vi.fn>}>());
vi.mock('@remotion/player',async()=>{
  const {forwardRef,useImperativeHandle,useMemo}=await import('react');
  return {Player:forwardRef(({inputProps}:{inputProps:{id:string}},ref)=>{
    const api=useMemo(()=>({play:vi.fn(),pause:vi.fn(),seekTo:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn()}),[]);
    useImperativeHandle(ref,()=>api);players.set(inputProps.id,api);
    return <div data-player={inputProps.id}/>;
  })};
});
beforeAll(()=>vi.stubGlobal('PointerEvent',class extends MouseEvent{
  pointerType:string;
  constructor(type:string,init:MouseEventInit&{pointerType?:string}={}){super(type,init);this.pointerType=init.pointerType??'mouse';}
}));
afterAll(()=>vi.unstubAllGlobals());

afterEach(()=>{cleanup();players.clear();});

describe('classified material library', () => {
  it('opens the seven layout cards and shows twenty-three materials without the withdrawn draft', () => {
    const {container} = render(<App />);
    expect(screen.getByTestId('material-count').textContent).toBe('23');
    expect(container.querySelectorAll('[data-material-id]')).toHaveLength(7);
    expect(screen.getAllByRole('button', {name: /播放预览/})).toHaveLength(7);
    expect(screen.queryByText('截图窗口聚焦')).toBeNull();
    expect(screen.queryByText(/查看原片/)).toBeNull();
  });
  it('only shows materials belonging to the selected category, with matching empty states', () => {
    render(<App />);
    for (const tab of screen.getAllByRole('tab')) {
      fireEvent.click(tab);
      const name = tab.querySelector('span')!.textContent!;
      const panel = screen.getByRole('tabpanel');
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
      const expected=catalog.filter(item=>`category-${item.category}`===tab.id);
      if(expected.length){
        expect(Array.from(panel.querySelectorAll<HTMLElement>('[data-material-id]')).map(card=>card.dataset.materialId)).toEqual(expected.map(item=>item.id));
      }else expect(panel.textContent).toContain(`${name}正在整理中，后续组件会继续加入。`);
      expect(tab.getAttribute('aria-selected')).toBe('true');
    }
  });
  it('plays on the first mouse hover and lets a mouse click stop or resume',()=>{
    render(<App/>);
    const button=screen.getByRole('button',{name:'透视面板：播放预览'}),api=players.get('perspective-panel')!;
    fireEvent.pointerEnter(button,{pointerType:'mouse'});
    expect(api.seekTo).toHaveBeenLastCalledWith(0);expect(api.play).toHaveBeenCalledOnce();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(button);expect(api.pause).toHaveBeenCalled();expect(button.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(button);expect(button.getAttribute('aria-pressed')).toBe('true');
    fireEvent.pointerLeave(button,{pointerType:'mouse'});expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(api.seekTo).toHaveBeenLastCalledWith(75);
  });
  it('waits for a touch click even if pointerleave precedes click, and stops on a second tap',()=>{
    render(<App/>);
    const button=screen.getByRole('button',{name:'透视面板：播放预览'}),api=players.get('perspective-panel')!;
    fireEvent.pointerDown(button,{pointerType:'touch'});fireEvent.focus(button);fireEvent.pointerLeave(button,{pointerType:'touch'});
    expect(api.play).not.toHaveBeenCalled();
    fireEvent.click(button);expect(button.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(button);expect(button.getAttribute('aria-pressed')).toBe('false');
  });
  it('does not start while scrolling and cancels safely',()=>{
    render(<App/>);
    const button=screen.getByRole('button',{name:'透视面板：播放预览'}),api=players.get('perspective-panel')!;
    fireEvent.pointerDown(button,{pointerType:'touch'});fireEvent.pointerCancel(button,{pointerType:'touch'});
    expect(api.play).not.toHaveBeenCalled();expect(button.getAttribute('aria-pressed')).toBe('false');
  });
  it('allows keyboard activation to stop and restart a focused preview',()=>{
    render(<App/>);
    const button=screen.getByRole('button',{name:'透视面板：播放预览'});
    fireEvent.focus(button);expect(button.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(button,{detail:0});expect(button.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(button,{detail:0});expect(button.getAttribute('aria-pressed')).toBe('true');
    fireEvent.blur(button);expect(button.getAttribute('aria-pressed')).toBe('false');
  });
  it('retains keyboard category navigation with wrapping and Home/End', () => {
    render(<App />);
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], {key: 'ArrowLeft'});
    expect(document.activeElement).toBe(tabs.at(-1));
    fireEvent.keyDown(tabs.at(-1)!, {key: 'ArrowRight'});
    expect(document.activeElement).toBe(tabs[0]);
    fireEvent.keyDown(tabs[0], {key: 'End'});
    expect(tabs.at(-1)!.getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tabs.at(-1)!, {key: 'Home'});
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs.slice(1).every((tab) => tab.tabIndex === -1)).toBe(true);
  });
});
