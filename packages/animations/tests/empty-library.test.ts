import {describe, expect, it} from 'vitest';
import * as animations from '../src';

describe('curated animation library', () => {
  it('exports only the twenty-six registered reusable components', () => {
    expect(Object.keys(animations).sort()).toEqual(['PerspectivePanel','ExplodedLayers','SceneThumbnail','FanCardDeck','ChapterHeading','BlurredCollage','AudioPulseBadge','ChapterCardRow','BranchingPaths','SectionCollapse','TargetReticle','ConstraintSwitches','TetheredMotion','RisingCurve','DocumentFocusGallery','ConstraintRelease','PreparationCards','AgentPipeline','ScriptDocumentGuide','TypewriterComparison','CardSpotlight','ProgressRace','ProgressRow','DocumentWindow','HighlightBox','CollapsingTitle'].sort());
  });
});
