/**
 * ナンバーズ桁別出現分布ヒートマップカードコンポーネント (ナンバーズ専用)
 * 千/百/十/一の位ごとの 0〜9 の出現回数をヒートマップ表示
 * @module components/DigitHeatmapCard
 */

import React from 'react';
import { DigitDistribution } from '../types/analysis';
import { GameConfig } from '../types/config';
import { LayoutGrid, Flame } from 'lucide-react';

interface DigitHeatmapCardProps {
  digitDistributions?: DigitDistribution[];
  gameConfig: GameConfig;
  analysisCount: number;
}

export const DigitHeatmapCard: React.FC<DigitHeatmapCardProps> = ({
  digitDistributions,
  gameConfig,
  analysisCount,
}) => {
  // ナンバーズ系以外、またはデータがない場合は非表示
  if (gameConfig.category !== 'numbers' || !digitDistributions || digitDistributions.length === 0) {
    return null;
  }

  // 全桁・全数字の中での最大出現回数を取得（色の強度計算用）
  let maxCountInAll = 1;
  digitDistributions.forEach((dist) => {
    Object.values(dist.counts).forEach((cnt) => {
      if (cnt > maxCountInAll) maxCountInAll = cnt;
    });
  });

  // ヒートマップセルのスタイル生成
  const getCellStyle = (count: number): React.CSSProperties => {
    const intensity = Math.min(1, count / maxCountInAll);
    if (count === 0) {
      return {
        backgroundColor: 'var(--bg-inset)',
        color: 'var(--text-muted)',
        border: '1px solid var(--border-subtle)',
      };
    }
    // アンバー〜ゴールドのグラデーション
    return {
      backgroundColor: `rgba(245, 158, 11, ${Math.max(0.12, intensity * 0.45)})`,
      color: intensity > 0.7 ? '#ffffff' : 'var(--text-primary)',
      border: `1px solid rgba(245, 158, 11, ${Math.max(0.2, intensity * 0.7)})`,
      fontWeight: intensity > 0.6 ? 700 : 500,
    };
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutGrid size={16} style={{ color: 'var(--accent-amber)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>桁別 出現ヒートマップ（過去 {analysisCount} 回）</h3>
        </div>
        <span className="badge badge-normal" style={{ fontSize: '11px' }}>
          {gameConfig.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>
        各桁（千/百/十/一の位）における数字 0〜9 の出現頻度です。色が濃いマスほど直近で出現回数が多い数字です。
      </p>

      {/* Heatmap Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            textAlign: 'center',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-inset)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'left',
                  minWidth: '80px',
                }}
              >
                桁 / 数字
              </th>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <th
                  key={`th-${n}`}
                  style={{
                    padding: '8px 4px',
                    backgroundColor: 'var(--bg-inset)',
                    color: 'var(--accent-blue)',
                    border: '1px solid var(--border-color)',
                    minWidth: '34px',
                    fontWeight: 700,
                  }}
                >
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {digitDistributions.map((dist) => {
              // 各行での最大出現回数
              const rowCounts = Object.values(dist.counts);
              const maxRow = Math.max(...rowCounts);

              return (
                <tr key={`dist-${dist.digitIndex}`}>
                  <td
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-inset)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    {dist.digitName}
                  </td>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                    const count = dist.counts[n] || 0;
                    const isMax = count === maxRow && count > 0;
                    const cellStyle = getCellStyle(count);

                    return (
                      <td
                        key={`cell-${dist.digitIndex}-${n}`}
                        style={{
                          padding: '6px 2px',
                          transition: 'all var(--transition-fast)',
                          ...cellStyle,
                        }}
                        title={`${dist.digitName} [${n}]: ${count}回出現 (${((count / analysisCount) * 100).toFixed(1)}%)`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                          <span>{count}</span>
                          {isMax && <Flame size={10} style={{ color: 'var(--accent-hot)' }} />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
