import type { CollectionConfig } from 'payload';

import { bodyField, draftField, projectField, sourcesField } from '../fields/shared';

/** Numbered decision records. Never rewritten — superseded, and linked. */
export const Decisions: CollectionConfig = {
  slug: 'decisions',
  labels: { singular: 'Decision', plural: 'Decisions' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'project', 'status', 'date'],
    group: 'Content',
  },
  defaultSort: '-number',
  fields: [
    projectField,
    {
      type: 'row',
      fields: [
        { name: 'number', type: 'number', required: true, min: 1, admin: { width: '25%' } },
        { name: 'date', type: 'date', required: true, admin: { width: '35%', date: { pickerAppearance: 'dayOnly' } } },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'accepted',
          options: ['proposed', 'accepted', 'superseded', 'reverted'],
          admin: { width: '40%' },
        },
      ],
    },
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'supersedes',
          type: 'array',
          fields: [{ name: 'value', type: 'number', required: true, min: 1 }],
          admin: { width: '50%', description: 'Numbers this record replaces.' },
        },
        {
          name: 'supersededBy',
          type: 'number',
          min: 1,
          admin: { width: '50%', description: 'The number that replaced this one.' },
        },
      ],
    },
    { name: 'tags', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    bodyField('Context · Options · Decision · Consequences'),
    sourcesField,
    draftField,
  ],
};
