/**
 * Phase 6 受入テスト・統合機能検証スクリプト
 * タイムトラベル過去検証、オフラインフォールバック、5くじ種全集計回数検証
 */

import { GAME_CONFIGS } from '../../config/games';
import { PRELOAD_DATA_MAP } from '../../config/preloadData';
import { GameKey, LotoRound } from '../../types/lottery';
import {
  runIntegratedAnalysis,
  generateMarkdownReport,
} from '../index';
import { fetchLotteryData } from '../dataFetcher';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

async function runPhase6AcceptanceTests() {
  console.log('====================================================');
  console.log('🚀 PHASE 6: ACCEPTANCE & INTEGRATION AUDIT TESTS');
  console.log('====================================================\n');

  // ------------------------------------------------------------------
  // 1. タイムトラベル過去検証 (Time-Travel Historical Verification)
  // ------------------------------------------------------------------
  console.log('--- 1. タイムトラベル過去検証 (Time-Travel Verification) ---');
  const loto7Data = PRELOAD_DATA_MAP.loto7 as LotoRound[];
  
  // baseRoundIndex = 0 (最新: 第610回)
  const currentAnalysis = runIntegratedAnalysis(loto7Data, 0, 10, GAME_CONFIGS.loto7);
  assert(currentAnalysis.baseRound.round === 610, `Current base round should be 610, got ${currentAnalysis.baseRound.round}`);
  assert(currentAnalysis.targetRounds[0].round === 610, `Target round 0 should be 610`);
  assert(currentAnalysis.targetRounds.length === 10, `Target rounds length should be 10`);

  // baseRoundIndex = 5 (第605回基準, 残り5回)
  const pastAnalysis = runIntegratedAnalysis(loto7Data, 5, 10, GAME_CONFIGS.loto7);
  assert(pastAnalysis.baseRound.round === 605, `Past base round should be 605, got ${pastAnalysis.baseRound.round}`);
  assert(pastAnalysis.targetRounds[0].round === 605, `Past target round 0 should be 605`);
  assert(pastAnalysis.targetRounds.length === 5, `Past target rounds length should be 5 (available slice)`);
  // 第605回の出目: [3, 6, 12, 15, 22, 29, 35] -> 合計: 122
  assert(pastAnalysis.latestMetrics.sum === 122, `Past round 605 sum should be 122, got ${pastAnalysis.latestMetrics.sum}`);
  // 出目表行数も一致
  assert(pastAnalysis.matrixRows.length === 5, `Past matrix rows length should be 5`);
  assert(pastAnalysis.matrixRows[0].round === 605, `Past matrix row 0 round should be 605`);

  // ------------------------------------------------------------------
  // 2. オフラインフォールバック検証 (Offline Fallback Verification)
  // ------------------------------------------------------------------
  console.log('\n--- 2. オフラインフォールバック検証 (Offline Fallback Verification) ---');
  const allGameKeys: GameKey[] = ['loto7', 'loto6', 'miniloto', 'numbers3', 'numbers4'];
  
  for (const key of allGameKeys) {
    const result = await fetchLotteryData(key);
    assert(result.data.length > 0, `Game ${key} data should not be empty`);
    assert(result.status === 'synced' || result.status === 'offline', `Game ${key} status should be synced or offline`);
    assert(typeof result.updatedAt === 'string', `Game ${key} updatedAt should be valid string`);
  }

  // ------------------------------------------------------------------
  // 3. 5くじ種 × 全集計回数マトリクス検証 (5 Games x All Analysis Counts)
  // ------------------------------------------------------------------
  console.log('\n--- 3. 5くじ種 × 全集計回数マトリクス検証 (5 Games x All Counts) ---');
  const counts = [10, 30, 50, 100];

  for (const gameKey of allGameKeys) {
    const config = GAME_CONFIGS[gameKey];
    const data = PRELOAD_DATA_MAP[gameKey];

    for (const count of counts) {
      const analysis = runIntegratedAnalysis(data, 0, count, config);
      const expectedCount = Math.min(count, data.length);
      
      assert(analysis.targetRounds.length === expectedCount, `${gameKey} count ${count}: targetRounds length is ${expectedCount}`);
      assert(analysis.matrixRows.length === expectedCount, `${gameKey} count ${count}: matrixRows length is ${expectedCount}`);
      assert(analysis.recentMetricsList.length === expectedCount, `${gameKey} count ${count}: recentMetricsList length is ${expectedCount}`);
      assert(analysis.spanRanking.length === config.maxNumber - config.minNumber + 1, `${gameKey} span ranking count matches number pool`);
      assert(analysis.frequencies.length === config.maxNumber - config.minNumber + 1, `${gameKey} frequencies count matches number pool`);

      if (config.category === 'loto') {
        assert(Array.isArray(analysis.macroSlideFlows), `${gameKey} macro slide flows is an array`);
      } else {
        assert(analysis.digitDistributions !== undefined, `${gameKey} has digit distributions`);
        assert(analysis.digitDistributions?.length === config.mainCount, `${gameKey} digit distributions count (${analysis.digitDistributions?.length}) matches mainCount (${config.mainCount})`);
      }
    }
  }

  // ------------------------------------------------------------------
  // 4. Markdownレポート統合出力検証 (Markdown Report Verification)
  // ------------------------------------------------------------------
  console.log('\n--- 4. Markdownレポート統合出力検証 (Markdown Export Verification) ---');
  for (const gameKey of allGameKeys) {
    const config = GAME_CONFIGS[gameKey];
    const data = PRELOAD_DATA_MAP[gameKey];
    const analysis = runIntegratedAnalysis(data, 0, 30, config);
    const md = generateMarkdownReport(analysis, config);

    assert(md.includes('# ロト＆ナンバーズ 統合構造解析レポート'), `${gameKey} Markdown report title check`);
    assert(md.includes(config.label), `${gameKey} Markdown report label check`);
    assert(md.includes('## 1. 構成解析指標'), `${gameKey} Markdown report section 1 check`);
    assert(md.includes('## 2. 出現頻度分類'), `${gameKey} Markdown report section 2 check`);
    assert(md.includes('## 3. 未出現スパン'), `${gameKey} Markdown report section 3 check`);
    assert(md.includes('## 4. 共起ペア相性'), `${gameKey} Markdown report section 4 check`);
  }

  console.log('\n====================================================');
  console.log('🎉 ALL PHASE 6 ACCEPTANCE AUDIT TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================\n');
}

runPhase6AcceptanceTests().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
