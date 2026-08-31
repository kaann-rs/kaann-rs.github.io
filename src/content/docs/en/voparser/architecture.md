---
lang: en
description: A tokeniser that never backs up, and a tree builder that owns no memory.
order: 20
---

*Example content, to show what this section looks like.*

## Pipeline

```mermaid
flowchart LR
  IN["bytes"] --> DEC["decoder<br/>UTF-8, BOM, meta charset"]
  DEC --> TOK["tokeniser<br/>explicit state machine"]
  TOK --> TB["tree builder<br/>insertion modes"]
  TB --> DOC["document<br/>arena-allocated"]
  DOC --> Q["query"]
```

## Tokeniser

The tokeniser is the specification's state machine written out, one function
per state, with the current state held in a variable rather than on the call
stack:

```mermaid
stateDiagram-v2
  [*] --> Data
  Data --> TagOpen: <
  TagOpen --> TagName: alpha
  TagOpen --> MarkupDeclaration: !
  TagName --> BeforeAttributeName: whitespace
  TagName --> Data: >
  BeforeAttributeName --> AttributeName: alpha
  AttributeName --> AttributeValue: =
  AttributeValue --> BeforeAttributeName: whitespace
  AttributeValue --> Data: >
```

It never backs up. Every byte is consumed once, which is what keeps the parse
linear in input size and makes the cost model easy to reason about: one pass,
no re-scan, no lookahead beyond a single character.

## Tree builder

Insertion modes follow the specification, including the parts that exist only
because real documents are broken — the active formatting elements list and
its adoption agency algorithm. About a third of the code exists to handle
markup that no one would write on purpose but that every crawl encounters.
