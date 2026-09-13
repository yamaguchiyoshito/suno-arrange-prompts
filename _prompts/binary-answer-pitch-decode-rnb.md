---
schema_version: 1
prompt_id: suno-000237
slug: binary-answer-pitch-decode-rnb
title: 四打の質問を低音で解読するR&B
description: AI「I Wanna Know」から着想を得た、四拍の有無を二進数として読み、次小節の低音音級で回答するDJ WATARAI系R&B。
bpm: 86
vocals: vocal
tags:
  - dj-watarai
  - minimal-rnb
  - vocal
  - drums
  - synth-bass
  - electric-piano
  - call-response
  - sparse-arrangement
tip_label: 調整するなら
tip: 二進変換を示す場合は、質問小節の四位置を同じクリック音にし、回答小節では打楽器を完全に休ませます。
status: published
order: 2370
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Build an original 86 BPM R&B call-and-response from six two-bar units. In each first bar, treat beats 1-4 as a four-bit question, where a dry click means 1 and silence means 0. Use this exact code order: 0011, 0101, 0110, 1001, 1010, 1100. Read each as a binary integer and reduce 12 to pitch class 0; in the following answer bar, remove all clicks and let the bass sustain that resulting pitch class for four beats. An original singer may phrase only in question bars, while a fixed electric-piano chord may sound only in answer bars. Repeat the six-unit sequence twice without changing codes, pitches, tempo, or dynamics. Do not add drums to answer bars or bass to question bars. Use only original performances, melodies, lyrics, samples, and recordings created for this piece. Do not imitate the source artist's melody, lyrics, vocal flow, signature rhythm, sound design, or recording.
```
