---
name: pokeapi-cli
description: >-
  PokeAPI CLI reference for fetching Pokemon and Pokemon species data from
  pokeapi.co. Use when the user mentions pokeapi-cli, pkmn, Pokemon base stats,
  typing, abilities, moves, evolution, egg groups, or needs to look up canonical
  Pokemon data from the command line or in agent workflows.
---

# PokeAPI CLI (`pkmn`)

Command-line interface for the [PokeAPI](https://pokeapi.co/docs/v2): fetches Pokemon data and prints the exact JSON response.

**API documentation:** [pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)

**Package:** `pokeapi-cli` on npm · **Binary:** `pkmn` · **Current version:** 0.1.0 (see `pkmn --version` after install)

---

## Prerequisites

### Installation

```bash
# Global install (pick one)
npm i -g pokeapi-cli
pnpm add -g pokeapi-cli
yarn global add pokeapi-cli

# Run without global install
npx -p pokeapi-cli pkmn --help
```

### Runtime

- **Node.js** >= 18.17 (see package `engines`).

### Verify

```bash
pkmn --version
pkmn --help
```

---

## Authentication

PokeAPI is public and requires **no API key**.

---

## CLI structure

```
pkmn                              # Root (default action shows help)
├── pokemon <nameOrId>            # GET /pokemon/{name}
└── pokemon-species <nameOrId>    # GET /pokemon-species/{name}
```

---

## Commands

### `pkmn pokemon <nameOrId>`

Fetch a Pokemon by name or national dex id. Returns battle data from `GET /pokemon/{name}`.

**Includes:** types, base stats, abilities, moves, sprites, held items, cries, game indices.

```bash
pkmn pokemon incineroar
pkmn pokemon 727
pkmn pokemon flutter-mane
```

### `pkmn pokemon-species <nameOrId>`

Fetch a Pokemon species by name or id. Returns species data from `GET /pokemon-species/{name}`.

**Includes:** gender rate, capture rate, egg groups, evolution chain, flavor text, genera, varieties, legendary/mythical flags.

```bash
pkmn pokemon-species wormadam
pkmn pokemon-species 413
pkmn pokemon-species pikachu
```

---

## Output

- **Success:** raw PokeAPI JSON to stdout (2-space indentation). Keys are snake_case exactly as the API returns them. No transformation.
- **Error:** JSON object to stderr with `error.code`, `error.message`, and non-zero exit code.
- **404:** `error.code` is `not-found` when the name or id does not exist.

Use `jq` to select fields from the response:

```bash
pkmn pokemon pikachu | jq '.stats'
pkmn pokemon-species pikachu | jq '.evolution_chain.url'
```

---

## Agent routing

When the user asks about…

| Topic | Action |
|-------|--------|
| Pokemon typing, base stats, abilities, moves | `pkmn pokemon <name>` |
| Evolution, egg groups, legendary/mythical, flavor text | `pkmn pokemon-species <name>` |
| Type effectiveness (not in PokeAPI per-Pokemon) | Read `general/type-chart.md` |
| Damage rolls, OHKO claims | Use calc MCP — never invent numbers |

**Hard rule:** never guess base stats, typings, abilities, or learnsets — run `pkmn` and read the JSON.

Name normalization: spaces and underscores become hyphens; names are lowercased. Numeric ids pass through unchanged.

---

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Not found or generic error |
| 2 | Usage error |
| 4 | Validation error (malformed API response) |
| 5 | API error |
| 6 | Network error / timeout |

---

## Future commands (not yet implemented)

- `pkmn move <name>` — move details
- `pkmn ability <name>` — ability details
