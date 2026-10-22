// Run in a separate Node process so native ESM and our CJS package are both exercised.
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');
const React = require('react');
const {createRoot} = require('react-dom/client');

async function main() {
  const dom = new JSDOM('<div id="root"></div>', {url: 'http://localhost/'});
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const pending = new Set();
  const released = new Set();
  let nextHandle = 0;
  const barriers = {
    delayRender() {const handle = ++nextHandle; pending.add(handle); return handle;},
    continueRender(handle) {
      assert(!released.has(handle), `Handle ${handle} released twice`);
      released.add(handle);
      pending.delete(handle);
    },
    cancelRender(error) {throw error;},
  };
  const nativeRemotion = require('remotion');
  const observed = [];
  // Only the canvas sink and composition context are replaced; factories load for real.
  require.cache[require.resolve('remotion')].exports = {
    ...nativeRemotion,
    useCurrentFrame: () => 0,
    useVideoConfig: () => ({fps: 30}),
    useDelayRender: () => barriers,
    CanvasImage: ({effects}) => {
      observed.push(effects);
      return React.createElement('canvas', {'data-native-chain': effects[1].definition.backend});
    },
  };
  const {Peel, Shine, TearApart} = require('../packages/animations/dist/index.cjs');
  const root = createRoot(document.getElementById('root'));
  try {
    await React.act(async () => {
      root.render(React.createElement(React.StrictMode, null,
        ...[Peel, Shine, TearApart].map((Component, index) =>
          React.createElement(Component, {key: index, progress: 0.5, width: 640, height: 360}))));
    });
    const deadline = Date.now() + 15000;
    while (document.querySelectorAll('canvas').length < 3 && Date.now() < deadline) {
      await React.act(async () => {await new Promise((resolve) => setTimeout(resolve, 25));});
    }
    assert.equal(document.querySelectorAll('canvas').length, 3, 'CJS effects did not commit');
    for (const chain of observed) {
      assert.equal(chain.length, 2);
      assert.equal(chain[0].params.scale, 0.75);
      assert(chain[1].definition, 'Native effect definition missing');
    }
    assert(observed.some((chain) => chain[1].params.foldRadius === 35));
    assert(observed.some((chain) => chain[1].params.coreSigma === 32.5));
    assert(observed.some((chain) => chain[1].params.jaggedness === 12));
    assert.equal(pending.size, 0, 'CJS component left rendering blocked');
  } finally {
    await React.act(async () => {root.unmount();});
    require.cache[require.resolve('remotion')].exports = nativeRemotion;
    dom.window.close();
  }
  assert.equal(released.size, nextHandle);
  console.log('CJS: Peel, Shine, TearApart mounted with native ESM factories; all render handles released once.');
}
main().catch((error) => {console.error(error); process.exitCode = 1;});
