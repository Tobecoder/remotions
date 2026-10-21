# Changelog

## Unreleased — V0.1 hardening (2026-10-21)

- Import the V0.1 r2 project with a reproducible lockfile and Node 22/24 CI.
- Fix leading whitespace staggering and grapheme-based preview durations.
- Verify all eleven components with 48 tests, full type checks and production builds.
- Correct conditional ESM/CJS declarations and verify distribution contents.

- Make Typewriter and WaveText Unicode grapheme-aware, with screen-reader text labels for split typography effects.
- Add adjustable delay and Replay controls to the playground.
- Compute player loop length from duration, delay and typography stagger.
- Pin the two Remotion runtime packages to the exact same version (`4.0.536`).
- Add component render boundary tests, Unicode tests, and playground timeline tests.
- Include package-level license in the future npm distribution archive.
- Record completed local validation and remaining release limitations.

## 0.1.0 — Initial scaffold

- Eleven frame-driven animation components across Entrance, Typography, Data, and UI categories.
- Interactive Vite + Remotion Player showcase and copy-ready code snippets.
- Workspace structure, build scripts, CI, and initial math tests.
