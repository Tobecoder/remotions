import {describe, expect, it} from 'vitest';
import * as animations from '../src';

describe('curated animation library', () => {
  it('exports only the twenty-five registered reusable components', () => {
    expect(Object.keys(animations).sort()).toEqual(['PerspectivePanel','ExplodedLayers','SceneThumbnail','FanCardDeck','ChapterHeading','BlurredCollage','AudioPulseBadge','ChapterCardRow','BranchingPaths','SectionCollapse','TargetReticle','ConstraintSwitches','TetheredMotion','RisingCurve','ConstraintRelease','PreparationCards','AgentPipeline','TypewriterComparison','CardSpotlight','ProgressRow','DocumentWindow','HighlightBox','CollapsingTitle','CardEntrance','FocusLayer'].sort());
  });
});
