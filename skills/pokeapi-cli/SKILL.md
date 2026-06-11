---
name: pokeapi-cli
description: >-
  PokeAPI CLI reference for fetching Pokemon, Pokemon species, ability, item, move,
  and type data from pokeapi.co. Use when the user mentions pokeapi-cli, pkmn, Pokemon base
  stats, typing, type matchups, weaknesses, resistances, abilities, moves, items, evolution,
  egg groups, or needs to look up canonical Pokemon data from the command line or in agent workflows.
---

# PokeAPI CLI (`pkmn`)

Command-line interface for the [PokeAPI](https://pokeapi.co/docs/v2): fetches Pokemon data and prints the exact JSON response.

**API documentation:** [pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)

**Package:** `pokeapi-cli` on npm · **Binary:** `pkmn` · **Current version:** 0.1.0 (see `pkmn --version` after install)

---

## Authentication

PokeAPI is public and requires **no API key**.

---

## CLI structure

```
pkmn                              # Root (default action shows help)
├── pokemon <nameOrId>            # GET /pokemon/{name}
├── pokemon-species <nameOrId>    # GET /pokemon-species/{name}
├── ability <nameOrId>            # GET /ability/{name}
├── item <nameOrId>               # GET /item/{name}
├── move <nameOrId>               # GET /move/{name}
└── type <nameOrId>               # GET /type/{name}
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

### `pkmn ability <nameOrId>`

Fetch an ability by name or id. Returns ability data from `GET /ability/{name}`.

**Includes:** effect text, Pokemon that can have the ability, flavor text entries, generation, main-series flag.

```bash
pkmn ability intimidate
pkmn ability 22
pkmn ability flame-body
```

### `pkmn item <nameOrId>`

Fetch an item by name or id. Returns item data from `GET /item/{name}`.

**Includes:** cost, fling power/effect, attributes, category, effect/flavor text, held-by Pokemon.

```bash
pkmn item potion
pkmn item 1
pkmn item master-ball
```

### `pkmn move <nameOrId>`

Fetch a move by name or id. Returns move data from `GET /move/{name}`.

**Includes:** power, PP, accuracy, priority, type, damage class, effect entries, stat changes, target, learned-by Pokemon.

```bash
pkmn move flamethrower
pkmn move 53
pkmn move close-combat
```

### `pkmn type <nameOrId>`

Fetch a type by name or id. Returns type data from `GET /type/{name}`.

**Includes:** damage relations (offensive/defensive), past damage relations, generation, move damage class, Pokemon of the type, moves of the type.

```bash
pkmn type fire
pkmn type 10
pkmn type ground
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
pkmn ability intimidate | jq '.effect_entries'
pkmn item potion | jq '.effect_entries'
pkmn move flamethrower | jq '.effect_entries'
pkmn type fire | jq '.damage_relations'
```

---

## Agent routing

When the user asks about…

| Topic | Action |
|-------|--------|
| Pokemon typing, base stats, abilities, moves | `pkmn pokemon <name>` |
| Evolution, egg groups, legendary/mythical, flavor text | `pkmn pokemon-species <name>` |
| Ability effect text, which Pokemon have an ability | `pkmn ability <name>` |
| Item cost, effects, attributes, which Pokemon hold an item | `pkmn item <name>` |
| Move power, PP, accuracy, type, damage class, effects | `pkmn move <name>` |
| Type matchups, weaknesses, resistances, Pokemon/moves of a type | `pkmn type <name>` |

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
