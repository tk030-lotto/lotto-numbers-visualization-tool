/**
 * 未出現スパン（ハマり回数）分析カードコンポーネント
 * 現在のハマり回数および集計期間内最大ハマりランキングを表示
 * @module components/SpanRankingCard
 */

import React, { useState } from 'react';
import { SpanRankItem } from '../types/analysis';
import { Clock } from 'lucide-react';

interface SpanRankingCardProps {
  spanRanking: SpanRankItem[];
  gameConfig?: any;
  analysisCount: number;
  onNumberClick?: (num: number) => void;
}

type SortMode = 'current' | 'max';

export const SpanRankingCard: React.FC<SpanRankingCardProps> = ({
  spanRanking,
  analysisCount,
  onNumberClick,
}) => {
  const [sortMode, setSortMode] = useState<SortMode>('current');

  // ソート処理
  const sortedItems = [...spanRanking].sort((a, b) => {
    if (sortMode === 'current') {
      return b.currentSpan - a.currentSpan;
    }
    return b.maxSpan - a.maxSpan;
  });

  const top15 = sortedItems.slice(0, 15);

  const getSpanBadgeStyle = (span: number) => {
    if (span >= 10) {
      return {
        bg: 'var(--accent-rose-bg)',
        color: 'var(--accent-rose)',
        border: 'rgba(244, 63, 94, 0.3)',
      };
    }
    if (span >= 5) {
      return {
        bg: 'var(--accent-gold-bg)',
        color: 'var(--accent-gold)',
        border: 'rgba(234, 179, 8, 0.3)',
      };
    }
    return {
      bg: 'var(--bg-inset)',
      color: 'var(--text-secondary)',
      border: 'var(--border-subtle)',
    };
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} style={{ color: 'var(--accent-rose)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>未出現スパン（ハマり回数）ランキング</h3>
        </div>

        {/* Sort Toggle */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="btn-secondary"
            onClick={() => setSortMode('current')}
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              backgroundColor: sortMode === 'current' ? 'var(--accent-blue-bg)' : 'var(--bg-inset)',
              borderColor: sortMode === 'current' ? 'var(--accent-blue)' : 'var(--border-color)',
              color: sortMode === 'current' ? 'var(--accent-blue)' : 'var(--text-secondary)',
            }}
          >
            現在のハマり順
          </button>
          <button
            className="btn-secondary"
            onClick={() => setSortMode('max')}
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              backgroundColor: sortMode === 'max' ? 'var(--accent-blue-bg)' : 'var(--bg-inset)',
              borderColor: sortMode === 'max' ? 'var(--accent-blue)' : 'var(--border-color)',
              color: sortMode === 'max' ? 'var(--accent-blue)' : 'var(--text-secondary)',
            }}
          >
            期間内最大ハマり順
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>
        各数字が直近で当選していない連続回数（現在スパン）と、過去 {analysisCount} 回の中での最長未出現連続回数（最大スパン）です。
      </p>

      {/* Ranking Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '8px',
        }}
      >
        {top15.map((item, index) => {
          const currentBadge = getSpanBadgeStyle(item.currentSpan);
          const isDeepSpan = item.currentSpan >= 10;

          return (
            <div
              key={`span-${item.num}`}
              className="card-inset"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '8px 10px',
                border: isDeepSpan ? '1px solid rgba(244, 63, 94, 0.3)' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  #{index + 1}
                </span>
                <button
                  className="num-ball"
                  onClick={() => onNumberClick && onNumberClick(item.num)}
                  style={{
                    width: '26px',
                    height: '26px',
                    fontSize: '12px',
                    cursor: onNumberClick ? 'pointer' : 'default',
                    backgroundColor: 'var(--bg-card)',
                  }}
                  title={`数字 ${item.num} の詳細`}
                >
                  {item.num}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-muted">現在:</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: currentBadge.color,
                    }}
                  >
                    {item.currentSpan} 回
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-muted">最大:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {item.maxSpan} 回
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
