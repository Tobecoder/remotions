/** @vitest-environment jsdom */

import {createEvent, fireEvent, render, screen, cleanup} from '@testing-library/react';
import {describe, expect, it, afterEach, vi} from 'vitest';

vi.mock('./CatalogCardPreview', async () => {
  const React = await import('react');
  const CatalogCardPreview = React.forwardRef(
    ({active}: {active: boolean}, ref: React.ForwardedRef<{start: () => void; stop: () => void}>) => {
      React.useImperativeHandle(ref, () => ({start: () => {}, stop: () => {}}), []);
      return React.createElement('div', {'data-testid': 'card-preview', 'data-active': String(active)});
    },
  );
  return {CatalogCardPreview};
});

import {App} from './App';

afterEach(() => cleanup());

describe('catalog App interactions', () => {
  it('moves focus and selection through category tabs with arrow keys', () => {
    render(<App />);
    const tabs = screen.getAllByRole('tab');

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], {key: 'ArrowRight'});

    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].tabIndex).toBe(-1);
    expect(tabs[1].tabIndex).toBe(0);
  });

  it('toggles preview on the first and second touch clicks', () => {
    render(<App />);
    const card = screen.getByRole('button', {name: '预览示波曲线'});
    const touchClick = () => {
      const pointerDown = createEvent.pointerDown(card);
      Object.defineProperty(pointerDown, 'pointerType', {value: 'touch'});
      fireEvent(card, pointerDown);
      const pointerUp = createEvent.pointerUp(card);
      Object.defineProperty(pointerUp, 'pointerType', {value: 'touch'});
      fireEvent(card, pointerUp);
      fireEvent.click(card, {detail: 1});
    };

    touchClick();
    expect(card.getAttribute('aria-pressed')).toBe('true');
    expect(card.getAttribute('aria-label')).toBe('停止预览示波曲线');

    touchClick();
    expect(card.getAttribute('aria-pressed')).toBe('false');
    expect(card.getAttribute('aria-label')).toBe('预览示波曲线');
  });

  it('lets a mouse click stop and resume a hover preview', () => {
    render(<App />);
    const card = screen.getByRole('button', {name: '预览示波曲线'});
    fireEvent.pointerOver(card, {pointerType: 'mouse'});
    expect(card.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(card, {detail: 1});
    expect(card.getAttribute('aria-pressed')).toBe('false');
    expect(card.getAttribute('aria-label')).toBe('预览示波曲线');

    fireEvent.click(card, {detail: 1});
    expect(card.getAttribute('aria-pressed')).toBe('true');
    expect(card.getAttribute('aria-label')).toBe('停止预览示波曲线');
  });

  it('lets keyboard activation stop and resume a focus preview', () => {
    render(<App />);
    const card = screen.getByRole('button', {name: '预览示波曲线'});

    fireEvent.focus(card);
    expect(card.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(card, {detail: 0});
    expect(card.getAttribute('aria-pressed')).toBe('false');
    expect(card.getAttribute('aria-label')).toBe('预览示波曲线');

    fireEvent.click(card, {detail: 0});
    expect(card.getAttribute('aria-pressed')).toBe('true');
    expect(card.getAttribute('aria-label')).toBe('停止预览示波曲线');
  });
});
