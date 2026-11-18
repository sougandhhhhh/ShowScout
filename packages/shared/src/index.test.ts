import { describe, expect, it } from 'vitest';
import { CompareQuerySchema, rupees } from './index';

describe('shared contracts', () => {
  it('normalizes compare defaults', () => expect(CompareQuerySchema.parse({}).sort).toBe('best_value'));
  it('formats Indian rupees from paise', () => expect(rupees(12000)).toContain('120'));
});
