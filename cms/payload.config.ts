import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';

import { Projects } from './collections/Projects';
import { Docs } from './collections/Docs';
import { Releases } from './collections/Releases';
import { Roadmaps } from './collections/Roadmaps';
import { Benchmarks } from './collections/Benchmarks';
import { Decisions } from './collections/Decisions';
import { Pages } from './collections/Pages';
import { LOCALES, DEFAULT_LOCALE, SITE } from '../src/consts.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload runs as a local editor, not as a deployed service.
 *
 * The site itself stays static: `npm run cms` opens the admin against a SQLite
 * file in this repository, and `npm run build` reads the same file through
 * Payload's local API and writes plain HTML. Nothing here is deployed, and the
 * published site never talks to a database.
 */
export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ` · ${SITE.author}`,
    },
  },

  collections: [
    Projects,
    Docs,
    Releases,
    Roadmaps,
    Benchmarks,
    Decisions,
    Pages,
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email', group: 'System' },
      fields: [],
    },
  ],

  /** One record per project, two languages inside it. */
  localization: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    fallback: false,
  },

  /* Lexical is required by the config even though every body field is markdown. */
  editor: lexicalEditor(),

  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI ?? `file:${path.resolve(dirname, 'content.db')}` },
  }),

  secret: process.env.PAYLOAD_SECRET ?? 'local-only-not-a-deployed-service',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  telemetry: false,
  sharp: undefined,
});
