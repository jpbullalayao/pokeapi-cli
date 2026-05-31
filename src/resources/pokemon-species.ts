import type { Command } from 'commander';
import { ApiClient } from '../core/http.js';
import { printJson } from '../core/output.js';
import { normalizePokemonInput } from '../util/normalize.js';

const http = new ApiClient();

export function registerPokemonSpecies(program: Command) {
  program
    .command('pokemon-species <nameOrId>')
    .description('Fetch a Pokemon species by name or id (GET /pokemon-species/{name})')
    .addHelpText(
      'after',
      `
Examples:
  $ pkmn pokemon-species wormadam
  $ pkmn pokemon-species 413
  $ pkmn pokemon-species flutter-mane
`,
    )
    .action(async (nameOrId: string) => {
      const id = normalizePokemonInput(nameOrId);
      const data = await http.getJson(`/pokemon-species/${encodeURIComponent(id)}`);
      printJson(data);
    });
}
