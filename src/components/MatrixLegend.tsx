/**
 * 出目表凡例バッジコンポーネント
 * @module components/MatrixLegend
 */

import React from 'react';
import { GameConfig } from '../types/config';
import { Info } from 'lucide-react';

interface MatrixLegendProps {
  gameConfig: GameConfig;
}

export const MatrixLegend: React.FC<MatrixLegendProps> = ({ gameConfig }) => {
  const isLoto = gameConfig.category === 'loto';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '8px 12px',
        backgroundColor: 'var(--bg-inset)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        fontSize: '11px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
        <Info size={13} />
        <span>出目表の配色凡例:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* 引っ張り (青) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className="num-ball pull" style={{ width: '18px', height: '18px', fontSize: '10px' }}>●</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>引っ張り（前回重複）</span>
        </div>

        {/* スライド (緑) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className="num-ball slide" style={{ width: '18px', height: '18px', fontSize: '10px' }}>●</span>
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 500 }}>スライド（前回±1）</span>
        </div>

        {/* 通常当選 (黄) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className="num-ball normal" style={{ width: '18px', height: '18px', fontSize: '10px' }}>●</span>
          <span style={{ color: 'var(--accent-amber)', fontWeight: 500 }}>通常当選</span>
        </div>

        {/* ボーナス (紫) - ロト系のみ */}
        {isLoto && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="num-ball bonus" style={{ width: '18px', height: '18px', fontSize: '10px' }}>B</span>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 500 }}>ボーナス数字</span>
          </div>
        )}

        {/* ナンバーズ重複バッジ - ナンバーズ系のみ */}
        {!isLoto && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                backgroundColor: 'var(--accent-rose)',
                color: '#fff',
                borderRadius: 'var(--radius-full)',
                padding: '1px 5px',
                fontSize: '9px',
                fontWeight: 700,
              }}
            >
              ×2
            </span>
            <span className="text-secondary">同一回の重複出現</span>
          </div>
        )}
      </div>
    </div>
  );
};
