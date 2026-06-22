export function printJson(data: unknown): void {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

export function printPlain(text: string): void {
  process.stdout.write(`${text}\n`);
}
