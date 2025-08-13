import { describe, expect, it } from 'vitest';
import * as sharedTypes from '../index';

describe('Shared Types Index', () => {
  it('should export all types', () => {
    expect(typeof sharedTypes).toBe('object');
  });

  it('should be importable from main index', () => {
    const types = Object.keys(sharedTypes);
    expect(types).toBeDefined();
  });

  it('should allow importing the module', () => {
    expect(sharedTypes).toBeDefined();
    expect(typeof sharedTypes).toBe('object');
  });
});
