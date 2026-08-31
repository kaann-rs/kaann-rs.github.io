import { withPayload } from '@payloadcms/next/withPayload';

/**
 * Next exists here for one reason: it hosts Payload's admin interface while
 * editing. It is never built for production and never deployed — `npm run
 * build` is Astro, and the published site is static HTML.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  // Next writes its own AGENTS.md / CLAUDE.md otherwise; this repo has its own.
  agentRules: false,
};

export default withPayload(nextConfig);
