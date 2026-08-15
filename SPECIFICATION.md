# ロト＆ナンバーズ 統合構造解析・可視化システム 仕様書
**Version:** 1.0.0  
**作成日:** 2026-08-15  
**対象ディレクトリ:** C:\Users\tk030\Desktop\ロトナンバーズ可視化ツール

---

## 1. システム概要

### 1.1 目的・コンセプト
本システムは、ロト（ロト7・ロト6・ミニロト）およびナンバーズ（ナンバーズ3・ナンバーズ4）の過去出目データを高精度に解析・可視化するWebアプリケーションである。
※**買い目予想（買い目の自動抽出・推奨）ではなく、純粋な出目データの構造分析・パターン解析・出目表可視化ツール**として構築する。

### 1.2 主な特徴
- **5種完全対応**: ロト7 / ロト6 / ミニロト / ナンバーズ3 / ナンバーズ4 を統一UIで切り替え可能。
- **機能無劣化＋高速化**: 従来のPython/Streamlit版の全解析機能（基本指標、F式頻度、スライドマクロ、出目表）を完全再現し、TypeScriptにより待ち時間ゼロ（0msラグ）で動作。
- **最新データ自動同期**: lotto-data-hub（GitHub Pages）から最新データを非同期自動取得。オフライン時は内蔵プリロードデータにフォールバック。
- **GitHub Pages公開対応**: 完全静的SPA（Single Page Application）としてビルド可能。
- **モダン・ミニマルダークUI**: 「プロジェクト統計ツール」のデザインシステム（JetBlack / Zinc / Neon Accent）を継承。

---

## 2. 技術スタック・アーキテクチャ

| レイヤー | 採用技術 | 選定理由 |
| :--- | :--- | :--- |
| **言語** | TypeScript 5.6+ | 型安全性の確保、高速な演算処理 |
| **フレームワーク** | React 18 + Vite 5 | SPA構築、高速ビルド、GitHub Pagesとの親和性 |
| **アイコン** | Lucide React | 軽量・高品質なモダンUIアイコン |
| **グラフライブラリ** | Recharts | レスポンシブで美しい折れ線グラフ・領域塗りつぶし |
| **スタイリング** | Vanilla CSS (CSS変数ベースのDesign Tokens) | 「プロジェクト統計ツール」と同一の洗練されたデザインシステム |
| **デプロイ** | gh-pages / GitHub Actions | GitHub Pagesでの無料・高速ホスティング |

---

## 3. デザインシステム（プロジェクト統計ツール準拠）

- 背景: --bg-app: #09090b, --bg-card: #121215, --bg-inset: #050506
- ボーダー: --border-color: #27272a, --border-color-hover: #3f3f46
- テキスト: --text-primary: #f4f4f5, --text-secondary: #a1a1aa, --text-muted: #71717a
- アクセント: --accent-blue: #3b82f6 (引っ張り), --accent-emerald: #10b981 (スライド), --accent-amber: #f59e0b (通常当選), --accent-rose: #f43f5e (COLD/警告)
- フォント: Inter, JetBrains Mono

---

## 4. モジュール構成（1ファイル単機能設計）

`
ロトナンバーズ可視化ツール/
├── index.html                   # HTMLエントリー
├── package.json                 # 依存関係・ビルドスクリプト
├── tsconfig.json                # TypeScript設定
├── vite.config.ts               # Vite設定 (base path: ./ 対応)
├── README.md                    # ドキュメント (現行Python版流用配置済)
├── SPECIFICATION.md             # 本仕様書
└── src/
    ├── main.tsx                 # アプリ起動エントリー
    ├── App.tsx                  # メインコンポーネント (状態管理・ルーティング)
    ├── index.css                # デザインシステム・デザイントークン
    │
    ├── types/                   # 型定義 (1ファイル1責任)
    │   ├── lottery.ts           # 抽選データ型 (Round, Numbers, GameKey)
    │   ├── config.ts            # くじ種設定型 (GameConfig, Thresholds)
    │   └── analysis.ts          # 解析結果型 (Metrics, Frequency, MatrixCell)
    │
    ├── config/                  # 設定定数
    │   ├── games.ts             # ロト7/6/ミニ/N3/N4の各パラメータ定数
    │   └── preloadData.ts       # オフラインフォールバック用初期データ
    │
    ├── utils/                   # 純粋関数ロジック (1ファイル1機能)
    │   ├── dataFetcher.ts       # lotto-data-hub からの非同期データフェッチ
    │   ├── lotoAnalyzer.ts      # ロト系指標解析 (奇偶, 合計, 連番, スライド, ±3マクロ)
    │   ├── numbersAnalyzer.ts   # ナンバーズ系指標解析 (型判定, 合計, 連番, スライド)
    │   ├── frequencyAnalyzer.ts # F式出現頻度集計 (HOT/GOLD/RECOVERY/COLD)
    │   └── matrixBuilder.ts     # 出目表マトリクスデータ構築・ハイライト判定
    │
    └── components/              # UIコンポーネント (単機能分割)
        ├── Header.tsx           # ヘッダー (タイトル、くじ種セレクター、同期バッジ)
        ├── SidebarSettings.tsx  # サイドバー設定 (集計回数スライダー、PC/スマホ切替)
        ├── IntegratedReport.tsx # 統合分析レポート (基本指標 + 出現頻度グリッド)
        ├── MetricCard.tsx       # 構成解析カード (奇偶、合計値、ゾーン、連番等)
        ├── FrequencyCard.tsx    # 出現頻度分類カード (HOT/GOLD/RECOVERY/COLD)
        ├── MacroTrendChart.tsx  # 合計値推移折れ線グラフ (期待ゾーンガイドライン付)
        ├── RecentMetricsTable.tsx # 直近詳細メトリクス一覧テーブル
        ├── OccurrenceMatrix.tsx # 出目表 (横軸数字/縦軸回号・色分けグリッド)
        ├── MatrixLegend.tsx     # 出目表凡例バッジ
        └── Footer.tsx           # フッター (著作権、データ同期情報)
`

---

## 5. 分析・可視化詳細仕様

### 5.1 対象くじ種
- **ロト7 / ロト6 / ミニロト**: 奇偶比、合計値(黄金ゾーン)、数字帯(10区切り)、末尾被り、連番、引っ張り(前回)、スライド(前回±1)、前々回±3マクロ、F式出現頻度、出目表(1〜37/43/31)。
- **ナンバーズ3 / ナンバーズ4**: 奇偶比、合計値(期待値ゾーン)、パターン型(シングル/ダブル/トリプル/フォース)、連番、引っ張り、スライド、F式出現頻度(0〜9)、出目表(0〜9、重複バッジ)。

### 5.2 データ同期
- https://tk030-lotto.github.io/lotto-data-hub/data/.json から起動時および切替時に自動同期。
- オフライン時は内蔵プリロードデータで即時稼働。
