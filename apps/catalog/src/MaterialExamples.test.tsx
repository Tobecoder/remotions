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
    const {container}=render(<MaterialExamples materialId="perspective-panel"/>);
    expect(container.querySelector('button,video')).toBeNull();
  });
  it('opens the whole section, collapse and summary hold from the independent collapse action',()=>{
    const {container}=render(<MaterialExamples materialId="content-collapse"/>);
    const toggle=screen.getByRole('button',{name:'查看完整范例 · 小节收束'});
    fireEvent.click(toggle);
    const panel=screen.getByRole('region',{name:'小节收束完整范例'});
    expect(panel.querySelector('video')!.getAttribute('src')).toBe('/examples/section-collapse.mp4');
    expect(panel.textContent).toContain('11 秒');expect(panel.textContent).toContain('待确认');
    expect(panel.textContent).toContain('完整场景内容（静态或逐帧动画）');
    expect(panel.querySelector('code')!.textContent).toContain('component={SectionCollapseExample}');
    expect(panel.querySelector('.example-guide')!.getAttribute('href')).toBe('/examples/section-collapse.md');
    fireEvent.click(toggle);expect(container.querySelector('video')).toBeNull();
  });
  it('shares the chapter thumbnail handoff across collapse and heading without replacing the summary example',()=>{
    const {container,rerender}=render(<MaterialExamples materialId="content-collapse"/>);
    for(const materialId of ['content-collapse','chapter-heading'] as const){
      rerender(<MaterialExamples materialId={materialId}/>);
      expect(container.querySelectorAll('[data-material-example]')).toHaveLength(materialId==='content-collapse'?2:1);
      const toggle=screen.getByRole('button',{name:'查看完整范例 · 章节缩略卡'});
      fireEvent.click(toggle);
      const panel=screen.getByRole('region',{name:'章节缩略卡完整范例'});
      expect(panel.querySelector('video')!.getAttribute('src')).toBe('/examples/scene-thumbnail.mp4');
      expect(panel.textContent).toContain('4 秒');expect(panel.textContent).toContain('前后两节标题与说明');
      expect(panel.querySelector('code')!.textContent).toContain('component={SceneThumbnailExample}');
      expect(panel.querySelector('.example-guide')!.getAttribute('href')).toBe('/examples/scene-thumbnail.md');
      fireEvent.click(toggle);expect(container.querySelector('video')).toBeNull();
    }
  });
  it('opens the complete spotlight sequence with its return and content-replacement guidance',()=>{
    render(<MaterialExamples materialId="card-spotlight"/>);
    fireEvent.click(screen.getByRole('button',{name:'查看完整范例 · 卡片放大回位'}));
    const panel=screen.getByRole('region',{name:'卡片放大回位完整范例'});
    expect(panel.querySelector('video')!.getAttribute('src')).toBe('/examples/card-spotlight-return.mp4');
    expect(panel.textContent).toContain('4 秒');
    expect(panel.textContent).toContain('放大内容或随时间更新的画面');
    expect(panel.textContent).toContain('来源缩略图和前景内容使用同一时间');
    expect(panel.querySelector('code')!.textContent).toContain('component={CardSpotlightExample}');
  });
  it('opens the same complete document explanation from each of its linked materials',()=>{
    const {container,rerender}=render(<MaterialExamples materialId="document-window"/>);
    for(const materialId of ['document-window','highlight-box','collapsing-title'] as const){
      rerender(<MaterialExamples materialId={materialId}/>);
      expect(container.querySelectorAll('[data-material-example]')).toHaveLength(1);
      const toggle=screen.getByRole('button',{name:'查看完整范例 · 脚本文档讲解'});
      fireEvent.click(toggle);
      const panel=screen.getByRole('region',{name:'脚本文档讲解完整范例'});
      expect(panel.querySelector('video')!.getAttribute('src')).toBe('/examples/script-document-guide.mp4');
      expect(panel.querySelector('code')!.textContent).toContain('component={ScriptDocumentExample}');
      expect(panel.textContent).toContain('12 秒');expect(panel.textContent).toContain('可以替换');
      fireEvent.click(toggle);
      expect(container.querySelector('video')).toBeNull();
    }
  });
  it('shares one gallery and focus preview between card entry and foreground focus',()=>{
    const {container,rerender}=render(<MaterialExamples materialId="card-entrance"/>);
    for(const materialId of ['card-entrance','focus-layer'] as const){
      rerender(<MaterialExamples materialId={materialId}/>);
      const toggle=screen.getByRole('button',{name:'查看完整范例 · 文档聚焦'});
      fireEvent.click(toggle);
      const panel=screen.getByRole('region',{name:'文档聚焦完整范例'});
      expect(panel.querySelector('video')!.getAttribute('src')).toBe('/examples/document-focus-gallery.mp4');
      expect(panel.querySelector('code')!.textContent).toContain('component={DocumentFocusExample}');
      expect(panel.textContent).toContain('6 秒');expect(panel.textContent).toContain('资料卡标题和摘要');
      fireEvent.click(toggle);expect(container.querySelector('video')).toBeNull();
    }
  });
});
