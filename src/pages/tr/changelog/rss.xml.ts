import type { APIContext } from 'astro';
import { changelogFeed } from '../../../lib/feed';

export const GET = (context: APIContext) => changelogFeed('tr', context);
