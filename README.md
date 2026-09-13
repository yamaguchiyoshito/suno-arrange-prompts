# Suno アレンジプロンプト

プロンプトを1件1 Markdownで管理し、GitHub Pages上でキーワード検索とタグ絞り込みを行う静的カタログです。

## 設計方針

- `_prompts/` がプロンプト本文とメタデータの唯一の正本です。`index.html`へカードを追記しません。
- `_prompts/` はフラットに保ちます。ジャンル変更でファイル移動や履歴分断が起きないよう、分類はタグへ寄せます。
- 添付やメモを取り込む際は、原則として1コードブロックを1プロンプトとして保持します。内容が近い案も、編成・リズム・展開の差があれば別バリエーションとして管理します。
- タグには英数字の不変IDを使い、表示名と別名は `_data/tags.yml` で一元管理します。
- プロデューサーを指定した着想案は `producer` タグ、レーベルを指定した着想案は `source` タグで保持し、GitHub Pagesから着想元単位で絞り込めます。
- GitHub Pages標準のJekyllがMarkdownから一覧を生成します。npmや外部JavaScriptは使いません。
- JavaScript無効時も全プロンプトを閲覧・手動コピーできます。検索とコピーボタンだけが段階的に追加されます。

## ディレクトリ構成

```text
.
├── _config.yml                 # Jekyllと公開対象の設定
├── _prompts/                   # 1プロンプト＝1 Markdown（分類別に分けない）
├── _data/
│   └── tags.yml                # タグID、表示名、分類、検索別名
├── _includes/
│   └── prompt-card.html        # Markdownをカードへ変換する共通テンプレート
├── _layouts/
│   └── default.html            # 全体HTML
├── assets/
│   ├── css/site.css            # 表示とレスポンシブ対応
│   └── js/catalog.js           # 検索、URL同期、コピー
├── scripts/
│   └── validate_content.rb     # Front Matter、ID、タグ、本文の検証
├── templates/
│   └── prompt.md               # 新規原稿の雛形
├── .github/workflows/
│   └── validate.yml            # push / pull request時の自動検証
├── Gemfile                     # ローカルJekyll環境
├── index.html                  # 検索UIとCollectionの描画
└── README.md
```

`.nojekyll` は置きません。存在するとGitHub Pagesが `_prompts`、`_data`、Liquidテンプレートを処理できません。

## Markdownの形式

ファイル名は `<slug>.md` と一致させます。本文にはSunoへコピーする1000文字以下の文字列だけを、1個の `text` コードブロックで記述します。文字数はRubyの `String#length` で判定します。

````markdown
---
schema_version: 1
prompt_id: suno-000007
slug: piano-ballad-slow-rise
title: 静かに立ち上がるピアノバラード
description: 音数を抑え、ピアノとストリングスを緩やかに広げます。
bpm: 68
vocals: instrumental
tags:
  - piano-ballad
  - instrumental
  - piano
  - gradual-build
tip_label: 調整するなら
tip: soft pulseをno percussionへ変えると、拍の輪郭をさらに弱められます。
status: published
order: 70
created_at: "2026-09-12"
updated_at: "2026-09-12"
---

```text
Instrumental piano ballad at 68 BPM. ...
```
````

`status` が `published` の原稿だけを一覧へ出します。作業途中は `draft`、掲載終了後は `archived` にします。

テンポが書かれていない原稿は `bpm: null`、範囲指定は `bpm: null` と `bpm_range: [120, 130]` を併用します。画面にはそれぞれ「BPM指定なし」「120–130 BPM」と表示されます。

## プロンプトを追加する

1. `templates/prompt.md` を `_prompts/<slug>.md` へコピーします。
2. `prompt_id` を既存と重複しない `suno-` + 6桁の番号へ変更します。公開順は `order` で別に制御します。
3. `slug` とファイル名を同じASCII kebab-caseにします。一度公開した `prompt_id` と `slug` は変更しません。
4. `_data/tags.yml` に存在するタグIDを指定します。ジャンル、歌唱、楽器、展開を最低1件ずつ付けます。
5. 本文の `text` コードブロックへ、Sunoにコピーするプロンプトだけを書きます。
6. `status: published` にする前に検証を実行します。

