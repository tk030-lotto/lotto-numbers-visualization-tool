/**
 * くじ種仕様マスター定数
 * @module config/games
 */

import { GameConfig } from '../types/config';
import { GameKey } from '../types/lottery';

export const GAME_CONFIGS: Record<GameKey, GameConfig> = {
  loto7: {
    key: 'loto7',
    label: 'ロト7 (LOTO 7)',
    category: 'loto',
    minNumber: 1,
    maxNumber: 37,
    mainCount: 7,
    bonusCount: 2,
    sumThresholds: {
      min: 28,             // 1+2+3+4+5+6+7
      max: 238,            // 31+32+33+34+35+36+37
      expectedMin: 110,    // 黄金ゾーン下限
      expectedMax: 155,    // 黄金ゾーン上限
      centerAverage: 133,  // 中央期待値
    },
    dataUrl: 'https://tk030-lotto.github.io/lotto-data-hub/data/loto7.json',
  },
  loto6: {
    key: 'loto6',
    label: 'ロト6 (LOTO 6)',
    category: 'loto',
    minNumber: 1,
    maxNumber: 43,
    mainCount: 6,
    bonusCount: 1,
    sumThresholds: {
      min: 21,             // 1+2+3+4+5+6
      max: 231,            // 38+39+40+41+42+43
      expectedMin: 115,    // 黄金ゾーン下限
      expectedMax: 155,    // 黄金ゾーン上限
      centerAverage: 132,  // 中央期待値
    },
    dataUrl: 'https://tk030-lotto.github.io/lotto-data-hub/data/loto6.json',
  },
  miniloto: {
    key: 'miniloto',
    label: 'ミニロト (MINI LOTO)',
    category: 'loto',
    minNumber: 1,
    maxNumber: 31,
    mainCount: 5,
    bonusCount: 1,
    sumThresholds: {
      min: 15,             // 1+2+3+4+5
      max: 145,            // 27+28+29+30+31
      expectedMin: 65,     // 黄金ゾーン下限
      expectedMax: 95,     // 黄金ゾーン上限
      centerAverage: 80,   // 中央期待値
    },
    dataUrl: 'https://tk030-lotto.github.io/lotto-data-hub/data/miniloto.json',
  },
  numbers3: {
    key: 'numbers3',
    label: 'ナンバーズ3 (NUMBERS 3)',
    category: 'numbers',
    minNumber: 0,
    maxNumber: 9,
    mainCount: 3,
    bonusCount: 0,
    sumThresholds: {
      min: 0,              // 0+0+0
      max: 27,             // 9+9+9
      expectedMin: 10,     // 期待値ゾーン下限
      expectedMax: 17,     // 期待値ゾーン上限
      centerAverage: 13.5, // 中央期待値
    },
    dataUrl: 'https://tk030-lotto.github.io/lotto-data-hub/data/numbers3.json',
  },
  numbers4: {
    key: 'numbers4',
    label: 'ナンバーズ4 (NUMBERS 4)',
    category: 'numbers',
    minNumber: 0,
    maxNumber: 9,
    mainCount: 4,
    bonusCount: 0,
    sumThresholds: {
      min: 0,              // 0+0+0+0
      max: 36,             // 9+9+9+9
      expectedMin: 14,     // 期待値ゾーン下限
      expectedMax: 22,     // 期待値ゾーン上限
      centerAverage: 18.0, // 中央期待値
    },
    dataUrl: 'https://tk030-lotto.github.io/lotto-data-hub/data/numbers4.json',
  },
};

/** デフォルト設定 */
export const DEFAULT_GAME_KEY: GameKey = 'loto7';
export const DEFAULT_ANALYSIS_ROUNDS = 30;
export const MIN_ANALYSIS_ROUNDS = 10;
export const MAX_ANALYSIS_ROUNDS = 100;
