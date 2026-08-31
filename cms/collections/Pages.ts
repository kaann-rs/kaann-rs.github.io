import type { CollectionConfig } from 'payload';

import { bodyField, sourcesField } from '../fields/shared';

/** Standalone pages such as About. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug'], group: 'Content' },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    bodyField(),
    sourcesField,
  ],
};
