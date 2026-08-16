/**
 * 合計値推移トレンドチャートコンポーネント (Recharts)
 * 各回号の合計値推移、黄金ゾーン/期待値ライン、ツールチップを描画
 * @module components/MacroTrendChart
 */

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { RoundMetric } from '../types/analysis';
import { GameConfig } from '../types/config';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface MacroTrendChartProps {
  metricsList: RoundMetric[];
  gameConfig: GameConfig;
}

export const MacroTrendChart: React.FC<MacroTrendChartProps> = ({
  metricsList,
  gameConfig,
}) => {
  // チャート用データ（時系列: 古い回号 -> 新しい回号）
  const chartData = [...metricsList].reverse().map((m) => ({
    round: m.round,
    roundLabel: `第${m.round}回`,
    date: m.date,
    sum: m.sum,
    numbers: m.numbers.join(', '),
    isGolden: m.isGoldenZone,
  }));

  const isLoto = gameConfig.category === 'loto';
  const goldenMin = gameConfig.sumThresholds.expectedMin;
  const goldenMax = gameConfig.sumThresholds.expectedMax;
  const expectedSum = gameConfig.sumThresholds.centerAverage;

  // カスタムツールチップ
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        round: number;
        roundLabel: string;
        date: string;
        sum: number;
        isGolden: boolean;
        numbers: string;
      };
    }>;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="card"
          style={{
            backgroundColor: 'rgba(18, 18, 21, 0.95)',
            borderColor: 'var(--border-color-hover)',
            padding: '8px 12px',
            fontSize: '12px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.roundLabel}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{data.date}</span>
          </div>
          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>当選数字:</span>
            <span className="font-mono" style={{ color: 'var(--accent-amber)' }}>{data.numbers}</span>
          </div>
          <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>合計値:</span>
            <span className="font-mono" style={{ fontWeight: 700, color: data.isGolden ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
              {data.sum}
            </span>
            {data.isGolden && (
              <span className="badge badge-slide" style={{ fontSize: '10px', padding: '0 4px' }}>
                {isLoto ? '黄金ゾーン' : '期待値ゾーン'}
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={16} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>合計値推移マクロトレンド</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isLoto ? (
            <span className="badge badge-slide" style={{ fontSize: '11px' }}>
              <ShieldCheck size={12} /> 黄金ゾーン: {goldenMin} 〜 {goldenMax}
            </span>
          ) : (
            <span className="badge badge-normal" style={{ fontSize: '11px' }}>
              理論平均合計: {expectedSum}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>
        過去 {metricsList.length} 回の合計値の推移グラフです。
        {isLoto
          ? '緑色エリア（黄金ゾーン）内に収まっている回号はバランスの取れた出目構成です。'
          : '点線（理論期待値）周辺への収束傾向を確認できます。'}
      </p>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis
              dataKey="round"
              tickFormatter={(r) => `${r}`}
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* ロトの黄金ゾーンエリア */}
            {isLoto && (
              <ReferenceArea
                y1={goldenMin}
                y2={goldenMax}
                fill="rgba(16, 185, 129, 0.08)"
                stroke="rgba(16, 185, 129, 0.2)"
                strokeDasharray="2 2"
              />
            )}

            {/* ナンバーズの期待値ライン */}
            {!isLoto && expectedSum > 0 && (
              <ReferenceLine
                y={expectedSum}
                stroke="var(--accent-amber)"
                strokeDasharray="4 4"
                label={{ value: `期待値 ${expectedSum}`, fill: 'var(--text-muted)', fontSize: 10, position: 'insideTopLeft' }}
              />
            )}

            {/* 合計値 折れ線 */}
            <Line
              type="monotone"
              dataKey="sum"
              stroke="var(--accent-blue)"
              strokeWidth={2}
              dot={{ fill: 'var(--accent-blue)', r: 3 }}
              activeDot={{ r: 5, fill: 'var(--accent-emerald)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
