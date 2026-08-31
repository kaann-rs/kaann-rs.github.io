/**
 * Loads the markdown under src/content/ into Payload.
 *
 * Run once, after creating the first admin user:
 *
 *   npm run cms:import
 *
 * It is idempotent: a record that already exists is updated rather than
 * duplicated, so it can be re-run after editing the files. The markdown stays
 * on disk untouched — it remains the fallback content source, selected with
 * CONTENT_SOURCE=files.
 */
import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { getPayload } from 'payload';
import matter from 'gray-matter';

import config from './payload.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.resolve(dirname, '../src/content');
const LOCALES = ['en', 'tr'] as const;
type Locale = (typeof LOCALES)[number];

type Entry = { locale: Locale; parts: string[]; data: Record<string, any>; body: string };

/** Every markdown file under one collection folder, with its path split up. */
async function read(collection: string): Promise<Entry[]> {
  const root = path.join(CONTENT, collection);
  const out: Entry[] = [];

  const walk = async (dir: string, parts: string[]) => {
    let items;
    try {
      items = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const item of items) {
      if (item.name.startsWith('_') || item.name.startsWith('.')) continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) await walk(full, [...parts, item.name]);
      else if (item.name.endsWith('.md')) {
        const { data, content } = matter(await readFile(full, 'utf8'));
        const [locale, ...rest] = [...parts, item.name.replace(/\.md$/, '')];
        if (!LOCALES.includes(locale as Locale)) continue;
        out.push({ locale: locale as Locale, parts: rest, data, body: content.trim() });
      }
    }
  };

  await walk(root, []);
  return out;
}

/** Payload arrays of `{ value }` from a plain list. */
const list = (values: unknown) =>
  Array.isArray(values) ? values.map((value) => ({ value })) : undefined;

const iso = (value: unknown) => (value ? new Date(value as string).toISOString() : undefined);

