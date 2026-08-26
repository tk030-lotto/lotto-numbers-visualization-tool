/**
 * ロト＆ナンバーズ 抽選データ型定義
 * @module types/lottery
 */

/** 対応くじ種キー */
export type GameKey = 'loto7' | 'loto6' | 'miniloto' | 'numbers3' | 'numbers4';

/** くじ種カテゴリ */
export type GameCategory = 'loto' | 'numbers';

/** ロト系 1回分の抽選結果データ */
export interface LotoRound {
  round: number;
  date: string;
  numbers: number[]; // 本数字 (昇順ソート済み)
  bonus: number[];   // ボーナス数字
}

/** ナンバーズ系 1回分の抽選結果データ */
export interface NumbersRound {
  round: number;
  date: string;
  numbers: number[]; // 抽選数字配列（例: N3=[1, 5, 5], N4=[0, 8, 2, 9]）
}

/** 統合抽選結果データ型 */
export type LotteryRound = LotoRound | NumbersRound;

/** データ取得APIレスポンス型 (オブジェクト形式またはトップレベル配列形式) */
export interface DataHubObjectResponse {
  gameKey?: GameKey;
  updatedAt?: string;
  totalRounds?: number;
  data?: LotteryRound[];
}

export type DataHubResponse = DataHubObjectResponse | LotteryRound[];

/** 同期ステータス */
export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';
