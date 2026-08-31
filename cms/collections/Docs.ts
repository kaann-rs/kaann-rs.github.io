import type { CollectionConfig } from 'payload';

import { bodyField, draftField, projectField, sourcesField } from '../fields/shared';

/** Long-form sections: readme, architecture, structure, state, learned, or your own. */
export const Docs: CollectionConfig = {
  slug: 'docs',
  labels: { singular: 'Section', plural: 'Sections' },
  admin: {
    useAsTitle: 'section',
    defaultColumns: ['section', 'project', 'order'],
    group: 'Content',
  },
  fields: [
    projectField,
    {
      name: 'section',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'readme · architecture · structure · state · learned — or any id of your own.',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Only needed for an id the translations do not cover.' },
    },
    { name: 'glyph', type: 'text', admin: { description: 'Tab mark. Built-in ids already have one.' } },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
    bodyField(),
    sourcesField,
    draftField,
  ],
};
