---
lang: en
description: Which parts of the specification hold, and where the edges are.
order: 40
---

*Example content, to show what this section looks like.*

## Conformance

| Area | State | Note |
| --- | --- | --- |
| Tokeniser states | works | html5lib tokeniser suite passes |
| Insertion modes | works | except templates |
| `<template>` | partial | parsed, contents not moved into the fragment |
| Foreign content (SVG, MathML) | partial | namespaces kept, integration points incomplete |
| Encoding sniffing | works | BOM, meta charset, UTF-8 default |
| Fragment parsing | missing | planned |
| Streaming input | missing | the whole document is decoded first |

## Known limits

:::note
The arena means the document cannot outlive it, and nothing can be freed
individually. For a crawler — parse, extract, drop — that is the right trade.
For an editor holding one document open for hours, it is the wrong one.
:::

- Peak memory is proportional to input size, not to what the document needs.
  A 40 MB page costs 40 MB even if three nodes are read.
- The query engine has no index. Repeated queries over one document re-walk it;
  collect what is needed in a single pass instead.
- Error recovery matches the specification, not any particular browser's
  deviations from it.
