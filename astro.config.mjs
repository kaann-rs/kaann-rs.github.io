// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import {
  transformerNotationHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationWordHighlight,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers';

import rehypeTableWrap from './src/lib/rehype-table-wrap.mjs';
import remarkCodeBlocks from './src/lib/remark-code-blocks.mjs';
import remarkContainers from './src/lib/remark-containers.mjs';
import { transformerMeta } from './src/lib/shiki-meta.mjs';
import { KATEX_MACROS } from './src/lib/katex-macros.mjs';
import { SITE } from './src/consts.js';

export default defineConfig({
  site: SITE.url,

  integrations: [
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', tr: 'tr' } } }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: { prefixDefaultLocale: false },
  },

  markdown: {
    // Order matters:
    //   directive -> containers   (resolves ::: blocks)
    //   codeBlocks               (wraps code fences)
    // All of them must run BEFORE Astro's Shiki step.
    remarkPlugins: [remarkDirective, remarkContainers, remarkCodeBlocks, remarkMath],

    rehypePlugins: [
      // Astro runs its own id injector AFTER user plugins;
      // we call it explicitly first so autolink can see the ids.
      rehypeHeadingIds,
      [rehypeKatex, { macros: KATEX_MACROS, throwOnError: false, strict: 'ignore' }],
      rehypeTableWrap,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'], ariaHidden: 'true', tabIndex: -1 },
          content: { type: 'text', value: '#' },
        },
      ],
    ],

    shikiConfig: {
      // Three theme pairs are embedded; CSS decides which one shows.
      // defaultColor:false -> shiki inlines no color, everything is a variable.
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
        'cat-light': 'catppuccin-latte',
        'cat-dark': 'catppuccin-mocha',
        'gruv-light': 'gruvbox-light-medium',
        'gruv-dark': 'gruvbox-dark-medium',
      },
      defaultColor: false,
      transformers: [
        transformerMeta(),
        transformerMetaHighlight(),         // ```rust {2,5-7}
        transformerMetaWordHighlight(),     // ```rust /Node/
        transformerNotationHighlight(),     // // [!code highlight]
        transformerNotationDiff(),          // // [!code ++] / [!code --]
        transformerNotationFocus(),         // // [!code focus]
        transformerNotationWordHighlight(), // // [!code word:Node]
        transformerNotationErrorLevel(),    // // [!code error] / [!code warning]
      ],
      wrap: false,
    },
  },

  build: { format: 'directory' },
});
