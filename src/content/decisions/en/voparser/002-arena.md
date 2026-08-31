---
number: 2
title: Arena allocation, no individual frees
date: 2026-07-21
lang: en
status: accepted
tags: [memory, performance]
---

*Example content, to show what this section looks like.*

## Context

A parse allocates tens of thousands of small nodes with identical lifetimes:
they all die when the document dies.

## Options

**malloc per node** — familiar, works with every tool, and every node carries
allocator metadata. Teardown walks the whole tree.

**Arena** — one bump pointer, one `munmap` at the end. No individual free, so
the document cannot outlive the arena.

## Decision

Arena, sized by the caller. `vp_parse_file` takes the arena as a parameter
rather than owning one, so the caller decides the lifetime.

## Consequences

Teardown became free, and the profile lost its allocator entries entirely.
The price is that peak memory tracks input size rather than what the document
needs, and a long-lived document holding one arena keeps every byte of it —
which is the wrong shape for an editor and the right one for a crawler.
