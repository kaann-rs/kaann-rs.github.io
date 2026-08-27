export const SITE = {
  url: 'https://kaanbora.dev',
  author: 'Kaan',
  email: 'kaandijivo@gmail.com',
  github: 'https://github.com/kaann-rs/kaann-rs.github.io',
};

export const LOCALES = /** @type {const} */ (['en', 'tr']);
export const DEFAULT_LOCALE = 'en';

/**
 * Theme list. To add a new theme:
 *   1. one line here,
 *   2. two blocks in global.css (light + dark).
 * Nothing else needs to be touched.
 */
export const THEMES = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'catppuccin', label: 'Catppuccin' },
  { id: 'gruvbox', label: 'Gruvbox' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'modern', label: 'Modern' },
  { id: 'shadcn', label: 'shadcn' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'vercel', label: 'Vercel' },
];

export const DEFAULT_THEME = 'minimal';

/** Code color themes. New theme = one shiki pair in astro.config + one rule in global.css. */
export const CODE_THEMES = [
  { id: 'vitesse', label: 'Vitesse' },
  { id: 'catppuccin', label: 'Catppuccin' },
  { id: 'gruvbox', label: 'Gruvbox' },
];

export const DEFAULT_CODE_THEME = 'vitesse';

/** Code fonts. 'jetbrains' has no rule — it falls back to the :root default. */
export const CODE_FONTS = [
  { id: 'jetbrains', label: 'JetBrains Mono' },
  { id: 'ibm', label: 'IBM Plex Mono' },
  { id: 'fira', label: 'Fira Code' },
  { id: 'system', label: 'System' },
];

export const DEFAULT_CODE_FONT = 'jetbrains';

/**
 * Comments — Giscus (GitHub Discussions).
 *
 * To enable:
 *   1. the repository must be public
 *   2. tick Settings > General > Features > Discussions
 *   3. install the github.com/apps/giscus app on the repository
 *   4. go to giscus.app, enter the repository, and it hands you repoId and categoryId
 *   5. fill in the fields below and set `enabled: true`
 *
 * Comments are posted with the reader's own GitHub account; no data is
 * stored on your server.
 */
export const GISCUS = {
  enabled: false,

  repo: 'kullanici/depo',
  repoId: '',
  category: 'Announcements',
  categoryId: '',

  /** How a post is matched to a discussion. 'pathname' is right for most blogs. */
  mapping: 'pathname',
  reactionsEnabled: '1',
  inputPosition: 'bottom',

  /**
   * Site mode -> giscus theme.
   * giscus ships other themes too (catppuccin_latte, catppuccin_mocha,
   * dark_dimmed, noborder_light ...) — swap them here.
   */
  themes: { light: 'light', dark: 'dark' },
};
