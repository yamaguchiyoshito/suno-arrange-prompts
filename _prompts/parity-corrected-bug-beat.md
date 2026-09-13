---
schema_version: 1
prompt_id: suno-000229
slug: parity-corrected-bug-beat
title: 最終ビットが故障を訂正するバグ・ビート
description: Hi'Spec「BUG feat. ABC」から着想を得た、15打点の偶奇を16番目の検査打で常に偶数へ補正するデジタル・ラップ。
bpm: 90
vocals: vocal
tags:
  - hispec
  - idm
  - vocal
  - drum-machine
  - synth-bass
  - sampler
  - loop-based
  - dynamic-contrast
tip_label: 調整するなら
tip: 検査打を識別しやすくする場合は、16番目だけを短い電子クリックに固定し、他の位置では使いません。
status: published
order: 2290
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create a sixteen-step original drum-machine bar at 90 BPM. Use steps 1-15 as data bits with the initial pattern 101001011001010. Step 16 is a parity hit: sound it only when the first fifteen steps contain an odd number of hits, so every complete bar always contains an even number. Build five eight-bar sections. Section one uses the initial data. In sections two through five, deliberately flip only data steps 3, 7, 11, and 15 respectively, accumulating the faults; recalculate step 16 after each flip. Keep all other attacks, sounds, velocities, bass, and original rap fixed. Make step 16 a unique click and never use that click elsewhere. Do not randomize or repair the flipped data bits. Use only original performances, melodies, lyrics, samples, and recordings created for this piece. Do not imitate the source artist's melody, lyrics, vocal flow, signature rhythm, sound design, or recording.
```
