# コードレビューレポート

**プロジェクト**: ロト＆ナンバーズ 統合構造解析・出目表可視化システム
**レビュー実施日**: 2026-08-26
**対象リビジョン**: `d9848eb` (main) — feat: add PC/Mobile display mode switch, number zone filters, and remove F-type naming
**レビュー範囲**: `src/` 配下 全ファイル（types 3件 / config 2件 / utils 10件 / components 15件 / CSS 2件）+ ルート設定ファイル一式（package.json, tsconfig.json, vite.config.ts, index.html）

---

## 1. 検証結果サマリー

本レビューでは静的解析に加え、以下の動的検証を実際に実行した。

| # | 検証項目 | コマンド | 結果 |
|---|---|---|---|
| V-1 | 型チェック | `npx tsc --noEmit` | ✅ エラー 0件 |
| V-2 | 単体計算精度テスト | `npx tsx src/utils/__tests__/testCalculations.ts` | ✅ 全33アサーション合格 |
| V-3 | Phase 6 受入テスト | `npx tsx src/utils/__tests__/testPhase6Acceptance.ts` | ✅ 全項目合格 |
| V-4 | 本番ビルド | `npm run build` | ✅ 成功（35.3秒 / 本体JS 615KB、チャンクサイズ警告あり） |
| V-5 | リモートAPI実疎通 | `GET lotto-data-hub/data/loto7.json` | 🔴 **レスポンス形式不一致を確認（C-1参照）** |
| V-6 | Git状態 | `git status --short` | ✅ ワーキングツリークリーン |

> **総評**: アーキテクチャ・型安全性・計算ロジックの品質は高い。一方で、**リモートデータ取得機能がスキーマ不一致により常時フォールバック動作している重大バグ（C-1）と、同期ステータス表示の不正確さ（H-1）が判明した**。これらは公開ツールとしての信頼性に直結するため最優先での修正を推奨する。

---

## 2. 指摘事項

### 2.1 Critical（重大バグ・要修正）

#### C-1. データハブのレスポンス形式と不整合 → 常に最新データ取得に失敗している

- **箇所**: `src/utils/dataFetcher.ts` L61–L65
- **該当コード**:

```ts
const json: DataHubResponse = await response.json();

if (!json || !Array.isArray(json.data) || json.data.length === 0) {
  throw new Error('Invalid data format received from data hub');
}
```

- **問題の詳細**:
  実API (`https://tk030-lotto.github.io/lotto-data-hub/data/{gameKey}.json`) の実際のレスポンスは `{ gameKey, updatedAt, totalRounds, data: [...] }` 形式ではなく、**トップレベルが配列** `[ { round, date, numbers, bonus }, ... ]` であることをV-5の疎通で確認した。
  そのため `json.data` は常に `undefined` となり上記バリデーションは必ず失敗 → **5くじ種すべてで毎回例外が発生し、内蔵プリロードデータ（2025年2月時点）へフォールバックし続ける**。V-3受入テストの出力にも全種 `Invalid data format received from data hub` が出力されており、挙動を実機で確認済み。
- **影響**:
  - ユーザーは決して最新データを閲覧できない（約1.5年前の固定データ表示）
  - 後述のH-1と重複して「🟢 最新同期済」と誤表示され、データの古さに気付けない
- **修正方針（提案）**:

```ts
// 配列レスポンス互換処理
const payload = await response.json();
const rows: LotteryRound[] = Array.isArray(payload)
  ? payload
  : Array.isArray(payload?.data) ? payload.data : [];

if (rows.length === 0) {
  throw new Error('Invalid data format received from data hub');
}

memoryCache[gameKey] = {
  data: rows,
  // updatedAtは最新回の日付から導出
  updatedAt: (rows[0] as { date?: string }).date ?? new Date().toISOString().split('T')[0],
  fetchedAt: now,
};
```
  併せて `DataHubResponse` 型（`src/types/lottery.ts` L31–L36）の実態に合わせた見直しを推奨。

### 2.2 High（機能不正確・ユーザー誤認を招く）

#### H-1. `FetchResult.status` が無視され、オフライン時も「🟢 最新同期済」と表示される

- **箇所**: `src/App.tsx` L56–L64
- **該当コード**:

```ts
const resp = await fetchLotteryData(gameKey);
if (resp && resp.data && resp.data.length > 0) {
  setAllRounds(resp.data);
  setLastUpdated(resp.updatedAt);
  setSyncStatus('synced');   // ← resp.status を無視している
}
```

- **問題の詳細**:
  `fetchLotteryData` はネットワーク失敗時に内部 catch して `status: 'offline'` / `'error'` を返す設計だが、呼び出し側は「データが存在するか」のみを判定基準にしている。その結果、**フォールバックデータで動作中にもかかわらず同期バッジが「最新同期済」になる**。
