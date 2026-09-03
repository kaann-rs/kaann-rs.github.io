import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

import { SITE } from '../consts.js';

/**
 * Social preview cards, drawn at build time.
 *
 * Satori only understands flexbox and a subset of CSS, so this is deliberately
 * plain: the frame rules, the house mark, the title and one line. Fonts are
 * read from disk rather than fetched, so a build with no network produces the
 * same image.
 */

const WIDTH = 1200;
const HEIGHT = 630;

/* The dark surface, always — a social card has no reader preference to follow. */
const SURFACE = '#0e0d16';
const INK = '#e6e4f2';
const INK_STRONG = '#fbfbfe';
const INK_MUTED = '#8f8ba8';
const RULE = 'rgba(230, 228, 242, 0.14)';
const ACCENT = '#818cf8';

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
  /** Large line: the post's title, or the author's on the site card. */
  title: string;
  /** One line under it. */
  subtitle: string;
  /** Short label above the mark, e.g. the site name. */
  eyebrow?: string;
  /** Small facts along the bottom — date, tags, reading time. */
  facts?: string[];
};

/* The frame sits outside the text column, the way the site's side rules sit
   outside `--pad` — content that touches its own rule reads as a crop. */
const FRAME = 40;

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

/**
 * The house cloud, composed from two circles and a rounded bar. Satori has no
 * SVG path support worth relying on, but it does have border-radius — which is
 * all this mark actually needs.
 */
const mark = () => ({
  type: 'div',
  props: {
    style: { position: 'relative', width: '78px', height: '54px', display: 'flex' },
    children: [
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            left: '12px',
            top: '0px',
            width: '34px',
            height: '34px',
            borderRadius: '17px',
            background: '#6366f1',
          },
        },
      },
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            left: '30px',
            top: '10px',
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            background: '#4f46e5',
          },
        },
      },
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            left: '4px',
            top: '27px',
            width: '68px',
            height: '26px',
            borderRadius: '13px',
            background: '#4f46e5',
          },
        },
      },
    ],
  },
});

export async function renderCard(card: CardInput): Promise<Buffer> {
  cached ??= await loadFonts();

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
        rule(FRAME),
        rule(WIDTH - FRAME),
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '28px' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '22px' },
                  children: [
                    mark(),
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', fontSize: '26px', fontWeight: 600 },
                        children: [
                          {
                            type: 'span',
                            props: { style: { color: INK_STRONG }, children: 'kaan' },
                          },
                          {
                            type: 'span',
                            props: { style: { color: ACCENT }, children: '/blog' },
                          },
                        ],
                      },
                    },
                    card.eyebrow && {
                      type: 'div',
                      props: {
                        style: { fontSize: '24px', color: INK_MUTED },
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
                    fontSize: '72px',
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
                    maxWidth: '880px',
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
