---
lang: en
description: Where the parser's parts live.
order: 30
---

*Example content, to show what this section looks like.*

:::tree
- `include/voparser/` — the public header, one file
- `src/`
  - `decode.c` — encoding sniffing and UTF-8 decoding
  - `tokenise.c` — the state machine
  - `tree.c` — insertion modes, active formatting elements
  - `arena.c` — bump allocator, one free
  - `query.c` — selector parsing and matching
- `specs/` — the specification sections implemented, with their numbers
- `tests/`
  - `fixtures/` — html5lib-tests, vendored
  - `fuzz/` — corpus and the harness
:::

## Rules

**One public header.** Everything reachable from `voparser.h`; anything not in
it is free to change.

**`specs/` cites section numbers.** A tokeniser state that does not say which
part of the specification it implements is a state nobody can check.

**Fixtures are vendored, not fetched.** A test suite that needs the network is
a test suite that fails for reasons unrelated to the code.
