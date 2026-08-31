import { getCollection, type CollectionEntry } from 'astro:content';
import { base, t, type Lang, type UIKey } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;
export type Doc = CollectionEntry<'docs'>;
export type Release = CollectionEntry<'releases'>;
export type Roadmap = CollectionEntry<'roadmaps'>;
export type Benchmark = CollectionEntry<'benchmarks'>;
export type Decision = CollectionEntry<'decisions'>;

/** Drafts are visible while developing and vanish from the build. */
const published = (e: { data: { draft?: boolean } }) => import.meta.env.DEV || !e.data.draft;

/** `en/voparser` -> `voparser`; `en/voparser/0.2.0` -> `voparser`. */
export function slugOf(id: string): string {
  return id.split('/')[1] ?? '';
}

/** `en/voparser/architecture` -> `architecture`. */
export function sectionOf(id: string): string {
  return id.split('/')[2] ?? '';
}

/* ---------------------------------------------------------------- projects */

/** Published projects in one language: featured first, then `order`, then name. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection('projects', (p) => p.data.lang === lang && published(p));
  return all.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      a.data.order - b.data.order ||
      a.data.name.localeCompare(b.data.name)
  );
}

export async function getProject(lang: Lang, slug: string): Promise<Project | undefined> {
  const all = await getProjects(lang);
  return all.find((p) => slugOf(p.id) === slug);
}

/** Does the same project exist in the other language? Used by the switcher. */
export async function hasTranslation(lang: Lang, slug: string): Promise<boolean> {
  const other: Lang = lang === 'en' ? 'tr' : 'en';
  return (await getProject(other, slug)) !== undefined;
}

/* ---------------------------------------------------------------- releases */

/**
 * Releases, newest first. Unreleased entries always sit on top — they are the
 * work in flight, and that is what a reader checking on a project wants first.
 */
export async function getReleases(lang: Lang, slug?: string): Promise<Release[]> {
  const all = await getCollection(
    'releases',
    (r) => r.data.lang === lang && published(r) && (slug === undefined || slugOf(r.id) === slug)
  );
  return all.sort(
    (a, b) =>
      Number(b.data.unreleased) - Number(a.data.unreleased) ||
      b.data.date.valueOf() - a.data.date.valueOf()
  );
}

/** The newest shipped release of a project, if it has one. */
export async function latestRelease(lang: Lang, slug: string): Promise<Release | undefined> {
  const releases = await getReleases(lang, slug);
  return releases.find((r) => !r.data.unreleased);
}

export type Activity = { release: Release; project: Project };

/**
 * Every project's releases in one stream — the site's pulse. Entries whose
 * project is missing or unpublished are dropped, so a draft cannot leak.
 */
export async function getActivity(lang: Lang, limit?: number): Promise<Activity[]> {
  const projects = await getProjects(lang);
  const bySlug = new Map(projects.map((p) => [slugOf(p.id), p]));

  const feed = (await getReleases(lang))
    .map((release) => ({ release, project: bySlug.get(slugOf(release.id)) }))
    .filter((a): a is Activity => a.project !== undefined);

  return limit ? feed.slice(0, limit) : feed;
}

/* ---------------------------------------------------------------- roadmaps */

export async function getRoadmap(lang: Lang, slug: string): Promise<Roadmap | undefined> {
  const all = await getCollection(
    'roadmaps',
    (r) => r.data.lang === lang && slugOf(r.id) === slug
  );
  return all[0];
}

/** Checklist progress across a roadmap: how many items are ticked off. */
export function roadmapProgress(roadmap: Roadmap): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const m of roadmap.data.milestones) {
    for (const item of m.items) {
      total += 1;
      if (item.done) done += 1;
    }
  }
  return { done, total };
}

/* -------------------------------------------------------------- benchmarks */

export async function getBenchmark(lang: Lang, slug: string): Promise<Benchmark | undefined> {
  const all = await getCollection(
    'benchmarks',
    (b) => b.data.lang === lang && slugOf(b.id) === slug && published(b)
  );
  return all[0];
}

/* --------------------------------------------------------------- decisions */

/** Decision records, newest first — the log reads top-down like a changelog. */
export async function getDecisions(lang: Lang, slug: string): Promise<Decision[]> {
  const all = await getCollection(
    'decisions',
    (d) => d.data.lang === lang && slugOf(d.id) === slug && published(d)
  );
  return all.sort((a, b) => b.data.number - a.data.number);
}

/* -------------------------------------------------------------------- docs */

/** Long-form sections of one project, in their declared order. */
export async function getDocs(lang: Lang, slug: string): Promise<Doc[]> {
  const all = await getCollection(
    'docs',
    (d) => d.data.lang === lang && slugOf(d.id) === slug && published(d)
  );
  return all.sort(
    (a, b) => a.data.order - b.data.order || sectionOf(a.id).localeCompare(sectionOf(b.id))
  );
}

export async function getDoc(lang: Lang, slug: string, section: string): Promise<Doc | undefined> {
  const docs = await getDocs(lang, slug);
  return docs.find((d) => sectionOf(d.id) === section);
}

/* -------------------------------------------------------------- navigation */

/** The sections a project can show. `doc` covers everything file-backed. */
export type SectionKind =
  | 'overview'
  | 'changelog'
  | 'releases'
  | 'roadmap'
  | 'benchmarks'
  | 'decisions'
  | 'doc';

export type Section = {
  id: string;
  kind: SectionKind;
  label: string;
  href: string;
  /** Name in the shared icon set; empty when the section has no mark. */
  icon: string;
};

