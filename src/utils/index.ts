/**
 * 解析ユーティリティ統合エントリーポイント & オーケストレーター
 * @module utils/index
 */

import { GameConfig } from '../types/config';
import { DigitDistribution, IntegratedAnalysisResult, MacroSlideFlow, RoundMetric } from '../types/analysis';
import { LotoRound, LotteryRound, NumbersRound } from '../types/lottery';

import { fetchLotteryData } from './dataFetcher';
import { calculateLotoRoundMetric, calculateMacroSlideFlows } from './lotoAnalyzer';
import { calculateDigitDistributions, calculateNumbersRoundMetric, determineNumbersPatternType } from './numbersAnalyzer';
import { calculateFrequencies, getFrequencyRank } from './frequencyAnalyzer';
import { calculateSpanRankings } from './spanAnalyzer';
import { calculateSynergyPairs } from './synergyAnalyzer';
import { buildMatrixRows } from './matrixBuilder';
import { copyReportToClipboard, generateMarkdownReport } from './reportExporter';

// 個別モジュールの全エクスポート
export {
  fetchLotteryData,
  calculateLotoRoundMetric,
  calculateMacroSlideFlows,
  calculateNumbersRoundMetric,
  calculateDigitDistributions,
  determineNumbersPatternType,
  calculateFrequencies,
  getFrequencyRank,
  calculateSpanRankings,
  calculateSynergyPairs,
  buildMatrixRows,
  generateMarkdownReport,
  copyReportToClipboard,
};

/**
 * 統合構造解析を一括実行して完全な分析結果オブジェクトを構築する
 * @param allRounds 全抽選データ配列 (最新回が index 0)
 * @param baseRoundIndex 基準回号のインデックス (通常は 0, タイムトラベル検証時は任意の過去インデックス)
 * @param analysisCount 集計回数 (例: 30)
 * @param gameConfig くじ種設定定数
 */
export function runIntegratedAnalysis(
  allRounds: LotteryRound[],
  baseRoundIndex: number,
  analysisCount: number,
  gameConfig: GameConfig
): IntegratedAnalysisResult {
  if (!allRounds || allRounds.length === 0) {
    throw new Error('No lottery rounds data provided for analysis');
  }

  const safeBaseIndex = Math.max(0, Math.min(baseRoundIndex, allRounds.length - 1));
  const safeCount = Math.max(5, Math.min(analysisCount, allRounds.length - safeBaseIndex));

  // 1. 集計対象スライス (基準回号から過去 safeCount 回分)
  const targetRounds = allRounds.slice(safeBaseIndex, safeBaseIndex + safeCount);
  const baseRound = allRounds[safeBaseIndex];
  const isLoto = gameConfig.category === 'loto';

  // 2. 直近各回のメトリクスリストを算出
  const recentMetricsList: RoundMetric[] = [];
  for (let i = 0; i < targetRounds.length; i++) {
    const cur = targetRounds[i];
    const curGlobalIndex = safeBaseIndex + i;
    const prev = curGlobalIndex + 1 < allRounds.length ? allRounds[curGlobalIndex + 1] : undefined;

    if (isLoto) {
      const metric = calculateLotoRoundMetric(cur as LotoRound, prev as LotoRound | undefined, gameConfig);
      recentMetricsList.push(metric);
    } else {
      const metric = calculateNumbersRoundMetric(cur as NumbersRound, prev as NumbersRound | undefined, gameConfig);
      recentMetricsList.push(metric);
    }
  }

  const latestMetrics = recentMetricsList[0];

  // 3. F式 出現頻度分類
  const freqResult = calculateFrequencies(targetRounds, gameConfig);

  // 4. スライド・マクロ分析 (前々回±3流入)
  let macroSlideFlows: MacroSlideFlow[] = [];
  if (isLoto) {
    const prevPrev = safeBaseIndex + 2 < allRounds.length ? (allRounds[safeBaseIndex + 2] as LotoRound) : undefined;
    macroSlideFlows = calculateMacroSlideFlows(baseRound as LotoRound, prevPrev);
  }

  // 5. 未出現スパンランキング
  const spanRanking = calculateSpanRankings(targetRounds, gameConfig);

  // 6. 共起ペア相性
  const synergyPairs = calculateSynergyPairs(targetRounds, gameConfig, 25);

  // 7. ナンバーズ桁別出現分布
  let digitDistributions: DigitDistribution[] | undefined;
  if (!isLoto) {
    digitDistributions = calculateDigitDistributions(targetRounds as NumbersRound[], gameConfig.key);
  }

  // 8. 出目表マトリクスデータ構築
  const olderRoundForMatrix = safeBaseIndex + safeCount < allRounds.length ? allRounds[safeBaseIndex + safeCount] : undefined;
  const matrixRows = buildMatrixRows(targetRounds, gameConfig, olderRoundForMatrix);

  return {
    targetRounds,
    baseRound,
    latestMetrics,
    recentMetricsList,
    frequencies: freqResult.frequencies,
    hotNumbers: freqResult.hotNumbers,
    goldNumbers: freqResult.goldNumbers,
    recoveryNumbers: freqResult.recoveryNumbers,
    coldNumbers: freqResult.coldNumbers,
    macroSlideFlows,
    spanRanking,
    synergyPairs,
    digitDistributions,
    matrixRows,
  };
}
