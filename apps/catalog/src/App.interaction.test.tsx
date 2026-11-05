/** @vitest-environment jsdom */
import {afterEach, describe, expect, it} from 'vitest';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {App} from './App';

afterEach(cleanup);

describe('empty library', () => {
  it('shows zero materials and no old cards or players', () => {
    const {container} = render(<App />);
    expect(screen.getByTestId('material-count').textContent).toBe('00');
    expect(container.querySelector('.motion-card, canvas, video, audio')).toBeNull();
    expect(screen.queryByRole('button', {name: /预览|停止预览/})).toBeNull();
    expect(screen.queryByText('截图窗口聚焦')).toBeNull();
    expect(screen.queryByText(/查看原片/)).toBeNull();
  });
  it('shows the matching empty state when each category is selected', () => {
    render(<App />);
    for (const tab of screen.getAllByRole('tab')) {
      fireEvent.click(tab);
      const name = tab.querySelector('span')!.textContent!;
      const panel = screen.getByRole('tabpanel');
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
      expect(panel.textContent).toContain(`${name}正在整理中，后续组件会继续加入。`);
      expect(tab.getAttribute('aria-selected')).toBe('true');
    }
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
