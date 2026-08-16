/**
 * スライドマクロ分析カードコンポーネント (ロト系専用)
 * 前々回当選数字からの±3マクロ流入（スライドマクロ）を可視化
 * @module components/SlideMacroCard
 */

import React from 'react';
import { MacroSlideFlow } from '../types/analysis';
import { GameConfig } from '../types/config';
import { GitCommit, TrendingUp, Sparkles } from 'lucide-react';

interface SlideMacroCardProps {
  macroSlideFlows: MacroSlideFlow[];
  gameConfig: GameConfig;
  onNumberClick?: (num: number) => void;
}

export const SlideMacroCard: React.FC<SlideMacroCardProps> = ({
  macroSlideFlows,
  gameConfig,
  onNumberClick,
}) => {
  // ロト系以外の場合は非表示
  if (gameConfig.category !== 'loto') {
    return null;
  }

  // 差分（-3〜+3）の集計
  const diffDistribution: Record<number, number> = {
    [-3]: 0,
    [-2]: 0,
    [-1]: 0,
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  };

  macroSlideFlows.forEach((flow) => {
    if (diffDistribution[flow.diff] !== undefined) {
      diffDistribution[flow.diff]++;
    }
  });

  const getDiffBadgeClass = (diff: number) => {
    if (diff === 0) return 'badge-pull';
    if (Math.abs(diff) === 1) return 'badge-slide';
    if (Math.abs(diff) === 2) return 'badge-gold';
    return 'badge-recovery';
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitCommit size={16} style={{ color: 'var(--accent-emerald)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>前々回 ±3 スライドマクロ流入分析</h3>
        </div>
        <span className="badge badge-slide" style={{ fontSize: '11px' }}>
          前々回流入: {macroSlideFlows.length} 件
        </span>
      </div>

      {/* Description */}
      <p className="text-secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>
        前々回（2回前）の当選数字から ±3 の範囲内で今回の本数字に流入した数字の流れを分析します。
      </p>

      {/* Difference Distribution Mini-Bar */}
      <div className="card-inset" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> 差分（変動幅）分布
          </span>
          <span>計 {macroSlideFlows.length} 箇所</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {[-3, -2, -1, 0, 1, 2, 3].map((diff) => {
            const count = diffDistribution[diff] || 0;
            const sign = diff > 0 ? `+${diff}` : `${diff}`;
            const label = diff === 0 ? '同数' : sign;
            return (
              <div
                key={`diff-${diff}`}
                style={{
                  backgroundColor: count > 0 ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                  borderColor: count > 0 ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 2px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {label}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: count > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)',
                  }}
                >
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow Item List */}
      {macroSlideFlows.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
            今回の流入ルート一覧:
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '8px',
            }}
          >
            {macroSlideFlows.map((flow, index) => {
              const sign = flow.diff > 0 ? `+${flow.diff}` : `${flow.diff}`;
              const badgeClass = getDiffBadgeClass(flow.diff);
              return (
                <div
                  key={`flow-${index}`}
                  className="card-inset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="num-ball"
                      onClick={() => onNumberClick && onNumberClick(flow.prevPrevNum)}
                      style={{
                        width: '24px',
                        height: '24px',
                        fontSize: '11px',
                        cursor: onNumberClick ? 'pointer' : 'default',
                        backgroundColor: 'var(--bg-card)',
                      }}
                      title={`前々回の数字: ${flow.prevPrevNum}`}
                    >
                      {flow.prevPrevNum}
                    </button>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>➔</span>
                    <button
                      className="num-ball slide"
                      onClick={() => onNumberClick && onNumberClick(flow.currentNum)}
                      style={{
                        width: '26px',
                        height: '26px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: onNumberClick ? 'pointer' : 'default',
                      }}
                      title={`今回の数字: ${flow.currentNum}`}
                    >
                      {flow.currentNum}
                    </button>
                  </div>

                  <span className={`badge ${badgeClass}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                    {flow.diff === 0 ? '重複' : sign}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card-inset" style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          前々回からの ±3 マクロ流入はありません
        </div>
      )}
    </div>
  );
};
