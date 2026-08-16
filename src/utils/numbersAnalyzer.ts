/**
 * ナンバーズ系（ナンバーズ3/ナンバーズ4）構造解析ユーティリティ
 * @module utils/numbersAnalyzer
 */

import { GameConfig } from '../types/config';
import { GameKey, NumbersRound } from '../types/lottery';
import { DigitDistribution, NumbersPatternType, RoundMetric } from '../types/analysis';

/**
 * ナンバーズの出現型（シングル/ダブル/トリプル/フォース）を判定する
 * @param numbers 抽選数字配列
 */
export function determineNumbersPatternType(numbers: number[]): NumbersPatternType {
  const counts: Record<number, number> = {};
  for (const n of numbers) {
    counts[n] = (counts[n] || 0) + 1;
  }

  const values = Object.values(counts);
  const maxCount = Math.max(...values);

  if (numbers.length === 3) {
    // ナンバーズ3
    if (maxCount === 3) return 'トリプル';
    if (maxCount === 2) return 'ダブル';
    return 'シングル';
  } else {
    // ナンバーズ4
    if (maxCount === 4) return 'フォース';
    if (maxCount === 3) return 'トリプル';
    if (maxCount === 2) return 'ダブル'; // 2個重複 or 2ペア
    return 'シングル';
  }
}

/**
 * ナンバーズ系 1回分の詳細メトリクスを算出する
 * @param current 対象回データ
 * @param prev 前回データ (任意)
 * @param config くじ種設定定数 (任意)
 */
export function calculateNumbersRoundMetric(
  current: NumbersRound,
  prev?: NumbersRound,
  config?: GameConfig
): RoundMetric {
  const rawNumbers = current.numbers;
  const sortedNumbers = [...rawNumbers].sort((a, b) => a - b);
  const prevNumbers = prev ? prev.numbers : [];

  // 1. 合計値計算
  const sum = rawNumbers.reduce((acc, val) => acc + val, 0);

  // 2. 期待値ゾーン判定
  let isGoldenZone = false;
  if (config?.sumThresholds) {
    isGoldenZone = sum >= config.sumThresholds.expectedMin && sum <= config.sumThresholds.expectedMax;
  }

  // 3. 奇偶判定
  let oddCount = 0;
  let evenCount = 0;
  for (const n of rawNumbers) {
    if (n % 2 === 0) {
      evenCount++;
    } else {
      oddCount++;
    }
  }

  // 4. 連番判定 (ソート後配列で隣り合う数値の差が1)
  let consecutiveCount = 0;
  for (let i = 0; i < sortedNumbers.length - 1; i++) {
    if (sortedNumbers[i + 1] === sortedNumbers[i] + 1) {
      consecutiveCount++;
    }
  }

  // 5. 引っ張り数字判定 (前回当選数字との一致)
  const prevSet = new Set(prevNumbers);
  const pullNumbers = rawNumbers.filter((n) => prevSet.has(n));
  const pullCount = pullNumbers.length;
  const pullSet = new Set(pullNumbers);

  // 6. スライド数字判定 (前回数字の ±1 [0-9循環対応] かつ 引っ張りでない数字)
  const slideNumbers: number[] = [];
  if (prevNumbers.length > 0) {
    for (const num of rawNumbers) {
      if (pullSet.has(num)) continue;
      const isSlide = prevNumbers.some((pn) => {
        const diff = Math.abs(pn - num);
        return diff === 1 || diff === 9; // 0と9の境界もスライドとみなす
      });
      if (isSlide) {
        slideNumbers.push(num);
      }
    }
  }
  const slideCount = slideNumbers.length;

  // 7. パターン型判定
  const patternType = determineNumbersPatternType(rawNumbers);

  return {
    round: current.round,
    date: current.date,
    numbers: rawNumbers,
    sum,
    isGoldenZone,
    oddCount,
    evenCount,
    consecutiveCount,
    pullCount,
    pullNumbers,
    slideCount,
    slideNumbers,
    tailOverlapCount: 0, // ナンバーズは0〜9単一桁のため0
    patternType,
  };
}

/**
 * ナンバーズの桁別出現分布（各桁の0〜9の出現数）を集計する
 * @param rounds 対象回データ配列
 * @param gameKey numbers3 または numbers4
 */
export function calculateDigitDistributions(
  rounds: NumbersRound[],
  gameKey: GameKey
): DigitDistribution[] {
  const isN4 = gameKey === 'numbers4';
  const digitNames = isN4
    ? ['千の位', '百の位', '十の位', '一の位']
    : ['百の位', '十の位', '一の位'];

  const distributions: DigitDistribution[] = digitNames.map((name, index) => ({
    digitIndex: index,
    digitName: name,
    counts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
  }));

  for (const r of rounds) {
    const nums = r.numbers;
    for (let d = 0; d < distributions.length; d++) {
      const val = nums[d];
      if (val !== undefined && val >= 0 && val <= 9) {
        distributions[d].counts[val] = (distributions[d].counts[val] || 0) + 1;
      }
    }
  }

  return distributions;
}
