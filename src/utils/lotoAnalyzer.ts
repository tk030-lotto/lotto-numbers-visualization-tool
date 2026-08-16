/**
 * ロト系（ロト7/ロト6/ミニロト）構造解析ユーティリティ
 * @module utils/lotoAnalyzer
 */

import { GameConfig } from '../types/config';
import { LotoRound } from '../types/lottery';
import { MacroSlideFlow, RoundMetric } from '../types/analysis';

/**
 * ロト系 1回分の詳細メトリクスを算出する
 * @param current 対象回データ
 * @param prev 前回データ (任意)
 * @param config くじ種設定定数 (任意)
 */
export function calculateLotoRoundMetric(
  current: LotoRound,
  prev?: LotoRound,
  config?: GameConfig
): RoundMetric {
  const numbers = [...current.numbers].sort((a, b) => a - b);
  const prevNumbers = prev ? [...prev.numbers].sort((a, b) => a - b) : [];

  // 1. 合計値計算
  const sum = numbers.reduce((acc, val) => acc + val, 0);

  // 2. 黄金ゾーン判定
  let isGoldenZone = false;
  if (config?.sumThresholds) {
    isGoldenZone = sum >= config.sumThresholds.expectedMin && sum <= config.sumThresholds.expectedMax;
  }

  // 3. 奇偶判定
  let oddCount = 0;
  let evenCount = 0;
  for (const n of numbers) {
    if (n % 2 === 0) {
      evenCount++;
    } else {
      oddCount++;
    }
  }

  // 4. 連番判定 (昇順ソート済み配列で隣り合う数値の差が1)
  let consecutiveCount = 0;
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i + 1] === numbers[i] + 1) {
      consecutiveCount++;
    }
  }

  // 5. 引っ張り数字判定 (前回当選数字との一致)
  const prevSet = new Set(prevNumbers);
  const pullNumbers = numbers.filter((n) => prevSet.has(n));
  const pullCount = pullNumbers.length;
  const pullSet = new Set(pullNumbers);

  // 6. スライド数字判定 (前回当選数字の ±1 かつ 引っ張り数字でないもの)
  const slideNumbers: number[] = [];
  if (prevNumbers.length > 0) {
    for (const num of numbers) {
      if (pullSet.has(num)) continue;
      const isSlide = prevNumbers.some((pn) => Math.abs(pn - num) === 1);
      if (isSlide) {
        slideNumbers.push(num);
      }
    }
  }
  const slideCount = slideNumbers.length;

  // 7. 末尾被り判定 (下一桁 n % 10 の重複カウント)
  const tailCounts: Record<number, number> = {};
  for (const n of numbers) {
    const tail = n % 10;
    tailCounts[tail] = (tailCounts[tail] || 0) + 1;
  }
  let tailOverlapCount = 0;
  for (const count of Object.values(tailCounts)) {
    if (count > 1) {
      tailOverlapCount += count - 1;
    }
  }

  return {
    round: current.round,
    date: current.date,
    numbers,
    bonus: current.bonus,
    sum,
    isGoldenZone,
    oddCount,
    evenCount,
    consecutiveCount,
    pullCount,
    pullNumbers,
    slideCount,
    slideNumbers,
    tailOverlapCount,
  };
}

/**
 * 前々回からのスライド・マクロ流入 (±3マス以内) を検出する
 * @param current 今回データ
 * @param prevPrev 前々回データ (任意)
 */
export function calculateMacroSlideFlows(
  current: LotoRound,
  prevPrev?: LotoRound
): MacroSlideFlow[] {
  if (!prevPrev || !prevPrev.numbers || prevPrev.numbers.length === 0) {
    return [];
  }

  const flows: MacroSlideFlow[] = [];
  const currentNumbers = current.numbers;
  const prevPrevNumbers = prevPrev.numbers;

  for (const cur of currentNumbers) {
    for (const pp of prevPrevNumbers) {
      const diff = cur - pp;
      // ±1, ±2, ±3 の流入を検出 (0は同一数字なので除外)
      if (diff >= -3 && diff <= 3 && diff !== 0) {
        flows.push({
          currentNum: cur,
          prevPrevNum: pp,
          diff,
        });
      }
    }
  }

  return flows;
}
