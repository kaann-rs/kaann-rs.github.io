#!/usr/bin/env node
/*
 * Adds one changelog entry per language.
 *
 *   npm run new:release -- voparser 0.1.0
 *   npm run new:release -- site 0.3.0 --kind major --date 2026-09-01
 *   npm run new:release -- site next --unreleased
 */
import { parseArgs, today, write, die, LANGS } from './lib.mjs';

const { flags, positional } = parseArgs(process.argv.slice(2));
const [slug, version] = positional;
if (!slug || !version) die('usage: npm run new:release -- <project> <version> [--kind minor] [--date YYYY-MM-DD] [--unreleased]');

const kind = flags.kind ?? 'minor';
const date = flags.date ?? today();
const unreleased = flags.unreleased ? '\nunreleased: true' : '';
/* A dot is legal in the id, but a filename without one sorts better. */
const file = version.replace(/[^a-zA-Z0-9.\-]/g, '-');

const copy = {
  en: { summary: 'TODO — one line a reader can scan.', body: '### Added\n- \n\n### Changed\n- \n\n### Fixed\n- \n' },
  tr: { summary: 'TODO — tek satırda özet.', body: '### Eklendi\n- \n\n### Değişti\n- \n\n### Düzeltildi\n- \n' },
};

console.log(`\nrelease: ${slug} ${version}\n`);

for (const lang of LANGS) {
  await write(
    `releases/${lang}/${slug}/${file}.md`,
    `---
version: "${version}"
date: ${date}
lang: ${lang}
kind: ${kind}
summary: ${copy[lang].summary}${unreleased}
---

${copy[lang].body}`
  );
}
console.log('');
