import type { Command } from 'commander';
import { ApiClient } from '../core/http.js';
import { printJson } from '../core/output.js';
import { normalizePokemonInput } from '../util/normalize.js';

const http = new ApiClient();

export function registerAbility(program: Command) {
  program
    .command('ability <nameOrId>')
    .description('Fetch an ability by name or id (GET /ability/{name})')
    .addHelpText(
      'after',
      `
Examples:
  $ pkmn ability intimidate
  $ pkmn ability 22
  $ pkmn ability flame-body
`,
    )
    .action(async (nameOrId: string) => {
      const id = normalizePokemonInput(nameOrId);
      const data = await http.getJson(`/ability/${encodeURIComponent(id)}`);
      printJson(data);
    });
}
