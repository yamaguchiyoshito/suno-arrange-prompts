---
schema_version: 1
prompt_id: suno-000238
slug: least-recently-used-guest-party-rap
title: 最久不使用者が退場する三席パーティー
description: DJ WATARAI, HI-D & AI「Welcome 2 Da Party」から着想を得た、三つの演奏席をLRU規則で六楽器へ割り当てるパーティー・ラップ。
bpm: 100
vocals: vocal
tags:
  - dj-watarai
  - electro-funk
  - vocal
  - drums
  - sampler
  - synth-bass
  - role-exchange
  - loop-based
tip_label: 調整するなら
tip: LRUの退場を追跡しやすくする場合は、六楽器の短い固有音型を固定し、再入場時にも変更しません。
status: published
order: 2380
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create six original one-bar guest motifs A-F for drum kit, bass, piano, guitar, horn, and sampler at 100 BPM. Only three guest slots may be active. Process this request sequence, one request per four-bar section: A, B, C, D, A, E, B, F, C, D, E, F. If the requested guest is absent, admit it and evict the active guest whose most recent request is oldest; during the first three requests, fill empty slots. If it is already active, keep all three guests and refresh only its recency. Every active guest repeats its unchanged motif throughout that section beneath an original rap refrain. Do not fade, substitute, or combine motifs when eviction occurs; hard-switch at the downbeat. End with the final cache state. Use only original performances, melodies, lyrics, samples, and recordings created for this piece. Do not imitate the source artist's melody, lyrics, vocal flow, signature rhythm, sound design, or recording.
```
