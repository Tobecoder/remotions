import {describe, expect, it} from 'vitest';
import {catalog, categories} from './catalog';
import {draftMaterials} from './draftReview';

describe('curated catalog', () => {
  it('registers the twenty-four standalone materials under their matching categories', () => {
    expect(catalog).toHaveLength(24);
    expect(new Set(catalog.map(item=>item.id)).size).toBe(24);
    expect(catalog.filter(item=>item.category==='layouts').map(item=>item.component).sort()).toEqual(['PerspectivePanel','FanCardDeck','ContentCollapse','CardSpotlight','DocumentWindow','CardEntrance','FocusLayer'].sort());
    expect(catalog.some(item=>['ScriptDocumentGuide','ProgressRace','DocumentFocusGallery','SectionCollapse','SceneThumbnail'].includes(item.component))).toBe(false);
    expect(catalog.find(item=>item.component==='ExplodedLayers')?.category).toBe('storytelling');
    expect(catalog.find(item=>item.component==='ChapterHeading')?.category).toBe('text-effects');
    expect(catalog.find(item=>item.component==='BlurredCollage')?.category).toBe('backgrounds');
    expect(catalog.find(item=>item.component==='AudioPulseBadge')?.category).toBe('overlays');
    expect(catalog.filter(item=>item.category==='storytelling').map(item=>item.component).sort()).toEqual(['ExplodedLayers','ChapterCardRow','BranchingPaths','TargetReticle','ConstraintSwitches','TetheredMotion','ConstraintRelease','PreparationCards','AgentPipeline'].sort());
    expect(catalog.find(item=>item.component==='RisingCurve')?.category).toBe('charts');
    expect(catalog.find(item=>item.component==='ProgressRow')?.category).toBe('charts');
    expect(catalog.find(item=>item.component==='HighlightBox')?.category).toBe('overlays');
    expect(catalog.find(item=>item.component==='CollapsingTitle')?.category).toBe('text-effects');
    for(const item of catalog){
      expect(categories.some(category=>category.id===item.category)).toBe(true);
      expect(item.posterFrame).toBeGreaterThan(0);
      expect(item.posterFrame).toBeLessThan(item.durationInFrames);
      expect(item.code).toContain(`import {${item.component}} from '@remotions/animations'`);
    }
  });
  it('does not list the withdrawn self-designed experiment as a reference material', () => {
    expect(draftMaterials).toEqual([]);
  });
  it('retains unique category identifiers', () => {
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories.map((category) => category.id)).size).toBe(categories.length);
  });
});
