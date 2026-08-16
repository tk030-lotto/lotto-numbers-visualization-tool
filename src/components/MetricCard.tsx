/**
 * 構成解析メトリクスカードコンポーネント
 * @module components/MetricCard
 */

import React from 'react';
import { RoundMetric } from '../types/analysis';
import { GameConfig } from '../types/config';
import { Scale, Layers, GitCommit, ArrowRightLeft, Sparkles, Hash } from 'lucide-react';

interface MetricCardProps {
  metric: RoundMetric;
  gameConfig: GameConfig;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, gameConfig }) => {
  const isLoto = gameConfig.category === 'loto';
  const totalCount = metric.oddCount + metric.evenCount;
  const oddPercent = totalCount > 0 ? (metric.oddCount / totalCount) * 100 : 50;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>構成指標分析（基準回）</h2>
        </div>
        <span className="badge badge-normal" style={{ fontSize: '11px' }}>
          第{metric.round}回 データ
        </span>
      </div>

      <div className="grid-3">
        {/* 1. Odd/Even Balance */}
        <div className="card-inset">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="text-muted" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Scale size={13} /> 奇偶バランス
            </span>
            <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600 }}>
              奇 {metric.oddCount} : 偶 {metric.evenCount}
            </span>
          </div>
          {/* Visual Ratio Bar */}
          <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--accent-blue-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${oddPercent}%`, backgroundColor: 'var(--accent-blue)' }} title={`奇数: ${metric.oddCount}`} />
            <div style={{ width: `${100 - oddPercent}%`, backgroundColor: 'var(--accent-amber)' }} title={`偶数: ${metric.evenCount}`} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span style={{ color: 'var(--accent-blue)' }}>奇数 {metric.oddCount}</span>
            <span style={{ color: 'var(--accent-amber)' }}>偶数 {metric.evenCount}</span>
          </div>
        </div>

        {/* 2. Sum Value & Zone */}
        <div className="card-inset">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="text-muted" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Hash size={13} /> 合計値
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: metric.isGoldenZone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: metric.isGoldenZone ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                fontSize: '11px',
              }}
            >
              {isLoto ? (metric.isGoldenZone ? '黄金ゾーン内' : 'ゾーン外') : (metric.isGoldenZone ? '期待値ゾーン内' : 'ゾーン外')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {metric.sum}
            </span>
            <span className="text-muted font-mono" style={{ fontSize: '11px' }}>
              (基準: {gameConfig.sumThresholds.expectedMin}〜{gameConfig.sumThresholds.expectedMax})
            </span>
          </div>
        </div>

        {/* 3. Pull / Duplicate */}
        <div className="card-inset">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="text-muted" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GitCommit size={13} color="var(--accent-blue)" /> 引っ張り (前回重複)
            </span>
            <span className="badge badge-pull" style={{ fontSize: '11px' }}>
              {metric.pullCount} 個
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', minHeight: '24px', alignItems: 'center' }}>
            {metric.pullNumbers.length > 0 ? (
              metric.pullNumbers.map((n) => (
                <span key={n} className="num-ball pull" style={{ width: '22px', height: '22px', fontSize: '11px' }}>
                  {n}
                </span>
              ))
            ) : (
              <span className="text-muted" style={{ fontSize: '11px' }}>なし (0個)</span>
            )}
          </div>
        </div>

        {/* 4. Slide (+/-1) */}
        <div className="card-inset">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="text-muted" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowRightLeft size={13} color="var(--accent-emerald)" /> スライド (前回±1)
            </span>
            <span className="badge badge-slide" style={{ fontSize: '11px' }}>
              {metric.slideCount} 個
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', minHeight: '24px', alignItems: 'center' }}>
            {metric.slideNumbers.length > 0 ? (
              metric.slideNumbers.map((n) => (
                <span key={n} className="num-ball slide" style={{ width: '22px', height: '22px', fontSize: '11px' }}>
                  {n}
                </span>
              ))
            ) : (
              <span className="text-muted" style={{ fontSize: '11px' }}>なし (0個)</span>
            )}
          </div>
        </div>

        {/* 5. Consecutive / Series */}
        <div className="card-inset">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="text-muted" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} color="var(--accent-gold)" /> 連番ペア数
            </span>
            <span className="badge badge-gold" style={{ fontSize: '11px' }}>
              {metric.consecutiveCount} 組
            </span>
          </div>
          <div className="font-mono text-secondary" style={{ fontSize: '13px', paddingTop: '2px' }}>
            {metric.consecutiveCount > 0 ? `${metric.consecutiveCount} 箇所の連続番号あり` : '連番なし'}
          </div>
        </div>

        {/* 6. Pattern Type or Tail Overlap */}
        <div className="card-inset">
          {isLoto ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="text-muted" style={{ fontSize: '11px' }}>同下一桁 (末尾被り)</span>
                <span className="badge badge-normal" style={{ fontSize: '11px' }}>{metric.tailOverlapCount} 組</span>
              </div>
              <div className="font-mono text-secondary" style={{ fontSize: '13px', paddingTop: '2px' }}>
                {metric.tailOverlapCount > 0 ? `${metric.tailOverlapCount} 組の末尾同番あり` : '末尾被りなし'}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="text-muted" style={{ fontSize: '11px' }}>出現型パターン</span>
                <span className="badge badge-gold" style={{ fontSize: '11px' }}>{metric.patternType}</span>
              </div>
              <div className="font-mono text-secondary" style={{ fontSize: '13px', paddingTop: '2px' }}>
                {metric.patternType}型構成
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
