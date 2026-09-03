# Frontmatter

Two collections, two shapes. A missing or mistyped field **fails the build** —
errors surface before deploy, not in the browser.

## Post — `posts/<lang>/<slug>.md`

The filename is the URL slug. Turkish and English posts each keep their own
slug; `translationKey` is what links them.

```yaml
---
title: "Intermediate representations"
description: "One sentence. Shown on the card, in search and in the social card."
date: 2026-09-03
updated: 2026-09-10          # optional; shown next to the date
lang: en                     # en | tr

tags: [compilers, rust]      # lowercase, no spaces — each becomes a page
translationKey: ir-notes     # identical in both languages; links them

featured: false              # true -> leads the home page
draft: true                  # true -> visible in npm run dev only
toc: true                    # false -> no table of contents on this post

cover: /assets/ir.png        # optional, wide; sits above the body
ogImage: /assets/ir-card.png # optional; one is drawn at build time otherwise

sources: []
---
```

Only `title`, `description`, `date` and `lang` are required. Everything else
has a default.

### Tags

Lowercase, hyphenated, and reused rather than invented: every distinct tag
becomes its own page, so three spellings of one subject make three near-empty
pages. `rust` and `compilers`, not `Rust` and `Compiler Design`.

Many tags carry a pixel mark from the brand kit — `rust`, `python`, `go`,
`php`, `docker`, `database`, `security`, `performance`, `server`, `shell` and
about twenty more. An unmarked tag simply shows its word. The full mapping is
in `src/lib/pixel-icons.mjs`.

### Sources

Frontmatter, not body. Renders as a numbered list at the end of the post.

```yaml
sources:
  - title: Crafting Interpreters      # only this is required
    author: Robert Nystrom
    url: https://craftinginterpreters.com/
    detail: ch. 17
```

## Page — `pages/<lang>/<slug>.md`

Standalone pages such as About. No date, no tags.

```yaml
---
title: About
description: ""
lang: en
sources: []
---
```

## New post

From the terminal, which fills in the frontmatter and the date:

```bash
npm run new -- en "Intermediate representations" --tags compilers,rust
npm run new -- tr "Ara temsiller" --key ir-notes --tags compilers,rust
```

Or in Obsidian: the `Post (EN)` and `Yazi (TR)` templates.
