# Frontmatter

Every field. Only the first four are required.

```yaml
---
title: Post title
description: One sentence. Shows in lists and meta tags.
date: 2026-08-27
lang: en                      # en | tr

tags: [compilers, rust]       # lowercase, hyphenated, used in URLs
translationKey: some-key      # identical in the EN and TR file
updated: 2026-09-01

draft: true                   # true -> only visible in npm run dev
toc: false                    # default true
comments: false               # default true

sources:
  - title: Crafting Interpreters
    author: Robert Nystrom
    url: https://craftinginterpreters.com/
    detail: ch. 17
  - title: Engineering a Compiler
    author: Cooper & Torczon
    detail: 3rd ed., ch. 3
---
```

A missing or mistyped field **fails the build** — errors surface before deploy,
not in the browser.

`sources` is a list of objects. Obsidian's Properties panel cannot represent
that shape, which is why this vault keeps properties in **source mode**.
Do not change that setting.
