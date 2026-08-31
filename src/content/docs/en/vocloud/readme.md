---
lang: en
description: Install it, point it at a machine, and watch the first deploy land.
order: 10
---

*Example content, to show what this section looks like.*

## Requirements

| Component | Version | Note |
| --- | --- | --- |
| Linux host | kernel 5.10+ | Debian and Ubuntu are what get tested |
| systemd | 247+ | unit generation depends on it |
| PostgreSQL | 14+ | state and audit log |
| SSH | OpenSSH 8.4+ | agentless targets need no daemon installed |

## Install

```bash
curl -fsSL https://example.internal/vocloud/install.sh | sh
vocloud init --db postgres://localhost/vocloud
```

## Configuration

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
`targets.concurrency` is the number of hosts touched at once. Raising it past
the database pool size queues work rather than speeding it up.
:::

## First run

```bash
vocloud host add web-01 --address 10.0.4.11 --tags web,prod
vocloud plan  web-01
vocloud apply web-01
```

`plan` prints the difference between the recorded state and the host's actual
state, and it exits non-zero when they diverge — which is what makes it usable
from CI.
