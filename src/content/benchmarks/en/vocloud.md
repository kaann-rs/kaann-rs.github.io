---
lang: en
updated: 2026-08-24
environment:
  machine: AMD Ryzen 7 5800X, 32 GB, NVMe
  os: Debian 12, kernel 6.1
  toolchain: Go 1.23, PostgreSQL 16
  input: 40 hosts, 12 units each, LAN with 0.4 ms RTT
  method: 20 runs, first 3 discarded, median reported
suites:
  - title: Full apply across 40 hosts
    unit: s
    lowerIsBetter: true
    note: Wall clock from `apply` to the last host reporting done.
    results:
      - label: voCloud (concurrency 8)
        value: 34.6
        mine: true
      - label: Ansible (forks 8)
        value: 96.2
      - label: shell loop over ssh
        value: 214.8
        note: serial, included as the baseline it replaced
  - title: Plan on an unchanged fleet
    unit: s
    lowerIsBetter: true
    results:
      - label: voCloud
        value: 1.9
        mine: true
      - label: Ansible --check
        value: 41.3
  - title: Runner memory, peak RSS
    unit: MB
    lowerIsBetter: true
    results:
      - label: voCloud
        value: 82
        mine: true
      - label: Ansible
        value: 610
---

*Example content, to show what this section looks like.*

The gap on **plan** is the one that mattered: a check that takes 41 seconds
does not get run before every change, and one that takes two does. The apply
numbers are a distant second — that path is bounded by SSH and by the hosts
themselves, not by the tool.

Ansible was run with pipelining on and fact gathering off, which is the
configuration it was already deployed with here. With facts on it is slower,
but that would have been comparing against a worse setup than the one being
replaced.
