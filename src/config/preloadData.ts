/**
 * オフラインフォールバック用内蔵プリロードデータ
 * @module config/preloadData
 */

import { GameKey, LotoRound, NumbersRound } from '../types/lottery';

export const PRELOAD_LOTO7: LotoRound[] = [
  { round: 610, date: '2025-02-14', numbers: [3, 8, 12, 18, 24, 29, 35], bonus: [7, 31] },
  { round: 609, date: '2025-02-07', numbers: [1, 9, 12, 17, 25, 29, 36], bonus: [14, 22] },
  { round: 608, date: '2025-01-31', numbers: [5, 8, 11, 20, 24, 30, 37], bonus: [3, 16] },
  { round: 607, date: '2025-01-24', numbers: [2, 10, 14, 18, 21, 28, 33], bonus: [6, 26] },
  { round: 606, date: '2025-01-17', numbers: [4, 7, 13, 19, 23, 27, 34], bonus: [9, 32] },
  { round: 605, date: '2025-01-10', numbers: [3, 6, 12, 15, 22, 29, 35], bonus: [1, 18] },
  { round: 604, date: '2024-12-27', numbers: [8, 11, 16, 20, 24, 31, 36], bonus: [5, 25] },
  { round: 603, date: '2024-12-20', numbers: [2, 9, 14, 17, 23, 30, 37], bonus: [12, 28] },
  { round: 602, date: '2024-12-13', numbers: [1, 7, 10, 18, 25, 29, 33], bonus: [4, 21] },
  { round: 601, date: '2024-12-06', numbers: [5, 12, 15, 19, 26, 32, 35], bonus: [8, 24] },
];

export const PRELOAD_LOTO6: LotoRound[] = [
  { round: 1970, date: '2025-02-13', numbers: [4, 11, 19, 28, 35, 41], bonus: [22] },
  { round: 1969, date: '2025-02-10', numbers: [2, 12, 18, 27, 34, 40], bonus: [9] },
  { round: 1968, date: '2025-02-06', numbers: [5, 10, 20, 29, 36, 42], bonus: [15] },
  { round: 1967, date: '2025-02-03', numbers: [3, 8, 17, 25, 33, 39], bonus: [11] },
  { round: 1966, date: '2025-01-30', numbers: [7, 14, 21, 28, 32, 43], bonus: [19] },
  { round: 1965, date: '2025-01-27', numbers: [1, 9, 16, 24, 31, 38], bonus: [5] },
  { round: 1964, date: '2025-01-23', numbers: [6, 13, 22, 30, 37, 41], bonus: [18] },
  { round: 1963, date: '2025-01-20', numbers: [4, 11, 15, 26, 35, 40], bonus: [2] },
  { round: 1962, date: '2025-01-16', numbers: [8, 12, 19, 27, 34, 42], bonus: [23] },
  { round: 1961, date: '2025-01-13', numbers: [2, 10, 18, 23, 29, 36], bonus: [7] },
];

export const PRELOAD_MINILOTO: LotoRound[] = [
  { round: 1320, date: '2025-02-11', numbers: [3, 11, 17, 24, 29], bonus: [15] },
  { round: 1319, date: '2025-02-04', numbers: [5, 9, 14, 22, 28], bonus: [7] },
  { round: 1318, date: '2025-01-28', numbers: [2, 10, 18, 23, 31], bonus: [12] },
  { round: 1317, date: '2025-01-21', numbers: [4, 8, 15, 21, 27], bonus: [19] },
  { round: 1316, date: '2025-01-14', numbers: [1, 7, 13, 20, 26], bonus: [9] },
  { round: 1315, date: '2025-01-07', numbers: [6, 12, 16, 25, 30], bonus: [3] },
  { round: 1314, date: '2024-12-24', numbers: [8, 14, 19, 24, 28], bonus: [11] },
  { round: 1313, date: '2024-12-17', numbers: [2, 9, 17, 22, 31], bonus: [5] },
  { round: 1312, date: '2024-12-10', numbers: [4, 10, 15, 23, 29], bonus: [18] },
  { round: 1311, date: '2024-12-03', numbers: [3, 7, 12, 18, 26], bonus: [21] },
];

export const PRELOAD_NUMBERS3: NumbersRound[] = [
  { round: 6650, date: '2025-02-14', numbers: [3, 8, 2] },
  { round: 6649, date: '2025-02-13', numbers: [1, 5, 5] },
  { round: 6648, date: '2025-02-12', numbers: [9, 0, 4] },
  { round: 6647, date: '2025-02-11', numbers: [7, 7, 3] },
  { round: 6646, date: '2025-02-10', numbers: [2, 6, 8] },
  { round: 6645, date: '2025-02-07', numbers: [4, 1, 9] },
  { round: 6644, date: '2025-02-06', numbers: [0, 8, 3] },
  { round: 6643, date: '2025-02-05', numbers: [5, 5, 5] },
  { round: 6642, date: '2025-02-04', numbers: [6, 2, 7] },
  { round: 6641, date: '2025-02-03', numbers: [8, 4, 1] },
];

export const PRELOAD_NUMBERS4: NumbersRound[] = [
  { round: 6650, date: '2025-02-14', numbers: [4, 1, 8, 2] },
  { round: 6649, date: '2025-02-13', numbers: [0, 7, 3, 9] },
  { round: 6648, date: '2025-02-12', numbers: [5, 2, 2, 8] },
  { round: 6647, date: '2025-02-11', numbers: [9, 6, 1, 4] },
  { round: 6646, date: '2025-02-10', numbers: [3, 8, 0, 5] },
  { round: 6645, date: '2025-02-07', numbers: [7, 4, 9, 1] },
  { round: 6644, date: '2025-02-06', numbers: [2, 5, 6, 3] },
  { round: 6643, date: '2025-02-05', numbers: [8, 0, 4, 7] },
  { round: 6642, date: '2025-02-04', numbers: [1, 9, 3, 6] },
  { round: 6641, date: '2025-02-03', numbers: [6, 3, 7, 0] },
];

export const PRELOAD_DATA_MAP: Record<GameKey, (LotoRound | NumbersRound)[]> = {
  loto7: PRELOAD_LOTO7,
  loto6: PRELOAD_LOTO6,
  miniloto: PRELOAD_MINILOTO,
  numbers3: PRELOAD_NUMBERS3,
  numbers4: PRELOAD_NUMBERS4,
};
