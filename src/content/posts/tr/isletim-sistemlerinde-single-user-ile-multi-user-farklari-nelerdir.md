---
title: "İşletim Sistemlerinde Single User ile Multi User Farkları Nelerdir?"
description: "İşletim Sistemlerinde Single User ile Multi User Farklarına Dair Notlarım."
date: 2026-09-03
lang: tr
tags: [rust, os, dsa-book]
translationKey: multi-vs-single-user
draft: false
sources:
  - title: "Veri Yapıları ve Algoritmalar"
    author: "Rıfat Çöleksen"
    url: "http://papatyabilim.com.tr/PDF/veri_yapilari_ve_algoritmalar_pdf.pdf"
    detail: "1. Bölüm"
---

Merhabalar, bugün sabahleyin erken saatlerde Rıfat Çöleksen hocamızın Veri Yapıları ve Algoritmalar üzerine yazmış olduğu kitabı okumaktaydım. Nitekim 1. Bölüm'de işletim sistemleri hakkında detaylı bir bilgilendirme bulunuyordu. İşte buradan Multi-User ile Single-User OS arasındaki farkları öğrendim. Farklar tam olarak şu şekildeydi:

#### Multi User OS ile Single User OS Farkları Nelerdir?

**Single User OS**

- Tek Kullanıcılıdır.
- Access Right Yoktur
- Aynı Anda Erişime Sahip Değildir.

**Multi User OS**

- Çok Kullanıcılıdır.
- Access Right Vardır.
- Time Sharing Vardır.
- Aynı Anda Birden Fazla Kullanıcı Erişebilir.

#### İşletim Sistemi Nedir?

İşletim Sistemler, donanım ile yazılım arasında köprü kuran CPU/RAM, IO birimleri gibi birimleri yöneten bir kaynak yönetim yazılımıdır.  Programlama dillerinde ki standart kütüphanedeki bazı fonksiyonlar, hazır imkanlar kısmi olarak işletim sistemlerine bağlı olabilirler ve işletim sistemlerine göre değişiklik gösterebilirler. bknz: (syscall)  İşletim sistemlerinin pek çok türü vardır örnek:

- Multi User
- Single User
- Multi-Process
- Single-Process
- Real Time
- Non Real Time
- Ağ Odaklı İşletim Sistemleri vb...

Bu sınıflandırmalar birbirini dışlamaz. Örneğin bir işletim sistemi hem **multi-user**, hem **multi-process**, hem de belirli görevler açısından **real-time** özelliklere sahip olabilir.