import type { Command } from 'commander';
import { ApiClient } from '../core/http.js';
import { printJson } from '../core/output.js';
import { normalizePokemonInput } from '../util/normalize.js';

const http = new ApiClient();

export function registerMove(program: Command) {
  program
    .command('move <nameOrId>')
    .description('Fetch a move by name or id (GET /move/{name})')
    .addHelpText(
      'after',
      `
Examples:
  $ pkmn move flamethrower
  $ pkmn move 53
  $ pkmn move close-combat
`,
    )
    .action(async (nameOrId: string) => {
      const id = normalizePokemonInput(nameOrId);
      const data = await http.getJson(`/move/${encodeURIComponent(id)}`);
      printJson(data);
    });
}
