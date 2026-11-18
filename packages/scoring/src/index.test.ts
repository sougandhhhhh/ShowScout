import { describe, expect, it } from 'vitest';
import { createDemoTheatres } from '@showscout/providers/demo';
import { sortTheatres, valueScore } from './index';

describe('value scoring', () => {
  it('returns a bounded score', () => {
    const score = valueScore(createDemoTheatres()[0]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
  it('can sort the demo set by price', () => {
    const theatres = sortTheatres(createDemoTheatres(), 'lowest_price');
    expect(theatres[0].shows[0].priceFromPaise).toBeLessThanOrEqual(theatres.at(-1)!.shows[0].priceFromPaise);
  });
  it('handles empty shows and all supported sort modes', () => {
    const theatres = createDemoTheatres();
    const empty = { ...theatres[0], shows: [] };
    expect(valueScore(empty)).toBeGreaterThanOrEqual(0);
    expect(() => sortTheatres([empty, ...theatres], 'lowest_price')).not.toThrow();
    expect(sortTheatres(theatres, 'earliest')).toHaveLength(theatres.length);
    expect(sortTheatres(theatres, 'nearest')).toHaveLength(theatres.length);
    expect(sortTheatres(theatres, 'most_available')).toHaveLength(theatres.length);
  });
});
