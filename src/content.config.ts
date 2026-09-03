import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content layout — the folder path carries the language, so nothing has to be
 * repeated in frontmatter beyond what a reader would see:
 *
 *   posts/<lang>/<slug>.md   -> a post
 *   pages/<lang>/<slug>.md   -> a standalone page such as About
 *
 * A post's EN and TR versions are linked by `translationKey`, not by slug:
 * a Turkish post is allowed its own Turkish URL.
 */

/** A source a post draws on. Book, article, video, lecture — anything. */
const source = z.object({
  title: z.string(),
  author: z.string().optional(),
  url: z.string().url().optional(),
  /** Publication year, page range, chapter — free text. */
  detail: z.string().optional(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    lang: z.enum(['en', 'tr']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),

    /** Links the EN and TR versions. Must be identical in both files. */
    translationKey: z.string().optional(),

    /** Leads the home page and gets the wider card. */
    featured: z.boolean().default(false),

    /** Set to false to turn the table of contents off for this post. */
    toc: z.boolean().default(true),

    /**
     * Cover image, served from public/ — e.g. `/assets/some-post.png`.
     * A plain string rather than an Astro image import so a post can point at
     * anything already in public/ without a second build step.
     */
    cover: z.string().optional(),

    /** Social card to advertise; without it one is drawn at build time. */
    ogImage: z.string().optional(),

    sources: z.array(source).default([]),
  }),
});

/** Standalone pages such as About. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['en', 'tr']),
    sources: z.array(source).default([]),
  }),
});

export const collections = { posts, pages };
