---
number: 1
title: PostgreSQL for state, not etcd
date: 2026-05-19
lang: en
status: accepted
tags: [storage, operations]
---

*Example content, to show what this section looks like.*

## Context

The platform needs somewhere to keep desired state, observed state and an audit
log. etcd is the reflex choice for infrastructure tooling; the company already
runs PostgreSQL for everything else.

## Options

**etcd** — designed for exactly this, watch semantics for free, but a second
datastore to operate, back up and upgrade. Nobody here has run one in anger.

**PostgreSQL** — already operated, already backed up, already understood.
Watches have to be built on `LISTEN/NOTIFY`, which is weaker.

## Decision

PostgreSQL. The operational cost of a second datastore is paid every week; the
cost of writing a notification layer is paid once.

## Consequences

`LISTEN/NOTIFY` drops messages if a listener is away, so the queue polls as
well as listens. That polling is what later made the dead-letter path simple —
it was already reading the table.
