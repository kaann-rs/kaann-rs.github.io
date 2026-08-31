---
number: 1
title: Durum için etcd değil PostgreSQL
date: 2026-05-19
lang: tr
status: accepted
tags: [depolama, operasyon]
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Bağlam

Platformun hedeflenen durumu, gözlenen durumu ve denetim kaydını tutacak bir
yere ihtiyacı var. Altyapı araçlarında refleks tercih etcd; şirkette ise zaten
her şey için PostgreSQL çalışıyor.

## Seçenekler

**etcd** — tam bu iş için tasarlanmış, watch semantiği hazır geliyor; ama
işletilecek, yedeklenecek, yükseltilecek ikinci bir veri deposu. Burada kimse
onu ciddi yükte çalıştırmadı.

**PostgreSQL** — zaten işletiliyor, zaten yedekleniyor, zaten biliniyor. Watch
için `LISTEN/NOTIFY` üzerine bir şey yazmak gerekiyor ve o daha zayıf.

## Karar

PostgreSQL. İkinci bir veri deposunun işletme maliyeti her hafta ödeniyor;
bildirim katmanını yazmanın maliyeti bir kez.

## Sonuçlar

`LISTEN/NOTIFY`, dinleyici yokken mesajı düşürüyor; bu yüzden kuyruk hem
dinliyor hem yokluyor. Sonradan ölü mektup yolunu kolaylaştıran şey de bu
yoklama oldu — tabloyu zaten okuyordu.
