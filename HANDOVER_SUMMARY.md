# ロト＆ナンバーズ 統合構造解析・出目表可視化ツール 開発引き継ぎサマリー

**Version:** 1.1.0  
**更新日:** 2026-08-16  
**現在のステータス:** Phase 1 完了（基盤・型・定数・デザインシステム構築済） / Phase 2 準備中  
**対象ディレクトリ:** `C:\Users\tk030\Desktop\ロトナンバーズ可視化ツール`  
**リポジトリ:** `tk030-lotto/lotto-numbers-visualization-tool` (main)

---

## 1. プロジェクト概要・コンセプト
- **基本コンセプト**: Python/Streamlit版「可視化ツール」の全解析機能をTypeScript/Reactに移植し、「ナンバーズ（N3・N4）」の構造解析・出目表および7つの拡張分析機能を統合。
- **ツール性質**: 買い目予想ではなく、**過去出目データの純粋な構造解析・パターン分析・出目表可視化ツール**。
- **対象くじ種**: ロト7 / ロト6 / ミニロト / ナンバーズ3 / ナンバーズ4（全5種）
- **公開形態**: GitHub Pages（静的SPAビルド、`npm run build` / `base: './'`）

---

## 2. 実装完了状況 (Phase 1 完了)

- [x] **基盤・パッケージ**: React 18 + Vite 5 + TypeScript 5.6+, `lucide-react`, `recharts` 導入済
- [x] **デザインシステム (`src/index.css`)**: JetBlackテーマ（`--bg-app: #09090b` 等）、カラーパレット（青: 引っ張り / 緑: スライド / 黄: 通常当選 / 赤: COLD）、出目ボール・バッジスタイル定義済
- [x] **型定義 (`src/types/`)**:
  - `lottery.ts`: `GameKey`, `LotoRound`, `NumbersRound`, `LotteryRound`, `SyncStatus`
  - `config.ts`: `GameConfig`, `SumThresholds`, `ViewSettings`, `MatrixFilters`
  - `analysis.ts`: `RoundMetric`, `FrequencyRank`, `NumberFrequency`, `MacroSlideFlow`, `SpanRankItem`, `SynergyPairItem`, `DigitDistribution`, `MatrixCell`, `MatrixRow`, `IntegratedAnalysisResult`
- [x] **設定定数・内蔵データ (`src/config/`)**:
  - `games.ts`: 5くじ種の仕様定数マスター（黄金ゾーン/期待値閾値、URL等）
  - `preloadData.ts`: ネットワーク遮断時でも即座に動作する直近サンプルデータ
- [x] **Gate 1 監査**: `tsc --noEmit` エラー0件、`npm run build` 静的ビルド成功確認済

---

## 3. 次期フェーズの実装計画 (Phase 2: データ取得・解析ロジック実装)

次期フェーズでは、以下の解析ユーティリティ群（1ファイル1機能）を `src/utils/` に実装します。

1. `src/utils/dataFetcher.ts`: lotto-data-hub からの非同期データ取得・フォールバック
2. `src/utils/lotoAnalyzer.ts`: ロト系指標解析（奇偶比、合計値、黄金ゾーン、末尾被り、連番、引っ張り、スライド、±3マクロ）
3. `src/utils/numbersAnalyzer.ts`: ナンバーズ系指標解析（奇偶比、合計値、パターン型判定、桁別分布）
4. `src/utils/frequencyAnalyzer.ts`: F式出現頻度分類（HOT/GOLD/RECOVERY/COLD）
5. `src/utils/spanAnalyzer.ts`: 未出現スパン・最大スパン集計
6. `src/utils/synergyAnalyzer.ts`: 共起ペア出現頻度集計
7. `src/utils/matrixBuilder.ts`: 出目表マトリクスデータ構築（重複カウント・色分け判定）
8. `src/utils/reportExporter.ts`: Markdown形式レポート出力

---

## 4. プロトコル・行動規範（最重要遵守事項）

1. **【最最厳守】事前承認の義務（第6条）**: 新規作業開始前に必ずチャット上で提示し合意を得ること。承認前の実作業は厳禁。
2. **【最厳守】AIコンテキスト管理MCPツールの積極利用**: `generate_phase_summary`, `generate_audit_plan` などの定期実行。
3. **マイクロコミット（第3条）**: 動作確認・テスト完了ステップごとにコミットを実施。
4. **ファイル行数制限（第17条）**: 1ファイル300行以内を厳守。
5. **UI/UX品質（第18条）**: ミニマルダークデザイン（JetBlack）準拠。