- **影響**:
  - Header / Footer の同期ステータス表示（🟢🟡⚪🔴）が信頼できない
  - C-1発生時、ユーザーが古いデータを見ていることに気付けない
- **修正方針（提案）**: `setSyncStatus(resp.status)` を使用し、`status !== 'synced'` 時に警告バナー（既存の `errorMsg` 表示枠）を出す。

#### H-2. くじ種切り替え時の非同期レースコンディション＋二重フェッチ

- **箇所**: `src/App.tsx` L49–L73（loadData）, L76–L82（handleSelectGame）, L85–L87（useEffect）
- **問題の詳細**:
  1. `loadData` に中断機構（AbortController / リクエストID管理）がないため、素早いくじ種切り替えを行うと**先に発射した旧リクエストの応答が後着し、選択中とは異なるくじ種のデータで `allRounds` が上書きされ得る**（タブとデータの不一致が発生）。
  2. `handleSelectGame` 内の `loadData(game)` 呼び出しと、`useEffect(() => { loadData(selectedGame); }, [loadData, selectedGame])` による再実行で、**切替のたびに同一リクエストが2回走る**。
  3. 開発時は React StrictMode（`src/main.tsx` L12）の二重マウントにより初回フェッチも2回走る。
- **修正方針（提案）**:

```ts
useEffect(() => {
  let cancelled = false;
  (async () => {
    // ... fetch ...
    if (!cancelled) { /* setState */ }
  })();
  return () => { cancelled = true; };
}, [selectedGame]);
```
  `handleSelectGame` 側の `loadData()` 直呼び出しは削除し、状態変更は useEffect へ一本化するのが望ましい。

---

### 2.3 Medium（エッジケース・堅牢性）

#### M-1. 出目表のゾーンフィルターがくじ種切替でリセットされず空表になり得る

- **箇所**: `src/components/OccurrenceMatrix.tsx` L37（state定義）, L49–L60（numbersList生成）
- **問題の詳細**:
  スマホ表示でロト7の「21〜30」等を選択した状態からナンバーズ3（0〜9）へ切り替えると、`selectedZone` が保持されたまま数字範囲フィルターだけが適用され、`numbersList` が空配列になる。結果として**回号列のみのセル無し出目表**が描画される。
- **修正方針（提案）**: ①ゾーンタブはロト系のみ描画されているため、`activeZone` の適用も `isLoto` 条件に限定する。または②ゲーム切替時に `setSelectedZone('all')` する（App から key prop 再マウントでも可）。

#### M-2. リモートデータの個別行バリデーションがない

- **箇所**: `src/utils/dataFetcher.ts` L63
- **問題の詳細**:
  取得後の検証は「配列かつ非空」のみ。要素が `{ round, date, numbers }` 形式である保証がなく、データハブ側の不備（欠損行・型崩れ）が1行あるだけで解析パイプライン内で例外が発生し、App.tsx L94–L97 の catch で `analysisResult = null` → **画面全体が白紙化する**。
- **修正方針（提案）**: 取得時に最低限の shape チェックを行い、不正行は除外（または取得全体をエラー扱い）する。

#### M-3. TTL期限切れキャッシュの未活用

- **箇所**: `src/utils/dataFetcher.ts` L34–L41, L79–L93
- **問題の詳細**:
  ネットワーク障害時、TTL（1時間）切れのメモリキャッシュに正常な過去データが残っていても捨ててしまい、18ヶ月前のプリロードデータへフォールバックする。キャッシュは「期限切れ＝即廃棄」ではなく「stale として保持」する方が回復性が高い。
- **修正方針（提案）**: catch 節で `memoryCache[gameKey]` を優先参照し、存在しない場合のみプリロードへフォールバック。ステータスは `'offline'` を維持。

### 2.4 Low（品質改善・任意対応）

