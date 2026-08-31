---
number: 2
title: Arena ile ayırma, tek tek serbest bırakma yok
date: 2026-07-21
lang: tr
status: accepted
tags: [bellek, performans]
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Bağlam

Bir ayrıştırma, ömürleri birebir aynı olan on binlerce küçük düğüm ayırıyor:
hepsi belge ölünce ölüyor.

## Seçenekler

**Düğüm başına malloc** — tanıdık, her araçla çalışıyor, ve her düğüm ayırıcı
üstverisi taşıyor. Yıkım bütün ağacı geziyor.

**Arena** — tek artımlı işaretçi, sonunda tek `munmap`. Tek tek serbest bırakma
yok, yani belge arenadan uzun yaşayamıyor.

## Karar

Arena, boyutunu çağıran belirliyor. `vp_parse_file` arenayı sahiplenmek yerine
parametre olarak alıyor; ömre çağıran karar veriyor.

## Sonuçlar

Yıkım bedavaya geldi ve profilden ayırıcı satırları tamamen kayboldu. Bedeli,
tepe belleğin belgenin ihtiyacı yerine girdi boyutunu izlemesi ve tek arenayı
tutan uzun ömürlü bir belgenin her baytını elinde tutması — bir editör için
yanlış, bir tarayıcı için doğru biçim.
