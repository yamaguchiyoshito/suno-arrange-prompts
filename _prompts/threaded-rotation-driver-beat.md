---
schema_version: 1
prompt_id: suno-000268
slug: threaded-rotation-driver-beat
title: 一周後も暗くねじ込まれる回転ビート
description: MASS-HOLE「driver」から着想を得た、十六打ドラムを毎小節一目盛り回し、同時に和音の遮断周波数を半音比で下げ続けるビート。
bpm: 75
vocals: instrumental
tags:
  - mass-hole
  - abstract-hip-hop
  - instrumental
  - drums
  - sampler
  - synth-bass
  - phase-shift
  - irreversible-form
tip_label: 調整するなら
tip: 回転と暗化を分離して確認するため、ドラムだけを毎小節一つ右へ移し、遮断周波数だけを2の−1/12乗倍してください。
status: published
order: 2680
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create an instrumental abstract hip-hop beat using MASS-HOLE's “driver” only as a high-level structural reference. Write one original sixteen-slot drum pattern and rotate the entire pattern exactly one sixteenth note to the right at every barline. After sixteen bars the drum onsets must return to their starting positions. Simultaneously pass one repeating sampled chord through a low-pass filter beginning at 8 kHz; at each barline multiply cutoff by 2^(-1/12), the frequency ratio of one descending equal-tempered semitone. Never reset that filter, so when rhythm returns, the chord is sixteen semitones darker in cutoff ratio. Keep chord pitch, bass, velocity, resonance, and tempo fixed. At bar 17 present the restored drum grid against the darkened chord for one bar, then stop without reopening the filter. Use original material, melodies, lyrics, and recordings only; never imitate MASS-HOLE or the source track.
```
