---
lang: en
description: What works today, what is partial, and what will bite you.
order: 40
---

*Example content, to show what this section looks like.*

## Feature state

| Area | State | Note |
| --- | --- | --- |
| Host inventory | works | static file and DNS discovery |
| Plan / apply | works | idempotent, exits non-zero on drift |
| Package management | works | apt only |
| Service units | works | generated from templates |
| Certificate renewal | partial | issues, does not yet reload dependents |
| Metrics scrape | partial | one Prometheus target per host, no relabelling |
| Rollback | missing | roll forward with a new plan |
| Windows targets | missing | not planned |

## Known limits

:::note
A runner holds one SSH connection per host for the duration of a job. Forty
hosts at concurrency 8 means five waves, not forty connections.
:::

- The audit log is append-only but not signed; it detects mistakes, not an
  attacker with database access.
- `plan` compares against the last observation, not a live read. A host changed
  by hand since the last run shows as in sync until the next observation.
- There is no multi-tenancy. Everyone who can reach the API can see every host.
