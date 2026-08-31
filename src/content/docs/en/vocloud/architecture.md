---
lang: en
description: Four layers, one direction of travel, and a queue that keeps the machines out of the request path.
order: 20
---

*Example content, to show what this section looks like.*

## Shape

```mermaid
flowchart TD
  UI["Web UI"] --> API["API<br/>validate, authorise"]
  CLI["vocloud CLI"] --> API
  API --> STORE[("PostgreSQL<br/>desired state")]
  API --> Q["Job queue"]
  Q --> RUN["Runner pool"]
  RUN -->|SSH| H1["web-01"]
  RUN -->|SSH| H2["db-01"]
  RUN --> STORE
```

## Layers

| Layer | Responsibility | Never does |
| --- | --- | --- |
| API | validation, authorisation, writing desired state | touch a host |
| Queue | ordering, retries, back-pressure | decide what a job means |
| Runner | connects, applies, reports | store anything |
| Store | desired state, observed state, audit log | run logic |

The direction only goes one way: nothing below the API writes to the API. A
runner that cannot reach the store drops its result into the queue's dead
letter, and the next `plan` shows the drift instead of losing it.

## Why a queue rather than a request

Applying a change to forty hosts takes minutes, not milliseconds. Holding an
HTTP request open for that long makes every timeout in the chain — proxy,
browser, load balancer — part of the operation's correctness. The queue
removes them from the path.
