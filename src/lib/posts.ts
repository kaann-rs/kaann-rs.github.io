import { getCollection, type CollectionEntry } from 'astro:content';
import { WPM } from '../consts.js';
import { stripLang, type Lang } from '../i18n/ui';

export type Post = CollectionEntry<'posts'>;

/** Drafts are visible while developing and nowhere else. */
const isPublished = (p: Post) => import.meta.env.DEV || !p.data.draft;

/** Published posts in one language, newest first. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection('posts', (p) => p.data.lang === lang && isPublished(p));
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Posts grouped by year, newest year first, newest post first inside each. */
export async function getPostsByYear(lang: Lang): Promise<{ year: number; posts: Post[] }[]> {
  const posts = await getPosts(lang);
  const years = new Map<number, Post[]>();
  for (const p of posts) {
    const y = p.data.date.getFullYear();
    years.set(y, [...(years.get(y) ?? []), p]);
  }
  return [...years.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }));
}

/** Tag -> post count, most frequent first, ties alphabetical. */
export async function getTags(lang: Lang): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts(lang);
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const tag of p.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Every post carrying one tag, newest first. */
export async function getPostsByTag(lang: Lang, tag: string): Promise<Post[]> {
  const posts = await getPosts(lang);
  return posts.filter((p) => p.data.tags.includes(tag));
}

/** The post's counterpart in the other language — matched on translationKey. */
export async function getTranslation(post: Post): Promise<Post | undefined> {
  const key = post.data.translationKey;
  if (!key) return undefined;
  const other: Lang = post.data.lang === 'en' ? 'tr' : 'en';
  const candidates = await getCollection(
    'posts',
    (p) => p.data.lang === other && p.data.translationKey === key && isPublished(p)
  );
  return candidates[0];
}

/** The previous and next post in chronological order. */
export async function getNeighbours(post: Post) {
  const posts = await getPosts(post.data.lang);
  const i = posts.findIndex((p) => p.id === post.id);
  return {
    newer: i > 0 ? posts[i - 1] : undefined,
    older: i >= 0 && i < posts.length - 1 ? posts[i + 1] : undefined,
  };
}

/**
 * Posts that share a tag with this one, most tags in common first. Used as the
 * "read next" rail, so the post itself is never in the result.
 */
export async function getRelated(post: Post, limit = 3): Promise<Post[]> {
  if (post.data.tags.length === 0) return [];
  const posts = await getPosts(post.data.lang);
  const tags = new Set(post.data.tags);

  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ post: p, shared: p.data.tags.filter((t) => tags.has(t)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || b.post.data.date.valueOf() - a.post.data.date.valueOf())
    .slice(0, limit)
    .map(({ post }) => post);
}

/** Rough reading time. No CJK involved, so a word count is enough. */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}

/** "en/hello-world" -> "hello-world" */
export const slugOf = stripLang;
