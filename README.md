# kaanbora.dev

A blog. Notes on systems, compilers and whatever else gets taken apart, in
English and Turkish.

Astro, Markdown, static output. No database, no comments, no analytics.

```bash
npm install
npm run dev                                        # http://localhost:4321
npm run build                                      # static output into dist/

npm run new -- en "Intermediate representations" --tags compilers,rust
npm run new -- tr "Ara temsiller" --key ir-notes   # the translation
```

Content lives in `src/content/`; the folder path carries the language, so
nothing has to be repeated in frontmatter:

```
posts/<lang>/<slug>.md     a post; the filename is its URL
pages/<lang>/about.md      the About page
```

English and Turkish posts keep their own slugs. `translationKey`, identical in
both files, is what links them — that is what the language switch follows.

Tags are the only taxonomy, and most of them carry a pixel mark from the brand
kit. Search is built with the site (Pagefind), and social cards are drawn at
build time from each post's own title.

Syntax reference: `src/content/_templates/`.
Everything else: [docs/WRITING.md](docs/WRITING.md).

## License

MIT — see [LICENSE](LICENSE).
