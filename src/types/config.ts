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


