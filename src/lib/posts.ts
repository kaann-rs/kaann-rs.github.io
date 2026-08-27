import { getCollection, type CollectionEntry } from 'astro:content';
import { slugOf, type Lang } from '../i18n/ui';

export type Post = CollectionEntry<'posts'>;

const isPublished = (p: Post) => import.meta.env.DEV || !p.data.draft;

/** Published posts in one language, newest first. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection('posts', (p) => p.data.lang === lang && isPublished(p));
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Tag -> post count, most frequent first. */
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

/** Rough reading time. No CJK involved, so a word count is enough. */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export { slugOf };
