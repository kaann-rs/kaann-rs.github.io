import type { Loader, LoaderContext } from 'astro/loaders';
import { getPayload } from 'payload';

import config from '../../cms/payload.config';
import { LOCALES } from '../consts.js';
import type { Lang } from '../i18n/ui';

/**
 * Content loaders that read from Payload instead of from markdown files.
 *
 * They exist so the same site can be built either way: the schemas, the
 * components and the routes are untouched, because every loader hands Astro
 * exactly the shape the file-based collections already produce — the same ids
 * (`<lang>/<slug>`), the same fields, the same rendered markdown.
 *
 * Selected with CONTENT_SOURCE=cms; see src/content.config.ts.
 */

/** Payload stores repeatable scalars as `{ value }` rows. */
const flat = <T,>(rows: { value: T }[] | null | undefined): T[] =>
  (rows ?? []).map((row) => row.value);

const day = (value: unknown): string | undefined =>
  value ? new Date(value as string).toISOString().slice(0, 10) : undefined;

/** The related project's slug, whatever depth Payload returned it at. */
const projectSlug = (project: unknown): string =>
  typeof project === 'object' && project !== null && 'slug' in project
    ? String((project as { slug: unknown }).slug)
    : String(project);

type Row = Record<string, any>;

/**
 * One pass per language over one Payload collection.
 *
 * `id` builds the entry id from a record, and `data` its frontmatter; the
 * markdown body is rendered through Astro's own pipeline, so directives,
 * fence metadata and maths behave exactly as they do from a file.
 */
function loader(
  name: string,
  collection: string,
  build: (row: Row, lang: Lang) => { id: string; data: Row } | null,
  options: { depth?: number; sort?: string } = {}
): Loader {
  return {
    name: `payload-${name}`,
    async load({ store, parseData, renderMarkdown, logger }: LoaderContext) {
      const payload = await getPayload({ config });
      store.clear();

      let count = 0;
      for (const lang of LOCALES) {
        const { docs } = await payload.find({
          collection: collection as never,
          locale: lang,
          fallbackLocale: false,
          depth: options.depth ?? 1,
          limit: 1000,
          sort: options.sort,
          overrideAccess: true,
        });

        for (const row of docs as Row[]) {
          const built = build(row, lang);
          /* A record with nothing written in this language is not published in
             it — the same rule the file layout enforces by a file's absence. */
          if (!built) continue;

          const data = await parseData({ id: built.id, data: built.data });
          const body = typeof row.body === 'string' ? row.body : '';
          store.set({
            id: built.id,
            data,
            body,
            rendered: await renderMarkdown(body),
          });
          count++;
        }
      }

      logger.info(`${count} ${collection} from the CMS`);
    },
  };
}

export const payloadProjects = () =>
  loader('projects', 'projects', (row, lang) => {
    if (!row.name || !row.tagline) return null;
    return {
      id: `${lang}/${row.slug}`,
      data: {
        name: row.name,
        tagline: row.tagline,
        description: row.description ?? undefined,
        lang,
        status: row.status ?? 'active',
        accent: row.accent,
        accentDark: row.accentDark ?? undefined,
        monogram: row.monogram,
        glyph: row.glyph ?? undefined,
        icon: row.icon ?? undefined,
        cover: row.cover ?? undefined,
        card: row.card ?? undefined,
        sections: row.sections?.length ? flat(row.sections) : undefined,
        repo: row.repo ?? undefined,
        homepage: row.homepage ?? undefined,
        license: row.license ?? undefined,
        stack: flat(row.stack),
        started: day(row.started),
        order: row.order ?? 100,
        featured: Boolean(row.featured),
        draft: Boolean(row.draft),
        sources: row.sources ?? [],
      },
    };
  }, { depth: 0, sort: 'order' });

export const payloadDocs = () =>
  loader('docs', 'docs', (row, lang) => {
    const slug = projectSlug(row.project);
    if (!row.body) return null;
    return {
      id: `${lang}/${slug}/${row.section}`,
      data: {
        lang,
        title: row.title ?? undefined,
        glyph: row.glyph ?? undefined,
        description: row.description ?? undefined,
        order: row.order ?? 100,
        draft: Boolean(row.draft),
        sources: row.sources ?? [],
      },
    };
  }, { sort: 'order' });

export const payloadReleases = () =>
  loader('releases', 'releases', (row, lang) => {
    const slug = projectSlug(row.project);
    if (!row.summary) return null;
    return {
      id: `${lang}/${slug}/${row.version}`,
      data: {
        version: String(row.version),
        date: day(row.date),
        lang,
        kind: row.kind ?? 'minor',
        summary: row.summary,
        unreleased: Boolean(row.unreleased),
        draft: Boolean(row.draft),
      },
    };
  }, { sort: '-date' });

export const payloadRoadmaps = () =>
  loader('roadmaps', 'roadmaps', (row, lang) => {
    const slug = projectSlug(row.project);
    const milestones = (row.milestones ?? [])
      .filter((m: Row) => m.title)
      .map((m: Row) => ({
        title: m.title,
        status: m.status ?? 'planned',
        target: m.target ?? undefined,
        note: m.note ?? undefined,
        items: (m.items ?? [])
          .filter((i: Row) => i.text)
          .map((i: Row) => ({ text: i.text, done: Boolean(i.done) })),
      }));
    if (!milestones.length) return null;
    return {
      id: `${lang}/${slug}`,
      data: { lang, updated: day(row.updated), milestones },
    };
  });

export const payloadBenchmarks = () =>
  loader('benchmarks', 'benchmarks', (row, lang) => {
    const slug = projectSlug(row.project);
    const env = row.environment ?? {};
    if (!env.machine || !env.method) return null;
    return {
      id: `${lang}/${slug}`,
      data: {
        lang,
        updated: day(row.updated),
        draft: Boolean(row.draft),
        environment: {
          machine: env.machine,
          os: env.os ?? undefined,
          toolchain: env.toolchain ?? undefined,
          input: env.input ?? undefined,
          method: env.method,
        },
        suites: (row.suites ?? []).map((s: Row) => ({
          title: s.title,
          unit: s.unit,
          lowerIsBetter: s.lowerIsBetter !== false,
          note: s.note ?? undefined,
          results: (s.results ?? []).map((r: Row) => ({
            label: r.label,
            value: r.value,
            mine: Boolean(r.mine),
            note: r.note ?? undefined,
          })),
        })),
        sources: row.sources ?? [],
      },
    };
  });

export const payloadDecisions = () =>
  loader('decisions', 'decisions', (row, lang) => {
    const slug = projectSlug(row.project);
    if (!row.title) return null;
    const number = String(row.number).padStart(3, '0');
    return {
      id: `${lang}/${slug}/${number}`,
      data: {
        number: row.number,
        title: row.title,
        date: day(row.date),
        lang,
        status: row.status ?? 'accepted',
        supersedes: flat(row.supersedes),
        supersededBy: row.supersededBy ?? undefined,
        tags: flat(row.tags),
        draft: Boolean(row.draft),
        sources: row.sources ?? [],
      },
    };
  }, { sort: '-number' });

export const payloadPages = () =>
  loader('pages', 'pages', (row, lang) => {
    if (!row.title) return null;
    return {
      id: `${lang}/${row.slug}`,
      data: {
        title: row.title,
        description: row.description ?? '',
        lang,
        sources: row.sources ?? [],
      },
    };
  }, { depth: 0 });
