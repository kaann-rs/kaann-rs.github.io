---
lang: en
description: Parse a document, walk the tree, query it.
order: 10
---

*Example content, to show what this section looks like.*

## Build

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
ctest --test-dir build
```

## Use

```c title:examples/titles.c hl:6,11 ln:true
#include <voparser.h>

int main(void) {
    vp_arena arena;
    vp_arena_init(&arena, 1 << 20);
    vp_doc *doc = vp_parse_file("page.html", &arena);

    vp_nodes titles = vp_query(doc, "h2");
    for (size_t i = 0; i < titles.len; i++)
        puts(vp_text(titles.items[i]));

    vp_arena_free(&arena);   // frees the document with it
    return 0;
}
```

There is no `vp_free_doc`. Everything the parse allocates comes from the arena
you hand it, so the document's lifetime is the arena's lifetime — see
[decision 2](/projects/voparser/decisions/#d002).

## Query subset

| Selector | Supported |
| --- | --- |
| `tag`, `.class`, `#id` | yes |
| `a b`, `a > b` | yes |
| `[attr]`, `[attr="value"]` | yes |
| `:nth-child(n)` | yes |
| `:has()`, `:is()`, `~`, `+` | no |
