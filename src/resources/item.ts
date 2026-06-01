import type { Command } from 'commander';
import { ApiClient } from '../core/http.js';
import { printJson } from '../core/output.js';
import { normalizePokemonInput } from '../util/normalize.js';

const http = new ApiClient();

export function registerItem(program: Command) {
  program
    .command('item <nameOrId>')
    .description('Fetch an item by name or id (GET /item/{name})')
    .addHelpText(
      'after',
      `
Examples:
  $ pkmn item potion
  $ pkmn item 1
  $ pkmn item master-ball
`,
    )
    .action(async (nameOrId: string) => {
      const id = normalizePokemonInput(nameOrId);
      const data = await http.getJson(`/item/${encodeURIComponent(id)}`);
      printJson(data);
    });
}
