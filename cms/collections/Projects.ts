import type { CollectionConfig } from 'payload';

import { bodyField, draftField, sourcesField } from '../fields/shared';
import { STATUSES } from '../../src/consts.js';

/** A project. `slug` is the URL and the key every other collection points at. */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'featured', 'order'],
    group: 'Content',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'URL and folder name. Lowercase, no spaces.' },
    },
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'One line, on the card and under the name.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Meta description. Falls back to the tagline.' },
    },

    {
      type: 'collapsible',
      label: 'Identity',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'accent', type: 'text', required: true, admin: { width: '50%', description: 'Light mode, #rrggbb. Needs 4.5:1 on pale.' } },
            { name: 'accentDark', type: 'text', admin: { width: '50%', description: 'Dark mode. The lighter of the two.' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'monogram', type: 'text', required: true, maxLength: 3, admin: { width: '33%' } },
            { name: 'glyph', type: 'text', admin: { width: '33%', description: 'Name from src/lib/icons.mjs. Beats the monogram.' } },
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'active',
              options: [...STATUSES],
              admin: { width: '34%' },
            },
          ],
        },
        { name: 'cover', type: 'text', admin: { description: 'Path relative to the project file, e.g. ../../_assets/x-cover.svg' } },
        { name: 'card', type: 'text', admin: { description: 'Index card art. Falls back to the cover.' } },
        { name: 'icon', type: 'text', admin: { description: 'Square image. Beats the glyph.' } },
      ],
    },

    {
      type: 'collapsible',
      label: 'Facts',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'repo', type: 'text', admin: { width: '50%' } },
            { name: 'homepage', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'license', type: 'text', admin: { width: '50%' } },
            { name: 'started', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
          ],
        },
        {
          name: 'stack',
          type: 'array',
          fields: [{ name: 'value', type: 'text', required: true }],
          admin: { description: 'Names the icon set knows get a mark: Go, Docker, PostgreSQL…' },
        },
      ],
    },

    {
      name: 'sections',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
      admin: {
        description:
          'Pins the order and hides anything left out. Empty means "every section that has content".',
      },
    },

    bodyField('Overview'),
    sourcesField,

    {
      type: 'row',
      fields: [
        { name: 'order', type: 'number', defaultValue: 100, admin: { width: '50%' } },
        { name: 'featured', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
      ],
    },
    draftField,
  ],
};
