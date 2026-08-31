---
lang: tr
description: Hiç geri dönmeyen bir tokenizer ve hiçbir belleğe sahip olmayan bir ağaç kurucu.
order: 20
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Hat

```mermaid
flowchart LR
  IN["baytlar"] --> DEC["çözücü<br/>UTF-8, BOM, meta charset"]
  DEC --> TOK["tokenizer<br/>açık durum makinesi"]
  TOK --> TB["ağaç kurucu<br/>ekleme kipleri"]
  TB --> DOC["belge<br/>arenada ayrılmış"]
  DOC --> Q["sorgu"]
```

## Tokenizer

Tokenizer, şartnamedeki durum makinesinin açık açık yazılmış hâli: her durum
için bir fonksiyon, ve mevcut durum çağrı yığınında değil bir değişkende
tutuluyor:

```mermaid
stateDiagram-v2
  [*] --> Data
  Data --> TagOpen: <
  TagOpen --> TagName: harf
  TagOpen --> MarkupDeclaration: !
  TagName --> BeforeAttributeName: boşluk
  TagName --> Data: >
  BeforeAttributeName --> AttributeName: harf
  AttributeName --> AttributeValue: =
  AttributeValue --> BeforeAttributeName: boşluk
  AttributeValue --> Data: >
```

Hiç geri dönmüyor. Her bayt bir kez tüketiliyor; ayrıştırmayı girdi boyutunda
doğrusal tutan ve maliyet modelini kolay düşünülür kılan şey bu: tek geçiş,
yeniden tarama yok, tek karakterden fazla ileri bakma yok.

## Ağaç kurucu

Ekleme kipleri şartnameyi izliyor; yalnızca gerçek belgeler bozuk olduğu için
var olan kısımlar da dahil — etkin biçimlendirme elemanları listesi ve onun
evlat edinme algoritması. Kodun yaklaşık üçte biri, kimsenin bilerek yazmadığı
ama her taramada karşılaşılan işaretlemeyi karşılamak için var.
