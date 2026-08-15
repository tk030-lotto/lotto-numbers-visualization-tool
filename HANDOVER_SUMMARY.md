# ロト＆ナンバーズ 統合構造解析・可視化ツール 開発引き継ぎサマリー

## 1. プロジェクト概要・コンセプト
- **基本コンセプト**: 現行のPython/Streamlit版「可視化ツール」をTypeScriptに完全移植し、さらに「ナンバーズ（N3・N4）」の構造解析・出目表をシームレスに追加統合する。
- **ツール性質**: 買い目予想（自動生成・抽出）ではなく、**過去出目データの純粋な構造解析・パターン分析・出目表可視化ツール**。
- **対象くじ種**: ロト7 / ロト6 / ミニロト / ナンバーズ3 / ナンバーズ4（全5種）
- **公開形態**: GitHub Pages（静的SPAビルド）

---

## 2. 技術スタック・デザイン仕様
- **フレームワーク**: React 18 + Vite 5 (TypeScript 5.6+)
- **モジュール設計**: 1ファイル1機能（単一責任原則）
- **UIデザイン**: 「プロジェクト統計ツール」の洗練されたミニマルダークデザインを継承
  - 背景: --bg-app: #09090b, --bg-card: #121215, --bg-inset: #050506
  - ボーダー: --border-color: #27272a
  - テキスト: --text-primary: #f4f4f5, --text-secondary: #a1a1aa, --text-muted: #71717a
  - アクセント: 引っ張り #3b82f6 (Blue), スライド #10b981 (Emerald), 通常当選 #f59e0b (Amber), COLD #f43f5e (Rose)
  - フォント: Inter, JetBrains Mono
- **アイコン**: Lucide React
- **グラフ**: Recharts (折れ線グラフ + 期待値帯ガイドライン)

---

## 3. データ取得仕様
- **データ取得元**: 公開済みライト版と同じデータハブ方式
  - エンドポイント: https://tk030-lotto.github.io/lotto-data-hub/data/.json
  - 対象キー: loto7, loto6, miniloto, 
umbers3, 
umbers4
- **動作仕様**:
  - アプリ起動時およびくじ種切り替え時にバックグラウンドで最新JSONを自動非同期フェッチ。
  - ヘッダーに同期バッジを表示（🟢 同期完了 / 🟡 同期中 / ⚪ オフライン）。
  - オフライン時や通信失敗時は、内蔵プリロードデータにフォールバック。

---

## 4. 分析・可視化機能（Python版の完全再現＋ナンバーズ統合）
1. **統合分析レポート**:
   - 🟦 **構成解析**: 奇偶比、合計値(黄金ゾーン/期待値ゾーン判定)、数字帯(10区切り)、末尾被り、連番、引っ張り(前回重複)、スライド(前回±1)、ナンバーズ型判定(シングル/ダブル/トリプル等)
   - 🟩 **スライド・マクロ分析 (ロト)**: 前々回(±3)からの流入検出
   - 🟧 **出現頻度 (F式 / 直近N回)**: GOLD(3-4回) / HOT(5回以上) / RECOVERY(2回) / COLD(0-1回)
2. **マクロトレンドグラフ**: 直近N回の合計値推移折れ線グラフ（黄金ゾーン上下限ライン、ナンバーズ中央期待値ライン付）
3. **直近詳細メトリクス一覧表**: 直近N回の回号別指標一覧
4. **出目表 (Occurrence Matrix)**:
   - ロト系: 1〜37/43/31 × 回号
   - ナンバーズ系: 0〜9 × 回号（同回複数出現時の重複カウントバッジ付）
   - 配色: 引っ張り(青)、スライド(緑)、通常当選(黄)
5. **表示設定**: PC版(横長)/スマホ版(縦長)切替、集計回数スライダー(10〜100)、トレンド回数スライダー、メトリクス表示数スライダー

---

## 5. 推奨ファイル構成（1ファイル単機能）
`
ロトナンバーズ可視化ツール/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md (配置済)
├── SPECIFICATION.md (配置済)
├── HANDOVER_SUMMARY.md (本ファイル)
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/ (lottery.ts, config.ts, analysis.ts)
    ├── config/ (games.ts, preloadData.ts)
    ├── utils/ (dataFetcher.ts, lotoAnalyzer.ts, numbersAnalyzer.ts, frequencyAnalyzer.ts, matrixBuilder.ts)
    └── components/ (Header.tsx, SidebarSettings.tsx, IntegratedReport.tsx, MetricCard.tsx, FrequencyCard.tsx, MacroTrendChart.tsx, RecentMetricsTable.tsx, OccurrenceMatrix.tsx, MatrixLegend.tsx, Footer.tsx)
`

---

## 6. 次のアクション（新ワークスペースでの作業内容）
1. 
pm install または package.json のセットアップ（eact, eact-dom, lucide-react, echarts, ite, 	ypescript, @types/* 等）
2. src/index.css にプロジェクト統計ツール準拠のデザインシステムトークン・スタイルを構築
3. src/types/ および src/config/ の作成（5種の定数とオフラインプリロードデータ）
4. src/utils/ の解析ロジックおよびデータフェッチャーの実装
5. src/components/ の各UIコンポーネント実装
6. 
pm run build による検証および動作確認
