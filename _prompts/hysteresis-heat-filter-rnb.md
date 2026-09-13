---
schema_version: 1
prompt_id: suno-000290
slug: hysteresis-heat-filter-rnb
title: 二つの音圧閾値で開閉する発汗フィルター
description: Aru-2「Ase feat. Daichi Yamamoto」から着想を得た、−14LUFSで開き−20LUFSで閉じるヒステリシス制御の熱気あるR&B。
bpm: 94
vocals: vocal
tags:
  - aru-2
  - alternative-rnb
  - vocal
  - analog-pad
  - synth-bass
  - drums
  - timbre-morph
  - dynamic-contrast
tip_label: 調整するなら
tip: フィルターが頻繁に反転する場合は、判定窓を二小節に固定し、−20から−14LUFSの間では直前状態を必ず保持してください。
status: published
order: 2900
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create heated vocal alternative R&B at 94 BPM with drums, synth bass, electric piano, one analog pad, and an original rap-sung lead. Analyze the unfiltered full mix in consecutive two-bar blocks. Control only the pad's low-pass filter with two thresholds: after two bars louder than -14 LUFS integrated, switch from the closed 800 Hz state to the open 8 kHz state; after two bars quieter than -20 LUFS, switch back to 800 Hz. Between -20 and -14 LUFS, retain the previous state without change.

Construct eight two-bar blocks at -22,-18,-13,-16,-19,-21,-17, and -13 LUFS respectively, so open, hold, and close behavior can be checked. Do not let the filtered pad affect the detector input and do not smooth state changes. Use wholly original melody, harmony, lyrics, performances, recordings, and synthesis. Do not imitate Aru-2, the referenced track, its rapper, recognizable flow, riffs, recording, or samples.
```
