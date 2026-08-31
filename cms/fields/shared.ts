import type { Field } from 'payload';

/**
 * Fields shared across collections.
 *
 * The body is markdown, not rich text: the site's pipeline runs remark and
 * rehype over it — KaTeX, Shiki with its fence metadata, mermaid, and the
 * `:::tree` / `:::note` directives. A WYSIWYG editor would rewrite all of that
 * into something the build no longer understands.
 */

export const projectField: Field = {
  name: 'project',
  type: 'relationship',
  relationTo: 'projects',
  required: true,
  index: true,
  admin: { position: 'sidebar' },
};

export const bodyField = (label = 'Body'): Field => ({
  name: 'body',
  type: 'code',
  localized: true,
  label,
  admin: {
    language: 'markdown',
    description: 'Markdown. Directives, code fence options and $math$ all work as on the site.',
  },
});

export const draftField: Field = {
  name: 'draft',
  type: 'checkbox',
  defaultValue: false,
  admin: { position: 'sidebar', description: 'Visible while developing, absent from the build.' },
};

export const sourcesField: Field = {
  name: 'sources',
  type: 'array',
  labels: { singular: 'Source', plural: 'Sources' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'author', type: 'text' },
    { name: 'url', type: 'text' },
    { name: 'detail', type: 'text', admin: { description: 'Year, pages, chapter — free text.' } },
  ],
};
