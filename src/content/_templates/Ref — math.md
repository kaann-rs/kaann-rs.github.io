# Math

## Inline and display

Inline: `$e^{i\pi} + 1 = 0$` -> $e^{i\pi} + 1 = 0$

Display — **`$$` must be on its own line**, or it parses as inline:

```markdown
$$
\angle APB = \tfrac{1}{2}\,\angle AOB
$$
```

$$
\angle APB = \tfrac{1}{2}\,\angle AOB
$$

Aligned:

```markdown
$$
\begin{aligned}
  f(x) &= ax^2 + bx + c \\\\
  f'(x) &= 2ax + b
\end{aligned}
$$
```

$$
\begin{aligned}
  f(x) &= ax^2 + bx + c \\\\
  f'(x) &= 2ax + b
\end{aligned}
$$

## Macros

Defined in `src/lib/katex-macros.mjs`. In Obsidian they work after opening
`_mathjax-preamble.md` once per session.

| Write | Get |
| --- | --- |
| `$\R$` `$\N$` `$\Z$` `$\Q$` `$\C$` `$\F$` | $\R$ $\N$ $\Z$ $\Q$ $\C$ $\F$ |
| `$\eps$` | $\eps$ |
| `$\abs{x}$` | $\abs{x}$ |
| `$\norm{v}$` | $\norm{v}$ |
| `$\set{1, 2}$` | $\set{1, 2}$ |
| `$\floor{x}$` `$\ceil{x}$` | $\floor{x}$ $\ceil{x}$ |
| `$\iff$` `$\implies$` | $\iff$ $\implies$ |

### Compilers

| Write | Get |
| --- | --- |
| `$\judge{\Gamma}{e}{\tau}$` | $\judge{\Gamma}{e}{\tau}$ |
| `$\derives$` `$\derivesStar$` | $\derives$ $\derivesStar$ |
| `$\steps$` `$\stepsStar$` | $\steps$ $\stepsStar$ |
| `$\evalsto$` | $\evalsto$ |
| `$\lang$` `$\grammar$` | $\lang$ $\grammar$ |
| `$\emptystr$` `$\concat$` | $\emptystr$ $\concat$ |

New macro: add a line to `katex-macros.mjs`, then `npm run macros`.

## Theorem boxes

```markdown
:::theorem[Inscribed angle theorem]
An inscribed angle is half the central angle subtending the same arc.
:::

:::proof
Draw the radius. The rest is isosceles triangles.
:::
```

:::theorem[Inscribed angle theorem]
An inscribed angle is half the central angle subtending the same arc.
:::

:::proof
Draw the radius. The rest is isosceles triangles.
:::

### Every kind

| Directive | Numbered | Label |
| --- | --- | --- |
| `:::theorem[Name]` | ✓ | Theorem 1 |
| `:::lemma` | ✓ | Lemma 1 |
| `:::proposition` | ✓ | Proposition 1 |
| `:::corollary` | ✓ | Corollary 1 |
| `:::definition` | ✓ | Definition 1 |
| `:::example` | ✓ | Example 1 |
| `:::remark` | ✓ | Remark 1 |
| `:::proof` | — | Proof, ends with □ |
| `:::note` `:::tip` `:::warning` | — | Note / Tip / Warning |

The `[Name]` part is optional. Numbering is per file, per kind. Labels follow
the post's `lang` — write `:::theorem` in a Turkish post and it says "Teorem 1".

:::note
`:::` blocks show as plain text in Obsidian — no editor knows this syntax.
Run `npm run dev` to see them rendered.
:::
