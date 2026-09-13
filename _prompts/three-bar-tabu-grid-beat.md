---
schema_version: 1
prompt_id: suno-000231
slug: three-bar-tabu-grid-beat
title: 三小節以内の再訪を禁じるタブー・ビート
description: Hi'Spec「Don't Do」から着想を得た、四つの打音が直近三小節で使った位置を再利用できない制約型ビート。
bpm: 92
vocals: instrumental
tags:
  - hispec
  - abstract-hip-hop
  - instrumental
  - drums
  - sampler
  - synth-bass
  - loop-based
  - irreversible-form
tip_label: 調整するなら
tip: 抑制された打点を確認する場合は、その位置へ音を足さず、短い完全無音をそのまま残します。
status: published
order: 2310
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Use a sixteen-step bar at 92 BPM with four original percussion voices. Start kick, snare, rim, and hat at steps 1, 5, 9, and 13. After every bar, advance their pointers by 4, 6, 8, and 10 steps modulo sixteen. Before sounding a proposed attack, check that voice's positions in the preceding three bars. If the same voice used that step during that window, suppress the attack but still advance its pointer normally on the next bar; never substitute another position. Run the rule for sixteen bars, repeat the resulting sixteen-bar form once, and place a fixed one-note bass only on step 1. Do not add repair hits, fills, swing, or random variation. Use only original performances, melodies, lyrics, samples, and recordings created for this piece. Do not imitate the source artist's melody, lyrics, vocal flow, signature rhythm, sound design, or recording.
```
