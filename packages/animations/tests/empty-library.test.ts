import {describe, expect, it} from 'vitest';
import * as animations from '../src';

describe('curated animation library', () => {
  it('exports only the registered reusable components', () => {
    expect(Object.keys(animations).sort()).toEqual(['PerspectivePanel','ExplodedLayers','FanCardDeck','ChapterHeading','BlurredCollage','AudioPulseBadge','ChapterCardRow','BranchingPaths','ContentCollapse','TargetReticle','ConstraintSwitches','TetheredMotion','RisingCurve','ConstraintRelease','AgentPipeline','TypewriterComparison','CardSpotlight','ProgressRow','UsageMeter','TokenBowl','FileIntoContainer','DocumentWindow','HighlightBox','CollapsingTitle','CardEntrance','DropCard','ImpactRecoil','FocusLayer'].sort());
  });
});
