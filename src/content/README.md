# Vault guide

This vault is the site's `src/content/` folder. Files here **are** the site —
editing a note edits the published page.

```
projects/<lang>/<slug>.md              a project: identity, colours, overview
docs/<lang>/<slug>/<section>.md        readme, architecture, structure, state,
                                       learned — and any section you invent
releases/<lang>/<slug>/<version>.md    one changelog entry
roadmaps/<lang>/<slug>.md              milestones and their checklists
benchmarks/<lang>/<slug>.md            measured comparisons
decisions/<lang>/<slug>/<nnn>-x.md     one decision record, never rewritten
pages/<lang>/about.md                  the About page
_assets/                               icons, covers, card art
_templates/                            skeletons + syntax reference
```

`<lang>` is `en` or `tr`. `<slug>` is the project's URL and the only thing
linking its English and Turkish files — keep the two filenames identical.

Folders starting with `_` are ignored by the build.

## Don't hand-write frontmatter

From the repository root:

```bash
npm run new:project -- voparser --mono vp --accent "#7e22ce"
npm run new:release -- voparser 0.1.0
npm run new:doc     -- voparser architecture
npm run new:cover   -- voparser --glyph code --accent "#7e22ce"
```

Each command writes both languages at once, so EN and TR never drift apart.

## Forgot the syntax?

`_templates/` has it all, with live examples to copy:

| File | Covers |
| --- | --- |
| `Ref — frontmatter` | every field of every collection |
| `Ref — code` | `title:` `hl:` `ln:`, diff markers, mermaid |
| `Ref — math` | `$…$`, macros, theorem/proof boxes |
| `Ref — structure` | trees, figures, tables, links, translations |

`Proje` and `Surum` are insertable skeletons —
`Ctrl+P` → "Insert template".

## Turning a section off

A project shows every section that has content. To pin the list — or to hide
one — name them in the project's frontmatter:

```yaml
sections: [readme, changelog, decisions, benchmarks, learned]
```

Built-in ids: `readme` · `changelog` · `releases` · `roadmap` · `decisions` ·
`benchmarks` · `learned` · `architecture` · `structure` · `state`.

## Publishing

Git sidebar → stage → commit → push. Live in about a minute.
Or in the terminal: `git add -A && git commit -m "..." && git push`.
