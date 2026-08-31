---
lang: en
updated: 2026-08-26
environment:
  machine: AMD Ryzen 7 5800X, 32 GB, NVMe
  os: Debian 12, kernel 6.1
  toolchain: gcc 12.2, -O2, single thread
  input: 500 pages crawled from the top of the Alexa list, 4.1 MB median
  method: 30 runs per page, first 5 discarded, median of medians reported
suites:
  - title: Parse to document
    unit: ms
    lowerIsBetter: true
    note: Time from bytes to a walkable tree, decoding included.
    results:
      - label: voParser
        value: 41.2
        mine: true
      - label: html5ever
        value: 47.3
      - label: libxml2 (HTML mode)
        value: 58.9
        note: not spec-conformant, included because it is the common default
      - label: lexbor
        value: 33.8
        note: faster, and it stayed faster — see the note below
  - title: Peak RSS during parse
    unit: MB
    lowerIsBetter: true
    results:
      - label: voParser
        value: 63
        mine: true
      - label: html5ever
        value: 71
      - label: lexbor
        value: 58
  - title: Selector query, 10k matches
    unit: ms
    lowerIsBetter: true
    results:
      - label: voParser
        value: 12.4
        mine: true
      - label: libxml2 XPath
        value: 9.1
---

*Example content, to show what this section looks like.*

lexbor is faster and uses less memory. That is the honest headline, and it did
not change after three rounds of profiling — its interned-string table wins on
documents with many repeated attribute names, which is most of them.

What the arena bought was the free: teardown is one `munmap` rather than a walk
of every node, which does not show up in a parse benchmark but does show up in
a crawler that parses and drops a page every few milliseconds.

The query number is the one worth improving. libxml2 walks an index; this walks
the tree. That is the next thing to measure, not the parse loop.
