#!/usr/bin/env node
/*
 * Generates an Obsidian MathJax preamble note from the site's KaTeX macros.
 *
 * The site renders math with KaTeX and reads macros from src/lib/katex-macros.mjs.
 * Obsidian renders math with MathJax, which knows nothing about that file — so
 * `$\R$` would show as an error there. MathJax does, however, keep \newcommand
 * definitions globally for the session once a note containing them is rendered.
 *
 * This script emits that note, so both renderers stay driven by one source.
 * Re-run after editing katex-macros.mjs:  npm run macros
 */

import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KATEX_MACROS } from '../src/lib/katex-macros.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** \abs{#1} style macros declare their arity by the highest #n they use. */
function arity(body) {
  const args = [...body.matchAll(/#(\d)/g)].map((m) => Number(m[1]));
  return args.length ? Math.max(...args) : 0;
}

const commands = Object.entries(KATEX_MACROS)
  .map(([name, body]) => {
    const n = arity(body);
    const count = n > 0 ? `[${n}]` : '';
    return `\\newcommand{${name}}${count}{${body}}`;
  })
  .join('\n');

const note = `---
obsidian_only: true
---

# MathJax preamble

Generated from \`src/lib/katex-macros.mjs\` — **do not edit by hand.**
Run \`npm run macros\` after changing that file.

Obsidian renders math with MathJax, the site with KaTeX. The macros below make
the two agree: once this note has been rendered in a session, \`$\\R$\` and the
rest work in every other note too.

> [!tip]
> Keep this note pinned, or open it once after starting Obsidian.

$$
${commands}
$$

## Available macros

${Object.keys(KATEX_MACROS)
  .map((m) => `- \`$${m}$\``)
  .join('\n')}
`;

const out = join(ROOT, 'src/content/_mathjax-preamble.md');
await writeFile(out, note, 'utf8');
console.log(`${Object.keys(KATEX_MACROS).length} macros → ${out.replace(ROOT + '/', '')}`);
