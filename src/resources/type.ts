import type { Command } from 'commander';
import { ApiClient } from '../core/http.js';
import { printJson } from '../core/output.js';
import { normalizePokemonInput } from '../util/normalize.js';

const http = new ApiClient();

export function registerType(program: Command) {
  program
    .command('type <nameOrId>')
    .description('Fetch a type by name or id (GET /type/{name})')
    .addHelpText(
      'after',
      `
Examples:
  $ pkmn type fire
  $ pkmn type 10
  $ pkmn type ground
`,
    )
    .action(async (nameOrId: string) => {
      const id = normalizePokemonInput(nameOrId);
      const data = await http.getJson(`/type/${encodeURIComponent(id)}`);
      printJson(data);
    });
}
