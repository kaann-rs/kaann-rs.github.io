import type { APIContext } from 'astro';

import { renderCard, type CardInput } from '../../lib/og';
import { getPosts, slugOf, readingTime } from '../../lib/posts';
import { SITE } from '../../consts.js';
import { t, formatDateShort, LOCALES_ALL, type Lang } from '../../i18n/ui';

/**
 * One social card per post per language, plus a card for the site itself.
 *
 *   /og/site.png                the home page and everything without its own
 *   /og/posts/<slug>.png        a post, English
 *   /og/tr/posts/<slug>.png     a post, Turkish
 */
export async function getStaticPaths() {
  const paths: { params: { card: string }; props: { card: CardInput } }[] = [];

  for (const lang of LOCALES_ALL as readonly Lang[]) {
    const tr_ = t(lang);
    const prefix = lang === 'en' ? '' : 'tr/';

    if (lang === 'en') {
      paths.push({
        params: { card: 'site' },
        props: {
          card: {
            title: SITE.author,
            subtitle: tr_('site.tagline'),
            facts: [tr_('nav.posts'), tr_('nav.tags')],
          },
        },
      });
    }

    for (const post of await getPosts(lang)) {
      const d = post.data;
      paths.push({
        params: { card: `${prefix}posts/${slugOf(post.id)}` },
        props: {
          card: {
            title: d.title,
            subtitle: d.description,
            facts: [
              formatDateShort(d.date, lang),
              `${readingTime(post.body ?? '')} ${tr_('post.readingTime')}`,
              ...d.tags.slice(0, 2),
            ],
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
