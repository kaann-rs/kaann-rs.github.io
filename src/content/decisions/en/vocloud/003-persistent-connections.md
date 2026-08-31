---
number: 3
title: Persistent connections per runner
date: 2026-08-11
lang: en
status: accepted
supersedes: [2]
tags: [transport, performance]
---

*Example content, to show what this section looks like.*

## Context

Decision 2 said agentless and re-connect per operation. Across the WAN link to
the second site, connection setup went from 4 ms to 180 ms, and a 12-unit apply
spent more time handshaking than working.

## Decision

Still agentless — but a runner now holds one multiplexed SSH connection per host
for the lifetime of a job, and closes it when the job ends.

## Consequences

Apply across the WAN dropped from 71 s to 38 s. The cost is that a runner now
holds file descriptors proportional to its concurrency, so `concurrency` is
capped at the process's descriptor limit and the config validates it at start
rather than failing halfway through a run.
