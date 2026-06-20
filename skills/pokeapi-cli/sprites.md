# Sprites command reference

Detailed reference for `pkmn sprites`. See also the main [SKILL.md](./SKILL.md).

## Output contract

- **Success:** a single sprite URL printed to stdout (plain text, one trailing newline). **Not JSON.**
- **Errors:** JSON on stderr with `error.code`, same as other commands.

```bash
pkmn sprites --pokemon pikachu
# https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png
```

## Command syntax

```bash
pkmn sprites --pokemon <nameOrId> [flags]
pkmn sprites --item <nameOrId>
```

Provide exactly one of `--pokemon` or `--item`.

## Flags

| Flag | Purpose |
|------|---------|
| `--pokemon <nameOrId>` | Pokemon name or national dex id |
| `--item <nameOrId>` | Item name or id |
| `--path <dotPath>` | Explicit nested key path (overrides all convenience flags; cannot combine with other flags) |
| `--shiny` | Shiny variant |
| `--back` | Back-facing variant |
| `--female` | Female variant |
| `--animated` | Animated sprite (gen-v black-white GIFs) |
| `--official-artwork` | Shortcut: `other.official-artwork.*` |
| `--home` | Shortcut: `other.home.*` |
| `--dream-world` | Shortcut: `other.dream-world.*` |
| `--showdown` | Shortcut: `other.showdown.*` |
| `--generation <gen>` | Generation shortcut (requires `--game`; mutually exclusive with style flags) |
| `--game <slug>` | Game slug under generation (requires `--generation`) |

Style flags (`--official-artwork`, `--home`, etc.) are mutually exclusive with each other and with `--generation`/`--game`.

## Selection modes

### Default sprites

```bash
pkmn sprites --pokemon pikachu                    # front_default
pkmn sprites --pokemon pikachu --shiny            # front_shiny
pkmn sprites --pokemon charizard --back --shiny   # back_shiny
pkmn sprites --item potion                        # default
```

### Other / special artwork

```bash
pkmn sprites --pokemon pikachu --official-artwork
pkmn sprites --pokemon pikachu --official-artwork --shiny
pkmn sprites --pokemon pikachu --home
pkmn sprites --pokemon pikachu --dream-world
pkmn sprites --pokemon pikachu --showdown
```

### Generation / game sprites

Path resolved as: `versions → generation-{N} → {game} → [animated] → {leafKey}`

```bash
pkmn sprites --pokemon pikachu --generation v --game black-white
pkmn sprites --pokemon pikachu --generation v --game black-white --shiny
pkmn sprites --pokemon pikachu --generation v --game black-white --animated
pkmn sprites --pokemon pikachu --generation iii --game ruby-sapphire --back
pkmn sprites --pokemon pikachu --generation i --game red-blue --back
```

**Generation input:** roman numerals only (`i` through `ix`, e.g. `v` for Gen 5). For full API paths like `generation-v`, use `--path` instead.

**Game slug:** hyphenated API key verbatim (lowercased). Valid values per generation:

| Generation | `--game` values |
|------------|-----------------|
| i | `red-blue`, `yellow` |
| ii | `crystal`, `gold`, `silver` |
| iii | `emerald`, `firered-leafgreen`, `ruby-sapphire` |
| iv | `diamond-pearl`, `heartgold-soulsilver`, `platinum` |
| v | `black-white` |
| vi | `omegaruby-alphasapphire`, `x-y` |
| vii | `ultra-sun-ultra-moon`, `icons` |
| viii | `brilliant-diamond-shining-pearl`, `icons` |
| ix | `scarlet-violet` |

If `--game` is invalid for the generation, the error hint lists available games from the API response.

### Explicit path (power users)

```bash
pkmn sprites --pokemon pikachu --path other.official-artwork.front_shiny
pkmn sprites --pokemon pikachu --path versions.generation-v.black-white.animated.front_default
pkmn sprites --pokemon pikachu --path versions.generation-ii.crystal.transparent.shiny
```

Dot-separated keys mirror the PokeAPI `sprites` object exactly (including hyphens).

## Common recipes

| Need | Command |
|------|---------|
| Default front sprite | `pkmn sprites --pokemon <name>` |
| Shiny default | `pkmn sprites --pokemon <name> --shiny` |
| Official artwork | `pkmn sprites --pokemon <name> --official-artwork` |
| Gen 5 B&W sprite | `pkmn sprites --pokemon <name> --generation v --game black-white` |
| Gen 5 animated GIF | `pkmn sprites --pokemon <name> --generation v --game black-white --animated` |
| Item icon | `pkmn sprites --item <name>` |

## Errors

| Situation | `error.code` | Exit |
|-----------|--------------|------|
| Missing `--pokemon`/`--item`, bad flag combos | `usage-error` | 2 |
| Pokemon/item not found | `not-found` | 1 |
| Sprite null or missing at path | `not-found` | 1 |
| Invalid `--game` for generation | `not-found` (hint lists valid games) | 1 |

## Discovery escape hatch

To inspect all available sprite URLs for a Pokemon:

```bash
pkmn pokemon pikachu | jq '.sprites'
```

Use `--path` for any nested key found there.