async function main() {
  const payload = await getPayload({ config });
  const log = (what: string, n: number) => console.log(`  ${String(n).padStart(3)}  ${what}`);

  /* ---- projects: one record, both locales ------------------------------ */
  const projects = await read('projects');
  const projectId = new Map<string, string | number>();

  for (const locale of LOCALES) {
    for (const { parts, data, body } of projects.filter((p) => p.locale === locale)) {
      const slug = parts[0];
      const shared =
        locale === 'en'
          ? {
              slug,
              accent: data.accent,
              accentDark: data.accentDark,
              monogram: data.monogram,
              glyph: data.glyph,
              status: data.status ?? 'active',
              cover: data.cover,
              card: data.card,
              icon: data.icon,
              repo: data.repo,
              homepage: data.homepage,
              license: data.license,
              started: iso(data.started),
              order: data.order ?? 100,
              featured: Boolean(data.featured),
              draft: Boolean(data.draft),
              stack: list(data.stack),
              sections: list(data.sections),
            }
          : {};

      const localized = {
        name: data.name,
        tagline: data.tagline,
        description: data.description || undefined,
        body,
      };

      const existing = projectId.get(slug);
      if (existing) {
        await payload.update({ collection: 'projects', id: existing, locale, data: localized });
      } else {
        const created = await payload.create({
          collection: 'projects',
          locale,
          data: { ...shared, ...localized } as any,
        });
        projectId.set(slug, created.id);
      }
    }
  }
  log('projects', projectId.size);

  /* ---- everything that hangs off a project ----------------------------- */
  const byProject = (slug: string) => {
    const id = projectId.get(slug);
    if (!id) throw new Error(`no project "${slug}" — import projects first`);
    return id;
  };

  /** Creates on the first locale seen, updates on the second. */
  const upsert = async (
    collection: 'docs' | 'releases' | 'roadmaps' | 'benchmarks' | 'decisions' | 'pages',
    key: string,
    keys: Map<string, string | number>,
    locale: Locale,
    shared: Record<string, unknown>,
    localized: Record<string, unknown>
  ) => {
    const existing = keys.get(key);
    if (existing) {
      await payload.update({ collection, id: existing, locale, data: localized as any });
      return existing;
    }
    const created = await payload.create({
      collection,
      locale,
      data: { ...shared, ...localized } as any,
    });
    keys.set(key, created.id);
    return created.id;
  };

  /* docs: <project>/<section> */
  const docKeys = new Map<string, string | number>();
  for (const locale of LOCALES) {
    for (const { parts, data, body } of (await read('docs')).filter((d) => d.locale === locale)) {
      const [slug, section] = parts;
      await upsert(
        'docs',
        `${slug}/${section}`,
        docKeys,
        locale,
        {
          project: byProject(slug),
          section,
          glyph: data.glyph,
          order: data.order ?? 100,
          draft: Boolean(data.draft),
        },
        { title: data.title, description: data.description || undefined, body }
      );
    }
  }
  log('sections', docKeys.size);

  /* releases: <project>/<version> */
  const releaseKeys = new Map<string, string | number>();
  for (const locale of LOCALES) {
    for (const { parts, data, body } of (await read('releases')).filter((r) => r.locale === locale)) {
      const [slug] = parts;
      await upsert(
        'releases',
        `${slug}/${data.version}`,
        releaseKeys,
        locale,
        {
          project: byProject(slug),
          version: String(data.version),
          date: iso(data.date),
          kind: data.kind ?? 'minor',
          unreleased: Boolean(data.unreleased),
          draft: Boolean(data.draft),
        },
        { summary: data.summary, body }
      );
    }
  }
  log('releases', releaseKeys.size);

  /* roadmaps: <project> */
  const roadmapKeys = new Map<string, string | number>();
  for (const locale of LOCALES) {
    for (const { parts, data, body } of (await read('roadmaps')).filter((r) => r.locale === locale)) {
      const [slug] = parts;
      const milestones = (data.milestones ?? []).map((m: any) => ({
        title: m.title,
        status: m.status ?? 'planned',
        target: m.target,
        note: m.note,
        items: (m.items ?? []).map((i: any) => ({ text: i.text, done: Boolean(i.done) })),
      }));
      await upsert(
        'roadmaps',
        slug,
        roadmapKeys,
        locale,
        { project: byProject(slug), updated: iso(data.updated) },
        { milestones, body }
      );
    }
  }
  log('roadmaps', roadmapKeys.size);

  /* benchmarks: <project> */
  const benchKeys = new Map<string, string | number>();
  for (const locale of LOCALES) {
    for (const { parts, data, body } of (await read('benchmarks')).filter((b) => b.locale === locale)) {
      const [slug] = parts;
      const suites = (data.suites ?? []).map((s: any) => ({
        title: s.title,
        unit: s.unit,
        lowerIsBetter: s.lowerIsBetter !== false,
        note: s.note,
        results: (s.results ?? []).map((r: any) => ({
          label: r.label,
          value: r.value,
          mine: Boolean(r.mine),
          note: r.note,
        })),
      }));
      await upsert(
        'benchmarks',
        slug,
        benchKeys,
        locale,
        { project: byProject(slug), updated: iso(data.updated), draft: Boolean(data.draft) },
        {
          environment: {
            machine: data.environment?.machine,
            os: data.environment?.os,
            toolchain: data.environment?.toolchain,
            input: data.environment?.input,
            method: data.environment?.method,
          },
          suites,
          body,
        }
      );
    }
  }
  log('benchmarks', benchKeys.size);

  /* decisions: <project>/<nnn-name> */
  const decisionKeys = new Map<string, string | number>();
  for (const locale of LOCALES) {
    for (const { parts, data, body } of (await read('decisions')).filter((d) => d.locale === locale)) {
      const [slug] = parts;
      await upsert(
        'decisions',
        `${slug}/${data.number}`,
        decisionKeys,
        locale,
        {
          project: byProject(slug),
          number: data.number,
          date: iso(data.date),
          status: data.status ?? 'accepted',
          supersedes: list(data.supersedes),
          supersededBy: data.supersededBy,
          draft: Boolean(data.draft),
        },
        { title: data.title, tags: list(data.tags), body }
      );
    }
  }
  log('decisions', decisionKeys.size);

  /* pages: about */
  const pageKeys = new Map<string, string | number>();
  for (const locale of LOCALES) {
    for (const { parts, data, body } of (await read('pages')).filter((p) => p.locale === locale)) {
      const [slug] = parts;
      await upsert(
        'pages',
        slug,
        pageKeys,
        locale,
        { slug },
        { title: data.title, description: data.description || undefined, body }
      );
    }
  }
  log('pages', pageKeys.size);

  console.log('\n  done — the markdown on disk was not touched.\n');
  process.exit(0);
}

await main();
