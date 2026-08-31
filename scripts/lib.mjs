import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/* fileURLToPath, not .pathname — the checkout may sit under a path with
   spaces in it, and .pathname would hand back %20. */
export const ROOT = fileURLToPath(new URL('../src/content/', import.meta.url));
export const LANGS = ['en', 'tr'];

/** `--key value` and `--flag` into an object; everything else is positional. */
export function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) flags[key] = true;
      else { flags[key] = next; i++; }
    } else positional.push(arg);
  }
  return { flags, positional };
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Lowercase, dashed, ascii-safe. */
export function slugify(value) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i' };
  return value
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Writes a file, refusing to clobber one that already exists. */
export async function write(path, body) {
  const full = join(ROOT, path);
  try {
    await access(full);
    console.log(`  skipped (exists)  ${path}`);
    return false;
  } catch {
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, body, 'utf8');
    console.log(`  created           ${path}`);
    return true;
  }
}

export function die(message) {
  console.error(message);
  process.exit(1);
}
