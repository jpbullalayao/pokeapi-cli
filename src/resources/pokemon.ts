import type { Command } from 'commander';
import { ApiClient } from '../core/http.js';
import { printJson } from '../core/output.js';
import { normalizePokemonInput } from '../util/normalize.js';

const http = new ApiClient();

export function registerPokemon(program: Command) {
  program
    .command('pokemon <nameOrId>')
    .description('Fetch a Pokemon by name or id (GET /pokemon/{name})')
    .addHelpText(
      'after',
      `
Examples:
  $ pkmn pokemon incineroar
  $ pkmn pokemon 727
  $ pkmn pokemon flutter-mane
`,
    )
    .action(async (nameOrId: string) => {
      const id = normalizePokemonInput(nameOrId);
      const data = await http.getJson(`/pokemon/${encodeURIComponent(id)}`);
      printJson(data);
    });
}
