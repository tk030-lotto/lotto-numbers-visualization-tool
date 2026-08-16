/**
 * F式 出現頻度分類ユーティリティ
 * @module utils/frequencyAnalyzer
 */

import { GameConfig } from '../types/config';
import { FrequencyRank, NumberFrequency } from '../types/analysis';
import { LotteryRound } from '../types/lottery';

export interface FrequencyAnalysisResult {
  frequencies: NumberFrequency[];
  hotNumbers: number[];
  goldNumbers: number[];
  recoveryNumbers: number[];
  coldNumbers: number[];
}

/**
 * 出現回数からF式ランクを判定する
 * HOT: 5回以上 / GOLD: 3〜4回 / RECOVERY: 2回 / COLD: 0〜1回
 */
export function getFrequencyRank(count: number): FrequencyRank {
  if (count >= 5) return 'HOT';
  if (count >= 3) return 'GOLD';
  if (count === 2) return 'RECOVERY';
  return 'COLD';
}

/**
 * 集計対象回データにおける各数字の出現頻度およびF式分類を集計する
 * @param rounds 集計対象回データ配列 (最新回が先頭: rounds[0])
 * @param gameConfig くじ種設定定数
 */
export function calculateFrequencies(
  rounds: LotteryRound[],
  gameConfig: GameConfig
): FrequencyAnalysisResult {
  const { minNumber, maxNumber } = gameConfig;
  const totalRounds = rounds.length;

  const countMap: Record<number, number> = {};
  const lastSeenMap: Record<number, number> = {};

  // 全数字の初期化
  for (let n = minNumber; n <= maxNumber; n++) {
    countMap[n] = 0;
    lastSeenMap[n] = totalRounds; // 期間内未出現の場合は最大スパン値
  }

  // 出現回数および最新からの未出現スパン（ハマり回数）を集計
  for (let rIndex = 0; rIndex < rounds.length; rIndex++) {
    const roundData = rounds[rIndex];
    const nums = roundData.numbers;

    for (const num of nums) {
      if (num >= minNumber && num <= maxNumber) {
        countMap[num] = (countMap[num] || 0) + 1;
        // 最初に出現したインデックスを保持（未記録の場合のみ）
        if (lastSeenMap[num] === totalRounds) {
          lastSeenMap[num] = rIndex;
        }
      }
    }
  }

  const frequencies: NumberFrequency[] = [];
  const hotNumbers: number[] = [];
  const goldNumbers: number[] = [];
  const recoveryNumbers: number[] = [];
  const coldNumbers: number[] = [];

  for (let n = minNumber; n <= maxNumber; n++) {
    const count = countMap[n] || 0;
    const rate = totalRounds > 0 ? Number(((count / totalRounds) * 100).toFixed(1)) : 0;
    const rank = getFrequencyRank(count);
    const lastSeenRoundAgo = lastSeenMap[n] !== undefined ? lastSeenMap[n] : totalRounds;

    const item: NumberFrequency = {
      num: n,
      count,
      rate,
      rank,
      lastSeenRoundAgo,
    };

    frequencies.push(item);

    switch (rank) {
      case 'HOT':
        hotNumbers.push(n);
        break;
      case 'GOLD':
        goldNumbers.push(n);
        break;
      case 'RECOVERY':
        recoveryNumbers.push(n);
        break;
      case 'COLD':
        coldNumbers.push(n);
        break;
    }
  }

  return {
    frequencies,
    hotNumbers,
    goldNumbers,
    recoveryNumbers,
    coldNumbers,
  };
}
