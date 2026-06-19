import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizePokemonInput } from '../dist/util/normalize.js';

test('numeric ids pass through unchanged', () => {
  assert.equal(normalizePokemonInput('727'), '727');
  assert.equal(normalizePokemonInput(' 25 '), '25');
});

test('names are lowercased and spaces/underscores become hyphens', () => {
  assert.equal(normalizePokemonInput('Flutter Mane'), 'flutter-mane');
  assert.equal(normalizePokemonInput('flutter_mane'), 'flutter-mane');
  assert.equal(normalizePokemonInput('PIKACHU'), 'pikachu');
});
