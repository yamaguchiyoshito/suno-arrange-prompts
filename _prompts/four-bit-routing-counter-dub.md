---
schema_version: 1
prompt_id: suno-000262
slug: four-bit-routing-counter-dub
title: 四つの打音で二進数を数えるダブ
description: 16FLIP「Clark Dub」から着想を得た、一小節四打のドライ／遅延ルーティングを四ビットとして0000から1111まで数えるダブ。
bpm: 76
vocals: instrumental
tags:
  - 16flip
  - dub
  - instrumental
  - drums
  - sampler
  - synth-bass
  - hard-splice
  - loop-based
tip_label: 調整するなら
tip: 二進数を判別できるよう、1はドライのみ、0は遅延のみとし、四つの打点自体は毎小節必ず鳴らしてください。
status: published
order: 2620
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create an instrumental dub sequence using 16FLIP's “Clark Dub” only as a high-level point of departure. Place four identical original chord stabs on beats 1, 2, 3, and 4 of every bar, treating them as an 8-4-2-1 four-bit word. Count one bar at a time from 0000 through 1111. For a bit value of 1, route that stab dry-only; for 0, mute its dry signal and route it delay-only through a fixed one-dotted-eighth echo with one repeat. Every stab must still trigger, and routing must switch instantly at barlines. Keep pitches, velocities, bass, drums, delay time, and feedback unchanged across all sixteen bars. Do not smooth transitions or add fills. Bar 0000 is all echo-shadow; bar 1111 is fully dry. After 1111, play one silent bar instead of wrapping to 0000. Use original material, melodies, lyrics, and recordings only; never imitate 16FLIP or the source track.
```
