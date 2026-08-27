# Vault guide

This vault is the blog's `src/content/` folder. Files here **are** the site —
editing a note edits the published post.

```
posts/en/   posts/tr/     published posts
pages/en/   pages/tr/     about pages
_templates/               skeletons + syntax reference
_mathjax-preamble.md      open once per session for $\R$ etc.
```

## Forgot the syntax?

`_templates/` has it all, with live examples you can copy:

| File | Covers |
| --- | --- |
| `Ref — frontmatter` | every field, `sources` shape |
| `Ref — math` | `$…$`, macros, theorem/proof boxes |
| `Ref — code` | `title:` `hl:` `ln:`, diff markers, mermaid |
| `Ref — structure` | trees, figures, tables, links, translations |

`Post (EN)` and `Yazi (TR)` are insertable skeletons —
`Ctrl+P` → "Insert template".

Folders starting with `_` are ignored by the site build.

## Publishing

Left sidebar → Git icon → stage → commit → push. The site rebuilds itself and
is live in about a minute.

## What Obsidian renders, and what it doesn't

Obsidian and the site use different renderers, so a few things look different
here. **Nothing is broken** — the site is always the source of truth.

| Feature | Obsidian | Site |
| --- | --- | --- |
| Markdown, tables, quotes | ✅ | ✅ |
| Code blocks, syntax colors | ✅ | ✅ |
| `$math$`, `$$math$$` | ✅ MathJax | ✅ KaTeX |
| Custom macros `$\R$` | ✅ *after opening the preamble note* | ✅ always |
| ` ```mermaid ` diagrams | ✅ | ✅ |
| `title:x` `hl:2,5-7` `ln:true` | ✅ *Codeblock Customizer plugin* | ✅ same fence |
| `// [!code ++]` markers | shown as comments | ✅ diff colors |
| `:::theorem` `:::proof` `:::tree` | **plain text** | ✅ styled boxes |

Code fences use **Obsidian's Codeblock Customizer syntax**, so one fence renders
in both places:

````markdown
```rust title:src/parser.rs hl:9-11 ln:true
```
````

The `:::` rows are the only real difference. Those are this blog's own syntax —
no editor knows them. Seeing them as raw text while writing is arguably better:
you edit exactly what ships.

To see the real thing, run `npm run dev` and open http://localhost:4321.

## Frontmatter — one rule

Properties are shown in **source mode** on purpose. The `sources:` field is a
list of objects:

```yaml
sources:
  - title: Crafting Interpreters
    author: Robert Nystrom
    url: https://craftinginterpreters.com/
    detail: ch. 17
```

Obsidian's Properties panel cannot represent that shape and would silently
flatten it. Source mode keeps the YAML untouched. **Do not switch
Settings → Editor → Properties in document away from "Source".**

## Terminal alternative

```bash
npm run new -- en "Post title" --tags compilers,rust
npm run dev        # live preview of the real site
npm run macros     # after editing KaTeX macros
```

Full reference: `../../docs/WRITING.md`.
