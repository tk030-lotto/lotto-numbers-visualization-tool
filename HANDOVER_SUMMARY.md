# ロト＆ナンバーズ 統合構造解析・出目表可視化ツール 開発引き継ぎサマリー

## 1. プロジェクト基本情報
- **プロジェクト名**: ロト＆ナンバーズ 統合構造解析・出目表可視化システム
- **リポジトリ**: `tk030-lotto/lotto-numbers-visualization-tool` (main)
- **作業ディレクトリ**: `C:\Users\tk030\Desktop\ロトナンバーズ可視化ツール`
- **技術スタック**: React 18 + Vite 5 + TypeScript 5.6+ / Recharts / Lucide React / Vanilla CSS (JetBlack Theme)
- **公開形態**: GitHub Pages（静的SPAビルド、`base: './'`）
- **現在のステータス**: **Phase 3 完了（コアUI・統合レポート・出目表実装済） / Phase 4 準備中**

---

## 2. これまでに完了したこと（Phase 0 〜 Phase 3）

1. **仕様策定 & 基盤定義 (Phase 0)**:
   - 全体プロトコル・行動規範（`AGENTS.md`, `.cursorrules` 等）同期完了
   - 仕様書（`SPECIFICATION.md`）、工程管理表（`SCHEDULE.md`）、開発記録（`RECORD.md`）策定
   - GitHub プライベートリポジトリ連携・初期Push完了
2. **環境構築 & 基盤設計 (Phase 1)**:
   - React 18 + Vite 5 + TypeScript 5.6+ 基盤、`lucide-react`, `recharts` 導入
   - デザインシステム（`src/index.css`）: JetBlackテーマ、カラーパレット（青/緑/黄/赤/紫）、出目ボール・バッジスタイル
   - 型定義（`src/types/lottery.ts`, `config.ts`, `analysis.ts`）完全実装（Strict準拠）
   - 設定定数・内蔵データ（`src/config/games.ts`, `preloadData.ts`）配備
   - Gate 1 監査（`tsc --noEmit` エラー0件、ビルド成功）完了
3. **データ取得 & 解析ロジック実装 (Phase 2)**:
   - `src/utils/dataFetcher.ts`: lotto-data-hub 非同期取得・TTLキャッシュ・内蔵フォールバック
   - `src/utils/lotoAnalyzer.ts`: ロト系指標解析（奇偶/合計/黄金ゾーン/連番/引っ張り/スライド/末尾被り/±3マクロ）
   - `src/utils/numbersAnalyzer.ts`: ナンバーズ系指標解析（奇偶/合計/型判定［S/D/T/F］/桁別出現分布）
   - `src/utils/frequencyAnalyzer.ts`: F式出現頻度分類（HOT: 5回以上 / GOLD: 3〜4回 / RECOVERY: 2回 / COLD: 0〜1回）
   - `src/utils/spanAnalyzer.ts`: 各数字の未出現スパン（ハマり回数）・集計期間内最大スパン計算
   - `src/utils/synergyAnalyzer.ts`: 同時出現ペア（相性）ランキング集計
   - `src/utils/matrixBuilder.ts`: 出目表マトリクスデータ構築（引っ張り/スライド/通常当選/重複カウント）
   - `src/utils/reportExporter.ts`: Markdownレポート生成・クリップボード出力
   - `src/utils/index.ts`: 統合解析オーケストレーター（`runIntegratedAnalysis`）
   - Gate 2 監査: 単体計算精度テスト（`testCalculations.ts`）全件パス、`tsc --noEmit` エラー0件、全ファイル300行以内、静的ビルド成功、MCP `generate_phase_summary` 実行完了
