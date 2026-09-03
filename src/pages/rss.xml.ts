import type { APIRoute } from 'astro';
import { postsFeed } from '../lib/feed';

export const GET: APIRoute = ({ site }) => postsFeed('en', site);
