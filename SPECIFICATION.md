# ロト＆ナンバーズ 統合構造解析・可視化システム 仕様書
**Version:** 1.1.0  
**作成日:** 2026-08-15  
**対象ディレクトリ:** C:\Users\tk030\Desktop\ロトナンバーズ可視化ツール

---

## 1. システム概要

### 1.1 目的・コンセプト
本システムは、ロト（ロト7・ロト6・ミニロト）およびナンバーズ（ナンバーズ4・ナンバーズ3）の過去出目データを解析・可視化するWebアプリケーションである。
※**買い目予想（買い目の自動生成・推奨）ではなく、過去出目データの純粋な構造解析・パターン分析・出目表可視化ツール**として構築する。

### 1.2 主な特徴
- **5種対応**: ロト7 / ロト6 / ミニロト / ナンバーズ4 / ナンバーズ3 を統一UIで切り替え可能。
- **Python版機能のTypeScript移植**: 従来のPython/Streamlit版の全解析機能（基本指標、F式頻度、スライドマクロ、出目表、メトリクス一覧、トレンドグラフ）をTypeScript/Reactへ移植。
- **機能拡張**: 数字個別詳細パネル、共起ペア分析、未出現スパン分析、出目表フィルター、ナンバーズ桁別ヒートマップ、基準回号選択（過去検証）、Markdownレポート出力機能を追加。
- **データ自動同期**: lotto-data-hub（GitHub Pages）から最新データを非同期自動取得。オフライン時は内蔵プリロードデータにフォールバック。
- **GitHub Pages公開対応**: 静的SPA（Single Page Application）としてビルド可能。
- **ミニマルダークUI**: プロジェクト統計ツールのデザインシステム（JetBlack / Zinc / Accent）に準拠。

---

## 2. 技術スタック・アーキテクチャ

| レイヤー | 採用技術 | 選定理由 |
| :--- | :--- | :--- |
| **言語** | TypeScript 5.6+ | 型安全性の確保、演算処理の安定化 |
| **フレームワーク** | React 18 + Vite 5 | SPA構築、高速ビルド、GitHub Pagesとの親和性 |
| **アイコン** | Lucide React | 軽量なSVGアイコン |
| **グラフライブラリ** | Recharts | 折れ線グラフ・領域表示の実装 |
| **スタイリング** | Vanilla CSS (CSS変数ベースのDesign Tokens) | プロジェクト統計ツールと同一のデザインシステム |
| **デプロイ** | gh-pages / GitHub Actions | GitHub Pagesでの静的ホスティング |

---

## 3. デザインシステム（プロジェクト統計ツール準拠）

- 背景: `--bg-app: #09090b`, `--bg-card: #121215`, `--bg-inset: #050506`
- ボーダー: `--border-color: #27272a`, `--border-color-hover: #3f3f46`
- テキスト: `--text-primary: #f4f4f5`, `--text-secondary: #a1a1aa`, `--text-muted: #71717a`
- アクセント: `--accent-blue: #3b82f6` (引っ張り), `--accent-emerald: #10b981` (スライド), `--accent-amber: #f59e0b` (通常当選), `--accent-rose: #f43f5e` (COLD/警告)
- フォント: `Inter`, `JetBrains Mono`

---

## 4. モジュール構成（1ファイル単機能設計）

