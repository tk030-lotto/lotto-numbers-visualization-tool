# ロト＆ナンバーズ 統合構造解析・可視化ツール 開発引き継ぎサマリー

## 1. プロジェクト概要・コンセプト
- **基本コンセプト**: Python/Streamlit版「可視化ツール」の全機能をTypeScriptに移植し、「ナンバーズ（N3・N4）」の構造解析・出目表および7つの拡張分析機能を追加統合する。
- **ツール性質**: 買い目予想（自動生成・抽出）ではなく、**過去出目データの純粋な構造解析・パターン分析・出目表可視化ツール**。
- **対象くじ種**: ロト7 / ロト6 / ミニロト / ナンバーズ3 / ナンバーズ4（全5種）
- **公開形態**: GitHub Pages（静的SPAビルド、`npm run build` / `gh-pages`）
- **作業ディレクトリ**: `C:\Users\tk030\Desktop\ロトナンバーズ可視化ツール`

---

## 2. 技術スタック・デザイン仕様
- **フレームワーク**: React 18 + Vite 5 (TypeScript 5.6+)
- **モジュール設計**: 1ファイル1機能（単一責任原則に準拠したディレクトリ分割）
- **UIデザイン**: 「プロジェクト統計ツール」のミニマルダークデザインを継承
  - 背景: `--bg-app: #09090b`, `--bg-card: #121215`, `--bg-inset: #050506`
  - ボーダー: `--border-color: #27272a`, `--border-color-hover: #3f3f46`
  - テキスト: `--text-primary: #f4f4f5`, `--text-secondary: #a1a1aa`, `--text-muted: #71717a`
  - アクセント: 引っ張り `#3b82f6` (Blue), スライド `#10b981` (Emerald), 通常当選 `#f59e0b` (Amber), COLD `#f43f5e` (Rose)
  - フォント: `Inter`, `JetBrains Mono`
- **アイコン**: `lucide-react`
- **グラフ**: `recharts` (合計値推移折れ線グラフ + 期待値帯/黄金ゾーンガイドライン)

---

## 3. データ取得仕様
- **データ取得元**: 公開済みデータハブ方式
  - エンドポイント: `https://tk030-lotto.github.io/lotto-data-hub/data/${gameKey}.json`
  - 対象キー: `loto7`, `loto6`, `miniloto`, `numbers3`, `numbers4`
- **動作仕様**:
  - アプリ起動時およびくじ種切り替え時にバックグラウンドで最新JSONを自動非同期フェッチ。
  - ヘッダーに同期ステータスバッジを表示（🟢 同期完了 / 🟡 同期中 / ⚪ オフライン）。
  - オフライン時や通信失敗時は、内蔵プリロードデータにフォールバック。

---

## 4. 分析・可視化機能（Python版再現 ＋ ナンバーズ統合 ＋ 拡張機能）
1. **統合分析レポート**:
   - 構成解析: 奇偶比、合計値(黄金ゾーン/期待値ゾーン判定)、数字帯(10区切り)、末尾被り、連番、引っ張り(前回重複)、スライド(前回±1)、ナンバーズ型判定(シングル/ダブル/トリプル/フォース)
   - スライド・マクロ分析 (ロト): 前々回(±3)からの流入検出
   - 出現頻度 (F式 / 直近N回): GOLD(3-4回) / HOT(5回以上) / RECOVERY(2回) / COLD(0-1回)
2. **マクロトレンドグラフ**: 直近N回の合計値推移折れ線グラフ（黄金ゾーン上下限ライン、ナンバーズ中央期待値ライン付）
3. **直近詳細メトリクス一覧表**: 直近N回の回号別指標一覧
4. **出目表 (Occurrence Matrix)**:
   - ロト系: 1〜37/43/31 × 回号
   - ナンバーズ系: 0〜9 × 回号（同回複数出現時の重複カウントバッジ付）
   - 配色: 引っ張り(青)、スライド(緑)、通常当選(黄)
5. **拡張分析機能**:
   - 数字個別詳細パネル（未出現スパン、過去最大スパン、共起ペア、スライド実績）
   - 共起ペア分析（同時出現ペアランキング）
   - 未出現スパン分析（ハマり回数一覧）
   - ナンバーズ桁別ヒートマップ（各桁の数字偏り分布）
   - 出目表インタラクティブフィルター（引っ張り/スライド/奇偶/数字帯トグル）
   - 基準回号選択（過去時点での再計算・検証）
   - Markdownレポート出力（分析結果のテキスト出力）
6. **表示設定**: PC版(横長)/スマホ版(縦長)切替、集計回数スライダー(10〜100)、トレンド回数スライダー、メトリクス表示数スライダー

---

## 5. ファイル構成（1ファイル単機能）
```
ロトナンバーズ可視化ツール/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── RECORD.md
├── SPECIFICATION.md
├── HANDOVER_SUMMARY.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/ (lottery.ts, config.ts, analysis.ts)
    ├── config/ (games.ts, preloadData.ts)
    ├── utils/ (dataFetcher.ts, lotoAnalyzer.ts, numbersAnalyzer.ts, frequencyAnalyzer.ts, spanAnalyzer.ts, synergyAnalyzer.ts, matrixBuilder.ts, reportExporter.ts)
    └── components/ (Header.tsx, SidebarSettings.tsx, IntegratedReport.tsx, MetricCard.tsx, FrequencyCard.tsx, SlideMacroCard.tsx, SynergyCard.tsx, SpanRankingCard.tsx, DigitHeatmapCard.tsx, NumberDetailModal.tsx, MacroTrendChart.tsx, RecentMetricsTable.tsx, OccurrenceMatrix.tsx, MatrixLegend.tsx, Footer.tsx)
```
