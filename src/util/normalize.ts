/** Normalize a Pokemon name or id for PokeAPI lookup. */
export function normalizePokemonInput(input: string): string {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  return trimmed.toLowerCase().replace(/[\s_]+/g, '-');
}
