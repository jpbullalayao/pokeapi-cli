# pokeapi-cli

Command-line interface for the [PokeAPI](https://pokeapi.co/docs/v2). Fetches Pokemon data and prints the **exact, untransformed JSON** response from the API.

**Binary:** `pkmn` · **Package:** `pokeapi-cli` on npm

## Installation

```bash
# Global install
npm i -g pokeapi-cli

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

## Usage

```bash
# By name
pkmn pokemon incineroar
pkmn pokemon-species wormadam

# By national dex id
pkmn pokemon 727
pkmn pokemon-species 413

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
