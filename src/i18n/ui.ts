export const ui = {
  en: {
    'nav.posts': 'Posts',
    'nav.tags': 'Tags',
    'nav.about': 'About',
    'nav.language': 'Türkçe',

    'site.tagline': 'Notes from books and from whatever I am learning — short pieces, and sometimes long ones.',
    'home.title': 'My Notes',
    'home.lede':
      'Notes from books and from whatever I am learning — short pieces, and sometimes long ones.',
    'home.featured': 'Featured',
    'home.recent': 'Recent',
    'home.earlier': 'Earlier',
    'home.allPosts': 'All posts',
    'home.browseTags': 'Browse by tag',
    'home.statPosts': 'Posts',
    'home.statTags': 'Tags',
    'home.statLatest': 'Last written',
    'home.statNone': 'nothing yet',

    'posts.all': 'All posts',
    'posts.lede': 'Everything published here, newest first.',
    'posts.empty': 'Nothing here yet.',
    'posts.count': 'posts',

    'post.toc': 'Contents',
    'post.sources': 'Sources',
    'post.updated': 'Updated',
    'post.readingTime': 'min read',
    'post.tags': 'Tagged',
    'post.related': 'Read next',
    'post.older': 'Older',
    'post.newer': 'Newer',
    'post.backToPosts': 'All posts',

    'tags.title': 'Tags',
    'tags.lede': 'Every subject written about here, most written first.',
    'tags.postsIn': 'Tagged',
    'tags.empty': 'No tags yet.',
    'tags.all': 'All tags',
    'tags.count': 'posts',
    'tags.countOne': 'post',

    'feed.subscribe': 'Follow by RSS',

    'search.open': 'Search',
    'search.title': 'Search the site',
    'search.placeholder': 'Posts, tags, anything…',
    'search.hint': 'Type to search every post.',
    'search.none': 'Nothing matched.',
    'search.dev': 'The index is built with the site — run npm run build to search.',
    'search.close': 'Close',

    'code.copy': 'Copy',
    'code.copied': 'Copied',

    'footer.source': 'Source',
    'footer.github': 'GitHub',
    'footer.email': 'Email',
    'a11y.skip': 'Skip to content',
    'a11y.nav': 'Main navigation',
    'a11y.postNav': 'Post navigation',
  },

  tr: {
    'nav.posts': 'Yazılar',
    'nav.tags': 'Etiketler',
    'nav.about': 'Hakkımda',
    'nav.language': 'English',

    'site.tagline': 'Kitaplardan ve öğrendiklerimden notlar, kısa yazılar, bazen uzun yazılar.',
    'home.title': 'Notlarım',
    'home.lede':
      'Kitaplardan ve öğrendiklerimden notlar, kısa yazılar, bazen uzun yazılar paylaşıyorum.',
    'home.featured': 'Öne çıkan',
    'home.recent': 'Son yazılar',
    'home.earlier': 'Daha önce',
    'home.allPosts': 'Tüm yazılar',
    'home.browseTags': 'Etikete göre gez',
    'home.statPosts': 'Yazı',
    'home.statTags': 'Etiket',
    'home.statLatest': 'Son yazılan',
    'home.statNone': 'henüz yok',

    'posts.all': 'Tüm yazılar',
    'posts.lede': 'Burada yayımlanan her şey, en yeniden başlayarak.',
    'posts.empty': 'Henüz bir şey yok.',
    'posts.count': 'yazı',

    'post.toc': 'İçindekiler',
    'post.sources': 'Kaynaklar',
    'post.updated': 'Güncellendi',
    'post.readingTime': 'dk okuma',
    'post.tags': 'Etiketler',
    'post.related': 'Sırada',
    'post.older': 'Önceki',
    'post.newer': 'Sonraki',
    'post.backToPosts': 'Tüm yazılar',

    'tags.title': 'Etiketler',
    'tags.lede': 'Burada yazılan bütün konular, en çok yazılandan başlayarak.',
    'tags.postsIn': 'Etiket',
    'tags.empty': 'Henüz etiket yok.',
    'tags.all': 'Tüm etiketler',
    'tags.count': 'yazı',
    'tags.countOne': 'yazı',

    'feed.subscribe': 'RSS ile takip et',

    'search.open': 'Ara',
    'search.title': 'Sitede ara',
    'search.placeholder': 'Yazı, etiket, her şey…',
    'search.hint': 'Bütün yazılarda aramak için yaz.',
    'search.none': 'Eşleşen bir şey yok.',
    'search.dev': 'Dizin siteyle birlikte üretiliyor — aramak için npm run build çalıştır.',
    'search.close': 'Kapat',

    'code.copy': 'Kopyala',
    'code.copied': 'Kopyalandı',

    'footer.source': 'Kaynak kodu',
    'footer.github': 'GitHub',
    'footer.email': 'E-posta',
    'a11y.skip': 'İçeriğe atla',
    'a11y.nav': 'Ana gezinme',
    'a11y.postNav': 'Yazılar arası gezinme',
  },
} as const;

export type Lang = keyof typeof ui;

/** Every language the site is built in, in menu order. */
export const LOCALES_ALL = ['en', 'tr'] as const satisfies readonly Lang[];
export type UIKey = keyof (typeof ui)['en'];

export function t(lang: Lang) {
  return (key: UIKey): string => ui[lang][key];
}

/** Root path per language: en -> "", tr -> "/tr" */
export function base(lang: Lang): string {
  return lang === 'en' ? '' : '/tr';
}

/** "en/hello-world" -> "hello-world" */
export function stripLang(id: string): string {
  return id.replace(/^(en|tr)\//, '');
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** Compact form for dense lists: "20 Aug 2026" / "20 Ağu 2026". */
export function formatDateShort(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
