---
lang: tr
description: Ayrıştırıcının parçaları nerede duruyor.
order: 30
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

:::tree
- `include/voparser/` — genel başlık dosyası, tek dosya
- `src/`
  - `decode.c` — kodlama sezgisi ve UTF-8 çözme
  - `tokenise.c` — durum makinesi
  - `tree.c` — ekleme kipleri, etkin biçimlendirme elemanları
  - `arena.c` — artımlı ayırıcı, tek serbest bırakma
  - `query.c` — seçici ayrıştırma ve eşleştirme
- `specs/` — uygulanan şartname bölümleri, numaralarıyla
- `tests/`
  - `fixtures/` — html5lib-tests, depoya alınmış
  - `fuzz/` — korpus ve koşum takımı
:::

## Kurallar

**Tek genel başlık.** Her şeye `voparser.h` üzerinden ulaşılıyor; orada olmayan
her şey değişmekte serbest.

**`specs/` bölüm numarası veriyor.** Şartnamenin hangi kısmını uyguladığını
söylemeyen bir tokenizer durumu, kimsenin denetleyemeyeceği bir durumdur.

**Fikstürler indirilmiyor, depoda duruyor.** Ağa ihtiyaç duyan bir test takımı,
kodla ilgisi olmayan sebeplerle kırılan bir test takımıdır.
