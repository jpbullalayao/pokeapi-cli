import { getVersion } from '../util/version.js';
import { CliError } from './errors.js';

const API_BASE = 'https://pokeapi.co/api/v2';

const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function jitterMs(base: number) {
  return base + Math.floor(Math.random() * 200);
}

function buildUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  return base + p;
}

function userAgent(): string {
  return `pokeapi-cli/${getVersion()} node/${process.version}`;
}

export class ApiClient {
  async getJson(path: string, signal?: AbortSignal): Promise<unknown> {
    const url = buildUrl(path);
    const requestSignal = signal ?? AbortSignal.timeout(30_000);

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      let res: Response;
      try {
        res = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': userAgent(),
          },
          signal: requestSignal,
        });
      } catch (e) {
        const name = (e as NodeJS.ErrnoException)?.name;
        const isAbort = name === 'AbortError';
        if (isAbort) {
          throw new CliError('Request timed out', { code: 'network-error', cause: e });
        }
        if (attempt >= MAX_RETRIES) {
          throw new CliError(e instanceof Error ? e.message : 'Network error', {
            code: 'network-error',
            cause: e,
          });
        }
        await sleep(jitterMs(200 * 2 ** attempt));
        continue;
      }

      if (res.status === 404) {
        throw new CliError('Pokemon not found', {
          code: 'not-found',
          hint: `No resource at ${path}`,
          docsUrl: 'https://pokeapi.co/docs/v2',
        });
      }

      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        if (attempt >= MAX_RETRIES) {
          const body = await this.safeReadText(res);
          throw new CliError(
            `API request failed: ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`,
            { code: 'api-error' },
          );
        }
        const ra = res.headers.get('retry-after');
        const waitSec = ra ? Number.parseInt(ra, 10) : Number.NaN;
        const delay =
          Number.isFinite(waitSec) && waitSec > 0 ? waitSec * 1000 : jitterMs(200 * 2 ** attempt);
        await sleep(delay);
        continue;
      }

      if (!res.ok) {
        const body = await this.safeReadText(res);
        throw new CliError(
          `API error: ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`,
          { code: 'api-error' },
        );
      }

      const text = await res.text();
      try {
        return text ? JSON.parse(text) : null;
      } catch (e) {
        throw new CliError('Invalid JSON in API response', { code: 'validation-error', cause: e });
      }
    }

    throw new CliError('Request failed after retries', { code: 'network-error' });
  }

  private async safeReadText(res: Response): Promise<string> {
    try {
      return await res.text();
    } catch {
      return '';
    }
  }
}
