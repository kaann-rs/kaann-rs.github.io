---
number: 2
title: Agentless over SSH
date: 2026-06-02
lang: en
status: superseded
supersededBy: 3
tags: [transport]
---

*Example content, to show what this section looks like.*

## Context

Runners have to reach forty hosts. Either something is installed on each host,
or the platform connects to what is already there.

## Decision

Agentless, over SSH. Nothing to install, nothing to upgrade, and a host that is
removed from the inventory is genuinely disconnected.

## Consequences

Every operation pays connection setup, and a host behind a bastion pays it
twice. Measured at 0.4 ms RTT this was invisible; it stopped being invisible as
soon as a second site was added — see decision 3.
