---
lang: tr
description: Bugün ne çalışıyor, ne yarım, ne ısırır.
order: 40
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Özellik durumu

| Alan | Durum | Not |
| --- | --- | --- |
| Makine envanteri | çalışıyor | statik dosya ve DNS keşfi |
| Plan / apply | çalışıyor | idempotent, sapmada sıfırdan farklı çıkış |
| Paket yönetimi | çalışıyor | yalnızca apt |
| Servis unit'leri | çalışıyor | şablondan üretiliyor |
| Sertifika yenileme | kısmi | üretiyor, bağımlıları henüz yeniden yüklemiyor |
| Metrik toplama | kısmi | makine başına tek hedef, etiket düzenleme yok |
| Geri alma | yok | yeni bir planla ileri git |
| Windows hedefler | yok | planlanmıyor |

## Bilinen sınırlar

:::note
Bir koşucu, iş boyunca makine başına tek SSH bağlantısı tutuyor. Eşzamanlılık 8
iken kırk makine, kırk bağlantı değil beş dalga demek.
:::

- Denetim kaydı yalnızca ekleniyor ama imzalanmıyor; hataları yakalar,
  veritabanına erişimi olan bir saldırganı değil.
- `plan`, canlı okuma değil son gözlemle karşılaştırıyor. Son çalıştırmadan
  sonra elle değiştirilmiş bir makine, bir sonraki gözleme kadar uyumlu
  görünür.
- Çok kiracılık yok. API'ye erişebilen herkes bütün makineleri görür.
