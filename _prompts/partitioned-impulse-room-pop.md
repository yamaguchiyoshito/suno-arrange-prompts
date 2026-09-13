---
schema_version: 1
prompt_id: suno-000208
slug: partitioned-impulse-room-pop
title: 残響を三区画へ分けて巡回する空間ポップ
description: 長澤知之「My Living Praise（空間ver.）」に着想を得た、一つの四秒間インパルス応答を三つの時間帯へ分割し、声、ギター、打楽器へ排他的に巡回させるポップ。
bpm: 78
vocals: vocal
tags:
  - experimental-pop
  - vocal
  - acoustic-guitar
  - soft-percussion
  - natural-room
  - stereo-motion
  - recurring-motif
tip_label: 調整するなら
tip: 残響量を比較可能に保つ場合は、各ブロックの畳み込み後wet returnを測定し、音源ごとに第一ブロックと同じ積分エネルギーへ揃えてください。
status: published
order: 2080
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create intimate vocal pop at 78 BPM with lead voice, acoustic guitar, and sparse hand percussion. Split one original four-second room IR into non-overlapping early 0–80 ms, middle 80–800 ms, and late 800–4000 ms partitions; normalize them to equal energy. Block 1 assigns early to voice, middle to guitar, and late to percussion. Rotate every eight bars so each source receives each partition once. Use only the assigned partition, never the full IR. At each boundary, mute old wet returns before enabling new routing; dry signals continue, so no source holds two partitions. Keep dry notes, timing, dynamics, and pan fixed. After each switch, trim only wet-return gain so each source matches its block-1 wet energy. After block 3, stop dry input and let current tails decay. Use wholly original music, lyrics, and IR; do not reuse an existing melody, lyric, riff, recording, sample, or vocal likeness, or imitate the source artists.
```
