---
number: 2
title: SSH üzerinden ajansız
date: 2026-06-02
lang: tr
status: superseded
supersededBy: 3
tags: [taşıma]
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Bağlam

Koşucuların kırk makineye ulaşması gerekiyor. Ya her makineye bir şey kurulur
ya da platform zaten orada olana bağlanır.

## Karar

Ajansız, SSH üzerinden. Kurulacak bir şey yok, yükseltilecek bir şey yok ve
envanterden çıkarılan bir makine gerçekten kopmuş oluyor.

## Sonuçlar

Her işlem bağlantı kurulumunu ödüyor; bastion arkasındaki bir makine iki kez
ödüyor. 0,4 ms RTT'de bu görünmezdi; ikinci saha eklenir eklenmez görünür oldu
— 3 numaralı karara bak.
