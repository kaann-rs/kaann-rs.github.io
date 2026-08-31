import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { getActivity, slugOf } from './projects';
import { SITE } from '../consts.js';
import { base, t, type Lang } from '../i18n/ui';

/**
 * One feed per language carrying every project's releases. Following the site
 * means following the work, not the writing — so this is the only feed there is.
 */
export async function changelogFeed(lang: Lang, context: APIContext) {
  const tr_ = t(lang);
  const b = base(lang);
  const items = await getActivity(lang, 50);

  return rss({
    title: `${SITE.author} — ${tr_('changelog.title')}`,
    description: tr_('changelog.allLede'),
    site: context.site ?? SITE.url,
    customData: `<language>${lang === 'tr' ? 'tr-TR' : 'en-GB'}</language>`,
    items: items.map(({ release, project }) => {
      const slug = slugOf(project.id);
      const version = release.data.unreleased ? tr_('changelog.unreleased') : release.data.version;
      return {
        title: `${project.data.name} ${version}`,
        description: release.data.summary,
        pubDate: release.data.date,
        link: `${b}/projects/${slug}/changelog/#v${release.data.version}`,
        categories: [project.data.name],
      };
    }),
  });
}
