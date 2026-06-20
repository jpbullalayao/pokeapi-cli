import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const PKMN = ['node', 'bin/pkmn.js', 'sprites'];

function runSprites(args) {
  return spawnSync('node', ['bin/pkmn.js', 'sprites', ...args], { encoding: 'utf8' });
}

test('sprites with no resource flag returns usage-error', () => {
  const proc = runSprites([]);

  assert.equal(proc.status, 2);
  const err = JSON.parse(proc.stderr);
  assert.equal(err.error.code, 'usage-error');
});

test('sprites with both --pokemon and --item returns usage-error', () => {
  const proc = runSprites(['--pokemon', 'pikachu', '--item', 'potion']);

  assert.equal(proc.status, 2);
  const err = JSON.parse(proc.stderr);
  assert.equal(err.error.code, 'usage-error');
});

test('sprites --generation without --game returns usage-error', () => {
  const proc = runSprites(['--pokemon', 'pikachu', '--generation', 'v']);

  assert.equal(proc.status, 2);
  const err = JSON.parse(proc.stderr);
  assert.equal(err.error.code, 'usage-error');
});

test('sprites --pokemon pikachu returns default front sprite URL', () => {
  const proc = runSprites(['--pokemon', 'pikachu']);

  assert.equal(proc.status, 0);
  assert.equal(
    proc.stdout.trim(),
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  );
});

test('sprites --pokemon pikachu --shiny returns shiny URL', () => {
  const proc = runSprites(['--pokemon', 'pikachu', '--shiny']);

  assert.equal(proc.status, 0);
  assert.equal(
    proc.stdout.trim(),
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png',
  );
});

test('sprites --item potion returns item sprite URL', () => {
  const proc = runSprites(['--item', 'potion']);

  assert.equal(proc.status, 0);
  assert.equal(
    proc.stdout.trim(),
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',
  );
});

test('sprites --path other.official-artwork.front_default returns artwork URL', () => {
  const proc = runSprites([
    '--pokemon',
    'pikachu',
    '--path',
    'other.official-artwork.front_default',
  ]);

  assert.equal(proc.status, 0);
  assert.equal(
    proc.stdout.trim(),
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  );
});

test('sprites --generation v --game black-white --shiny returns gen-v shiny URL', () => {
  const proc = runSprites([
    '--pokemon',
    'pikachu',
    '--generation',
    'v',
    '--game',
    'black-white',
    '--shiny',
  ]);

  assert.equal(proc.status, 0);
  assert.equal(
    proc.stdout.trim(),
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/shiny/25.png',
  );
});

test('sprites --generation v --game black-white --animated returns animated GIF URL', () => {
  const proc = runSprites([
    '--pokemon',
    'pikachu',
    '--generation',
    'v',
    '--game',
    'black-white',
    '--animated',
  ]);

  assert.equal(proc.status, 0);
  assert.match(
    proc.stdout.trim(),
    /generation-v\/black-white\/animated\/25\.gif$/,
  );
});

test('sprites invalid --game for generation returns not-found with hint', () => {
  const proc = runSprites([
    '--pokemon',
    'pikachu',
    '--generation',
    'v',
    '--game',
    'invalid-game',
  ]);

  assert.equal(proc.status, 1);
  const err = JSON.parse(proc.stderr);
  assert.equal(err.error.code, 'not-found');
  assert.match(err.error.hint, /Available games:/);
});

test('sprites missing sprite at path returns not-found', () => {
  const proc = runSprites(['--pokemon', 'magnemite', '--female']);

  assert.equal(proc.status, 1);
  const err = JSON.parse(proc.stderr);
  assert.equal(err.error.code, 'not-found');
  assert.match(err.error.message, /Sprite not available/);
});

test('sprites unknown pokemon returns not-found', () => {
  const proc = runSprites(['--pokemon', 'totally-not-a-real-mon-xyz']);

  assert.notEqual(proc.status, 0);
  const err = JSON.parse(proc.stderr);
  assert.equal(err.error.code, 'not-found');
});
