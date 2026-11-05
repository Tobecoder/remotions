import {describe, expect, it} from 'vitest';
import {catalog, categories} from './catalog';

describe('catalog reset', () => {
  it('has no registered materials', () => expect(catalog).toEqual([]));
  it('retains unique category identifiers', () => {
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories.map((category) => category.id)).size).toBe(categories.length);
  });
});
