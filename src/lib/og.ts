import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

import { SITE, BRAND } from '../consts.js';

/**
 * Social preview cards, drawn at build time.
 *
 * Satori only understands flexbox and a subset of CSS, so this is deliberately
 * plain: the frame rules, the project's mark in its own colour, the name and
 * one line. Fonts are read from disk rather than fetched, so a build with no
 * network produces the same image.
 */

const WIDTH = 1200;
const HEIGHT = 630;

const INK = '#f0e3de';
const INK_STRONG = '#fffbf5';
const INK_MUTED = '#9a9390';
const SURFACE = '#151414';
const RULE = 'rgba(240, 227, 222, 0.14)';

/* Read from the project root rather than import.meta.url: this module is
   bundled into dist/ before it runs, and a relative URL would resolve there. */
const font = (file: string) => readFile(join(process.cwd(), 'src/assets/fonts', file));

let cached: Awaited<ReturnType<typeof loadFonts>> | undefined;

async function loadFonts() {
  const [regular, semibold] = await Promise.all([
    font('inter-latin-400-normal.woff'),
    font('inter-latin-600-normal.woff'),
  ]);
  return [
    { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: semibold, weight: 600 as const, style: 'normal' as const },
  ];
}

export type CardInput = {
  /** Large line: the project's name, or the author's on the site card. */
  title: string;
  /** One line under it. */
  subtitle: string;
  /** Short label above, e.g. the section or the site name. */
  eyebrow?: string;
  /** The mark: one to three characters on the accent. */
  monogram: string;
  accent?: string;
  /** Small facts along the bottom — status, stack, licence. */
  facts?: string[];
};

/** A vertical frame rule, matching the site's own. */
const rule = (left: number) => ({
  type: 'div',
  props: {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: `${left}px`,
      width: '1px',
      background: RULE,
    },
  },
});

export async function renderCard(card: CardInput): Promise<Buffer> {
  cached ??= await loadFonts();
  const accent = card.accent ?? BRAND.dark;

  /* Satori accepts this plain element tree, but types it as ReactNode — which
     it only is once React's own types are in scope. The cast keeps the tree
     readable instead of pulling JSX into a build-time module. */
  const tree = {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: SURFACE,
          color: INK,
          fontFamily: 'Inter',
          padding: '72px 80px',
          position: 'relative',
        },
        children: [
          rule(80),
          rule(WIDTH - 80),
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '28px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '20px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '64px',
                            height: '64px',
                            borderRadius: '14px',
                            background: accent,
                            color: SURFACE,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '30px',
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                          },
                          children: card.monogram,
                        },
                      },
                      card.eyebrow && {
                        type: 'div',
                        props: {
                          style: { fontSize: '24px', color: INK_MUTED, letterSpacing: '0.02em' },
                          children: card.eyebrow,
                        },
                      },
                    ].filter(Boolean),
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '76px',
                      fontWeight: 600,
                      letterSpacing: '-0.035em',
                      lineHeight: 1.05,
                      color: INK_STRONG,
                    },
                    children: card.title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '30px',
                      lineHeight: 1.4,
                      color: INK_MUTED,
                      maxWidth: '860px',
                    },
                    children: card.subtitle,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: `1px solid ${RULE}`,
                paddingTop: '28px',
                fontSize: '24px',
                color: INK_MUTED,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: '24px' },
                    children: (card.facts ?? []).map((fact) => ({
                      type: 'div',
                      props: { style: { display: 'flex' }, children: fact },
                    })),
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', color: INK },
                    children: SITE.url.replace(/^https?:\/\//, ''),
                  },
                },
              ],
            },
          },
        ],
      },
  } as never;

  const svg = await satori(tree, { width: WIDTH, height: HEIGHT, fonts: cached });

  return sharp(Buffer.from(svg)).png().toBuffer();
}