```
ロトナンバーズ可視化ツール/
├── index.html                   # HTMLエントリー
├── package.json                 # 依存関係・ビルドスクリプト
├── tsconfig.json                # TypeScript設定
├── vite.config.ts               # Vite設定 (base path: ./ 対応)
├── README.md                    # ドキュメント
├── RECORD.md                    # 開発記録
├── SPECIFICATION.md             # 本仕様書
├── HANDOVER_SUMMARY.md          # 引き継ぎサマリー
└── src/
    ├── main.tsx                 # アプリ起動エントリー
    ├── App.tsx                  # メインコンポーネント (状態管理・画面統合)
    ├── index.css                # デザインシステム・トークン定義
    │
    ├── types/                   # 型定義
    │   ├── lottery.ts           # 抽選データ型 (Round, Numbers, Bonus, GameKey)
    │   ├── config.ts            # くじ種設定型 (GameConfig, Thresholds)
    │   └── analysis.ts          # 解析結果型 (Metrics, Frequency, MatrixCell, Synergy, Span)
    │
    ├── config/                  # 設定定数
    │   ├── games.ts             # ロト7/6/ミニ/N3/N4の各パラメータ定数
    │   └── preloadData.ts       # オフラインフォールバック用初期データ
    │
    ├── utils/                   # 解析ロジック・ユーティリティ
    │   ├── dataFetcher.ts       # lotto-data-hub からのデータ取得
    │   ├── lotoAnalyzer.ts      # ロト系指標解析 (奇偶, 合計, 連番, スライド, ±3マクロ)
    │   ├── numbersAnalyzer.ts   # ナンバーズ系指標解析 (型判定, 合計, 連番, スライド, 桁別分布)
    │   ├── frequencyAnalyzer.ts # F式出現頻度集計 (HOT/GOLD/RECOVERY/COLD)
    │   ├── spanAnalyzer.ts      # 未出現スパン（ハマり回数）集計
    │   ├── synergyAnalyzer.ts   # 共起ペア出現数集計
    │   ├── matrixBuilder.ts     # 出目表マトリクスデータ構築・ハイライト判定
    │   └── reportExporter.ts    # Markdown形式レポート出力
    │
    └── components/              # UIコンポーネント
        ├── Header.tsx           # ヘッダー (タイトル、くじ種セレクター、同期バッジ)
        ├── SidebarSettings.tsx  # サイドバー設定 (集計回数スライダー、基準回号選択、フィルター等)
        ├── IntegratedReport.tsx # 統合分析レポート (基本指標 + 出現頻度グリッド)
        ├── MetricCard.tsx       # 構成解析カード (奇偶、合計値、ゾーン、連番等)
        ├── FrequencyCard.tsx    # 出現頻度分類カード (HOT/GOLD/RECOVERY/COLD)
        ├── SlideMacroCard.tsx   # スライドマクロ分析カード (前々回±3流入検出)
        ├── SynergyCard.tsx      # 共起ペア相性分析カード
        ├── SpanRankingCard.tsx  # 未出現スパンランキングカード
        ├── DigitHeatmapCard.tsx # ナンバーズ桁別ヒートマップカード
        ├── NumberDetailModal.tsx# 数字個別詳細モーダル（クリック時の深掘り情報）
        ├── MacroTrendChart.tsx  # 合計値推移折れ線グラフ (Recharts)
        ├── RecentMetricsTable.tsx # 直近詳細メトリクス一覧テーブル
        ├── OccurrenceMatrix.tsx # 出目表 (色分けグリッド、フィルター対応)
        ├── MatrixLegend.tsx     # 出目表凡例バッジ
        └── Footer.tsx           # フッター (著作権、データ同期情報)
```

---

## 5. 分析・可視化機能仕様

### 5.1 構成解析
- **ロト系**: 奇偶比、合計値（黄金ゾーン判定）、数字帯分布（10区切り）、末尾被り、連番、引っ張り（前回重複）、スライド（前回±1）
- **ナンバーズ系**: 奇偶比、合計値（期待値ゾーン判定）、パターン型（シングル/ダブル/トリプル/フォース）、連番、引っ張り、スライド、桁別分布

### 5.2 スライド・マクロ分析 (川の流れ)
- 前々回の当選番号から周辺±3マス内に流入した数字を検出・可視化（ロト系）。

### 5.3 F式 出現頻度分類 (直近N回)
- **HOT**: 5回以上出現
- **GOLD**: 3〜4回出現
- **RECOVERY**: 2回出現
- **COLD**: 0〜1回出現

### 5.4 拡張分析機能
1. **数字個別詳細パネル**: 数字をクリックした際に対象数字の未出現スパン推移、直近出現回数、共起上位ペア、スライド流入実績を表示。
2. **共起ペア分析**: 直近N回で同時に出現したペアの出現頻度ランキングを集計・表示。
3. **未出現スパン分析**: 各数字の現在の連続未出現回数および過去最大スパンを集計・表示。
4. **ナンバーズ桁別ヒートマップ**: 百の位・十の位・一の位・千の位における各数字の出現分布を可視化。
5. **出目表インタラクティブフィルター**: 引っ張り・スライド・奇数・偶数・数字帯のハイライトトグル。
6. **基準回号選択（タイムトラベル検証）**: 最新回以外の過去の回号を基準点として指定し、その時点での解析結果・出目表を再計算して表示。
7. **Markdownレポート出力**: 分析結果およびメトリクスをMarkdownテキストとしてクリップボードに出力。

### 5.5 出目表 (Occurrence Matrix)
- ロト系: 1〜37（ロト7） / 1〜43（ロト6） / 1〜31（ミニロト） × 回号
- ナンバーズ系: 0〜9 × 回号（同一回の複数出現時は重複カウントバッジを表示）
- 配色: 引っ張り（青）、スライド（緑）、通常当選（黄）
- 表示モード: PC版（横スクロール） / スマホ版（縦最適化）

### 5.6 マクロトレンドグラフ
- 直近N回の合計値推移折れ線グラフ（Recharts）
- 黄金ゾーン上限・下限ライン、ナンバーズ中央期待値ラインの表示
- ホバー時の回号・日付・当選番号・合計値ツールチップ

### 5.7 直近詳細メトリクス一覧表
- 直近N回の回号別指標一覧テーブル
