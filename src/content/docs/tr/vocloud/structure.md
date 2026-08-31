---
lang: tr
description: Platformun her parçası nerede duruyor.
order: 30
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

:::tree
- `cmd/`
  - `vocloud/` — CLI giriş noktası
  - `vocloudd/` — API sunucusu ve zamanlayıcı
- `internal/`
  - `api/` — işleyiciler, doğrulama, yetkilendirme
  - `queue/` — iş deposu, yeniden deneme, ölü mektup
  - `runner/` — SSH taşıması ve uygulama döngüsü
  - `state/` — hedeflenen ve gözlenen durum, sapma tespiti
  - `audit/` — yalnızca ekleyen kayıt, saklama süresi
- `migrations/` — numaralı, yalnızca ileri
- `deploy/` — systemd unit'leri ve kurulum betiği
- `docs/` — operatör el kitapları
:::

## Kurallar

**`internal/` dışarıdan çağrılamaz.** Hem CLI hem sunucu `api` üzerinden
geçiyor; böylece bir kural tek bir yerde zorlanabiliyor.

**Göçler yalnızca ileri.** Geri alma yeni bir göçtür; geriye gidebilen bir
şemaya kimse güvenmez.

**El kitapları kodun yanında.** Yalnızca birinin aklında duran prosedür, o kişi
izne çıktığında patlayacak bir kesintidir.
