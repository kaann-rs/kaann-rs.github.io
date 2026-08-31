#!/usr/bin/env node
/*
 * Adds one documentation section to a project, in both languages.
 *
 *   npm run new:doc -- voparser architecture
 *   npm run new:doc -- voparser benchmarks --title "Benchmarks" --title-tr "Ölçümler"
 *
 * Built-in ids (readme, architecture, structure, state) are labelled from the
 * translations; any other id needs a title, otherwise the tab shows the id.
 */
import { parseArgs, slugify, write, die, LANGS } from './lib.mjs';

const { flags, positional } = parseArgs(process.argv.slice(2));
const [slug, rawSection] = positional;
if (!slug || !rawSection) die('usage: npm run new:doc -- <project> <section> [--title X] [--title-tr Y] [--order 40]');

const section = slugify(rawSection);
const order = flags.order ?? '100';
const titles = { en: flags.title, tr: flags['title-tr'] ?? flags.title };

console.log(`\nsection: ${slug}/${section}\n`);

for (const lang of LANGS) {
  const title = titles[lang] ? `\ntitle: ${titles[lang]}` : '';
  await write(
    `docs/${lang}/${slug}/${section}.md`,
    `---
lang: ${lang}${title}
description: ""
order: ${order}
---

${lang === 'tr' ? '## Başlık\n\nBurayı doldur.\n' : '## Heading\n\nFill this in.\n'}`
  );
}
console.log('');
