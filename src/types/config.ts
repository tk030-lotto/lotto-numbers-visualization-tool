/**
 * ゲーム設定および表示設定の型定義
 * @module types/config
 */

import { GameCategory, GameKey } from './lottery';

/** 合計値の期待値・黄金ゾーン設定 */
export interface SumThresholds {
  min: number;
  max: number;
  expectedMin: number;
  expectedMax: number;
  centerAverage: number;
}

/** くじ種設定 */
export interface GameConfig {
  key: GameKey;
  label: string;
  category: GameCategory;
  minNumber: number;        // ロト: 1, ナンバーズ: 0
  maxNumber: number;        // ロト7: 37, ロト6: 43, ミニ: 31, ナンバーズ: 9
  mainCount: number;        // ロト7: 7, ロト6: 6, ミニ: 5, N3: 3, N4: 4
  bonusCount: number;       // ロト7: 2, ロト6: 1, ミニ: 1, ナンバーズ: 0
  sumThresholds: SumThresholds;
  dataUrl: string;
}

/** 出目表表示モード */
export type MatrixDisplayMode = 'desktop' | 'mobile';

/** 出目表フィルターオプション */
export interface MatrixFilters {
  highlightPull: boolean;    // 引っ張り (青)
  highlightSlide: boolean;   // スライド (緑)
  highlightNormal: boolean;  // 通常当選 (黄)
  highlightOdd: boolean;     // 奇数
  highlightEven: boolean;    // 偶数
  selectedDigitZone: number | null; // 数字帯フィルター (1: 1-10, 2: 11-20 等)
}

/** アプリケーション全域の表示設定 */
export interface ViewSettings {
  selectedGame: GameKey;
  analysisRounds: number;    // 集計回数 (10〜100)
  baseRound: number | null;  // 基準回号 (null時は最新)
  matrixMode: MatrixDisplayMode;
  filters: MatrixFilters;
}
