# Contributing to Remotions

Thanks for helping improve the library.

## Develop

- Node.js 20+, npm 10+.
- Install with `npm ci`, then run `npm run dev`.
- Before opening a PR run `npm run check`.
- Keep Remotion-related dependencies at compatible 4.x versions across all packages.

## Adding a component

1. Create a new audio-reactive component in `packages/animations/src/components/` with typed props, including an audio `src`.
2. Use `useCurrentFrame()` and `useVideoConfig()` with `@remotion/media-utils` to calculate animation state from real audio; do not substitute CSS transitions, timers, or random waveform data.
3. Export both component and props through `packages/animations/src/index.ts`.
4. Add a catalog entry, preview branch and copy-ready TSX snippet in `apps/catalog/src/catalog.tsx`.
5. Update the README and add focused tests for rendering and audio data handling.

## Code review checklist

- Visualization changes with the audio data at the current frame.
- The visual and audible track use the same source and remain aligned after seeking.
- Props have defaults and predictable units; public props are documented.
- Long audio is windowed, and preview behavior is checked with a real fixture.
