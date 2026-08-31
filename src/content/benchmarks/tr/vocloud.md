---
lang: tr
updated: 2026-08-24
environment:
  machine: AMD Ryzen 7 5800X, 32 GB, NVMe
  os: Debian 12, kernel 6.1
  toolchain: Go 1.23, PostgreSQL 16
  input: 40 makine, her birinde 12 unit, 0,4 ms RTT'li yerel ağ
  method: 20 koşu, ilk 3 atıldı, medyan bildiriliyor
suites:
  - title: 40 makinede tam uygulama
    unit: sn
    lowerIsBetter: true
    note: "`apply` anından son makinenin bitti demesine kadar geçen süre."
    results:
      - label: voCloud (eşzamanlılık 8)
        value: 34.6
        mine: true
      - label: Ansible (forks 8)
        value: 96.2
      - label: ssh üzerinde kabuk döngüsü
        value: 214.8
        note: sıralı; yerine geçtiği taban olduğu için eklendi
  - title: Değişmemiş filoda plan
    unit: sn
    lowerIsBetter: true
    results:
      - label: voCloud
        value: 1.9
        mine: true
      - label: Ansible --check
        value: 41.3
  - title: Koşucu belleği, tepe RSS
    unit: MB
    lowerIsBetter: true
    results:
      - label: voCloud
        value: 82
        mine: true
      - label: Ansible
        value: 610
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

Önemli olan fark **plan** tarafındaydı: 41 saniye süren bir kontrol her
değişiklikten önce çalıştırılmaz, iki saniye süren çalıştırılır. Uygulama
sayıları uzak ikinci sırada — o yol aracın değil, SSH'ın ve makinelerin
sınırladığı bir yol.

Ansible, pipelining açık ve fact toplama kapalı çalıştırıldı; burada zaten
kurulu olduğu yapılandırma buydu. Fact'ler açıkken daha yavaş, ama o zaman
yerine geçtiğimiz kurulumdan daha kötü bir kuruluma karşı ölçmüş olurduk.
