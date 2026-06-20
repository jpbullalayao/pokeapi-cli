import assert from 'node:assert/strict';
import test from 'node:test';
import { CliError } from '../dist/core/errors.js';
import { normalizeGeneration } from '../dist/sprites/resolve.js';

test('normalizeGeneration accepts roman numerals', () => {
  assert.equal(normalizeGeneration('v'), 'generation-v');
  assert.equal(normalizeGeneration('III'), 'generation-iii');
  assert.equal(normalizeGeneration(' ix '), 'generation-ix');
});

test('normalizeGeneration rejects non-roman input', () => {
  for (const input of ['5', 'generation-v']) {
    assert.throws(() => normalizeGeneration(input), (e) => {
      assert.ok(e instanceof CliError);
      assert.equal(e.code, 'usage-error');
      return true;
    });
  }
});
