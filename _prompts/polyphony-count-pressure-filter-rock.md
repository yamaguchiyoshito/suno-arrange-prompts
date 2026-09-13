---
schema_version: 1
prompt_id: suno-000203
slug: polyphony-count-pressure-filter-rock
title: 持続声数で圧力が変わるフィルター・ロック
description: ラブクライ「空気の底」に着想を得た、低音以外の同時持続声数を数え、その密度だけで共有ローパスの遮断周波数を切り替えるロック。
bpm: 92
vocals: vocal
tags:
  - indie-rock
  - vocal
  - electric-guitar
  - organ
  - bass-guitar
  - drums
  - loop-based
  - timbre-morph
tip_label: 調整するなら
tip: フィルター規則を明瞭にする場合は、声と二本のギターとオルガンの音価を8分音符単位へ揃え、境界間でカットオフを動かさないでください。
status: published
order: 2030
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create original vocal filter-rock at 92 BPM with lead voice, two electric guitars, organ, bass guitar, and dry drums. Write one eight-bar phrase and repeat it unchanged. At every eighth-note position, count N, the number of sustaining parts among voice, guitar L, guitar R, and organ. Set one shared low-pass filter for those four parts only: N=0 at 16 kHz, N=1 at 8 kHz, N=2 at 4 kHz, N=3 at 2 kHz, and N=4 at 1 kHz. Switch cutoff only on eighth-note boundaries with no sweep or smoothing. Bass and drums always bypass the filter. Keep pitches, attacks, durations, gains, pans, distortion, tempo, and arrangement fixed so polyphony alone creates pressure. End after one fully occupied N=4 position, then cut dry. Use wholly original music and lyrics; do not reuse any existing melody, lyric, signature riff, recording, sample, or vocal likeness.
```
