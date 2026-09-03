# Vault guide

This vault is the site's `src/content/` folder. Files here **are** the site —
editing a note edits the published page.

```
posts/<lang>/<slug>.md     a post; the filename is its URL
pages/<lang>/about.md      the About page
_assets/                   images a post points at
_templates/                skeletons + syntax reference
```

`<lang>` is `en` or `tr`. Folders starting with `_` are ignored by the build.

English and Turkish posts keep their own slugs — a Turkish post gets a Turkish
URL. What links the two is `translationKey`, identical in both files.

## Don't hand-write frontmatter

From the repository root:

```bash
npm run new -- en "Intermediate representations" --tags compilers,rust
npm run new -- tr "Ara temsiller" --key ir-notes --tags compilers,rust
```

Or in Obsidian, from `_templates/`: **Post (EN)** and **Yazi (TR)**.

Required: `title`, `description`, `date`, `lang`. Everything else has a
default — see `_templates/Ref — frontmatter.md`.

## Tags are the only taxonomy

Lowercase, hyphenated, and reused rather than invented: every distinct tag
becomes its own page, so three spellings of one subject make three near-empty
pages.

Most tags carry a pixel mark from the brand kit — `rust`, `python`, `go`,
`docker`, `database`, `security`, `performance`, `shell`, `philosophy` and
about thirty more. Anything unmapped gets the document mark. The table lives
in `src/lib/pixel-icons.mjs`.

## Drafts

`draft: true` keeps a post out of the build. It still shows in `npm run dev`,
so you can read it in place before publishing.

## Writing

Markdown, plus the extras the site adds: callout boxes, trees, numbered
figures, KaTeX maths and annotated code blocks. All of it is in
`_templates/Ref — *.md`, with live examples you can copy.

## Publishing

Git sidebar → stage → commit → push. Live in about a minute.
Or in the terminal: `git add -A && git commit -m "..." && git push`.
