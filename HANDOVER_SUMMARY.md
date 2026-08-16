# ロト＆ナンバーズ 統合構造解析・出目表可視化ツール 開発引き継ぎサマリー

**Version:** 1.2.0  
**更新日:** 2026-08-16  
**現在のステータス:** **Phase 2 完了（データ取得・全解析ロジック実装済） / Phase 3 準備中**  
**対象ディレクトリ:** `C:\Users\tk030\Desktop\ロトナンバーズ可視化ツール`  
**リポジトリ:** `tk030-lotto/lotto-numbers-visualization-tool` (main)

---

## 1. プロジェクト基本情報・コンセプト

- **プロジェクト名**: ロト＆ナンバーズ 統合構造解析・出目表可視化システム
- **基本コンセプト**: Python/Streamlit版「可視化ツール」の全解析機能をTypeScript/Reactに移植し、「ナンバーズ（N3・N4）」の構造解析・出目表および7つの拡張分析機能を統合。
- **ツール性質**: 買い目予想ではなく、**過去出目データの純粋な構造解析・パターン分析・出目表可視化ツール**。
- **対象くじ種**: ロト7 / ロト6 / ミニロト / ナンバーズ3 / ナンバーズ4（全5種）
- **技術スタック**: React 18 + Vite 5 + TypeScript 5.6+ / Recharts / Lucide React / Vanilla CSS
- **公開形態**: GitHub Pages（静的SPAビルド、`base: './'`）

---

## 2. これまでに完了したこと（Phase 0 〜 Phase 2）

### Phase 0: 仕様・基盤定義 & GitHub連携
- プロトコル・行動規範（`AGENTS.md`, `.cursorrules` 等）同期完了
- 仕様書（`SPECIFICATION.md`）、工程管理表（`SCHEDULE.md`）、開発記録（`RECORD.md`）策定
- GitHub プライベートリポジトリ連携・初期コミット完了

### Phase 1: プロジェクト環境構築・基盤設計
- React 18 + Vite 5 + TypeScript 5.6+ 基盤初期化、`lucide-react`, `recharts` 導入
- デザインシステム（`src/index.css`）: JetBlackテーマ、カラーパレット（青/緑/黄/赤）、出目ボール・バッジスタイル
- 型定義（`src/types/`）: `lottery.ts`, `config.ts`, `analysis.ts`（Strict Mode準拠）
- 設定定数・内蔵データ（`src/config/`）: `games.ts`, `preloadData.ts`
- Gate 1 監査（`tsc --noEmit` エラー0件、ビルド成功）完了

### Phase 2: データ取得・解析ロジック実装
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

---

## 3. 次期フェーズの実装計画（Phase 3: コアUI・統合レポート・出目表実装）

次期フェーズでは、以下のUIコンポーネント（1ファイル1機能・単一責任原則・300行以内）を `src/components/` に実装し、`src/App.tsx` と統合します。

| ファイル | 実装内容・役割 |
| :--- | :--- |
| `src/components/Header.tsx` | ヘッダー（タイトル、5くじ種タブセレクター、同期ステータスバッジ 🟢/🟡/⚪） |
| `src/components/SidebarSettings.tsx` | サイドバー設定（集計回数スライダー［10〜100］、基準回号選択、フィルター切替） |
| `src/components/IntegratedReport.tsx` | 統合分析レポート（基準回当選数字表示、基本指標グリッド、F式分類カード群） |
| `src/components/MetricCard.tsx` | 構成解析カード（奇偶比、合計値、黄金ゾーン/期待値判定、連番、引っ張り、スライド、型判定） |
| `src/components/FrequencyCard.tsx` | 出現頻度分類カード（HOT/GOLD/RECOVERY/COLD バッジ表示） |
| `src/components/OccurrenceMatrix.tsx` | ロト・ナンバーズ統合出目表（色分けグリッド、重複バッジ、横スクロール・縦最適化） |
| `src/components/MatrixLegend.tsx` | 出目表凡例バッジ（青: 引っ張り / 緑: スライド / 黄: 通常 / 灰: ボーナス） |
| 🔍 **Gate 3 監査** | デザインシステム適合性、出目表描画性能、`tsc --noEmit`、`generate_phase_summary` 実行 |

---

## 4. プロトコル・行動規範（最重要遵守事項）

1. **【最最厳守】事前承認の義務（第6条）**: 新規作業開始前に必ずチャット上で提示し合意を得ること。承認前の実作業（コード変更・コマンド実行）は厳禁。
2. **【最厳守】AIコンテキスト管理MCPツールの積極利用**: `generate_phase_summary`, `generate_audit_plan` などの定期実行。
3. **マイクロコミット（第3条）**: 動作確認・テスト完了ステップごとにコミットを実施。
4. **ファイル行数制限（第17条）**: 1ファイル300行以内を厳守。
5. **UI/UX品質（第18条）**: ミニマルダークデザイン（JetBlack: `#09090b`）準拠。
