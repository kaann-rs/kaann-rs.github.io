import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { STATUSES, RELEASE_KINDS, MILESTONE_STATES } from './consts.js';
/**
 * Where content comes from.
 *
 *   files  markdown under src/content/ — the default, and what git tracks
 *   cms    the Payload database at cms/content.db, edited with `npm run cms`
 *
 * Set CONTENT_SOURCE=cms to build from the CMS. Both paths produce identical
 * entries — same ids, same fields — so nothing downstream knows the difference.
 *
 * The import is dynamic on purpose: a default build must not need Payload,
 * Next or React installed at all. CI checks out and builds from files.
 */
const FROM_CMS = process.env.CONTENT_SOURCE === 'cms';

const cms = FROM_CMS ? await import('./lib/payload-source') : null;

/** Picks the loader without repeating the schema. */
const from = <T>(files: T, load: (source: NonNullable<typeof cms>) => T): T =>
  cms ? load(cms) : files;

/**
 * Content layout — the folder path carries the identity, so nothing has to be
 * repeated in frontmatter:
 *
 *   projects/<lang>/<slug>.md             -> the project's overview page
 *   docs/<lang>/<slug>/<section>.md       -> one extra section (readme,
 *                                            architecture, structure, state…)
 *   releases/<lang>/<slug>/<version>.md   -> one changelog entry
 *   roadmaps/<lang>/<slug>.md             -> the project's roadmap
 *   benchmarks/<lang>/<slug>.md           -> measured comparisons
 *   decisions/<lang>/<slug>/<nnn>-x.md    -> one decision record
 *
 * A project's EN and TR files share the same <slug>; that is what links them.
 */

/**
 * Keep the id equal to the path minus the extension. The default generator
 * slugifies each segment, which would turn a version like `0.2.0` into
 * `0-2-0`; the paths here are already URL-safe, so pass them through.
 */
const idFromPath = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

/** A source a page draws on. Book, article, specification — anything. */
const source = z.object({
  title: z.string(),
  author: z.string().optional(),
  url: z.string().url().optional(),
  detail: z.string().optional(),
});

const hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'accent must be a six-digit hex colour, e.g. #3b6ea5');

const projects = defineCollection({
  loader: from(glob({ pattern: '**/*.md', base: './src/content/projects', generateId: idFromPath }), (c) => c.payloadProjects()),
  schema: z.object({
    /** Display name. The URL slug comes from the filename. */
    name: z.string(),
    /** One line, shown on the card and under the project's name. */
    tagline: z.string(),
    /** Longer line for <meta name="description">. Falls back to the tagline. */
    description: z.string().optional(),
    lang: z.enum(['en', 'tr']),

    status: z.enum(STATUSES).default('active'),

    /**
     * The project's own colour. Every project page is painted with it, which
     * is what gives each project its own identity inside one house style.
     * `accentDark` is the dark-mode variant — needs to be lighter.
     */
    accent: hex,
    accentDark: hex.optional(),
    /** One to three characters for the project mark — the fallback when there is no icon. */
    monogram: z.string().min(1).max(3),

    /**
     * The project's mark, in order of precedence: `icon` (an image file),
     * then `glyph` (a name from the shared icon set — see src/lib/icons.mjs),
     * then the monogram. All three are drawn on the project's own colour.
     */
    glyph: z.string().optional(),

    /**
     * Artwork. All optional: a project with none of it still looks finished,
     * because the mark and the accent already give it an identity.
     *
     *   icon   square image, replaces glyph and monogram wherever they appear
     *   cover  wide image across the top of every page of the project
     *   card   what the project index shows; falls back to `cover`
     *
     * Paths are served from public/, e.g. `/assets/elconv-cover.svg`. They are
     * plain strings rather than Astro image imports so that the same field can
     * come from a markdown file or from the CMS database.
     */
    icon: z.string().optional(),
    cover: z.string().optional(),
    card: z.string().optional(),

    /**
     * Which sections this project shows, in this order. Leaving it out means
     * "everything that has content": the docs files that exist, plus changelog
     * and roadmap when there is something in them.
     *
     * Built-in ids: readme · changelog · releases · roadmap · architecture ·
     * structure · state. Any other id works too — it just needs a matching
     * file at docs/<lang>/<slug>/<id>.md.
     */
    sections: z.array(z.string()).optional(),

    repo: z.string().url().optional(),
    homepage: z.string().url().optional(),
    license: z.string().optional(),
    /** Languages, runtimes, notable dependencies — shown as small chips. */
    stack: z.array(z.string()).default([]),

    started: z.coerce.date().optional(),
    /** Ascending. Lower numbers come first on the index; ties fall back to name. */
    order: z.number().default(100),
    /** Featured projects lead the home page. */
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),

    sources: z.array(source).default([]),
  }),
});

