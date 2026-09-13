---
schema_version: 1
prompt_id: suno-000202
slug: least-foreground-time-scheduler-pop
title: 最少前景時間を優先するBGMスケジューラ
description: SUPERCAR「BGM」に着想を得た、累積前景時間が最少のパートだけを四小節ごとに前面へ出し、四役の露出を均等化するエレクトロニックポップ。
bpm: 118
vocals: vocal
tags:
  - electronic-pop
  - vocal
  - electric-guitar
  - bass-guitar
  - fm-synth
  - drum-machine
  - role-exchange
  - even-dynamics
tip_label: 調整するなら
tip: 選択規則が曖昧な場合は、四小節単位の途中で前景役を交代せず、同点時の優先順も固定してください。
status: published
order: 2020
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Create a 118 BPM vocal electronic-pop track with clean guitar, synth bass, FM keys, and drum machine. Divide the arrangement into twelve four-bar blocks and keep a cumulative count of foreground blocks for each role. At every boundary, select only the role with the least foreground time. Break ties by rotating from the role after the previous winner; begin guitar→bass→keys→drums. Render the selected role dry, wide, and at reference level. Render all other roles mono, 18 dB lower, and low-passed at 3 kHz. Never alter notes, rhythm, timbre, or the role during a block. Keep one original centered vocal and its level unchanged; it never enters the scheduler. End after block twelve with all four roles cut together. Use wholly original harmony, melody, lyrics, recordings, and sounds; do not imitate any identifiable song, riff, arrangement, or vocal likeness.
```
