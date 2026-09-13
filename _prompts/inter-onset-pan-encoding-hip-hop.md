---
schema_version: 1
prompt_id: suno-000222
slug: inter-onset-pan-encoding-hip-hop
title: 打点間隔を定位へ符号化するパン・リズム
description: MURO「Pan Rhythm」から着想を得た、直前の打点間隔を数値変換し、次の打音の左右位置へ割り当てるインスト・ヒップホップ。
bpm: 94
vocals: instrumental
tags:
  - muro
  - abstract-hip-hop
  - instrumental
  - drums
  - sampler
  - synth-bass
  - stereo-motion
  - loop-based
tip_label: 調整するなら
tip: 定位変換を明瞭にする場合は、全打音を同一の短いワンショットにし、残響とステレオ拡張を使いません。
status: published
order: 2220
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Build an instrumental 94 BPM hip-hop loop on thirty-two sixteenth-note slots. Place eight identical original percussion attacks using the cyclic preceding-gap list 1, 2, 3, 4, 5, 6, 7, 4, which totals thirty-two. Encode each attack's preceding gap g as its pan value: g=1 is 100% left, g=2 is 67% left, g=3 is 33% left, g=4 is center, g=5 is 33% right, g=6 is 67% right, and g=7 is 100% right. Begin with two mono repetitions, then apply the encoding for eight repetitions, then invert every pan sign for four repetitions. Keep the onset list, timbre, velocity, bass line, and level fixed. Use no stereo reverb or moving automation between hits. Use only original performances, melodies, lyrics, samples, and recordings created for this piece. Do not imitate the source artist's melody, lyrics, vocal flow, signature rhythm, sound design, or recording.
```
