/**
 * Site-wide constants.
 *
 * This site is a project showcase, not a blog: the work speaks, and each
 * project keeps its own overview, changelog and roadmap.
 */

export const SITE = {
  url: 'https://kaanbora.dev',
  author: 'Kaan',
  email: 'kaandijivo@gmail.com',
  /** GitHub profile. */
  github: 'https://github.com/kaann-rs',
  /** This site's own repository. */
  repo: 'https://github.com/kaann-rs/kaann-rs.github.io',
};

export const LOCALES = /** @type {const} */ (['en', 'tr']);
export const DEFAULT_LOCALE = 'en';

/**
 * The house colour. One signature accent, light and dark — no theme picker.
 * A project may override it per page with its own accent (see the `accent`
 * field in the projects collection); this is the fallback everything else uses.
 */
export const BRAND = {
  light: '#d9480f',
  dark: '#ff5e1f',
};

/**
 * Project lifecycle states. The id is what goes in a project's frontmatter;
 * the label comes from i18n (`status.<id>`), the colour from global.css.
 */
export const STATUSES = /** @type {const} */ ([
  'active',
  'stable',
  'maintenance',
  'experiment',
  'archived',
]);

/** Release kinds — decides the shape of the badge on a changelog entry. */
export const RELEASE_KINDS = /** @type {const} */ (['major', 'minor', 'patch', 'prerelease']);

/** Roadmap milestone states. */
export const MILESTONE_STATES = /** @type {const} */ (['shipped', 'building', 'planned', 'exploring']);
