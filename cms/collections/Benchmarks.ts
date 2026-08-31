import type { CollectionConfig } from 'payload';

import { bodyField, draftField, projectField, sourcesField } from '../fields/shared';

/**
 * Measured comparisons. The environment is required for the same reason it is
 * required in the file schema: a number without the machine, the flags and the
 * input it came from is a claim, not a measurement.
 */
export const Benchmarks: CollectionConfig = {
  slug: 'benchmarks',
  labels: { singular: 'Benchmark', plural: 'Benchmarks' },
  admin: { useAsTitle: 'id', defaultColumns: ['project', 'updated'], group: 'Content' },
  fields: [
    projectField,
    { name: 'updated', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'environment',
      type: 'group',
      fields: [
        { name: 'machine', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'os', type: 'text', admin: { width: '50%' } },
            { name: 'toolchain', type: 'text', localized: true, admin: { width: '50%' } },
          ],
        },
        { name: 'input', type: 'text', localized: true },
        {
          name: 'method',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'Runs, warm-up, and what is reported — median, p99, mean.' },
        },
      ],
    },
    {
      name: 'suites',
      type: 'array',
      localized: true,
      labels: { singular: 'Suite', plural: 'Suites' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'unit', type: 'text', required: true, admin: { width: '50%', description: 'ms, MB, ops/s' } },
            {
              name: 'lowerIsBetter',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%', description: 'Off for throughput.' },
            },
          ],
        },
        { name: 'note', type: 'text' },
        {
          name: 'results',
          type: 'array',
          minRows: 2,
          labels: { singular: 'Result', plural: 'Results' },
          admin: { description: 'At least two — a benchmark against nothing is a number.' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'value', type: 'number', required: true, admin: { width: '25%' } },
                { name: 'mine', type: 'checkbox', defaultValue: false, admin: { width: '25%', description: 'This project' } },
              ],
            },
            { name: 'note', type: 'text' },
          ],
        },
      ],
    },
    bodyField('What the numbers mean'),
    sourcesField,
    draftField,
  ],
};
