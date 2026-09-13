---
schema_version: 1
prompt_id: suno-000205
slug: masking-threshold-reveal-ambient
title: マスキング閾値で一層ずつ現れるアンビエント
description: INOYAMALAND「Glass Chime（2018 New Master）」に着想を得た、固定レベルの四持続音を、個別校正した四つのノイズ帯域で一音ずつ露出・再遮蔽するアンビエント。
bpm: null
vocals: instrumental
tags:
  - ambient
  - instrumental
  - analog-pad
  - beatless
  - even-dynamics
tip_label: 調整するなら
tip: 露出順を明確にする場合は、各音周辺の1/3オクターブ・ノイズを個別に校正し、対応帯域以外のレベルを変えないでください。
status: published
order: 2050
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create beatless original ambient from four continuous pure tones at 250, 500, 1000, and 2000 Hz, matched for perceived loudness. Keep every tone's gain, pan, and duration fixed. Cover each tone with its own one-third-octave pink-noise band centered on that frequency. Calibrate each mask separately by raising it from silence to the minimum level that just makes its tone inaudible. Every sixteen seconds, attenuate exactly one mask by 18 dB, in order 2000, 1000, 500, then 250 Hz, revealing one new tone while all other mask levels remain fixed. Hold all four reveals, then restore the masks one at a time in reverse order. Use instantaneous changes, no fades, modulation, rhythm, added attacks, or master automation. End after every tone is masked again. Use wholly original tones and sound design; do not reuse any existing melody, recording, sample, or signature sound, and do not imitate the source artists.
```
