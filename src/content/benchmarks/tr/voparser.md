---
lang: tr
updated: 2026-08-26
environment:
  machine: AMD Ryzen 7 5800X, 32 GB, NVMe
  os: Debian 12, kernel 6.1
  toolchain: gcc 12.2, -O2, tek iş parçacığı
  input: Alexa listesinin başından taranmış 500 sayfa, medyan 4,1 MB
  method: Sayfa başına 30 koşu, ilk 5 atıldı, medyanların medyanı
suites:
  - title: Belgeye ayrıştırma
    unit: ms
    lowerIsBetter: true
    note: Baytlardan gezilebilir ağaca kadar geçen süre, çözme dahil.
    results:
      - label: voParser
        value: 41.2
        mine: true
      - label: html5ever
        value: 47.3
      - label: libxml2 (HTML kipi)
        value: 58.9
        note: şartnameye uygun değil, yaygın varsayılan olduğu için eklendi
      - label: lexbor
        value: 33.8
        note: daha hızlı, ve öyle kaldı — aşağıdaki nota bak
  - title: Ayrıştırma sırasında tepe RSS
    unit: MB
    lowerIsBetter: true
    results:
      - label: voParser
        value: 63
        mine: true
      - label: html5ever
        value: 71
      - label: lexbor
        value: 58
  - title: Seçici sorgusu, 10 bin eşleşme
    unit: ms
    lowerIsBetter: true
    results:
      - label: voParser
        value: 12.4
        mine: true
      - label: libxml2 XPath
        value: 9.1
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

lexbor daha hızlı ve daha az bellek kullanıyor. Dürüst başlık bu ve üç tur
profil çıkarmadan sonra da değişmedi — sıralanmış dizge tablosu, tekrar eden
öznitelik adlarının çok olduğu belgelerde kazanıyor, ki çoğu belge öyle.

Arenanın kazandırdığı şey yıkım tarafındaydı: her düğümü gezmek yerine tek bir
`munmap`. Bu bir ayrıştırma ölçümünde görünmüyor, ama birkaç milisaniyede bir
sayfa ayrıştırıp atan bir tarayıcıda görünüyor.

Asıl iyileştirilecek sayı sorgu tarafı. libxml2 bir dizin geziyor, bu ağacı
geziyor. Sıradaki ölçüm ayrıştırma döngüsü değil, o.
