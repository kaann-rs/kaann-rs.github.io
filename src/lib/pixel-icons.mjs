/**
 * The personal brand icon set — pixel art, drawn on a 16px grid.
 *
 * These are the marks from the blog's brand kit: fixed-colour SVGs in one
 * indigo ramp, deliberately not `currentColor`. They are the decorative voice
 * of the site, used where a subject needs a face — tags, mostly. Anything
 * structural (chevrons, rules, UI affordances) uses the line set in icons.mjs.
 */

/* Eager + ?raw: the files are inlined at build time, so a tag mark costs no
   request and the sprite never falls out of sync with the folder. The glob
   result has no declared type, so the cast is what tells the rest of the file
   these are strings. */
const files = /** @type {Record<string, string>} */ (
  import.meta.glob('../assets/brand/icons/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  })
);

/** @type {Record<string, string>} name -> raw svg markup, keyed by filename. */
export const PIXEL_ICONS = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [
    path.split('/').pop().replace(/\.svg$/, ''),
    svg,
  ])
);

/**
 * Tag -> mark. The kit is named in Turkish; a blog tag may be either language
 * or a technology name, so the aliases carry both. An unmatched tag simply has
 * no pixel mark and falls back to the line set.
 */
const ALIASES = {
  anahtar: ['key', 'auth', 'crypto', 'kriptografi', 'cryptography', 'ssh'],
  api: ['rest', 'graphql', 'grpc', 'http', 'openapi'],
  arama: ['search', 'index', 'pagefind', 'arama-motoru'],
  bulut: ['cloud', 'aws', 'vercel', 'railway', 'hosting', 'deploy', 'deployment'],
  cip: ['chip', 'cpu', 'hardware', 'donanim', 'donanım', 'embedded', 'gomulu', 'gömülü', 'assembly',
        'mathematics', 'matematik', 'math', 'geometry', 'geometri', 'logic', 'mantik', 'mantık'],
  donusum: ['conversion', 'transform', 'compiler', 'derleyici', 'parser', 'ayristirici', 'ayrıştırıcı', 'transpiler', 'codegen'],
  dumen: ['helm', 'kubernetes', 'k8s', 'orchestration', 'orkestrasyon',
          'religion', 'din', 'inanc', 'inanç', 'theology', 'ilahiyat', 'ethics', 'etik'],
  'fil-php': ['php', 'laravel', 'wordpress', 'symfony'],
  git: ['version-control', 'surum-kontrol', 'sürüm-kontrol', 'github', 'vcs'],
  'gopher-go': ['go', 'golang'],
  icerik: ['content', 'writing', 'yazi', 'yazı', 'blog', 'markdown', 'notes', 'notlar', 'kitaplar', 'books', 'essay', 'deneme', 'inceleme', 'review'],
  kalkan: ['shield', 'security', 'guvenlik', 'güvenlik', 'defense'],
  kilit: ['lock', 'privacy', 'gizlilik', 'encryption', 'sifreleme', 'şifreleme', 'concurrency', 'esszamanlilik', 'eşzamanlılık', 'mutex'],
  konteyner: ['container', 'docker', 'podman', 'oci'],
  kova: ['bucket', 'storage', 'depolama', 's3', 'object-storage'],
  kullanici: ['user', 'account', 'hesap', 'identity', 'kimlik'],
  kure: ['globe', 'sphere', 'web', 'network', 'ag', 'ağ', 'dns', 'internet', 'i18n', 'diller', 'languages',
         'philosophy', 'felsefe', 'dusunce', 'düşünce', 'metaphysics', 'metafizik', 'ontology'],
  musteri: ['customer', 'client', 'istemci', 'crm'],
  nabiz: ['pulse', 'monitoring', 'izleme', 'observability', 'metrics', 'metrikler', 'benchmark', 'olcum', 'ölçüm', 'profiling'],
  saat: ['clock', 'time', 'zaman', 'cron', 'scheduling', 'zamanlama', 'latency', 'gecikme'],
  simsek: ['lightning', 'zap', 'performance', 'performans', 'speed', 'hiz', 'hız', 'optimization', 'optimizasyon'],
  sunucu: ['server', 'backend', 'sysadmin', 'infrastructure', 'altyapi', 'altyapı', 'ops', 'devops', 'linux'],
  terminal: ['shell', 'cli', 'bash', 'zsh', 'console', 'komut-satiri', 'komut-satırı', 'tooling'],
  veritabani: ['database', 'db', 'sql', 'postgres', 'postgresql', 'sqlite', 'mysql', 'mariadb', 'redis'],
  'yengec-rust': ['rust', 'ferris', 'cargo'],
  'yilan-python': ['python', 'py', 'pip'],
  zarf: ['mail', 'email', 'eposta', 'e-posta', 'smtp', 'newsletter', 'bulten', 'bülten'],
};

/** alias -> icon name, built once. */
const INDEX = new Map();
for (const [icon, aliases] of Object.entries(ALIASES)) {
  INDEX.set(icon, icon);
  for (const alias of aliases) INDEX.set(alias, icon);
}

/** Loose match: case and separators do not matter. @param {string} tag */
const normalise = (tag) => tag.toLowerCase().trim().replace(/[\s_]+/g, '-');

/**
 * What an unmapped subject gets. The document mark is the one claim that is
 * true of every tag on a blog, so it reads as a default rather than as a
 * wrong guess — which is what a randomly assigned mark would look like.
 */
const FALLBACK = 'icerik';

/**
 * The pixel mark for a tag. Falls back to the document mark, so every subject
 * on the site has a face. Returns the raw SVG so the caller can inline it.
 *
 * @param {string} tag
 * @returns {string | undefined}
 */
export function pixelIcon(tag) {
  const name = INDEX.get(normalise(tag)) ?? FALLBACK;
  return PIXEL_ICONS[name];
}

/** Whether the set has a real, named mark for this tag — not the fallback. */
export const hasPixelIcon = (tag) => INDEX.has(normalise(tag));

/** Every mark the set holds, for a reference sheet. @returns {string[]} */
export const iconNames = () => Object.keys(PIXEL_ICONS).sort();
