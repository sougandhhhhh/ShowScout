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
});
