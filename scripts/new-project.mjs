#!/usr/bin/env node
/*
 * Scaffolds a project in both languages, plus an empty roadmap.
 *
 *   npm run new:project -- voparser --name voParser --accent "#7e22ce" --mono vp
 *   npm run new:project -- "My Tool" --status experiment --draft
 *
 * Every field can be edited afterwards; the point is that nothing is missing
 * and that EN and TR start out in step.
 */
import { parseArgs, slugify, today, write, die, LANGS } from './lib.mjs';
import { BRAND } from '../src/consts.js';

const { flags, positional } = parseArgs(process.argv.slice(2));
const input = positional[0];
if (!input) die('usage: npm run new:project -- <slug|name> [--name X] [--accent #hex] [--accent-dark #hex] [--mono ab] [--status active] [--draft]');

const slug = slugify(input);
const name = flags.name ?? input;
const accent = flags.accent ?? BRAND.light;
const accentDark = flags['accent-dark'] ?? BRAND.dark;
const monogram = flags.mono ?? slug.slice(0, 2);
const status = flags.status ?? 'active';
const draft = flags.draft ? '\ndraft: true' : '';

const copy = {
  en: {
    tagline: 'TODO — one line on what it does, and for whom.',
    body: `## What it does\n\nOne paragraph: the input, the output, and the part that was hard.\n\n## Why it exists\n\nWhat was already available, why it did not fit, and what you measured before\ndeciding to write your own.\n\n## Design\n\nThe decisions worth defending.\n`,
  },
  tr: {
    tagline: 'TODO — ne yaptığını tek cümlede yaz.',
    body: `## Ne yapar\n\nTek paragraf: girdi, çıktı ve zor olan kısım.\n\n## Neden var\n\nHazırda ne vardı, neden yetmedi ve kendin yazmaya karar vermeden önce neyi\nölçtün.\n\n## Tasarım\n\nSavunmaya değer kararlar.\n`,
  },
};

console.log(`\nproject: ${slug}\n`);

for (const lang of LANGS) {
  const { tagline, body } = copy[lang];
  await write(
    `projects/${lang}/${slug}.md`,
    `---
name: ${name}
tagline: ${tagline}
description: ""
lang: ${lang}
status: ${status}
accent: "${accent}"
accentDark: "${accentDark}"
monogram: ${monogram}
# icon: ../../_assets/${slug}-icon.png
# cover: ../../_assets/${slug}-cover.png
# sections: [readme, changelog, roadmap, architecture, structure, state]
repo: ""
license: MIT
stack: []
started: ${today()}
order: 100${draft}
---

${body}`
  );

  await write(
    `roadmaps/${lang}/${slug}.md`,
    `---
lang: ${lang}
updated: ${today()}
milestones:
  - title: ${lang === 'tr' ? 'İlk kilometre taşı' : 'First milestone'}
    status: building
    items:
      - text: ${lang === 'tr' ? 'İlk madde' : 'First item'}
        done: false
---
`
  );
}

console.log(`\nnext: npm run new:release -- ${slug} 0.1.0\n`);
