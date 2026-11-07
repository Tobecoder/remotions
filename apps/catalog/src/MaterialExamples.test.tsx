/** @vitest-environment jsdom */
import {afterEach,describe,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {MaterialExamples} from './MaterialExamples';

afterEach(cleanup);

describe('full examples associated with a standalone material',()=>{
  it('opens the linked comparison and unloads its video when closed',()=>{
    const {container}=render(<MaterialExamples materialId="progress-row"/>);
    const toggle=screen.getByRole('button',{name:'查看完整范例 · 进度对比'});
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('video')).toBeNull();
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const panel=screen.getByRole('region',{name:'进度对比完整范例'});
    expect(panel.id).toBe(toggle.getAttribute('aria-controls'));
    const video=panel.querySelector('video')!;
    expect(video.getAttribute('src')).toBe('/examples/progress-row-comparison.mp4');
    expect(video.getAttribute('poster')).toBe('/examples/progress-row-comparison.jpg');
    expect(video.controls).toBe(true);expect(video.muted).toBe(true);expect(video.autoplay).toBe(false);
    expect(panel.textContent).toContain('待确认');
    expect(panel.textContent).toContain('可以替换');expect(panel.textContent).toContain('沿用效果');
    expect(panel.querySelector('code')!.textContent).toContain('component={ProgressRowExample}');
    fireEvent.click(toggle);
    expect(container.querySelector('video')).toBeNull();
  });
  it('does not show another component an unrelated example',()=>{
    const {container}=render(<MaterialExamples materialId="document-window"/>);
    expect(container.querySelector('button,video')).toBeNull();
  });
});
