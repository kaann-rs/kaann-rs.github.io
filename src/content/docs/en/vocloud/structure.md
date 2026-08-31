---
lang: en
description: Where each part of the platform lives.
order: 30
---

*Example content, to show what this section looks like.*

:::tree
- `cmd/`
  - `vocloud/` — the CLI entry point
  - `vocloudd/` — API server and scheduler
- `internal/`
  - `api/` — handlers, validation, authorisation
  - `queue/` — job store, retries, dead letter
  - `runner/` — SSH transport and the apply loop
  - `state/` — desired vs observed, drift detection
  - `audit/` — append-only log, retention
- `migrations/` — numbered, forward-only
- `deploy/` — systemd units and the install script
- `docs/` — operator runbooks
:::

## Rules

**`internal/` is not importable from outside.** The CLI and the daemon both go
through `api`, so there is one place where a rule can be enforced.

**Migrations are forward-only.** A rollback is a new migration; a schema that
can move backwards is a schema nobody trusts.

**Runbooks live with the code.** A procedure that lives in someone's head is
an outage waiting for that person to be on holiday.
