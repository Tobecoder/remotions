# Contributing to Remotions

Thanks for helping improve the library.

## Develop

- Node.js 20+, npm 10+.
- Install with `npm ci`, then run `npm run dev`.
- Before opening a PR run `npm run check`.
- Keep Remotion-related dependencies at compatible 4.x versions across all packages.

## Adding a component

1. Create a new `packages/animations/src/components/MyEffect.tsx` with typed props.
2. Use `useCurrentFrame()` and `useVideoConfig()` to calculate all animation state; do not animate using CSS transitions or timers.
3. Export both component and props through `packages/animations/src/index.ts`.
4. Add a catalog entry and render branch to `apps/playground/src/catalog.tsx`.
5. Add a corresponding copy-ready TSX snippet to `snippetFor`.
6. Update the README table and add tests for pure animation math when applicable.

## Code review checklist

- Animation starts and ends reliably at expected frames.
- Respects nonzero `delayInFrames` and custom `durationInFrames`.
- Does not depend on render order, wall clock, browser random or async requests.
- Props have defaults and predictable units.
- Public props are documented; preview works at different FPS values.