/** Sections that are generated rather than written as a markdown file. */
const GENERATED: Record<string, SectionKind> = {
  changelog: 'changelog',
  releases: 'releases',
  roadmap: 'roadmap',
  benchmarks: 'benchmarks',
  decisions: 'decisions',
};

/** Built-in ids get a translated label; anything else uses the doc's own title. */
const LABEL_KEYS: Record<string, UIKey> = {
  overview: 'section.overview',
  readme: 'section.readme',
  changelog: 'section.changelog',
  releases: 'section.releases',
  roadmap: 'section.roadmap',
  benchmarks: 'section.benchmarks',
  decisions: 'section.decisions',
  learned: 'section.learned',
  architecture: 'section.architecture',
  structure: 'section.structure',
  state: 'section.state',
};

/** Built-in ids also get a mark; a custom section names its own with `glyph`. */
const SECTION_ICONS: Record<string, string> = {
  overview: 'overview',
  readme: 'readme',
  changelog: 'changelog',
  releases: 'releases',
  roadmap: 'roadmap',
  benchmarks: 'zap',
  decisions: 'target',
  learned: 'learned',
  architecture: 'architecture',
  structure: 'structure',
  state: 'state',
};

/** The order used when a project does not pin one with `sections`. */
const NATURAL_ORDER = [
  'readme',
  'changelog',
  'roadmap',
  'decisions',
  'benchmarks',
  'learned',
  'architecture',
  'structure',
  'state',
];

/**
 * Everything a project's tab bar needs, in one pass.
 *
 * A project may pin its sections — `sections: [readme, changelog]` — and that
 * list decides both order and visibility. Without it, every section that has
 * content is shown, in a sensible default order. Either way a section with
 * nothing behind it is dropped: an empty tab is a dead end.
 */
export async function projectNav(lang: Lang, slug: string) {
  const [project, docs, releases, roadmap, benchmark, decisions] = await Promise.all([
    getProject(lang, slug),
    getDocs(lang, slug),
    getReleases(lang, slug),
    getRoadmap(lang, slug),
    getBenchmark(lang, slug),
    getDecisions(lang, slug),
  ]);

  const tr_ = t(lang);
  const root = `${base(lang)}/projects/${slug}/`;
  const docBySection = new Map(docs.map((d) => [sectionOf(d.id), d]));

  const available = (id: string): boolean => {
    if (id === 'overview') return true;
    if (id === 'changelog' || id === 'releases') return releases.length > 0;
    if (id === 'roadmap') return (roadmap?.data.milestones.length ?? 0) > 0;
    if (id === 'benchmarks') return (benchmark?.data.suites.length ?? 0) > 0;
    if (id === 'decisions') return decisions.length > 0;
    return docBySection.has(id);
  };

  const labelOf = (id: string): string => {
    const doc = docBySection.get(id);
    if (doc?.data.title) return doc.data.title;
    const key = LABEL_KEYS[id];
    return key ? tr_(key) : id;
  };

  const iconOf = (id: string): string =>
    docBySection.get(id)?.data.glyph ?? SECTION_ICONS[id] ?? '';

  const pinned = project?.data.sections;
  const ids = pinned
    ? pinned.filter(available)
    : [
        ...NATURAL_ORDER.filter(available),
        ...docs.map((d) => sectionOf(d.id)).filter((id) => !NATURAL_ORDER.includes(id)),
      ];

  const sections: Section[] = [
    {
      id: 'overview',
      kind: 'overview',
      label: labelOf('overview'),
      href: root,
      icon: iconOf('overview'),
    },
    ...ids
      .filter((id) => id !== 'overview')
      .map((id) => ({
        id,
        kind: GENERATED[id] ?? ('doc' as SectionKind),
        label: labelOf(id),
        href: `${root}${id}/`,
        icon: iconOf(id),
      })),
  ];

  return { project, docs, releases, roadmap, benchmark, decisions, sections };
}

/* ------------------------------------------------------------ page helpers */

/** Build the static paths for every documentation section of every project. */
export async function docPaths(lang: Lang) {
  const projects = await getProjects(lang);
  const paths: { params: { slug: string; section: string }; props: { project: Project; doc: Doc } }[] =
    [];

  for (const project of projects) {
    const slug = slugOf(project.id);
    const { sections, docs } = await projectNav(lang, slug);
    const visible = new Set(sections.filter((s) => s.kind === 'doc').map((s) => s.id));

    for (const doc of docs) {
      const section = sectionOf(doc.id);
      if (!visible.has(section)) continue;
      paths.push({ params: { slug, section }, props: { project, doc } });
    }
  }

  return paths;
}

/**
 * Static paths for one generated section — changelog, releases or roadmap —
 * covering only the projects whose tab bar actually offers it. A route that no
 * tab points at would be an empty page nobody can reach on purpose.
 */
export async function sectionPaths(
  lang: Lang,
  section: 'changelog' | 'releases' | 'roadmap' | 'benchmarks' | 'decisions'
) {
  const projects = await getProjects(lang);
  const paths: { params: { slug: string }; props: { project: Project } }[] = [];

  for (const project of projects) {
    const slug = slugOf(project.id);
    const { sections } = await projectNav(lang, slug);
    if (sections.some((s) => s.id === section)) paths.push({ params: { slug }, props: { project } });
  }

  return paths;
}

/** Build the static paths for every project page in one language. */
export async function projectPaths(lang: Lang) {
  const projects = await getProjects(lang);
  return projects.map((project) => ({
    params: { slug: slugOf(project.id) },
    props: { project },
  }));
}
