/**
 * Phase 2 解析ユーティリティ単体計算精度テスト
 */

import { GAME_CONFIGS } from '../../config/games';
import { PRELOAD_DATA_MAP } from '../../config/preloadData';
import {
  runIntegratedAnalysis,
  calculateLotoRoundMetric,
  calculateNumbersRoundMetric,
  determineNumbersPatternType,
  calculateFrequencies,
  calculateSpanRankings,
  calculateSynergyPairs,
  buildMatrixRows,
  generateMarkdownReport,
} from '../index';
import { LotoRound, NumbersRound } from '../../types/lottery';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('--- 1. ロト系解析テスト (LOTO7) ---');
const loto7Data = PRELOAD_DATA_MAP.loto7 as LotoRound[];
// 第610回: [3, 8, 12, 18, 24, 29, 35], sum = 129
// 第609回: [1, 9, 12, 17, 25, 29, 36]
const loto7Metric = calculateLotoRoundMetric(loto7Data[0], loto7Data[1], GAME_CONFIGS.loto7);
assert(loto7Metric.sum === 129, `LOTO7 sum should be 129, got ${loto7Metric.sum}`);
assert(loto7Metric.isGoldenZone === true, `LOTO7 sum 129 should be in golden zone [110-155]`);
assert(loto7Metric.oddCount === 3 && loto7Metric.evenCount === 4, `LOTO7 odd/even count 3:4, got ${loto7Metric.oddCount}:${loto7Metric.evenCount}`);
assert(loto7Metric.pullCount === 2, `LOTO7 pull numbers [12, 29], got ${loto7Metric.pullCount} (${loto7Metric.pullNumbers})`);
// スライド: 8(prev 9の-1), 18(prev 17の+1), 24(prev 25の-1), 35(prev 36の-1)
assert(loto7Metric.slideCount >= 3, `LOTO7 slideCount should be >= 3, got ${loto7Metric.slideCount} (${loto7Metric.slideNumbers})`);

console.log('\n--- 2. ナンバーズ系解析テスト (NUMBERS3/4) ---');
assert(determineNumbersPatternType([1, 2, 3]) === 'シングル', 'N3 [1,2,3] is single');
assert(determineNumbersPatternType([1, 5, 5]) === 'ダブル', 'N3 [1,5,5] is double');
assert(determineNumbersPatternType([5, 5, 5]) === 'トリプル', 'N3 [5,5,5] is triple');
assert(determineNumbersPatternType([4, 1, 8, 2]) === 'シングル', 'N4 [4,1,8,2] is single');
assert(determineNumbersPatternType([5, 2, 2, 8]) === 'ダブル', 'N4 [5,2,2,8] is double');
assert(determineNumbersPatternType([7, 7, 7, 1]) === 'トリプル', 'N4 [7,7,7,1] is triple');
assert(determineNumbersPatternType([9, 9, 9, 9]) === 'フォース', 'N4 [9,9,9,9] is fourth');

const n3Data = PRELOAD_DATA_MAP.numbers3 as NumbersRound[];
const n3Metric = calculateNumbersRoundMetric(n3Data[0], n3Data[1], GAME_CONFIGS.numbers3);
// 第6650回: [3, 8, 2], sum = 13, expectedMin=10, expectedMax=17
assert(n3Metric.sum === 13, `N3 sum should be 13, got ${n3Metric.sum}`);
assert(n3Metric.isGoldenZone === true, `N3 sum 13 should be in expected zone`);
assert(n3Metric.patternType === 'シングル', `N3 pattern should be シングル`);

console.log('\n--- 3. F式頻度分類テスト ---');
const freqResult = calculateFrequencies(loto7Data, GAME_CONFIGS.loto7);
assert(freqResult.frequencies.length === 37, `LOTO7 should have 37 number frequencies`);
const totalRanks = freqResult.hotNumbers.length + freqResult.goldNumbers.length + freqResult.recoveryNumbers.length + freqResult.coldNumbers.length;
assert(totalRanks === 37, `All 37 numbers must be classified into F ranks`);

console.log('\n--- 4. 未出現スパン解析テスト ---');
const spanResults = calculateSpanRankings(loto7Data, GAME_CONFIGS.loto7);
assert(spanResults.length === 37, `Span rankings count should be 37`);
// 数字3, 8, 12, 18, 24, 29, 35 は第610回(index 0)に出現しているので currentSpan は 0
const num3Span = spanResults.find((s) => s.num === 3);
assert(num3Span?.currentSpan === 0, `Number 3 appeared in round 610, so currentSpan must be 0, got ${num3Span?.currentSpan}`);

console.log('\n--- 5. 共起ペア相性テスト ---');
const synergyPairs = calculateSynergyPairs(loto7Data, GAME_CONFIGS.loto7, 5);
assert(synergyPairs.length === 5, `Top 5 synergy pairs returned`);
assert(synergyPairs[0].count >= synergyPairs[1].count, `Pairs should be sorted in descending order of count`);

console.log('\n--- 6. 出目表マトリクスデータテスト ---');
const matrixRows = buildMatrixRows(loto7Data, GAME_CONFIGS.loto7);
assert(matrixRows.length === loto7Data.length, `Matrix rows count (${matrixRows.length}) matches data length`);
const row0Cells = matrixRows[0].cells;
assert(row0Cells[3].isHit === true, `Number 3 in row 0 must be isHit=true`);
assert(row0Cells[12].isPull === true, `Number 12 in row 0 must be isPull=true`);
assert(row0Cells[4].isHit === false, `Number 4 in row 0 must be isHit=false`);

console.log('\n--- 7. 統合解析オーケストレーター & Markdown出力テスト ---');
const integrated = runIntegratedAnalysis(loto7Data, 0, 10, GAME_CONFIGS.loto7);
assert(integrated.targetRounds.length === 10, `Target rounds length should be 10`);
assert(integrated.latestMetrics.sum === 129, `Latest metrics sum should be 129`);
const reportMd = generateMarkdownReport(integrated, GAME_CONFIGS.loto7);
assert(reportMd.includes('# ロト＆ナンバーズ 統合構造解析レポート'), 'Markdown report title included');
assert(reportMd.includes('ロト7 (LOTO 7)'), 'Game label included in report');

console.log('\n========================================');
console.log('🎉 ALL PHASE 2 UNIT TESTS PASSED!');
console.log('========================================');
