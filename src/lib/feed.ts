import rss from '@astrojs/rss';
import { SITE } from '../consts.js';
import { getPosts, slugOf } from './posts';
import { t, base, type Lang } from '../i18n/ui';

/**
 * One feed per language. A reader following the Turkish feed gets Turkish
 * posts and nothing else — the site has no fallback between languages, and
 * the feed should not invent one.
 */
export async function postsFeed(lang: Lang, site: URL | undefined) {
  const tr_ = t(lang);
  const b = base(lang);
  const posts = await getPosts(lang);

  return rss({
    title: `${SITE.author} — ${tr_('posts.all')}`,
    description: tr_('site.tagline'),
    site: site ?? SITE.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${b}/posts/${slugOf(post.id)}/`,
      categories: post.data.tags,
    })),
    customData: `<language>${lang === 'tr' ? 'tr-TR' : 'en-GB'}</language>`,
  });
}
