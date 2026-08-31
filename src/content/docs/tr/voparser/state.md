---
lang: tr
description: Şartnamenin hangi kısımları tutuyor, kenarlar nerede.
order: 40
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Uygunluk

| Alan | Durum | Not |
| --- | --- | --- |
| Tokenizer durumları | çalışıyor | html5lib tokenizer takımı geçiyor |
| Ekleme kipleri | çalışıyor | template hariç |
| `<template>` | kısmi | ayrıştırılıyor, içerik parçaya taşınmıyor |
| Yabancı içerik (SVG, MathML) | kısmi | ad alanları korunuyor, entegrasyon noktaları eksik |
| Kodlama sezgisi | çalışıyor | BOM, meta charset, varsayılan UTF-8 |
| Parça ayrıştırma | yok | planlanıyor |
| Akış hâlinde girdi | yok | belgenin tamamı önce çözülüyor |

## Bilinen sınırlar

:::note
Arena, belgenin arenadan uzun yaşayamaması ve hiçbir şeyin tek tek serbest
bırakılamaması demek. Bir tarayıcı için — ayrıştır, çıkar, at — doğru takas.
Tek belgeyi saatlerce açık tutan bir editör için yanlış takas.
:::

- Tepe bellek, belgenin ihtiyacıyla değil girdi boyutuyla orantılı. 40 MB'lık
  bir sayfa, üç düğüm okunsa bile 40 MB'a mal oluyor.
- Sorgu motorunda dizin yok. Aynı belge üzerinde tekrarlanan sorgular ağacı
  yeniden geziyor; gereken şeyi tek geçişte toplamak gerekiyor.
- Hata kurtarma, herhangi bir tarayıcının sapmalarına değil şartnameye uyuyor.
