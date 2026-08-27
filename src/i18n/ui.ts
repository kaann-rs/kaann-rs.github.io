export const ui = {
  en: {
    'nav.posts': 'Posts',
    'nav.tags': 'Tags',
    'nav.about': 'About',
    'site.tagline': 'Notes on compilers, mathematics, languages and the books I read.',
    'post.toc': 'Contents',
    'post.sources': 'Sources',
    'post.comments': 'Comments',
    'post.updated': 'Updated',
    'post.readingTime': 'min read',
    'post.tags': 'Tagged',
    'post.translation': 'Türkçe',
    'posts.all': 'All posts',
    'posts.empty': 'Nothing here yet.',
    'tags.title': 'Tags',
    'tags.postsIn': 'Posts tagged',
    'theme.toggle': 'Toggle light/dark',
    'theme.select': 'Theme',
    'appearance': 'Appearance',
    'codeTheme': 'Code theme',
    'codeFont': 'Code font',
    'code.copy': 'Copy',
    'code.copied': 'Copied',
    'home.recent': 'Recent',
    'home.allPosts': 'All posts',
    'footer.source': 'Source',
  },
  tr: {
    'nav.posts': 'Yazılar',
    'nav.tags': 'Etiketler',
    'nav.about': 'Hakkımda',
    'site.tagline': 'Derleyiciler, matematik, diller ve okuduğum kitaplar üzerine notlar.',
    'post.toc': 'İçindekiler',
    'post.sources': 'Kaynaklar',
    'post.comments': 'Yorumlar',
    'post.updated': 'Güncellendi',
    'post.readingTime': 'dk okuma',
    'post.tags': 'Etiketler',
    'post.translation': 'English',
    'posts.all': 'Tüm yazılar',
    'posts.empty': 'Henüz bir şey yok.',
    'tags.title': 'Etiketler',
    'tags.postsIn': 'Etiket',
    'theme.toggle': 'Açık/koyu değiştir',
    'theme.select': 'Tema',
    'appearance': 'Görünüm',
    'codeTheme': 'Kod teması',
    'codeFont': 'Kod fontu',
    'code.copy': 'Kopyala',
    'code.copied': 'Kopyalandı',
    'home.recent': 'Son yazılar',
    'home.allPosts': 'Tüm yazılar',
    'footer.source': 'Kaynak kodu',
  },
} as const;

export type Lang = keyof typeof ui;
export type UIKey = keyof (typeof ui)['en'];

export function t(lang: Lang) {
  return (key: UIKey): string => ui[lang][key];
}

/** Root path per language: en -> "", tr -> "/tr" */
export function base(lang: Lang): string {
  return lang === 'en' ? '' : '/tr';
}

/** "en/hello-world" -> "hello-world" */
export function slugOf(id: string): string {
  return id.replace(/^(en|tr)\//, '');
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
