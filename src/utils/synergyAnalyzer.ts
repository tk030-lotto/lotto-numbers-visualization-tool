/**
 * 共起ペア（相性・同時出現）解析ユーティリティ
 * @module utils/synergyAnalyzer
 */

import { GameConfig } from '../types/config';
import { SynergyPairItem } from '../types/analysis';
import { LotteryRound } from '../types/lottery';

/**
 * 集計対象回データにおける数字ペアの同時出現回数・出現率を集計する
 * @param rounds 集計対象回データ配列
 * @param _gameConfig くじ種設定定数
 * @param topN 返却する上位ペア数 (未指定時は全ペア)
 */
export function calculateSynergyPairs(
  rounds: LotteryRound[],
  _gameConfig: GameConfig,
  topN?: number
): SynergyPairItem[] {
  const totalRounds = rounds.length;
  if (totalRounds === 0) return [];

  const pairCountMap: Map<string, { pair: [number, number]; count: number }> = new Map();

  for (const r of rounds) {
    // ユニークかつ昇順にソートした本数字配列を取得
    const uniqueNums = Array.from(new Set(r.numbers)).sort((a, b) => a - b);

    for (let i = 0; i < uniqueNums.length; i++) {
      for (let j = i + 1; j < uniqueNums.length; j++) {
        const n1 = uniqueNums[i];
        const n2 = uniqueNums[j];
        const key = `${n1}-${n2}`;

        const existing = pairCountMap.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          pairCountMap.set(key, { pair: [n1, n2], count: 1 });
        }
      }
    }
  }

  const results: SynergyPairItem[] = Array.from(pairCountMap.values()).map(({ pair, count }) => ({
    pair,
    count,
    rate: Number(((count / totalRounds) * 100).toFixed(1)),
  }));

  // 出現回数降順 (同値は pair[0], pair[1] 昇順) でソート
  results.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    if (a.pair[0] !== b.pair[0]) {
      return a.pair[0] - b.pair[0];
    }
    return a.pair[1] - b.pair[1];
  });

  if (topN && topN > 0) {
    return results.slice(0, topN);
  }

  return results;
}
