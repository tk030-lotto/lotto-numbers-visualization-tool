/**
 * 未出現スパン（ハマり回数）解析ユーティリティ
 * @module utils/spanAnalyzer
 */

import { GameConfig } from '../types/config';
import { SpanRankItem } from '../types/analysis';
import { LotteryRound } from '../types/lottery';

/**
 * 各数字の現在未出現スパンおよび集計期間内最大スパンを算出する
 * @param rounds 集計対象回データ配列 (最新回が rounds[0])
 * @param gameConfig くじ種設定定数
 */
export function calculateSpanRankings(
  rounds: LotteryRound[],
  gameConfig: GameConfig
): SpanRankItem[] {
  const { minNumber, maxNumber } = gameConfig;
  const totalRounds = rounds.length;

  if (totalRounds === 0) {
    const emptyResult: SpanRankItem[] = [];
    for (let n = minNumber; n <= maxNumber; n++) {
      emptyResult.push({ num: n, currentSpan: 0, maxSpan: 0 });
    }
    return emptyResult;
  }

  // 各数字が出現したラウンドのインデックス配列 (0: 最新回, ..., totalRounds - 1: 最古回)
  const hitIndicesMap: Record<number, number[]> = {};
  for (let n = minNumber; n <= maxNumber; n++) {
    hitIndicesMap[n] = [];
  }

  for (let rIndex = 0; rIndex < totalRounds; rIndex++) {
    const roundData = rounds[rIndex];
    const nums = roundData.numbers;
    const numSet = new Set(nums);

    for (let n = minNumber; n <= maxNumber; n++) {
      if (numSet.has(n)) {
        hitIndicesMap[n].push(rIndex);
      }
    }
  }

  const items: SpanRankItem[] = [];

  for (let n = minNumber; n <= maxNumber; n++) {
    const hitIndices = hitIndicesMap[n];

    if (hitIndices.length === 0) {
      // 期間内一度も出現していない場合
      items.push({
        num: n,
        currentSpan: totalRounds,
        maxSpan: totalRounds,
      });
      continue;
    }

    // 1. 現在スパン (最初に出現したインデックス = 最新からの未出現回数)
    const currentSpan = hitIndices[0];

    // 2. 期間内最大スパンの算出
    let maxSpan = currentSpan; // 最新回から最初の出現までのスパン

    // 中間の出現間隔
    for (let i = 0; i < hitIndices.length - 1; i++) {
      const gap = hitIndices[i + 1] - hitIndices[i] - 1;
      if (gap > maxSpan) {
        maxSpan = gap;
      }
    }

    // 最後の出現から最古回までのスパン
    const trailingGap = totalRounds - 1 - hitIndices[hitIndices.length - 1];
    if (trailingGap > maxSpan) {
      maxSpan = trailingGap;
    }

    items.push({
      num: n,
      currentSpan,
      maxSpan,
    });
  }

  // 現在スパン降順 (同値は数字昇順) でソート
  items.sort((a, b) => {
    if (b.currentSpan !== a.currentSpan) {
      return b.currentSpan - a.currentSpan;
    }
    return a.num - b.num;
  });

  return items;
}
