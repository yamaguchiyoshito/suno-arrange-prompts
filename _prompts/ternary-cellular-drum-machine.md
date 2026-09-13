---
schema_version: 1
prompt_id: suno-000286
slug: ternary-cellular-drum-machine
title: 三状態セルが自己更新する十二分割ドラム機械
description: doooo「Brain Maschine」から着想を得た、休符・リム・スネアの十二セルを左隣との三進加算で六世代更新する機械ビート。
bpm: 92
vocals: instrumental
tags:
  - doooo
  - idm
  - instrumental
  - drum-machine
  - sampler
  - fm-synth
  - loop-based
  - recurring-motif
tip_label: 調整するなら
tip: 世代更新を検証する場合は、各小節の十二状態をMIDI名として保存し、左端セルでは十二番目を左隣として計算してください。
status: published
order: 2860
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create instrumental machine hip-hop at 92 BPM on a twelve-step grid per bar. Represent each step by 0 for silence, 1 for rim, or 2 for snare. Start with this circular seed row: 1,0,2,0,1,0,0,2,0,1,0,0. For every following bar, update all twelve cells simultaneously with new[i] = (old[i] + old[i-1]) modulo 3, treating cell 11 as the left neighbor of cell 0. Render exactly six generations as six consecutive bars, then repeat the resulting six-bar supercycle.

Keep a kick fixed at steps 0, 3, 6, and 9 and place an original three-note FM-bass figure beneath the evolving rim/snare row. Do not add fills, randomization, swing, or manual corrections. A short bridge may mute the kick while the cellular row continues. Use only newly synthesized or recorded sounds and wholly original composition. Do not imitate doooo, the referenced track, its groove, timbres, riffs, recording, or samples.
```
