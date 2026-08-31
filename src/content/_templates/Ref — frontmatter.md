# Frontmatter

Six collections, six shapes. A missing or mistyped field **fails the build** —
errors surface before deploy, not in the browser.

## Project — `projects/<lang>/<slug>.md`

The filename is the URL slug, and the EN and TR files of one project share it.

```yaml
---
name: voparser                   # display name
tagline: One line, on the card and under the name.
description: ""                # meta description; falls back to the tagline
lang: en                       # en | tr

status: active                 # active | stable | maintenance | experiment | archived
accent: "#d9480f"              # the project's colour, light mode
accentDark: "#ff5e1f"          # …and dark mode; needs to be the lighter one
monogram: el                   # 1–3 characters, used when there is no icon

glyph: code                        # a name from src/lib/icons.mjs; beats monogram
icon: ../../_assets/vp-icon.png    # optional, square; beats glyph
cover: ../../_assets/vp-cover.svg  # optional, wide; sits above every page
card: ../../_assets/vp-card.svg    # optional; the index falls back to cover

sections: [readme, changelog, decisions, benchmarks, learned]

repo: https://github.com/user/voparser
homepage: https://example.com
license: MIT
stack: [C, CMake]              # small chips
started: 2026-08-26
order: 20                      # ascending; featured projects lead regardless
featured: true
draft: true                    # true -> visible in npm run dev only
sources: []
---
```

**`sections` decides both order and visibility.** Leave it out and every section
that has content is shown, in a sensible order. Name it and you get exactly that
list — this is how a section is switched off. Built-in ids: `readme`,
`changelog`, `releases`, `roadmap`, `decisions`, `benchmarks`, `learned`,
`architecture`, `structure`, `state`. Any other id works as long as
`docs/<lang>/<slug>/<id>.md` exists.

A section with nothing behind it never appears, listed or not.

## Release — `releases/<lang>/<slug>/<version>.md`

```yaml
---
version: "0.2.0"
date: 2026-08-30
lang: en
kind: minor                    # major | minor | patch | prerelease
summary: One line a reader can scan.
unreleased: false              # true -> shown as "Unreleased", pinned on top
draft: false
---
```

The body is free markdown; `### Added` / `### Changed` / `### Fixed` reads well
and is what the site is styled for.

## Roadmap — `roadmaps/<lang>/<slug>.md`

```yaml
---
lang: en
updated: 2026-08-30
milestones:
  - title: First working conversion
    status: building           # shipped | building | planned | exploring
    target: "2026 Q4"          # free text
    note: One sentence of context.
    items:
      - text: Specification pinned down
        done: true
      - text: End-to-end path for the simplest input
        done: false
---
```

Ticked items drive the progress bar. The body below the frontmatter is optional
context shown above the milestones.

## Documentation section — `docs/<lang>/<slug>/<section>.md`

```yaml
---
lang: en
title: Profiling               # only needed for a custom section id
glyph: zap                     # its mark in the tab bar; built-in ids have one
description: One line under the heading.
order: 40                      # used when `sections` does not pin the order
draft: false
sources: []
---
```

## Benchmark — `benchmarks/<lang>/<slug>.md`

```yaml
---
lang: en
updated: 2026-08-26
environment:                   # required, all of it
  machine: AMD Ryzen 7 5800X, 32 GB, NVMe
  os: Debian 12, kernel 6.1
  toolchain: gcc 12.2, -O2, single thread
  input: 500 pages, 4.1 MB median
  method: 30 runs, first 5 discarded, median reported
suites:
  - title: Parse to document
    unit: ms
    lowerIsBetter: true        # false for throughput
    note: One line about what is being timed.
    results:                   # at least two
      - label: voParser
        value: 41.2
        mine: true             # marks your own implementation
      - label: lexbor
        value: 33.8
        note: faster, and it stayed faster
---
```

Bars scale against the largest value in the suite; the winner is marked, not
implied. Write what the numbers mean in the body.

## Decision — `decisions/<lang>/<slug>/<nnn>-<name>.md`

```yaml
---
number: 3
title: Persistent connections per runner
date: 2026-08-11
lang: en
status: accepted               # proposed | accepted | superseded | reverted
supersedes: [2]                # numbers this one replaces
supersededBy: 7                # the number that replaced this one
tags: [transport, performance]
---
```

Body: `## Context`, `## Options`, `## Decision`, `## Consequences`. Records are
never rewritten — a decision that stops holding is marked `superseded` and
points at its replacement.

`sources` is a list of objects. Obsidian's Properties panel cannot represent
that shape, which is why this vault keeps properties in **source mode**.
Do not change that setting.
