import { CliError } from '../core/errors.js';

export type SpriteResource = 'pokemon' | 'item';

export type SpriteStyle = 'official-artwork' | 'home' | 'dream-world' | 'showdown';

export type SpriteModifiers = {
  back?: boolean;
  shiny?: boolean;
  female?: boolean;
  animated?: boolean;
};

export type SpritePathOptions = {
  path?: string;
  generation?: string;
  game?: string;
  style?: SpriteStyle;
  modifiers: SpriteModifiers;
};

const GENERATION_BY_ROMAN: Record<string, string> = {
  i: 'generation-i',
  ii: 'generation-ii',
  iii: 'generation-iii',
  iv: 'generation-iv',
  v: 'generation-v',
  vi: 'generation-vi',
  vii: 'generation-vii',
  viii: 'generation-viii',
  ix: 'generation-ix',
};

const GENERATION_BY_ARABIC: Record<string, string> = {
  '1': 'generation-i',
  '2': 'generation-ii',
  '3': 'generation-iii',
  '4': 'generation-iv',
  '5': 'generation-v',
  '6': 'generation-vi',
  '7': 'generation-vii',
  '8': 'generation-viii',
  '9': 'generation-ix',
};

export function normalizeGeneration(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.startsWith('generation-')) {
    return trimmed;
  }
  if (GENERATION_BY_ARABIC[trimmed]) {
    return GENERATION_BY_ARABIC[trimmed];
  }
  if (GENERATION_BY_ROMAN[trimmed]) {
    return GENERATION_BY_ROMAN[trimmed];
  }
  throw new CliError(`Invalid generation: ${input}`, {
    code: 'usage-error',
    hint: 'Use roman numerals (i–ix), arabic (1–9), or full slug (generation-v)',
  });
}

export function normalizeGameSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');
}

export function buildLeafKey(modifiers: SpriteModifiers): string {
  const orient = modifiers.back ? 'back' : 'front';
  if (!modifiers.shiny && !modifiers.female) {
    return `${orient}_default`;
  }
  const parts = [orient];
  if (modifiers.shiny) parts.push('shiny');
  if (modifiers.female) parts.push('female');
  return parts.join('_');
}

export function buildSpritePath(options: SpritePathOptions, resource: SpriteResource): string[] {
  if (options.path) {
    return options.path.split('.').filter((segment) => segment.length > 0);
  }

  const leafKey = buildLeafKey(options.modifiers);

  if (resource === 'item') {
    return ['default'];
  }

  if (options.generation && options.game) {
    const generation = normalizeGeneration(options.generation);
    const game = normalizeGameSlug(options.game);
    const segments = ['versions', generation, game];
    if (options.modifiers.animated) {
      segments.push('animated');
    }
    segments.push(leafKey);
    return segments;
  }

  if (options.style) {
    return ['other', options.style, leafKey];
  }

  return [leafKey];
}

export function resolveSpriteUrl(sprites: Record<string, unknown>, path: string[]): string {
  let current: unknown = sprites;

  for (const segment of path) {
    if (current == null || typeof current !== 'object' || Array.isArray(current)) {
      throw new CliError(`Sprite not available at path: ${path.join('.')}`, {
        code: 'not-found',
        hint: "Inspect available sprites with: pkmn pokemon <name> | jq '.sprites'",
      });
    }
    current = (current as Record<string, unknown>)[segment];
  }

  if (current == null) {
    throw new CliError(`Sprite not available at path: ${path.join('.')}`, {
      code: 'not-found',
      hint: "Inspect available sprites with: pkmn pokemon <name> | jq '.sprites'",
    });
  }

  if (typeof current !== 'string') {
    throw new CliError(`Sprite not available at path: ${path.join('.')}`, {
      code: 'not-found',
      hint: 'The path resolves to a nested object, not a URL. Try a more specific path.',
    });
  }

  return current;
}

export function validateGenerationGamePath(
  sprites: Record<string, unknown>,
  generation: string,
  game: string,
): void {
  const versions = sprites.versions;
  if (versions == null || typeof versions !== 'object' || Array.isArray(versions)) {
    throw new CliError(`No version sprites for generation ${generation}`, {
      code: 'not-found',
    });
  }

  const generationNode = (versions as Record<string, unknown>)[generation];
  if (
    generationNode == null ||
    typeof generationNode !== 'object' ||
    Array.isArray(generationNode)
  ) {
    const available = Object.keys(versions as Record<string, unknown>).join(', ');
    throw new CliError(`No sprites for generation ${generation}`, {
      code: 'not-found',
      hint: `Available generations: ${available}`,
    });
  }

  const gameNode = (generationNode as Record<string, unknown>)[game];
  if (gameNode == null) {
    const available = Object.keys(generationNode as Record<string, unknown>).join(', ');
    throw new CliError(`No sprites for game ${game} under ${generation}`, {
      code: 'not-found',
      hint: `Available games: ${available}`,
    });
  }
}
