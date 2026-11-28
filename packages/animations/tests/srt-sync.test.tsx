/** @vitest-environment jsdom */
import type {CSSProperties, ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {NarrationFilm} from '../../../examples/reference-opening/NarrationScene';
import {SrtFilm} from '../../../examples/reference-opening/SrtScene';
import {SrtSyncExample} from '../../../examples/reference-opening/compositions/SrtSynchronization';
import {TranscriptRoutingExample} from '../../../examples/component-examples/transcript-routing/Example';
import segments from '../../../examples/reference-opening/segments.json';

const clock = vi.hoisted(() => ({frame: 0}));
vi.mock('remotion', () => ({
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: 30, width: 1920, height: 1080}),
  staticFile: (file: string) => file,
  AbsoluteFill: ({children, style}: {children: ReactNode; style: CSSProperties}) => <div style={style}>{children}</div>,
  Img: ({src, style}: {src: string; style: CSSProperties}) => <img src={src} style={style}/>,
  OffthreadVideo: ({src}: {src: string}) => <video src={src}/>,
  Sequence: ({children, from = 0, durationInFrames = Infinity}: {children: ReactNode; from?: number; durationInFrames?: number}) =>
    clock.frame >= from && clock.frame < from + durationInFrames ? <>{children}</> : null,
  Loop: ({children}: {children: ReactNode}) => <>{children}</>,
}));

const at = (frame: number) => {
  clock.frame = frame;
  return new DOMParser().parseFromString(renderToStaticMarkup(<SrtFilm/>), 'text/html');
};

