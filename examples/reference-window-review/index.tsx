import {useEffect, useMemo} from 'react';
import {Composition, continueRender, delayRender, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {ScreenshotFocusDraft} from '../../packages/animations/src/drafts/ScreenshotFocusDraft';
import {screenshotExamples} from '../../apps/catalog/src/draftReview';

const Probe = () => {
  const frame = useCurrentFrame();
  const handle = useMemo(() => delayRender(`window review ${frame}`), [frame]);
  useEffect(() => {
    let released = false;
    const release = () => {if (!released) {released = true; continueRender(handle);}};
    const id = requestAnimationFrame(() => {
      const root = document.querySelector('[data-window-focus]')!;
      const bounds = root.getBoundingClientRect();
      const card = root.querySelector('[data-window-card]')!;
      const box = card.getBoundingClientRect();
      const highlight = root.querySelector('[data-window-highlight]')!;
      const marked = highlight.getBoundingClientRect();
      console.log('WINDOW_REVIEW:' + JSON.stringify({frame, card: {x: box.x - bounds.x, y: box.y - bounds.y, width: box.width, height: box.height}, image: card.querySelector('img')?.getAttribute('src'), highlight: {x: marked.x - box.x, y: marked.y - box.y, width: marked.width, height: marked.height}, markOpacity: Number(getComputedStyle(highlight).opacity)}));
      release();
    });
    return () => {cancelAnimationFrame(id); release();};
  }, [frame, handle]);
  return null;
};

const ReviewScene = ({example = 'document'}: {example?: string}) => {
  const item = screenshotExamples.find((entry) => entry.id === example)!;
  return <><ScreenshotFocusDraft {...item.props} src={staticFile(item.props.src.slice(1))}/><Probe/></>;
};

registerRoot(() => <Composition id="Screenshot-Focus-Review" component={ReviewScene} width={1280} height={720} fps={30} durationInFrames={240} defaultProps={{example: 'document'}}/>);
