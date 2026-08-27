import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { getPosts, slugOf } from '../lib/posts';
import { SITE } from '../consts.js';
import { ui } from '../i18n/ui';

export async function GET(context: APIContext) {
  const posts = await getPosts('en');
  return rss({
    title: SITE.author,
    description: ui.en['site.tagline'],
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      categories: p.data.tags,
      link: `/posts/${slugOf(p.id)}/`,
    })),
  });
}