| # | 箇所 | 内容 | 提案 |
|---|---|---|---|
| L-1 | `src/types/config.ts` L34–L50 | `MatrixFilters` / `ViewSettings` は**どこからも参照されていないデッド型**（実装は `HighlightFilterType` に置換済み） | 削除 |
| L-2 | `package.json` scripts | `test` スクリプトが存在しない。テストファイル2件の実行手段が不明（本レビューでは `npx tsx` で実行） | `"test": "tsx src/utils/__tests__/testCalculations.ts && tsx src/utils/__tests__/testPhase6Acceptance.ts"` 等を追加 |
| L-3 | `vite.config.ts` / ビルド出力 | 本体JS 615KB（minify後）でチャンク警告。Recharts が大半を占める | `MacroTrendChart` を `React.lazy` 遅延読み込み、または `manualChunks` で recharts を分離 |
| L-4 | `src/App.tsx` L85–L87 | StrictMode 二重マウントで初回フェッチが2回走る（H-2対策で自然解消） | H-2と一括対応 |
| L-5 | `src/components/SidebarSettings.tsx` L74–L78, L93 | ①スライダー下の目盛ラベルが max<100 時も「100回」固定表示。②基準回号セレクタが先頭50回限定（仕様書 §5.4-6 は「過去の任意の回号」） | ラベル動的生成／選択肢範囲の見直し |
| L-6 | `src/components/OccurrenceMatrix.tsx` L164, L245 等 | `<span onClick>` / `<th onClick>` がキーボード操作不可（a11y） | `button` 化 or `tabIndex` + `onKeyDown` 追加 |
| L-7 | `src/components/SlideMacroCard.tsx` L29–L50 | `calculateMacroSlideFlows` が diff=0 を除外するため「同数/重複」バッジ分岐はデッドコード | 整理 |
| L-8 | `src/components/MacroTrendChart.tsx` L48–L99, L137 | `CustomTooltip` がレンダリング毎に再定義される。`tickFormatter={(r) => \`${r}\`}` は恒等変換で不要 | コンポーネント外定義へ移動、formatter削除 |
| L-9 | `src/utils/dataFetcher.ts` L82 | フォールバック日付 `'2026-08-16'` のマジックナンス | preload 先頭 date からの導出で十分 |
| L-10 | `README.md` / `SPECIFICATION.md` / `Header.tsx` L35 | バージョン表記不一致（package 1.0.0 vs SPEC 1.1.0）。タブ並び（N4→N3）と README 記載（N3→N4）の不一致 | 表記統一 |

---

## 3. 良い点（評価事項）

1. **解析ロジックの純粋関数分離** — `utils/` 配下が UI 依存のない純粋関数として徹底されており、実際に全テストがブラウザなしで完結する高いテスト容易性。
2. **理論値の正確性** — 合計値の期待値設定が全くじ種で数学的に正しい（ロト7: 133=7×19、ロト6: 132=6×22、ミニロト: 80=5×16、N3: 13.5、N4: 18）。
3. **型安全性** — `strict` + `noUnusedLocals/noUnusedParameters/noFallthroughCasesInSwitch` 有効、`any` 完全排除、判別可能ユニオンに対する型ガード（`'bonus' in current`）の適切な使用。
4. **エッジケース配慮の計算ロジック** — スパン分析の区間ギャップ算出（`spanAnalyzer.ts`）、ナンバーズ 0↔9 循環スライド判定（`numbersAnalyzer.ts` L91–94 / `matrixBuilder.ts` L58–62）、重複カウントバッジ等。
5. **規約遵守** — 全ファイル300行以内（最大252行）、1ファイル単機能設計の徹底。

---

## 4. 修正実施のご提案（承認待ち）

| バッチ | 対象 | 概要 |
|---|---|---|
| 【A】最優先 | C-1 + H-1 | dataFetcher の配列レスポンス互換化＋App側 status 反映（実データでの動作検証まで実施） |
| 【B】 | H-2 + L-4 | レースコンディション・二重フェッチ解消 |
| 【C】 | M-1〜M-3 | ゾーンフィルターリセット・行バリデーション・stale cache 活用 |
| 【D】 | Low系一式 | デッド型削除、test script 追加、チャンク分割等 |

---

## 5. 補記

- `.clinerules` 参照先の `knowledge/protocol.md` および `knowledge/lottery.md` は本プロジェクト内に存在しなかった（`SKILLS.md` のみ確認）。knowledge ファイルの所在確認・同期を推奨。
- SKILLS.md 運用ルール4（能動的提案）より、今回の教訓「外部APIのレスポンス形式は実疎通で必ず検証する」「フェッチ結果の status をUIに反映する」は共通スキルへの追記候補と考える。

## 付録A. テスト実行方法

```bash
# 型チェック
npx tsc --noEmit

# 単体計算精度テスト（Node.js ランナー使用）
npx tsx src/utils/__tests__/testCalculations.ts

# Phase 6 受入テスト（ネットワーク疎通を含む）
npx tsx src/utils/__tests__/testPhase6Acceptance.ts

# 本番ビルド
npm run build
```

## 付録B. レビュー時の検証ログ要点

```
TSC_EXIT=0
🎉 ALL COMPREHENSIVE AUDIT TESTS PASSED!          （33/33 assertions）
🎉 ALL PHASE 6 ACCEPTANCE AUDIT TESTS PASSED SUCCESSFULLY!
vite v5.4.21 building for production...
✓ 2416 modules transformed.
dist/assets/index-D_pR-5fr.js   615.37 kB │ gzip: 174.45 kB
✓ built in 35.31s   BUILD_EXIT=0
[DataFetcher] Failed to fetch data for loto7/loto6/miniloto/numbers3/numbers4
from remote. Reason: Invalid data format received from data hub   ← C-1 の実証
```

---

*本レポートは ox-alpha (Cline) によるコードレビューに基づき自動生成されたものです。*


