import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    /** Set to false to turn the table of contents off for this post. */
    toc: z.boolean().default(true),
    /** Set to false to turn comments off on this post. */
    comments: z.boolean().default(true),
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
