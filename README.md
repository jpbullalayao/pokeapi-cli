# pokeapi-cli

Command-line interface for the [PokeAPI](https://pokeapi.co/docs/v2). Fetches Pokemon data and prints the **exact, untransformed JSON** response from the API.

**Binary:** `pkmn` · **Package:** `pokeapi-cli` on npm

## Installation

```bash
# Global install (pick one)
npm i -g pokeapi-cli
pnpm add -g pokeapi-cli
yarn global add pokeapi-cli

# Run without global install
npx pokeapi-cli pkmn pokemon pikachu
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

## Usage

```bash
# By name
pkmn pokemon incineroar
pkmn pokemon-species wormadam
pkmn ability intimidate
pkmn item potion
pkmn move flamethrower

# By national dex id
pkmn pokemon 727
pkmn pokemon-species 413
pkmn ability 22
pkmn item 1
pkmn move 53

# Hyphenated names (spaces/underscores normalized automatically)
pkmn pokemon "flutter mane"
pkmn pokemon flutter-mane
```

## Output

Commands print the **raw PokeAPI JSON** to stdout with 2-space indentation. Keys and values are exactly as returned by the API (snake_case, no transformation). Errors are written to stderr as JSON with a non-zero exit code.

Pipe to [jq](https://jqlang.github.io/jq/) for field selection:

```bash
pkmn pokemon pikachu | jq '.types'
pkmn pokemon-species pikachu | jq '.genera'
pkmn ability intimidate | jq '.effect_entries'
pkmn item potion | jq '.effect_entries'
pkmn move flamethrower | jq '.effect_entries'
```

## Agent skill

This CLI ships an agent skill at [`skills/pokeapi-cli/SKILL.md`](skills/pokeapi-cli/SKILL.md) for any harness that supports the [Agent Skills specification](https://agentskills.io) (Claude Code, Cursor, Codex, and others).

Install it with the [skills CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add jpbullalayao/pokeapi-cli
```

## Development

```bash
cd general/pokeapi-cli
npm install
npm run build
node bin/pkmn.js pokemon pikachu
```

## License

MIT
