import type { Command } from 'commander';
import { CliError } from '../core/errors.js';
import { ApiClient } from '../core/http.js';
import { printPlain } from '../core/output.js';
import {
  type SpriteStyle,
  buildSpritePath,
  normalizeGameSlug,
  normalizeGeneration,
  resolveSpriteUrl,
  validateGenerationGamePath,
} from '../sprites/resolve.js';
import { normalizePokemonInput } from '../util/normalize.js';

const http = new ApiClient();

type SpritesOptions = {
  pokemon?: string;
  item?: string;
  path?: string;
  shiny?: boolean;
  back?: boolean;
  female?: boolean;
  animated?: boolean;
  officialArtwork?: boolean;
  home?: boolean;
  dreamWorld?: boolean;
  showdown?: boolean;
  generation?: string;
  game?: string;
};

function validateSpritesOptions(options: SpritesOptions): {
  resource: 'pokemon' | 'item';
  nameOrId: string;
  pathOptions: {
    path?: string;
    generation?: string;
    game?: string;
    style?: SpriteStyle;
    modifiers: {
      back?: boolean;
      shiny?: boolean;
      female?: boolean;
      animated?: boolean;
    };
  };
} {
  const hasPokemon = options.pokemon != null && options.pokemon.length > 0;
  const hasItem = options.item != null && options.item.length > 0;

  if (!hasPokemon && !hasItem) {
    throw new CliError('Provide --pokemon or --item', {
      code: 'usage-error',
      hint: 'Example: pkmn sprites --pokemon pikachu',
    });
  }

  if (hasPokemon && hasItem) {
    throw new CliError('Provide only one of --pokemon or --item', { code: 'usage-error' });
  }

  const styleFlags = [
    options.officialArtwork && 'official-artwork',
    options.home && 'home',
    options.dreamWorld && 'dream-world',
    options.showdown && 'showdown',
  ].filter(Boolean) as SpriteStyle[];

  if (styleFlags.length > 1) {
    throw new CliError('Use only one style flag at a time', {
      code: 'usage-error',
      hint: 'Style flags: --official-artwork, --home, --dream-world, --showdown',
    });
  }

  const hasGeneration = options.generation != null && options.generation.length > 0;
  const hasGame = options.game != null && options.game.length > 0;

  if (hasGeneration !== hasGame) {
    throw new CliError('--generation and --game must be used together', {
      code: 'usage-error',
      hint: 'Example: pkmn sprites --pokemon pikachu --generation v --game black-white',
    });
  }

  if (hasGeneration && styleFlags.length > 0) {
    throw new CliError('Do not combine --generation/--game with style flags', {
      code: 'usage-error',
    });
  }

  const convenienceFlagsUsed =
    options.shiny ||
    options.back ||
    options.female ||
    options.animated ||
    styleFlags.length > 0 ||
    hasGeneration;

  if (options.path && convenienceFlagsUsed) {
    throw new CliError('Do not combine --path with other sprite selection flags', {
      code: 'usage-error',
    });
  }

  const resource = hasPokemon ? 'pokemon' : 'item';
  const rawName = hasPokemon ? options.pokemon : options.item;
  if (rawName == null || rawName.length === 0) {
    throw new CliError('Provide --pokemon or --item', {
      code: 'usage-error',
      hint: 'Example: pkmn sprites --pokemon pikachu',
    });
  }
  const nameOrId = normalizePokemonInput(rawName);

  return {
    resource,
    nameOrId,
    pathOptions: {
      path: options.path,
      generation: hasGeneration ? options.generation : undefined,
      game: hasGame ? options.game : undefined,
      style: styleFlags[0],
      modifiers: {
        back: options.back,
        shiny: options.shiny,
        female: options.female,
        animated: options.animated,
      },
    },
  };
}

export function registerSprites(program: Command) {
  program
    .command('sprites')
    .description('Resolve a sprite URL for a Pokemon or item')
    .option('--pokemon <nameOrId>', 'Pokemon name or national dex id')
    .option('--item <nameOrId>', 'Item name or id')
    .option('--path <dotPath>', 'Explicit sprite path (dot-separated API keys)')
    .option('--shiny', 'Shiny sprite variant')
    .option('--back', 'Back-facing sprite variant')
    .option('--female', 'Female sprite variant')
    .option('--animated', 'Animated sprite (gen-v black-white GIFs)')
    .option('--official-artwork', 'Official artwork sprite')
    .option('--home', 'Pokemon Home sprite')
    .option('--dream-world', 'Dream World SVG sprite')
    .option('--showdown', 'Smogon Showdown sprite')
    .option('--generation <gen>', 'Generation (roman numerals i–ix)')
    .option('--game <slug>', 'Game slug under generation (e.g. black-white, red-blue)')
    .addHelpText(
      'after',
      `
Output:
  Prints a single sprite URL to stdout (plain text, not JSON).

Examples:
  $ pkmn sprites --pokemon pikachu
  $ pkmn sprites --pokemon pikachu --shiny
  $ pkmn sprites --pokemon pikachu --official-artwork
  $ pkmn sprites --pokemon pikachu --generation v --game black-white --shiny
  $ pkmn sprites --pokemon pikachu --generation v --game black-white --animated
  $ pkmn sprites --pokemon pikachu --path other.official-artwork.front_shiny
  $ pkmn sprites --item potion
`,
    )
    .action(async (options: SpritesOptions) => {
      const { resource, nameOrId, pathOptions } = validateSpritesOptions(options);
      const endpoint = resource === 'pokemon' ? 'pokemon' : 'item';
      const data = (await http.getJson(`/${endpoint}/${encodeURIComponent(nameOrId)}`)) as {
        sprites?: Record<string, unknown>;
      };

      if (data.sprites == null || typeof data.sprites !== 'object') {
        throw new CliError('No sprites found for this resource', { code: 'not-found' });
      }

      if (pathOptions.generation && pathOptions.game) {
        const generation = normalizeGeneration(pathOptions.generation);
        const game = normalizeGameSlug(pathOptions.game);
        validateGenerationGamePath(data.sprites, generation, game);
      }

      const path = buildSpritePath(pathOptions, resource);
      const url = resolveSpriteUrl(data.sprites, path);
      printPlain(url);
    });
}