const releases = defineCollection({
  loader: from(glob({ pattern: '**/*.md', base: './src/content/releases', generateId: idFromPath }), (c) => c.payloadReleases()),
  schema: z.object({
    /** Authoritative version string; the filename only keeps entries apart. */
    version: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'tr']),
    kind: z.enum(RELEASE_KINDS).default('minor'),
    /** One line. This is what the activity feed and the RSS item show. */
    summary: z.string(),
    /** Marks an entry that is still open — rendered as "Unreleased". */
    unreleased: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const milestoneItem = z.object({
  text: z.string(),
  done: z.boolean().default(false),
});

const roadmaps = defineCollection({
  loader: from(glob({ pattern: '**/*.md', base: './src/content/roadmaps', generateId: idFromPath }), (c) => c.payloadRoadmaps()),
  schema: z.object({
    lang: z.enum(['en', 'tr']),
    updated: z.coerce.date().optional(),
    milestones: z
      .array(
        z.object({
          title: z.string(),
          status: z.enum(MILESTONE_STATES).default('planned'),
          /** Free text: "2026 Q4", "after 1.0", "no date yet". */
          target: z.string().optional(),
          note: z.string().optional(),
          items: z.array(milestoneItem).default([]),
        })
      )
      .default([]),
  }),
});

/**
 * Long-form sections of a project: readme, architecture, folder structure,
 * state — and anything else worth its own page. The filename is the section id.
 */
const docs = defineCollection({
  loader: from(glob({ pattern: '**/*.md', base: './src/content/docs', generateId: idFromPath }), (c) => c.payloadDocs()),
  schema: z.object({
    lang: z.enum(['en', 'tr']),
    /** Overrides the built-in section label in the tab bar. Required for a custom id. */
    title: z.string().optional(),
    /** Mark for the tab, from the shared icon set. Built-in sections have one already. */
    glyph: z.string().optional(),
    /** Shown under the heading on the section's own page. */
    description: z.string().optional(),
    /** Only used when the project does not pin the order with `sections`. */
    order: z.number().default(100),
    draft: z.boolean().default(false),
    sources: z.array(source).default([]),
  }),
});

/**
 * Measured comparisons. The environment is required, not optional: a number
 * without the machine, the flags and the input it came from is a claim, not a
 * measurement.
 */
const benchmarks = defineCollection({
  loader: from(glob({ pattern: '**/*.md', base: './src/content/benchmarks', generateId: idFromPath }), (c) => c.payloadBenchmarks()),
  schema: z.object({
    lang: z.enum(['en', 'tr']),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),

    environment: z.object({
      machine: z.string(),
      os: z.string().optional(),
      toolchain: z.string().optional(),
      /** Runs, warm-up, what is being reported — median, p99, mean. */
      method: z.string(),
      input: z.string().optional(),
    }),

    suites: z
      .array(
        z.object({
          title: z.string(),
          /** ms, MB, ops/s — printed after every value. */
          unit: z.string(),
          /** Latency and memory: lower wins. Throughput: higher wins. */
          lowerIsBetter: z.boolean().default(true),
          note: z.string().optional(),
          results: z
            .array(
              z.object({
                label: z.string(),
                value: z.number(),
                /** Marks your own implementation so it reads apart from the field. */
                mine: z.boolean().default(false),
                note: z.string().optional(),
              })
            )
            .min(2, 'a benchmark needs something to compare against'),
        })
      )
      .default([]),

    sources: z.array(source).default([]),
  }),
});

/**
 * Decision records. One file per decision, numbered, never rewritten: a
 * decision that no longer holds is marked superseded and stays where it is.
 */
const decisions = defineCollection({
  loader: from(glob({ pattern: '**/*.md', base: './src/content/decisions', generateId: idFromPath }), (c) => c.payloadDecisions()),
  schema: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'tr']),
    status: z.enum(['proposed', 'accepted', 'superseded', 'reverted']).default('accepted'),
    /** Numbers of the decisions this one replaces, and the one that replaced it. */
    supersedes: z.array(z.number().int().positive()).default([]),
    supersededBy: z.number().int().positive().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    sources: z.array(source).default([]),
  }),
});

/** Standalone pages such as About. */
const pages = defineCollection({
  loader: from(glob({ pattern: '**/*.md', base: './src/content/pages', generateId: idFromPath }), (c) => c.payloadPages()),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['en', 'tr']),
    sources: z.array(source).default([]),
  }),
});

export const collections = { projects, docs, releases, roadmaps, benchmarks, decisions, pages };
