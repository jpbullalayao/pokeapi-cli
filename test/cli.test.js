import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { getVersion } from '../dist/util/version.js';

test('--version exits 0 and prints package version', () => {
  const proc = spawnSync('node', ['bin/pkmn.js', '--version'], { encoding: 'utf8' });

  assert.equal(proc.status, 0);
  assert.equal(proc.stdout.trim(), getVersion());
});

test('--help exits 0 and mentions pokemon command', () => {
  const proc = spawnSync('node', ['bin/pkmn.js', '--help'], { encoding: 'utf8' });

  assert.equal(proc.status, 0);
  assert.match(proc.stdout, /pokemon/i);
});

test('unknown pokemon returns not-found from CLI', () => {
  const proc = spawnSync('node', ['bin/pkmn.js', 'pokemon', 'totally-not-a-real-mon-xyz'], {
    encoding: 'utf8',
  });

  assert.notEqual(proc.status, 0);
  const err = JSON.parse(proc.stderr);
  assert.equal(err.error.code, 'not-found');
});
