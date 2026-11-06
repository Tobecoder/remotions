import {describe, expect, it} from 'vitest';
import {catalog, categories} from './catalog';
import {draftMaterials} from './draftReview';

describe('curated catalog', () => {
  it('registers the sixteen standalone materials under their matching categories', () => {
    expect(catalog).toHaveLength(16);
    expect(new Set(catalog.map(item=>item.id)).size).toBe(16);
    expect(catalog.filter(item=>item.category==='layouts').map(item=>item.component).sort()).toEqual(['PerspectivePanel','SceneThumbnail','FanCardDeck','SectionCollapse','DocumentFocusGallery'].sort());
    expect(catalog.find(item=>item.component==='ExplodedLayers')?.category).toBe('storytelling');
    expect(catalog.find(item=>item.component==='ChapterHeading')?.category).toBe('text-effects');
    expect(catalog.find(item=>item.component==='BlurredCollage')?.category).toBe('backgrounds');
    expect(catalog.find(item=>item.component==='AudioPulseBadge')?.category).toBe('overlays');
    expect(catalog.filter(item=>item.category==='storytelling').map(item=>item.component).sort()).toEqual(['ExplodedLayers','ChapterCardRow','BranchingPaths','TargetReticle','ConstraintSwitches','TetheredMotion','ConstraintRelease'].sort());
    expect(catalog.find(item=>item.component==='RisingCurve')?.category).toBe('charts');
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
