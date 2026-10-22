import {useLayoutEffect, useRef, useState} from 'react';
import {useDelayRender} from 'remotion';

let annotations: Promise<typeof import('@remotion/rough-notation')> | undefined;
let cylinder: Promise<typeof import('@remotion/effects/cylinder')> | undefined;
// Keep native imports intact: both dependencies expose ESM-only entry points.
export const loadTextAnnotations = () => annotations ??= import('@remotion/rough-notation');
export const loadCylinderEffect = () => cylinder ??= import('@remotion/effects/cylinder');

/** Block before the first commit, release after the native component commits, once. */
export const useTextEffectResource = <T,>(loader: () => Promise<T>) => {
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const ref = useRef<{released: boolean; release: () => void} | null>(null);
  const createBlock = () => {
    const handle = delayRender('Loading native text effects');
    const block = {released: false, release: () => {
      if (block.released) return;
      block.released = true;
      continueRender(handle);
    }};
    return block;
  };
  const [initialBlock] = useState(() => ref.current ??= createBlock());
  const [resource, setResource] = useState<T | null>(null);
  useLayoutEffect(() => {
    if (ref.current?.released) ref.current = createBlock();
    const block = ref.current ?? initialBlock;
    let active = true;
    loader().then((loaded) => {if (active) setResource(() => loaded);}).catch((error: unknown) => {
      if (!active) return;
      block.release();
      cancelRender(error instanceof Error ? error : new Error(String(error)));
    });
    return () => {active = false; block.release();};
  }, [loader, initialBlock, delayRender, continueRender, cancelRender]);
  useLayoutEffect(() => {if (resource !== null) ref.current?.release();});
  return resource;
};
