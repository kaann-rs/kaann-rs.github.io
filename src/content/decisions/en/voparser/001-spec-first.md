---
number: 1
title: Follow the specification, not a browser
date: 2026-07-03
lang: en
status: accepted
tags: [scope, correctness]
---

*Example content, to show what this section looks like.*

## Context

Browsers deviate from the HTML specification in small, well-known ways.
Matching one of them means matching its bugs; matching the specification means
occasionally disagreeing with every browser at once.

## Decision

Implement the specification, cite section numbers in `specs/`, and treat
html5lib-tests as the definition of correct.

## Consequences

Comparing output against a headless browser is not a valid test — the
differences are expected, and chasing them would mean picking a browser to be
bug-compatible with. The trade is that a document that renders one way in
Chrome may parse another way here, and that is by design rather than by
accident.
