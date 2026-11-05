import {describe, expect, it} from 'vitest';
import {catalog, categories} from './catalog';
import {draftMaterials} from './draftReview';

describe('catalog reset', () => {
  it('has no registered materials', () => expect(catalog).toEqual([]));
  it('keeps the new reference draft separate from approved materials', () => {
    expect(draftMaterials).toHaveLength(1);
    expect(draftMaterials[0].status).toBe('awaiting-review');
    expect(draftMaterials[0].reference.fromSeconds).toBe(122);
  });
  it('retains unique category identifiers', () => {
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories.map((category) => category.id)).size).toBe(categories.length);
  });
});
