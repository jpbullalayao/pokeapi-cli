#!/usr/bin/env node
import { Command } from 'commander';
import { isCliError, writeCliError } from './core/errors.js';
import { registerAbility } from './resources/ability.js';
import { registerItem } from './resources/item.js';
import { registerMove } from './resources/move.js';
import { registerPokemonSpecies } from './resources/pokemon-species.js';
import { registerPokemon } from './resources/pokemon.js';
import { getVersion } from './util/version.js';

const program = new Command();

program.version(getVersion(), '-V, --version');

program
  .name('pkmn')
  .description(
    'Command-line interface for the PokeAPI (pokemon, pokemon-species, ability, item, and move endpoints).\n\nDocs: https://pokeapi.co/docs/v2',
  );

registerPokemon(program);
registerPokemonSpecies(program);
registerAbility(program);
registerItem(program);
registerMove(program);

program.addHelpText(
  'after',
  `
Output:
  Commands print the raw PokeAPI JSON response to stdout (2-space indentation).
  Errors are written to stderr as JSON with a non-zero exit code.

Examples:
  $ pkmn pokemon pikachu
  $ pkmn pokemon-species pikachu
  $ pkmn ability intimidate
  $ pkmn item potion
  $ pkmn move flamethrower
`,
);

program
  .command('help [topic]')
  .description('Show help (alias: pkmn --help)')
  .action((topic?: string) => {
    if (topic) {
      process.stderr.write(`Use: pkmn ${topic} --help (or: pkmn --help ${topic})\n`);
    }
    program.help();
  });

program.action(() => {
  program.help();
});

function printError(e: unknown) {
  if (isCliError(e)) {
    writeCliError(e);
    return;
  }
  if (e instanceof Error) {
    process.stderr.write(
      `${JSON.stringify({ error: { code: 'generic-error', message: e.message, exit: 1 } }, null, 2)}\n`,
    );
  } else {
    process.stderr.write(
      `${JSON.stringify({ error: { code: 'generic-error', message: 'Unknown error', exit: 1 } }, null, 2)}\n`,
    );
  }
  process.exitCode = 1;
}

try {
  await program.parseAsync(process.argv, { from: 'node' });
} catch (e) {
  printError(e);
  if (process.exitCode == null || process.exitCode === undefined) {
    process.exitCode = 1;
  }
  process.exit(process.exitCode);
}
