# Remotions ✦

**Frame-driven motion components for Remotion.** An open-source collection of reusable effects, with a visual playground and copy-ready React examples.

> **Version 0.1.0 — initial component library.** Not yet published to npm. Compatible with Remotion 4.x; always align `remotion` and `@remotion/player` to matching exact versions in applications. Both are pinned to `4.0.536` in this workspace per Remotion guidance.

## Quick start

Requirements: Node.js 20+ and npm 10+.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse and customize animations. The library package is built first and loaded by the playground.

Other commands:

```bash
npm run build       # Build library + web playground
npm run test        # Build library and run component/math/playground Vitest tests
npm run typecheck   # Type check library, playground, tests and examples
npm run check       # Run tests, type check, build
```

## What is included?

| Name | Category | Configurable properties |
| --- | --- | --- |
| `FadeIn` | Entrance | opacity, delay, duration |
| `SlideIn` | Entrance | direction, distance, delay, duration |
| `ScaleIn` | Entrance | fromScale, transformOrigin, timing |
| `SpringPop` | Entrance | fromScale, damping, stiffness, mass, timing |
| `Typewriter` | Typography | text, cursor, cursorCharacter, timing |
| `WordReveal` | Typography | text, stagger, distance, timing |
| `WaveText` | Typography | text, stagger, amplitude, timing |
| `CountUp` | Data | from/to, decimals, prefix/suffix, locale, timing |
| `ProgressBar` | Data | value, width/height, colors, timing |
| `ProgressRing` | Data | value, size, strokeWidth, colors, label, timing |
| `CardReveal` | UI | tiltDegrees, distance, timing |

## Usage in a Remotion Composition

```tsx
import { AbsoluteFill, Composition, registerRoot } from 'remotion';
import { SlideIn, CountUp, ProgressBar } from '@remotions/animations';

const Demo = () => (
  <AbsoluteFill style={{backgroundColor: '#11111b', color: 'white', padding: 80}}>
    <SlideIn direction="up" delayInFrames={5} durationInFrames={35}>
      <h1>Welcome to Remotions</h1>
    </SlideIn>
    <CountUp to={12800} suffix="+" delayInFrames={25} durationInFrames={45} />
    <ProgressBar value={86} delayInFrames={30} durationInFrames={45} />
  </AbsoluteFill>
);

const Root = () => <Composition id="Demo" component={Demo} width={1280} height={720} fps={30} durationInFrames={150} />;
registerRoot(Root);
```

Install this workspace library into another project as a local dependency while developing, or publish the package after review. The package is **not** published at `@remotions/animations` yet.

## Component contract

- All animations are pure functions of `useCurrentFrame()` and (for physics) `useVideoConfig().fps`.
- `delayInFrames` defaults to 0; `durationInFrames` is measured in **frames**, not milliseconds.
- Components do not use CSS transitions, random runtime values, timers, or uncontrolled animation state.
- Children-based effects accept `children`, `className`, and `style`.
- Typographic/data effects accept `className` and `style`.
- `style` overrides computed wrapper styles when properties conflict; avoid overriding `opacity` or `transform` on the animated wrapper if you want the built-in effect to remain visible.
- Wrap components in a Remotion `Composition`, `Player`, or another Remotion time context. Outside Remotion, the hooks cannot read frame information.

## Architecture

```text
remotions/
├── apps/playground/          # Vite app + @remotion/player previews
├── packages/animations/      # Reusable React + Remotion components
│   ├── src/components/       # Individual animation effects
│   ├── src/internal/         # Pure timing helpers and hooks
│   └── tests/                # Animation math tests
└── .github/workflows/ci.yml # Verification on push / PR
```

## Constraints for 0.1

- No npm publication or GitHub Pages deployment is configured. Dependency installation requires registry access; a successful build on a clean machine must be confirmed before release.
- Animation components expect Remotion's rendering context.
- Typewriter and WaveText use `Intl.Segmenter` for grapheme-aware text animation (with a code-point fallback on older browsers). For absolutely identical output across browsers and render machines, use matching runtime versions and fonts.
- Per-frame PNG / video render snapshots and visual regression tests are not yet included.
- The playground's animation snippets are minimal examples, not complete videos. Preview loops include enough frames for staggered typography and configurable delay.

## Roadmap

- **0.1:** 11 frame-driven effects, interactive preview, configurable delay, replay, source snippets, tests and CI. This repository contains the implementation; see [the V0.1 plan](docs/V0.1-PLAN.md) and [contributor guide](CONTRIBUTING.md).
- **0.2:** Docs site, examples by use case, accessibility reviews, polished presets and visual regressions.
- **0.3:** Prop schema / registry, CLI install, templates and publish workflow.

## License

MIT, see [LICENSE](./LICENSE).

## Playground controls

Select an effect from the collection, modify its text, animation duration, delay and accent color, and replay it. The player automatically extends the loop for staggered text animations. The **Copy code** action generates a minimal JSX example including the current timing controls; snippets assume the `@remotions/animations` package is accessible in your project.

## Verification and limitations

`npm run check` passes on Windows with Node 24.15.0 and npm 11.12.1: 48 Vitest tests, full TypeScript checking (including tests and examples), library ESM/CJS declaration builds, and the production playground build. Package contents and both module import modes were checked. Browser smoke checks covered search, component selection, timing controls, replay and snippet copying. See [the verification record](docs/VERIFICATION.md) for evidence and limits.

CI uses the committed lockfile with `npm ci` and checks Node 22 and 24. The production playground currently has one Vite bundle-size advisory; per-frame video rendering and automated visual regressions remain future work. This PR does not publish the npm package or deploy the playground.