describe('SRT continuation', () => {
  it('starts at the previous cut and ends before the recommendation', () => {
    clock.frame = 9876;
    expect(renderToStaticMarkup(<SrtFilm/>)).toBe(renderToStaticMarkup(<NarrationFilm/>));
    expect(segments.slice(11, 13)).toEqual([{id: '12-Narration', endFrame: 9877}, {id: '13-Srt-Sync', endFrame: 10754}]);
    expect(at(9877).body.textContent).toContain('有了配音之后');
    expect(at(10753).body.textContent).not.toContain('Whisper');
  });

  it('reveals the three timestamps as the waveform playhead advances', () => {
    const early = at(9930), late = at(10050);
    expect(early.querySelectorAll('[data-srt-wave-segment]')).toHaveLength(3);
    expect(Number(early.querySelector('[data-srt-playhead]')?.getAttribute('x1'))).toBeLessThan(
      Number(late.querySelector('[data-srt-playhead]')?.getAttribute('x1')),
    );
    expect(early.querySelector<HTMLElement>('[data-srt-timestamp="157"]')?.style.opacity).toBe('0');
    expect(late.querySelector<HTMLElement>('[data-srt-timestamp="157"]')?.style.opacity).toBe('1');
  });

  it('synchronizes the highlighted SRT row with the selected timeline segment', () => {
    const early = at(10260), late = at(10350);
    expect(early.querySelector('[data-srt-active-cue]')?.getAttribute('data-srt-active-cue')).toBe('3');
    expect(late.querySelector('[data-srt-active-cue]')?.getAttribute('data-srt-active-cue')).toBe('4');
    expect(late.querySelector('[data-srt-tutorial-preview] video')?.getAttribute('src')).toBe('srt-sync/tutorial-preview.mp4');
    expect(early.querySelector('[data-srt-tutorial-timeline] rect[fill="#ca4935"]')?.getAttribute('x')).toBe('133');
    expect(late.querySelector('[data-srt-tutorial-timeline] rect[fill="#ca4935"]')?.getAttribute('x')).toBe('172');
  });

  it('uses replacement cue starts and ends for the caption, active row, and playhead', () => {
    const customAt = (frame: number) => {
      clock.frame = frame;
      return new DOMParser().parseFromString(renderToStaticMarkup(<SrtSyncExample frame={frame} playback={{
        previewSrc: 'replacement.mp4',
        cues: [{startMs: 0, endMs: 500, text: 'First'}, {startMs: 1000, endMs: 2000, text: 'Second'}],
      }}/>), 'text/html');
    };
    const first = customAt(10095), gap = customAt(10110), second = customAt(10125), done = customAt(10155);
    expect(first.querySelector('[data-srt-preview-caption]')?.textContent).toBe('First');
    expect(first.querySelector('[data-srt-tutorial-preview] video')?.getAttribute('src')).toBe('replacement.mp4');
    expect(gap.querySelector('[data-srt-preview-caption]')).toBeNull();
    expect(gap.querySelector('[data-srt-timeline-cue][fill="#ca4935"]')).toBeNull();
    expect(gap.querySelector('[data-srt-timeline-playhead]')?.getAttribute('x1')).toBe('152.5');
    expect(second.querySelector('[data-srt-preview-caption]')?.textContent).toBe('Second');
    expect(second.querySelector('[data-srt-active-cue]')?.getAttribute('data-srt-active-cue')).toBe('2');
    expect(second.querySelector('[data-srt-cue="2"]')?.textContent).toContain('00:00:01,000 --> 00:00:02,000');
    expect(second.querySelector('[data-srt-timeline-cue="2"]')?.getAttribute('fill')).toBe('#ca4935');
    expect(done.querySelector('[data-srt-preview-caption]')).toBeNull();
    expect(done.querySelector('[data-srt-timeline-playhead]')?.getAttribute('x1')).toBe('448');
  });

  it('shows rejection before the recognizer and accepts the transcribed text in order', () => {
    const statuses = (frame: number) => Array.from(at(frame).querySelectorAll('[data-srt-status]'), item => item.getAttribute('data-srt-status'));
    expect(statuses(10514)).toEqual(['rejected', 'rejected', 'rejected']);
    expect(at(10514).querySelector('[data-srt-recognizer]')).toBeNull();
    expect(at(10590).querySelector('[data-srt-transcript-packet]')).not.toBeNull();
    expect(statuses(10607)).toEqual(['accepted', 'accepted', 'rejected']);
    expect(statuses(10613)).toEqual(['accepted', 'accepted', 'accepted']);
  });

  it('shakes each model card horizontally on its own impact and returns it to its slot', () => {
    const x = (frame: number, name: string) =>
      parseFloat(at(frame).querySelector<HTMLElement>(`[data-srt-model="${name}"]`)!.style.left);
    for (const [name, hit] of [['Opus', 10490], ['Astra', 10495], ['DeepSeek', 10499]] as const) {
      expect(x(hit - 1, name)).toBe(568);
      expect(x(hit, name)).toBeGreaterThan(571);
      expect(x(hit + 2, name)).toBeLessThan(566);
      expect(x(hit + 13, name)).toBe(568);
    }
  });

  it('branches transcript packets up, straight, and down from the same output', () => {
    const position = (frame: number, name: string) => at(frame)
      .querySelector<HTMLElement>(`[data-srt-transcript-packet="${name}"]`)?.style;
    for (const [name, start, target] of [['Opus', 10583, 114], ['Astra', 10589, 206], ['DeepSeek', 10595, 299]] as const) {
      expect(position(start - 1, name)).toBeUndefined();
      expect(position(start, name)?.top).toBe('207px');
      expect(position(start, name)?.left).toBe('442px');
      expect(position(start + 16, name)?.top).toBe(target + 'px');
      expect(parseFloat(position(start + 16, name)!.left)).toBeGreaterThan(568);
      expect(position(start + 20, name)).toBeUndefined();
    }
  });

  it('uses the replacement names, accents, and text in the standalone routing example', () => {
    const cards = [
      {name: 'Preview', color: '#365997', transcript: 'Generate preview'},
      {name: 'Caption', color: '#50967b', transcript: 'Generate captions'},
      {name: 'Archive', color: '#956297', transcript: 'Save result'},
    ] as const;
    const exampleAt = (frame: number) => {
      clock.frame = frame;
      return new DOMParser().parseFromString(renderToStaticMarkup(<TranscriptRoutingExample cards={cards}/>), 'text/html');
    };
    const traveling = exampleAt(84);
    const packets = Array.from(traveling.querySelectorAll<HTMLElement>('[data-srt-transcript-packet]'));
    expect(packets.map(packet => packet.textContent)).toEqual(cards.map(card => card.transcript));
    expect(packets.map(packet => packet.dataset.srtTranscriptPacket)).toEqual(cards.map(card => card.name));
    expect(traveling.querySelector<HTMLElement>('[data-srt-model="Preview"] > div')?.style.background).toBe('rgb(54, 89, 151)');
    const statusAt = (frame: number) => Array.from(exampleAt(frame).querySelectorAll('[data-srt-status]'), node => node.getAttribute('data-srt-status'));
    expect(statusAt(86)).toEqual(['accepted', 'rejected', 'rejected']);
    expect(statusAt(92)).toEqual(['accepted', 'accepted', 'rejected']);
    expect(statusAt(98)).toEqual(['accepted', 'accepted', 'accepted']);
  });
});
