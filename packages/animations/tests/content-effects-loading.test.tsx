// @vitest-environment jsdom
import {StrictMode} from 'react';
import {act, cleanup, render} from '@testing-library/react';
import {afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {loadContentEffectEngine, useContentEffectEngine} from '../src/components/ContentEffects';

const gates = vi.hoisted(() => ({
  next: 0, pending: new Set<number>(), releases: [] as {handle: number; ready: boolean}[], events: [] as string[],
  delayRender: vi.fn(), continueRender: vi.fn(), cancelRender: vi.fn(),
}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useDelayRender: () => ({delayRender: gates.delayRender, continueRender: gates.continueRender, cancelRender: gates.cancelRender}),
}));

type Engine = Awaited<ReturnType<typeof loadContentEffectEngine>>;
type Loader = () => Promise<Engine>;
let engine: Engine;
beforeAll(async () => {engine = await loadContentEffectEngine();});

const deferred = () => {
  let resolve!: (value: Engine) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<Engine>((yes, no) => {resolve = yes; reject = no;});
  return {promise, resolve, reject};
};
const Harness = ({loader}: {loader: Loader}) => {
  const loaded = useContentEffectEngine(loader);
  gates.events.push(`render:${loaded ? 'ready' : 'pending'}`);
  return <div data-engine={loaded ? 'ready' : 'pending'}>{loaded ? 'ready' : 'pending'}</div>;
};

beforeEach(() => {
  gates.next = 0;
  gates.pending.clear();
  gates.releases.length = 0;
  gates.events.length = 0;
  gates.cancelRender.mockClear();
  gates.delayRender.mockImplementation(() => {
    const handle = ++gates.next;
    gates.pending.add(handle);
    gates.events.push('block');
    return handle;
  });
  gates.continueRender.mockImplementation((handle: number) => {
    gates.pending.delete(handle);
    gates.releases.push({handle, ready: document.querySelector('[data-engine="ready"]') !== null});
  });
});
afterEach(cleanup);

const expectReleasedOnce = () => {
  expect(gates.pending.size).toBe(0);
  expect(gates.releases).toHaveLength(gates.next);
  for (let handle = 1; handle <= gates.next; handle++) {
    expect(gates.releases.filter((release) => release.handle === handle)).toHaveLength(1);
  }
};

describe('content effect render barriers', () => {
  it('registers during render and only releases after ready content has committed', async () => {
    const loading = deferred();
    const loader = () => {gates.events.push('load'); return loading.promise;};
    const view = render(<Harness loader={loader} />);
    expect(gates.events.slice(0, 3)).toEqual(['block', 'render:pending', 'load']);
    expect(gates.pending.size).toBe(1);
    expect(gates.releases).toHaveLength(0);
    await act(async () => {loading.resolve(engine); await loading.promise;});
    expect(view.getByText('ready')).toBeTruthy();
    expect(gates.releases).toEqual([{handle: 1, ready: true}]);
    view.unmount();
    expectReleasedOnce();
  });

  it('releases an unmounted preview while its loader is still pending', async () => {
    const loading = deferred();
    const loader = () => loading.promise;
    const view = render(<Harness loader={loader} />);
    view.unmount();
    expectReleasedOnce();
    await act(async () => {loading.resolve(engine); await loading.promise;});
    expectReleasedOnce();
    expect(gates.cancelRender).not.toHaveBeenCalled();
  });

  it.each([true, false])('does not leak or double-release Strict Mode handles when loading completes: %s', async (complete) => {
    const loading = deferred();
    const loader = () => loading.promise;
    const view = render(<StrictMode><Harness loader={loader} /></StrictMode>);
    expect(gates.pending.size).toBe(1);
    if (complete) {
      await act(async () => {loading.resolve(engine); await loading.promise;});
      expect(view.getByText('ready')).toBeTruthy();
    }
    view.unmount();
    await act(async () => {loading.resolve(engine); await loading.promise;});
    expectReleasedOnce();
  });

  it('cancels a failed render and releases its handle once', async () => {
    const loading = deferred();
    const loader = () => loading.promise;
    const view = render(<Harness loader={loader} />);
    const error = new Error('effect module unavailable');
    await act(async () => {loading.reject(error); await loading.promise.catch(() => undefined);});
    expect(gates.cancelRender).toHaveBeenCalledExactlyOnceWith(error);
    view.unmount();
    expectReleasedOnce();
  });

  it('also waits for the commit when the engine is already cached', async () => {
    const loader = () => Promise.resolve(engine);
    const view = render(<Harness loader={loader} />);
    expect(gates.pending.size).toBe(1);
    await act(async () => {await Promise.resolve();});
    expect(gates.releases).toEqual([{handle: 1, ready: true}]);
    view.unmount();
    expectReleasedOnce();
  });

  it('releases a replacement render scope even when the engine is already ready', async () => {
    const loader = () => Promise.resolve(engine);
    const view = render(<Harness loader={loader} />);
    await act(async () => {await Promise.resolve();});
    const originalDelay = gates.delayRender;
    gates.delayRender = vi.fn(() => originalDelay());
    try {
      view.rerender(<Harness loader={loader} />);
      await act(async () => {await Promise.resolve();});
      expect(gates.pending.size).toBe(0);
      view.unmount();
      expectReleasedOnce();
    } finally {
      gates.delayRender = originalDelay;
    }
  });
});
