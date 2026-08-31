---
lang: tr
description: Belgeyi ayrıştır, ağacı gez, sorgula.
order: 10
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Derleme

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
ctest --test-dir build
```

## Kullanım

```c title:examples/titles.c hl:6,11 ln:true
#include <voparser.h>

int main(void) {
    vp_arena arena;
    vp_arena_init(&arena, 1 << 20);
    vp_doc *doc = vp_parse_file("page.html", &arena);

    vp_nodes titles = vp_query(doc, "h2");
    for (size_t i = 0; i < titles.len; i++)
        puts(vp_text(titles.items[i]));

    vp_arena_free(&arena);   // belgeyi de onunla birlikte serbest bırakır
    return 0;
}
```

`vp_free_doc` diye bir şey yok. Ayrıştırmanın ayırdığı her şey verdiğin
arenadan geliyor; yani belgenin ömrü arenanın ömrü —
[2 numaralı karara](/tr/projects/voparser/decisions/#d002) bak.

## Sorgu alt kümesi

| Seçici | Destek |
| --- | --- |
| `tag`, `.class`, `#id` | var |
| `a b`, `a > b` | var |
| `[attr]`, `[attr="değer"]` | var |
| `:nth-child(n)` | var |
| `:has()`, `:is()`, `~`, `+` | yok |
