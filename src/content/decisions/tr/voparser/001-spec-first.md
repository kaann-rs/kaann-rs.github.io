---
number: 1
title: Tarayıcıyı değil şartnameyi izle
date: 2026-07-03
lang: tr
status: accepted
tags: [kapsam, doğruluk]
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Bağlam

Tarayıcılar HTML şartnamesinden küçük ve iyi bilinen biçimlerde sapıyor.
Birini eşlemek onun hatalarını da eşlemek demek; şartnameyi eşlemek ise zaman
zaman bütün tarayıcılarla aynı anda anlaşmazlığa düşmek demek.

## Karar

Şartnameyi uygula, `specs/` içinde bölüm numaralarını yaz ve doğruluğun tanımı
olarak html5lib-tests'i al.

## Sonuçlar

Çıktıyı başsız bir tarayıcıyla karşılaştırmak geçerli bir test değil —
farklar beklenen farklar ve peşlerine düşmek, hangi tarayıcıyla hata uyumlu
olacağını seçmek demek. Takas şu: Chrome'da bir türlü görüntülenen bir belge
burada başka türlü ayrıştırılabilir, ve bu kaza değil tasarım.
