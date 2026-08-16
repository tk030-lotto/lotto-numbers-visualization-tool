/**
 * 出目表マトリクスデータ構築ユーティリティ
 * @module utils/matrixBuilder
 */

import { GameConfig } from '../types/config';
import { MatrixCell, MatrixRow } from '../types/analysis';
import { LotteryRound } from '../types/lottery';

/**
 * 集計対象回データから出目表用のマトリクス行データを構築する
 * @param rounds 集計対象回データ配列 (rounds[0] が最新回、降順ソート)
 * @param gameConfig くじ種設定定数
 * @param olderRound より過去の1回データ (rounds[last] の引っ張り/スライド判定用、任意)
 */
export function buildMatrixRows(
  rounds: LotteryRound[],
  gameConfig: GameConfig,
  olderRound?: LotteryRound
): MatrixRow[] {
  const { minNumber, maxNumber, category } = gameConfig;
  const matrixRows: MatrixRow[] = [];

  for (let i = 0; i < rounds.length; i++) {
    const current = rounds[i];
    const prev = i + 1 < rounds.length ? rounds[i + 1] : olderRound;

    const currentNumbers = current.numbers;
    const bonusNumbers = 'bonus' in current && Array.isArray(current.bonus) ? current.bonus : [];
    const prevNumbers = prev ? prev.numbers : [];

    const prevSet = new Set(prevNumbers);
    const bonusSet = new Set(bonusNumbers);

    // 数字ごとの出現回数カウント (ナンバーズの重複出現対応)
    const numCounts: Record<number, number> = {};
    for (const n of currentNumbers) {
      numCounts[n] = (numCounts[n] || 0) + 1;
    }

    const cells: Record<number, MatrixCell> = {};

    for (let n = minNumber; n <= maxNumber; n++) {
      const count = numCounts[n] || 0;
      const isHit = count > 0;
      const isBonus = !isHit && bonusSet.has(n);

      let isPull = false;
      let isSlide = false;
      let isNormal = false;

      if (isHit) {
        // 引っ張り判定: 前回の本数字に含まれる
        if (prevSet.has(n)) {
          isPull = true;
        } else if (prevNumbers.length > 0) {
          // スライド判定: 前回の本数字の ±1 (ナンバーズは 0-9 循環対応)
          if (category === 'numbers') {
            isSlide = prevNumbers.some((pn) => {
              const diff = Math.abs(pn - n);
              return diff === 1 || diff === 9;
            });
          } else {
            isSlide = prevNumbers.some((pn) => Math.abs(pn - n) === 1);
          }
        }

        // 通常当選: 引っ張りでもスライドでもない
        if (!isPull && !isSlide) {
          isNormal = true;
        }
      }

      cells[n] = {
        num: n,
        isHit,
        isBonus,
        isPull,
        isSlide,
        isNormal,
        count,
      };
    }

    matrixRows.push({
      round: current.round,
      date: current.date,
      cells,
    });
  }

  return matrixRows;
}
