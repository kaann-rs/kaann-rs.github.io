import type { APIContext } from 'astro';

import { renderCard, type CardInput } from '../../lib/og';
import { getProjects, slugOf } from '../../lib/projects';
import { SITE } from '../../consts.js';
import { t, LOCALES_ALL, type Lang } from '../../i18n/ui';

/**
 * One social card per project per language, plus a card for the site itself.
 *
 *   /og/site.png            the home page and everything without its own card
 *   /og/<slug>.png          a project, English
 *   /og/tr/<slug>.png       the same project in Turkish
 */
export async function getStaticPaths() {
  const paths: { params: { card: string }; props: { card: CardInput } }[] = [];

  for (const lang of LOCALES_ALL) {
    const tr_ = t(lang);
    const prefix = lang === 'en' ? '' : 'tr/';

    if (lang === 'en') {
      paths.push({
        params: { card: 'site' },
        props: {
          card: {
            title: SITE.author,
            subtitle: tr_('site.tagline'),
            monogram: 'K',
            facts: [tr_('nav.projects'), tr_('nav.changelog')],
          },
        },
      });
    }

    for (const project of await getProjects(lang)) {
      const d = project.data;
      paths.push({
        params: { card: `${prefix}${slugOf(project.id)}` },
        props: {
          card: {
            title: d.name,
            subtitle: d.tagline,
            eyebrow: SITE.author,
            monogram: d.monogram,
            accent: d.accentDark ?? d.accent,
            facts: [tr_(`status.${d.status}`), ...d.stack.slice(0, 3)],
          },
        },
      });
    }
  }

  return paths;
}

export async function GET({ props }: APIContext) {
  const png = await renderCard((props as { card: CardInput }).card);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
