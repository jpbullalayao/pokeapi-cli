# pokeapi-cli

Command-line interface for the [PokeAPI](https://pokeapi.co/docs/v2). Fetches Pokemon data and prints the **exact, untransformed JSON** response from the API.

**Binary:** `pkmn` · **Package:** `@professorragna/pokeapi-cli` on npm

## Installation

```bash
# Global install (pick one)
npm i -g @professorragna/pokeapi-cli
pnpm add -g @professorragna/pokeapi-cli
yarn global add @professorragna/pokeapi-cli

# Run without global install
npx @professorragna/pokeapi-cli pkmn pokemon pikachu
```

### Prerequisites

- **Node.js** >= 18.17

### Verify

```bash
pkmn --version
pkmn --help
```

## Commands

| Command | Endpoint | Description |
|---------|----------|-------------|
| `pkmn pokemon <nameOrId>` | `GET /pokemon/{name}` | Battle data: types, base stats, abilities, moves, sprites |
| `pkmn pokemon-species <nameOrId>` | `GET /pokemon-species/{name}` | Species data: evolution, egg groups, flavor text, legendary flags |
| `pkmn ability <nameOrId>` | `GET /ability/{name}` | Ability data: effect text, Pokemon with the ability, flavor text |
| `pkmn item <nameOrId>` | `GET /item/{name}` | Item data: cost, fling, attributes, category, effect/flavor text, held-by |
| `pkmn move <nameOrId>` | `GET /move/{name}` | Move data: power, PP, accuracy, type, damage class, effect, stat changes |
| `pkmn type <nameOrId>` | `GET /type/{name}` | Type data: damage relations (offensive/defensive), generation, move damage class, Pokemon and moves of the type |
| `pkmn sprites [flags]` | `GET /pokemon` or `GET /item` | Resolve a single sprite URL (plain text output; see [skills/pokeapi-cli/sprites.md](skills/pokeapi-cli/sprites.md)) |

## Usage

```bash
# By name
pkmn pokemon incineroar
pkmn pokemon-species wormadam
pkmn ability intimidate
pkmn item potion
pkmn move flamethrower
pkmn type fire

# By national dex id
pkmn pokemon 727
pkmn pokemon-species 413
pkmn ability 22
pkmn item 1
pkmn move 53
pkmn type 10

# Hyphenated names (spaces/underscores normalized automatically)
pkmn pokemon "flutter mane"
pkmn pokemon flutter-mane

# Sprite URLs (plain text output)
pkmn sprites --pokemon pikachu
pkmn sprites --pokemon pikachu --generation v --game black-white --shiny
pkmn sprites --item potion
```

## Output

Commands print the **raw PokeAPI JSON** to stdout with 2-space indentation. Keys and values are exactly as returned by the API (snake_case, no transformation). The `sprites` command prints a single URL string instead — see [skills/pokeapi-cli/sprites.md](skills/pokeapi-cli/sprites.md). Errors are written to stderr as JSON with a non-zero exit code.

Pipe to [jq](https://jqlang.github.io/jq/) for field selection:

```bash
pkmn pokemon pikachu | jq '.types'
pkmn pokemon-species pikachu | jq '.genera'
pkmn ability intimidate | jq '.effect_entries'
pkmn item potion | jq '.effect_entries'
pkmn move flamethrower | jq '.effect_entries'
pkmn type fire | jq '.damage_relations'
```

## Agent skill

This CLI ships an agent skill at [`skills/pokeapi-cli/SKILL.md`](skills/pokeapi-cli/SKILL.md) for any harness that supports the [Agent Skills specification](https://agentskills.io) (Claude Code, Cursor, Codex, and others).

Install it with the [skills CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add jpbullalayao/pokeapi-cli
```

## Development

```bash
npm install
npm run build
node bin/pkmn.js pokemon pikachu
npm test
```

## Releasing

Pushing a semver tag (`v*`) triggers [`.github/workflows/publish.yml`](.github/workflows/publish.yml) to build, test, and publish to npm with provenance.

### Cut a release

The tag must match the version in `package.json` (e.g. tag `v1.0.0` requires `"version": "1.0.0"`).

```bash
npm version patch   # or minor / major — updates package.json and package-lock.json
git push origin main
git push origin vX.Y.Z
```

The workflow validates the tag, runs `npm ci && npm test`, then publishes. Confirm at [npmjs.com/package/@professorragna/pokeapi-cli](https://www.npmjs.com/package/@professorragna/pokeapi-cli).

## License

MIT
