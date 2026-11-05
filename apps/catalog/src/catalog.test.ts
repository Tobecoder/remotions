import {describe, expect, it} from 'vitest';
import {catalog, categories} from './catalog';
import {draftMaterials} from './draftReview';

describe('catalog reset', () => {
  it('has no registered materials', () => expect(catalog).toEqual([]));
  it('does not list the withdrawn self-designed experiment as a reference material', () => {
    expect(draftMaterials).toEqual([]);
  });
  it('retains unique category identifiers', () => {
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories.map((category) => category.id)).size).toBe(categories.length);
  });
});
