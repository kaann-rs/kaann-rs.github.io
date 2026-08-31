#!/usr/bin/env node
/*
 * Draws a project's cover image.
 *
 *   npm run new:cover -- vocloud --glyph server --accent "#0e7490" --accent-dark "#22d3ee"
 *
 * The result is an SVG under src/content/_assets/, built from the same parts
 * as the site: the frame rules, the corner squares, and the project's own mark
 * in its own colour. It carries its own light and dark palette, so the same
 * file suits both without a second asset.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseArgs, slugify, die } from './lib.mjs';
import { ICONS, resolveIcon } from '../src/lib/icons.mjs';
import { BRAND } from '../src/consts.js';

const { flags, positional } = parseArgs(process.argv.slice(2));
const input = positional[0];
if (!input) die('usage: npm run new:cover -- <slug> [--glyph name] [--accent #hex] [--accent-dark #hex]');

const slug = slugify(input);
const accent = flags.accent ?? BRAND.light;
const accentDark = flags['accent-dark'] ?? flags.accent ?? BRAND.dark;
const glyphName = flags.glyph ?? 'package';

const glyph = resolveIcon(glyphName);
if (!glyph) die(`unknown glyph "${glyphName}". Available: ${Object.keys(ICONS).join(', ')}`);

const W = 1600;
const H = 533;
/** The mark is drawn on a 24-unit grid; scale it up and place it bottom-left. */
const SCALE = 11;
const MARK = 24 * SCALE;
const MARK_X = 120;
const MARK_Y = H - MARK - 96;

/** Vertical rules on the same 4-unit rhythm the page uses. */
const columns = [120, 400, 680, 960, 1240, 1480];
const rules = columns.map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="${H}" class="rule"/>`).join('\n  ');

/** Corner squares where the rules meet the horizontal ones. */
const rows = [96, H - 96];
const squares = columns
  .flatMap((x) => rows.map((y) => `<rect x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" class="mark"/>`))
  .join('\n  ');
const bands = rows.map((y) => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" class="rule"/>`).join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <style>
    :root { --surface: #fffbf5; --ink: #151414; --accent: ${accent}; }
    @media (prefers-color-scheme: dark) {
      :root { --surface: #151414; --ink: #f0e3de; --accent: ${accentDark}; }
    }
    .surface { fill: var(--surface); }
    .rule { stroke: var(--ink); stroke-opacity: 0.125; stroke-width: 1; }
    .mark { fill: var(--surface); stroke: var(--ink); stroke-opacity: 0.3; stroke-width: 1; }
    .glyph { stroke: var(--accent); stroke-opacity: 0.9; fill: none;
             stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
    .glyph-filled { fill: var(--accent); fill-opacity: 0.9; stroke: none; }
  </style>

  <rect width="${W}" height="${H}" class="surface"/>

  ${rules}
  ${bands}
  ${squares}

  <g transform="translate(${MARK_X} ${MARK_Y}) scale(${SCALE})" class="${glyph.filled ? 'glyph-filled' : 'glyph'}">
    ${glyph.body}
  </g>
</svg>
`;

const out = join(fileURLToPath(new URL('../public/assets/', import.meta.url)), `${slug}-cover.svg`);
await mkdir(dirname(out), { recursive: true });
await writeFile(out, svg, 'utf8');
console.log(`\n  created  public/assets/${slug}-cover.svg`);
console.log(`\n  add to both language files:\n    cover: /assets/${slug}-cover.svg\n`);