```bash
ruby scripts/validate_content.rb
node --check assets/js/catalog.js
bundle exec jekyll build --baseurl /suno-arrange-prompts
ruby scripts/verify_site.rb _site /suno-arrange-prompts
```

検証は未知タグ、重複prompt ID、重複slug、ファイル名不一致、日付不正、BPM範囲外、本文形式不正、本文の1000文字超過に加え、生成後のカード件数、HTML ID、ARIA参照、コピー参照、プロジェクトサイト配下のアセットURLも確認します。

## タグを追加する

`_data/tags.yml` に次の形式で追加します。

```yaml
- id: synth-pad
  label: シンセパッド
  group: instrument
  group_label: 楽器
  aliases: [synth pad, ambient pad, パッド]
```

ルールは次のとおりです。

- `id` はURLに保存される不変値です。表示名を変えても `id` は変えません。ジャンルタグだけはカード見出し用の英字 `code` も持ちます。
- `group: source` は着想元レーベルの任意タグです。同一レーベルの候補を横断検索するときに使用します。
- `label` は画面表示、`aliases` はキーワード検索だけに使います。
- 別タグ間で `label` と `aliases` を重複させません。
- 既存IDを別の意味へ再利用しません。

## 検索仕様

- キーワードはタイトル、説明、BPM、英語プロンプト、タグID、表示名、別名を対象に部分一致します。
- 入力値はNFKC正規化と小文字化を行います。空白で区切った複数語はAND条件です。
- 同じ分類で複数タグを選ぶとOR、異なる分類をまたぐとANDです。
- 条件は `?q=ピアノ&tag=vocal&tag=gradual-build` の形式でURLへ保存され、再読込・共有・戻る操作で復元されます。
- 未知のタグIDがURLに含まれていても無視します。

## ローカルで確認する

初回だけJekyllをインストールします。Ruby 3.1以降とBundlerが必要です。

```bash
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve
```

起動後に `http://127.0.0.1:4000/` を開きます。`index.html`を直接開いてもLiquidは展開されないため、必ずJekyll経由で確認してください。

確認項目は次の5点です。

1. 公開件数とカード件数が一致する。
2. 同一分類の複数タグがOR、分類をまたぐタグがANDで動く。
3. 検索後のURLを別タブで開いて同じ条件が復元される。
4. コピーボタンから本文だけをコピーできる。
5. スマートフォン幅でも検索欄、タグ、カードが横にはみ出さない。

## GitHub Pagesで公開する

1. このディレクトリ一式をGitHubリポジトリの `main` ブランチへ追加します。
2. **Settings → Pages → Build and deployment** を開きます。
3. **Source** を **Deploy from a branch** にします。
4. **Branch** は `main`、フォルダは `/(root)` を選びます。
5. Actionsで `Validate prompt catalog` とPagesのビルドが成功したことを確認します。
6. Pagesの公開URLで検索、URL再現、コピー、スマートフォン表示を確認します。

プロジェクトサイトでもCSSとJavaScriptのURLが壊れないよう、テンプレート内の公開パスにはJekyllの `relative_url` を使用しています。

参考：[GitHub公式：Setting up a GitHub Pages site with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)

## 掲載内容の適用範囲

- 掲載プロンプトと調整案は、Sunoによる音源生成・試聴が未実施です。
- 参照曲名・アーティスト名を含む項目は、添付原稿の出典文脈を残した独立したアレンジ指示であり、公式設定や再現性を保証する情報ではありません。
- BPM、楽器、曲構成は生成への指示であり、結果を固定する設定ではありません。
- 歌詞はLyrics欄、編成や音の指示はStyle／Styles欄へ入力します。
- 本サイトはSunoの公式サイトではありません。
