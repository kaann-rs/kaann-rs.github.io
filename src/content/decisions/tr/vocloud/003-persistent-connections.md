---
number: 3
title: Koşucu başına kalıcı bağlantı
date: 2026-08-11
lang: tr
status: accepted
supersedes: [2]
tags: [taşıma, performans]
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Bağlam

2 numaralı karar ajansız çalışmayı ve her işlemde yeniden bağlanmayı
söylüyordu. İkinci sahaya giden geniş alan bağlantısında kurulum süresi 4
ms'den 180 ms'ye çıktı ve 12 unit'lik bir uygulama, çalışmaktan çok el sıkışarak
vakit geçirdi.

## Karar

Hâlâ ajansız — ama bir koşucu artık iş boyunca makine başına tek bir
çoğullanmış SSH bağlantısı tutuyor ve iş bitince kapatıyor.

## Sonuçlar

Geniş alan üzerinden uygulama 71 sn'den 38 sn'ye indi. Bedeli, koşucunun artık
eşzamanlılığıyla orantılı dosya tanıtıcısı tutması; bu yüzden `concurrency`
süreç tanıtıcı sınırıyla sınırlandı ve yapılandırma bunu koşunun ortasında
patlamak yerine başlangıçta doğruluyor.
