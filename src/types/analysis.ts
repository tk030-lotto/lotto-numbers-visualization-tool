/**
 * 解析結果および可視化データの型定義
 * @module types/analysis
 */

import { LotteryRound } from './lottery';

/** ナンバーズの出現型 */
export type NumbersPatternType = 'シングル' | 'ダブル' | 'トリプル' | 'フォース';

/** 1回ごとの構成指標（メトリクス） */
export interface RoundMetric {
  round: number;
  date: string;
  numbers: number[];
  bonus?: number[];
  sum: number;
  isGoldenZone: boolean;        // 黄金ゾーン（ロト）または期待値ゾーン（ナンバーズ）内か
  oddCount: number;             // 奇数個数
  evenCount: number;            // 偶数個数
  consecutiveCount: number;     // 連番ペア数
  pullCount: number;            // 引っ張り個数 (前回からの重複)
  pullNumbers: number[];
  slideCount: number;           // スライド個数 (前回当選数字の±1)
  slideNumbers: number[];
  tailOverlapCount: number;     // 末尾被り個数 (同下一桁の重複)
  patternType?: NumbersPatternType; // ナンバーズ専用型判定
}

/** F式 出現頻度分類 */
export type FrequencyRank = 'HOT' | 'GOLD' | 'RECOVERY' | 'COLD';

export interface NumberFrequency {
  num: number;
  count: number;
  rate: number;                 // 出現率 (%)
  rank: FrequencyRank;
  lastSeenRoundAgo: number;     // 現在の未出現スパン（ハマり回数）
}

/** スライド・マクロ分析 (前々回±3流入) */
export interface MacroSlideFlow {
  currentNum: number;
  prevPrevNum: number;
  diff: number;                 // -3 〜 +3
}

/** 未出現スパンランキングアイテム */
export interface SpanRankItem {
  num: number;
  currentSpan: number;          // 現在の連続未出現回数
  maxSpan: number;              // 集計期間内の最大ハマり回数
}

/** 共起ペア（相性）アイテム */
export interface SynergyPairItem {
  pair: [number, number];
  count: number;
  rate: number;
}

/** ナンバーズ桁別出現分布 */
export interface DigitDistribution {
  digitIndex: number;           // 0: 千の位(N4のみ), 1: 百の位, 2: 十の位, 3: 一の位
  digitName: string;
  counts: Record<number, number>; // 数字 0〜9 の出現数
}

/** 出目表の1セル情報 */
export interface MatrixCell {
  num: number;
  isHit: boolean;
  isBonus: boolean;
  isPull: boolean;              // 引っ張り (青)
  isSlide: boolean;             // スライド (緑)
  isNormal: boolean;            // 通常当選 (黄)
  count: number;                // 同回での出現数（ナンバーズのダブル・トリプル等）
}

/** 出目表の1行情報 (1回号) */
export interface MatrixRow {
  round: number;
  date: string;
  cells: Record<number, MatrixCell>;
}

/** 統合分析サマリー */
export interface IntegratedAnalysisResult {
  targetRounds: LotteryRound[];
  baseRound: LotteryRound;
  latestMetrics: RoundMetric;
  recentMetricsList: RoundMetric[];
  frequencies: NumberFrequency[];
  hotNumbers: number[];
  goldNumbers: number[];
  recoveryNumbers: number[];
  coldNumbers: number[];
  macroSlideFlows: MacroSlideFlow[];
  spanRanking: SpanRankItem[];
  synergyPairs: SynergyPairItem[];
  digitDistributions?: DigitDistribution[];
  matrixRows: MatrixRow[];
}
