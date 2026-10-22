import {Composition, registerRoot, staticFile, useDelayRender} from 'remotion';
import {useEffect, useState} from 'react';
import {NewsArticleHighlight, OnScreenMessages, PolaroidPictures, SpeedLines} from '../../packages/animations/dist/index.cjs';

const photos = [
  {src: staticFile('storytelling/scene-blue.jpg'), caption: 'scene A', label: 'A'},
  {src: staticFile('storytelling/scene-pink.jpg'), caption: 'scene B', label: 'B'},
  {src: staticFile('storytelling/scene-blue.jpg'), caption: 'scene C', label: 'C', filter: 'hue-rotate(-65deg)'},
];
const font = `@font-face{font-family:Caveat;font-style:normal;font-weight:600;src:url('${staticFile('storytelling/caveat-600.ttf')}') format('truetype');}`;
const definitions = [
  {id: 'News', Component: NewsArticleHighlight, frames: 150},
  {id: 'Messages', Component: OnScreenMessages, frames: 162},
  {id: 'Polaroid', Component: PolaroidPictures, frames: 150},
  {id: 'Speed', Component: SpeedLines, frames: 45},
];
const LayoutProbe = () => {
  const {delayRender, continueRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Checking storytelling text bounds'));
  useEffect(() => {
    let active = true;
    const release = () => {if (active) {active = false; continueRender(handle);}};
    void document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!active) return;
      const checks = [...document.querySelectorAll<HTMLElement>('[data-story-message] > span, [data-story-photo] > div:last-child')].map((element) => {
        const clippingBox = element.closest('[data-story-message]') ? element.closest('[role="img"]')! : element;
        const box = clippingBox.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(element);
        const rects = [...range.getClientRects()];
        const photo = element.closest('[data-story-photo]');
        let occluded = false;
        if (photo) {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          let node: Node | null;
          while ((node = walker.nextNode())) {
            for (let offset = 0; offset < (node.textContent?.length ?? 0); offset++) {
              if (/\s/u.test(node.textContent![offset])) continue;
              range.setStart(node, offset);
              range.setEnd(node, offset + 1);
              const glyph = range.getBoundingClientRect();
              const hit = document.elementFromPoint((glyph.left + glyph.right) / 2, (glyph.top + glyph.bottom) / 2);
              if (hit?.closest('[data-story-photo]') !== photo) occluded = true;
            }
          }
        }
        return {
          text: element.textContent,
          clipped: rects.some((rect) => rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1),
          occluded,
          box: {left: box.left, top: box.top, right: box.right, bottom: box.bottom},
          textBounds: rects.map((rect) => ({left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom})),
        };
      });
      console.log(`STORY_LAYOUT_REPORT:${JSON.stringify(checks)}`);
      release();
    })));
    return release;
  }, [handle, continueRender]);
  return null;
};
const boundaryDefinitions = [
  {id: 'MessagesMultiline', render: (width: number, height: number) => <OnScreenMessages width={width} height={height} backgroundColor="#edf2f4" progress={1} messages={[{from: 'me', text: Array.from({length: 20}, (_, index) => `第 ${index + 1} 行：这是一行消息`).join('\n')}]} />},
  {id: 'PolaroidLongCaptions', render: (width: number, height: number) => <PolaroidPictures width={width} height={height} backgroundColor="#edf2f4" progress={1} fadeOut={false} photos={[
    {...photos[0], caption: '这一段较长的中文照片注释应该完整显示，不应裁切上下边缘或丢失最后的文字。'},
    {...photos[1], caption: 'W'.repeat(100)},
    {...photos[2], caption: '第一行\r\n\r\n第三行\n第四行'},
  ]} />},
];
const Root = () => <>{definitions.flatMap(({id, Component, frames}) => [{width: 640, height: 260, name: 'Card'}, {width: 360, height: 640, name: 'Portrait'}].map(({width, height, name}) => {
  const Scene = () => <><style>{font}</style><Component width={width} height={height} backgroundColor={id === 'Speed' ? '#222831' : '#edf2f4'} {...(id === 'Polaroid' ? {photos} : {})} /></>;
  return <Composition key={`${id}${name}`} id={`${id}${name}`} component={Scene} width={width} height={height} fps={30} durationInFrames={frames} />;
}))}{boundaryDefinitions.flatMap(({id, render}) => [{width: 640, height: 260, name: 'Card'}, {width: 360, height: 640, name: 'Portrait'}].map(({width, height, name}) => {
  const Scene = () => <><style>{font}</style>{render(width, height)}<LayoutProbe /></>;
  return <Composition key={`${id}${name}`} id={`${id}${name}`} component={Scene} width={width} height={height} fps={30} durationInFrames={1} />;
}))}</>;
registerRoot(Root);
