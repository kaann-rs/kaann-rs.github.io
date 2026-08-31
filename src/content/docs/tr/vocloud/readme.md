---
lang: tr
description: Kur, bir makineye yönelt, ilk dağıtımın inişini izle.
order: 10
---

*Bu bölümün nasıl göründüğünü göstermek için örnek içerik.*

## Gereksinimler

| Bileşen | Sürüm | Not |
| --- | --- | --- |
| Linux makine | çekirdek 5.10+ | Test edilen Debian ve Ubuntu |
| systemd | 247+ | unit üretimi buna dayanıyor |
| PostgreSQL | 14+ | durum ve denetim kaydı |
| SSH | OpenSSH 8.4+ | hedeflere ajan kurulmuyor |

## Kurulum

```bash
curl -fsSL https://example.internal/vocloud/install.sh | sh
vocloud init --db postgres://localhost/vocloud
```

## Yapılandırma

```yaml title:/etc/vocloud/config.yaml hl:6-9 ln:true
listen: 127.0.0.1:8080
database:
  url: postgres://localhost/vocloud
  pool: 8

targets:
  discovery: static      # static | dns | consul
  inventory: /etc/vocloud/hosts.yaml
  concurrency: 8

audit:
  retain: 90d
```

:::note
`targets.concurrency`, aynı anda dokunulan makine sayısı. Veritabanı havuzunun
üstüne çıkarmak işi hızlandırmaz, kuyruğa alır.
:::

## İlk çalıştırma

```bash
vocloud host add web-01 --address 10.0.4.11 --tags web,prod
vocloud plan  web-01
vocloud apply web-01
```

`plan`, kayıtlı durum ile makinenin gerçek durumu arasındaki farkı yazar ve
ikisi ayrıştığında sıfırdan farklı çıkış kodu döner — CI içinden kullanılabilir
olmasının sebebi bu.
