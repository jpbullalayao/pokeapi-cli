export type ErrorCode =
  | 'generic-error'
  | 'usage-error'
  | 'not-found'
  | 'validation-error'
  | 'api-error'
  | 'network-error';

const exitCodeByKind: Record<ErrorCode, 0 | 1 | 2 | 4 | 5 | 6> = {
  'generic-error': 1,
  'usage-error': 2,
  'not-found': 1,
  'validation-error': 4,
  'api-error': 5,
  'network-error': 6,
};

export class CliError extends Error {
  readonly code: ErrorCode;
  readonly exit: 0 | 1 | 2 | 4 | 5 | 6;
  readonly hint?: string;
  readonly docsUrl?: string;
  readonly cause?: unknown;

  constructor(
    message: string,
    options: {
      code: ErrorCode;
      hint?: string;
      docsUrl?: string;
      cause?: unknown;
    },
  ) {
    super(message);
    this.name = 'CliError';
    this.code = options.code;
    this.hint = options.hint;
    this.docsUrl = options.docsUrl;
    this.cause = options.cause;
    this.exit = exitCodeByKind[options.code];
  }
}

export function isCliError(e: unknown): e is CliError {
  return e instanceof CliError;
}

export function formatJsonError(e: CliError): {
  error: { code: string; message: string; hint?: string; exit: number; docs?: string };
} {
  return {
    error: {
      code: e.code,
      message: e.message,
      ...(e.hint ? { hint: e.hint } : {}),
      exit: e.exit,
      ...(e.docsUrl ? { docs: e.docsUrl } : {}),
    },
  };
}

/** Writes a CliError to stderr and sets `process.exitCode`. */
export function writeCliError(e: CliError): void {
  process.stderr.write(`${JSON.stringify(formatJsonError(e), null, 2)}\n`);
  process.exitCode = e.exit;
}
