# Verification status — 2026-10-21

## Source and environment

Imported `remotions-v0.1-r2.zip` into `Tobecoder/remotions` on `feat/remotions-v0.1`.
Local validation: Windows, Node 24.15.0, npm 11.12.1, Remotion and Player 4.0.536.

## Completed

- Dependency installation succeeded; the npm workspace lockfile is committed for CI and clean installs.
- `npm run check` passed: 48 Vitest tests (32 library tests, 16 old showcase tests), semantic TypeScript checks, ESM/CJS bundles and declarations, and the Vite production build.
- Component tests cover all 11 effects, delayed and completed states, out-of-order frame determinism, Unicode graphemes, word spacing, clamped progress values and springs at 24/30/60 fps. Only frame/config hooks are mocked; spring calculations use Remotion itself.
- Snippets for all 11 effects parse as TSX with quoted, multiline and Unicode input and preserve timing controls.
- `npm pack --dry-run -w @remotions/animations` passed. The package contains both JavaScript formats, the corresponding `.d.ts` / `.d.cts` declarations, README, manifest and MIT license.
- Both ESM import and CommonJS require expose all 11 components plus the Unicode helper.
- Live browser checks at `http://localhost:3000` confirmed search filtering, switching effects, frame-driven progress playback, duration/delay/text controls, replay and successful code copying.

## Fixes found during verification

- Leading whitespace no longer consumes an invisible word-stagger slot in WordReveal.
- WaveText preview duration counts grapheme clusters, matching the actual component instead of counting emoji code points separately.
- Conditional package exports select the correct declaration format for ESM and CommonJS consumers.
- Root type checking includes library, tests and examples as well as the old showcase.
- CI uses `npm ci`, read-only repository permissions and Node 22/24 jobs.

## Limits

- The production old showcase emits a Vite advisory about a JavaScript chunk above 500 kB (approximately 594 kB before gzip). It does not fail the build.
- Local browser smoke testing is not an automated visual regression suite. A separate mobile viewport pass and per-frame PNG/MP4 rendering were not performed.
- GitHub Actions results must be read from the PR; local success does not establish that remote jobs passed.
- No npm publication, release tag, merge or public deployment is included.
