import type { CollectionConfig } from 'payload';

import { bodyField, draftField, projectField } from '../fields/shared';
import { RELEASE_KINDS } from '../../src/consts.js';

/** One changelog entry. */
export const Releases: CollectionConfig = {
  slug: 'releases',
  labels: { singular: 'Release', plural: 'Releases' },
  admin: {
    useAsTitle: 'version',
    defaultColumns: ['version', 'project', 'date', 'kind', 'unreleased'],
    group: 'Content',
  },
  defaultSort: '-date',
  fields: [
    projectField,
    {
      type: 'row',
      fields: [
        { name: 'version', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'date', type: 'date', required: true, admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } } },
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'minor',
          options: [...RELEASE_KINDS],
          admin: { width: '34%' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'One line. This is what the feed and the RSS item show.' },
    },
    {
      name: 'unreleased',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Pinned to the top and labelled "Unreleased".' },
    },
    bodyField('Notes'),
    draftField,
  ],
};