4. **コアUI・統合レポート・出目表実装 (Phase 3)**:
   - `src/components/Header.tsx`: タイトル、5くじ種タブセレクター、データ同期ステータスバッジ（🟢最新/🟡キャッシュ/⚪内蔵/🔴エラー）、再取得機能
   - `src/components/SidebarSettings.tsx`: 集計回数スライダー（10〜100回）、基準回号選択（タイムトラベル検証）、ボーナス表示トグル、ハイライトフィルター
   - `src/components/MetricCard.tsx`: 構成解析カード（奇偶比バー、合計値＆黄金/期待値ゾーン判定、連番、引っ張り、スライド、型判定）
   - `src/components/FrequencyCard.tsx`: F式出現頻度分類カード（HOT/GOLD/RECOVERY/COLD バッジ・数字一覧・出現率表示）
   - `src/components/IntegratedReport.tsx`: 統合分析レポート（基準回当選数字ボール表示、主要指標＆F式頻度カード統合、Markdownコピー）
   - `src/components/MatrixLegend.tsx`: 出目表凡例バッジ（青: 引っ張り / 緑: スライド / 黄: 通常 / 紫: ボーナス / 桃: 重複バッジ）
   - `src/components/OccurrenceMatrix.tsx`: ロト・ナンバーズ統合出目表（固定ヘッダー、色分けボール、重複バッジ、横スクロール最適化）
   - `src/App.tsx`: 状態管理、非同期データフェッチ、統合解析エンジン連携、レスポンシブレイアウト統合
   - Gate 3 監査: `tsc --noEmit` エラー0件、全ファイル300行以内厳守（最大192行）、静的ビルド成功、Gitコミット＆Push完了、MCP `generate_phase_summary` 実行完了

---

## 3. 次期フェーズの実装計画（Phase 4: 拡張分析機能・グラフ・モーダル実装）

次期フェーズでは、以下の拡張分析コンポーネント（1ファイル1機能・単一責任原則・300行以内）を `src/components/` に実装し、`src/App.tsx` と統合します。

| ファイル | 実装内容・役割 |
| :--- | :--- |
| `src/components/SlideMacroCard.tsx` | スライドマクロ分析（前々回±3マクロ流入の可視化）※ロト系専用 |
| `src/components/DigitHeatmapCard.tsx` | ナンバーズ桁別ヒートマップ（千/百/十/一の位の出現分布）※ナンバーズ専用 |
| `src/components/SynergyCard.tsx` | 共起ペア相性分析（同時出現ペアランキング Top 10） |
| `src/components/SpanRankingCard.tsx` | 未出現スパン分析（現在のハマり回数・集計期間内最大ハマりランキング） |
| `src/components/NumberDetailModal.tsx` | 数字個別詳細モーダル（出目ボール・頻度カードクリック時の深掘り情報） |
| `src/components/MacroTrendChart.tsx` | 合計値推移折れ線グラフ（Recharts、黄金ゾーン/期待値ライン、ツールチップ） |
| `src/components/RecentMetricsTable.tsx` | 直近詳細メトリクス一覧テーブル（回号ごとの詳細指標グリッド） |
| `src/components/Footer.tsx` | フッター（データ同期ステータス・著作権表示） |
| 🔍 **Gate 4 監査** | 拡張機能の仕様網羅性検証、モーダル開閉・グラフ描画性能確認、`tsc --noEmit`、`generate_phase_summary` 実行 |

---

## 4. プロトコル・行動規範（最重要遵守事項）

1. **【最最厳守】事前承認の義務（第6条）**: 新規作業開始前に必ずチャット上で提示し合意を得ること。承認前の実作業（コード変更・コマンド実行）は厳禁。
2. **【最厳守】AIコンテキスト管理MCPツールの積極利用**: `generate_phase_summary`, `generate_audit_plan` などの定期実行。
3. **マイクロコミット（第3条）**: 動作確認・テスト完了ステップごとにコミットを実施。
4. **ファイル行数制限（第17条）**: 1ファイル300行以内を厳守。
5. **UI/UX品質（第18条）**: ミニマルダークデザイン（JetBlack: `#09090b`）準拠。
