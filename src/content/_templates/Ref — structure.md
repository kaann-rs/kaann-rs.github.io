# Structure

Everything that is not math or a code block.

## Tree — ASTs, file trees, hierarchies

An indented list; CSS draws the connectors. Stays a real `<ul>`, so it is
copyable and searchable.

````markdown
:::tree
- **Program**
  - **FunctionDecl** `"main"`
    - *Params* — empty
    - **Block**
      - **LetStmt** `"x"`
        - **IntLit** `42`
:::
````

:::tree
- **Program**
  - **FunctionDecl** `"main"`
    - *Params* — empty
    - **Block**
      - **LetStmt** `"x"`
        - **IntLit** `42`
:::

`**bold**` = node name · `` `code` `` = accent color · `*italic*` = muted

## Figure — numbered, linkable

````markdown
:::figure[Inscribed angle and central angle]
![](/diagram.svg)
:::
````

Renders as "Figure 1 — …" and is linkable with `[see](#fig-1)`.
Numbering is per file. Works with an image, an inline `<svg>`, or a table.

## Sources

Frontmatter, not body. Renders as a numbered list at the end of the post.

```yaml
sources:
  - title: Crafting Interpreters      # only this is required
    author: Robert Nystrom
    url: https://craftinginterpreters.com/
    detail: ch. 17
```

## Table

````markdown
| Encoding | Add an operator | Frames |
| --- | --- | --- |
| Grammar | New level | $\Theta(n)$ |
| Binding power | One line | $\Theta(1)$ |
````

Scrolls inside its own box on narrow screens. Math works in cells.

## Headings and the table of contents

`##` and `###` become the TOC automatically — a sticky column on wide screens,
a collapsible box on narrow ones. `#` is the title, never used in the body.

Turn it off for one post with `toc: false`.

## Links between posts

````markdown
[the IR post](/posts/why-an-ir/)          EN
[IR yazısı](/tr/posts/neden-ir/)          TR
````

Use site paths, not Obsidian `[[wiki links]]` — those do not survive the build.

## Translations

Put the same `translationKey` in both files:

```yaml
# posts/en/why-an-ir.md
translationKey: why-an-ir

# posts/tr/neden-ir.md
translationKey: why-an-ir
```

The language switch in the header then jumps to the counterpart instead of the
other language's home page.

## Publishing

Git sidebar -> stage -> commit -> push. Live in about a minute.
Or in the terminal: `git add -A && git commit -m "..." && git push`.
