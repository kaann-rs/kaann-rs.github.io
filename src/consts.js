/**
 * Site-wide constants.
 *
 * This site is a blog: notes on the work rather than a catalogue of it.
 * Posts carry tags; tags are the only taxonomy.
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
 * Everything else in global.css is derived from it.
 */
export const BRAND = {
  light: '#d9480f',
  dark: '#ff5e1f',
};

/** How many posts the home page shows before linking to the full archive. */
export const HOME_POSTS = 8;

/** Words per minute used for the reading-time estimate on a post. */
export const WPM = 200;
