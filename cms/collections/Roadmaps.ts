import type { CollectionConfig } from 'payload';

import { bodyField, projectField } from '../fields/shared';
import { MILESTONE_STATES } from '../../src/consts.js';

/** Milestones and the checklist that decides when each is done. */
export const Roadmaps: CollectionConfig = {
  slug: 'roadmaps',
  labels: { singular: 'Roadmap', plural: 'Roadmaps' },
  admin: { useAsTitle: 'id', defaultColumns: ['project', 'updated'], group: 'Content' },
  fields: [
    projectField,
    { name: 'updated', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'milestones',
      type: 'array',
      localized: true,
      labels: { singular: 'Milestone', plural: 'Milestones' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'planned',
              options: [...MILESTONE_STATES],
              admin: { width: '50%' },
            },
            {
              name: 'target',
              type: 'text',
              admin: { width: '50%', description: 'Free text: "2026 Q4", "after 1.0".' },
            },
          ],
        },
        { name: 'note', type: 'textarea' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'done', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    bodyField('Note above the milestones'),
  ],
};
