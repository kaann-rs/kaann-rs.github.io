#!/usr/bin/env node
/*
 * New post skeleton — so frontmatter never has to be typed by hand.
 *
 *   npm run new -- tr "Derleyicilerde ara temsil"
 *   npm run new -- en "Intermediate representations" --tags compilers,rust
 *   npm run new -- tr "Başlık" --key ir-notlari      # translation key
 *   npm run new -- tr "Başlık" --draft
 *
 * Creates the file and prints its path. Editor-agnostic — nvim, helix, whatever.
 */

import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Slug generator that transliterates Turkish characters correctly. */
function slugify(input) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
  return input
    .toLowerCase()
    .replace(/[çğıİöşüâîû]/g, (c) => map[c] ?? c)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--draft') flags.draft = true;
    else if (a === '--tags') flags.tags = argv[++i];
    else if (a === '--key') flags.key = argv[++i];
    else if (a === '--slug') flags.slug = argv[++i];
    else if (a.startsWith('--')) throw new Error(`Unknown option: ${a}`);
    else positional.push(a);
  }

  const [lang, ...titleParts] = positional;
  return { lang, title: titleParts.join(' '), ...flags };
}

const USAGE = `
Usage:
  npm run new -- <en|tr> "<Title>" [options]

Options:
  --tags a,b,c    Tags
  --key <key>     Translation key (must be THE SAME in both languages)
  --slug <slug>   Set the file name manually
  --draft         Create as a draft
`.trim();

const exists = async (p) => access(p).then(() => true, () => false);

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(e.message + '\n\n' + USAGE);
    process.exit(1);
  }

  const { lang, title, tags, key, draft } = args;

  if (!lang || !['en', 'tr'].includes(lang) || !title) {
    console.error(USAGE);
    process.exit(1);
  }

  const slug = args.slug ? slugify(args.slug) : slugify(title);
  if (!slug) {
    console.error('Could not derive a slug from the title — pass one with --slug.');
    process.exit(1);
  }

  const dir = join(ROOT, 'src', 'content', 'posts', lang);
  const file = join(dir, `${slug}.md`);

  if (await exists(file)) {
    console.error(`Already exists: ${file}`);
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);
  const tagList = (tags ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const tr = lang === 'tr';

  const front = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(tr ? 'Tek cümlelik özet.' : 'One-sentence summary.')}`,
    `date: ${today}`,
    `lang: ${lang}`,
    `tags: [${tagList.join(', ')}]`,
    ...(key ? [`translationKey: ${key}`] : []),
    ...(draft ? ['draft: true'] : []),
    'sources: []',
    '---',
    '',
  ].join('\n');

  const body = tr
    ? '\nBuradan başlayın.\n'
    : '\nStart here.\n';

  await mkdir(dir, { recursive: true });
  await writeFile(file, front + body, 'utf8');

  const rel = file.replace(ROOT + '/', '');
  console.log(rel);

  if (key) {
    const other = lang === 'en' ? 'tr' : 'en';
    console.error(
      `\nFor the translation:\n  npm run new -- ${other} "<${other} title>" --key ${key}` +
        (tagList.length ? ` --tags ${tagList.join(',')}` : '')
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
