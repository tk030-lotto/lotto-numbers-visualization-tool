/**
 * 共起ペア（相性）分析カードコンポーネント
 * 同時出現回数が多いペアのランキング Top 10 を可視化
 * @module components/SynergyCard
 */

import React from 'react';
import { SynergyPairItem } from '../types/analysis';
import { GameConfig } from '../types/config';
import { Users, Award, Percent } from 'lucide-react';

interface SynergyCardProps {
  synergyPairs: SynergyPairItem[];
  gameConfig?: GameConfig;
  analysisCount: number;
  onNumberClick?: (num: number) => void;
}

export const SynergyCard: React.FC<SynergyCardProps> = ({
  synergyPairs,
  analysisCount,
  onNumberClick,
}) => {
  const top10Pairs = synergyPairs.slice(0, 10);
  const maxCount = top10Pairs.length > 0 ? top10Pairs[0].count : 1;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} style={{ color: 'var(--accent-purple)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>共起ペア（相性）ランキング Top 10</h3>
        </div>
        <span className="badge badge-bonus" style={{ fontSize: '11px' }}>
          期間: {analysisCount} 回
        </span>
      </div>

      {/* Description */}
      <p className="text-secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>
        集計期間内に同一回号で同時に本数字として当選した回数が多いペアの組み合わせです。
      </p>

      {/* Top 10 List */}
      {top10Pairs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {top10Pairs.map((item, index) => {
            const rank = index + 1;
            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const isTop3 = rank <= 3;

            return (
              <div
                key={`synergy-${item.pair[0]}-${item.pair[1]}`}
                className="card-inset"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background Progress Bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${percentage}%`,
                    backgroundColor: isTop3 ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    zIndex: 0,
                    transition: 'width var(--transition-base)',
                  }}
                />

                {/* Left: Rank & Pair Balls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                  <div
                    style={{
                      width: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isTop3 ? 'var(--accent-purple)' : 'var(--text-muted)',
                    }}
                  >
                    {isTop3 ? <Award size={14} style={{ marginRight: '2px' }} /> : null}
                    {rank}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="num-ball"
                      onClick={() => onNumberClick && onNumberClick(item.pair[0])}
                      style={{
                        width: '28px',
                        height: '28px',
                        fontSize: '12px',
                        cursor: onNumberClick ? 'pointer' : 'default',
                        backgroundColor: 'var(--bg-card)',
                      }}
                      title={`数字: ${item.pair[0]} の詳細`}
                    >
                      {item.pair[0]}
                    </button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>+</span>
                    <button
                      className="num-ball"
                      onClick={() => onNumberClick && onNumberClick(item.pair[1])}
                      style={{
                        width: '28px',
                        height: '28px',
                        fontSize: '12px',
                        cursor: onNumberClick ? 'pointer' : 'default',
                        backgroundColor: 'var(--bg-card)',
                      }}
                      title={`数字: ${item.pair[1]} の詳細`}
                    >
                      {item.pair[1]}
                    </button>
                  </div>
                </div>

                {/* Right: Count & Rate */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {item.count}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '2px' }}>回</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      minWidth: '55px',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Percent size={11} style={{ color: 'var(--text-muted)' }} />
                    <span>{item.rate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-inset" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
          集計対象の共起ペアデータがありません
        </div>
      )}
    </div>
  );
};
