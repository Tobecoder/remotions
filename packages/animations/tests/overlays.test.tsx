import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {LocationLowerThird, NameLowerThird, SocialSafeZones} from '../src';

const clock = vi.hoisted(() => ({frame: 0, fps: 30}));
vi.mock('remotion', async (importOriginal) => ({
  ...await importOriginal<typeof import('remotion')>(),
  useCurrentFrame: () => clock.frame,
  useVideoConfig: () => ({fps: clock.fps}),
}));

describe('overlay components', () => {
  it.each([
    ['LocationLowerThird', <LocationLowerThird width={640} height={260} />],
    ['NameLowerThird', <NameLowerThird width={640} height={260} />],
  ])('%s changes with the current frame without invalid SVG values', (_, component) => {
    clock.frame = 0;
    const first = renderToStaticMarkup(component);
    clock.frame = 18;
    const later = renderToStaticMarkup(component);
    expect(first).toContain('role="img"');
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(later).not.toBe(first);
  });

  it('keeps explicit copy in the lower third markup', () => {
    const location = renderToStaticMarkup(<LocationLowerThird location="Shanghai, China" venue="Conference hall" progress={0.5} />);
    const name = renderToStaticMarkup(<NameLowerThird name="林默" role="Motion Designer" progress={0.5} />);
    expect(location).toContain('Shanghai, China');
    expect(location).toContain('Conference hall');
    expect(name).toContain('林默');
    expect(name).toContain('Motion Designer');
  });

  it('reveals two square solid bars instead of a rounded white card', () => {
    const first = renderToStaticMarkup(<NameLowerThird progress={0} />);
    const middle = renderToStaticMarkup(<NameLowerThird progress={0.5} />);
    const last = renderToStaticMarkup(<NameLowerThird progress={1} />);
    expect(middle).toContain('background-color:#2563eb');
    expect(middle).toContain('background-color:#18181b');
    expect(middle).not.toContain('border-radius');
    expect(first.match(/clip-path:inset\(0 100% 0 0\)/g)).toHaveLength(2);
    expect(middle.match(/clip-path:inset\(0 0% 0 0\)/g)).toHaveLength(2);
    expect(last.match(/clip-path:inset\(0 100% 0 0\)/g)).toHaveLength(2);
    const early = renderToStaticMarkup(<NameLowerThird progress={0.025} />);
    expect(early).not.toBe(first);
    expect(early).toMatch(/data-overlay-part="role-bar"[^>]*clip-path:inset\(0 100% 0 0\)/);
  });

  it('draws the pin before unveiling the single location line', () => {
    const early = renderToStaticMarkup(<LocationLowerThird progress={0.08} />);
    const middle = renderToStaticMarkup(<LocationLowerThird progress={0.5} />);
    const last = renderToStaticMarkup(<LocationLowerThird progress={1} />);
    expect(early).toContain('stroke-dasharray="1"');
    expect(early).toMatch(/data-overlay-part="location"[^>]*opacity:0/);
    expect(middle).toContain('stroke-dashoffset="0"');
    expect(middle).toContain('clip-path:inset(0 0% 0 0)');
    expect(middle).not.toContain('Event venue');
    expect(last).toMatch(/data-overlay-part="pin" opacity="0"/);
  });

  it.each(['instagram', 'tiktok'] as const)('renders a transparent %s interface with separate actions and navigation', (platform) => {
    const markup = renderToStaticMarkup(<SocialSafeZones platform={platform} />);
    expect(markup).toContain('data-overlay-part="action-rail"');
    expect(markup).toContain('data-overlay-part="bottom-navigation"');
    expect(markup).not.toContain('data-overlay-part="safe-area"');
    expect(markup).not.toContain('<image');
    expect(markup).not.toMatch(/NaN|Infinity/);
    expect(markup).toContain('viewBox="0 0 1080 1920"');
  });

  it('keeps the static UI stable across frames and makes the shaded guide opt-in', () => {
    clock.frame = 0;
    const first = renderToStaticMarkup(<SocialSafeZones />);
    clock.frame = 119;
    expect(renderToStaticMarkup(<SocialSafeZones />)).toBe(first);
    expect(renderToStaticMarkup(<SocialSafeZones showSafeArea />)).toContain('data-overlay-part="safe-area"');
  });

  it.each([24, 30, 60])('maps the controlled cycle to the same natural frames at %s FPS', (fps) => {
    clock.fps = fps;
    clock.frame = Math.floor((fps * 4 - 1) / 2);
    const controlled = renderToStaticMarkup(<NameLowerThird progress={0.5} />);
    expect(renderToStaticMarkup(<NameLowerThird />)).toBe(controlled);
    clock.frame = 0;
    expect(renderToStaticMarkup(<NameLowerThird progress={0.5} />)).toBe(controlled);
    expect(renderToStaticMarkup(<NameLowerThird progress={0} />)).not.toBe(controlled);
    clock.frame = fps * 4 - 1;
    expect(renderToStaticMarkup(<NameLowerThird />)).toBe(renderToStaticMarkup(<NameLowerThird progress={1} />));
    clock.fps = 30;
  });

  it('normalizes invalid dimensions and progress values', () => {
    const markup = renderToStaticMarkup(<LocationLowerThird width={Number.NaN} height={Number.POSITIVE_INFINITY} progress={Number.NaN} />);
    expect(markup).toContain('width="1"');
    expect(markup).toContain('height="1"');
    expect(markup).not.toMatch(/NaN|Infinity/);
  });
});
