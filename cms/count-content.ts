import { getPayload } from 'payload';
import config from './payload.config';

const payload = await getPayload({ config });
for (const c of ['projects', 'docs', 'releases', 'roadmaps', 'benchmarks', 'decisions', 'pages', 'users'] as const) {
  const { totalDocs } = await payload.count({ collection: c });
  console.log(`${String(totalDocs).padStart(4)}  ${c}`);
}
process.exit(0);
