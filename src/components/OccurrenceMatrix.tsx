/**
 * ロト＆ナンバーズ 統合出目表（Occurrence Matrix）コンポーネント
 * @module components/OccurrenceMatrix
 */

import React from 'react';
import { MatrixRow } from '../types/analysis';
import { GameConfig } from '../types/config';
import { MatrixLegend } from './MatrixLegend';
import { HighlightFilterType } from './SidebarSettings';
import { Grid } from 'lucide-react';

interface OccurrenceMatrixProps {
  matrixRows: MatrixRow[];
  gameConfig: GameConfig;
  showBonus: boolean;
  highlightFilter?: HighlightFilterType;
  onNumberClick?: (num: number) => void;
}

export const OccurrenceMatrix: React.FC<OccurrenceMatrixProps> = ({
  matrixRows,
  gameConfig,
  showBonus,
  highlightFilter = 'all',
  onNumberClick,
}) => {
  const isLoto = gameConfig.category === 'loto';
  const minNum = gameConfig.minNumber;
  const maxNum = gameConfig.maxNumber;

  // 数字一覧配列を生成 (ロト: 1..N, ナンバーズ: 0..9)
  const numbersList: number[] = [];
  for (let n = minNum; n <= maxNum; n++) {
    numbersList.push(n);
  }

  // 10区切りのボーダー判定（ロト系のみ、視認性向上のため）
  const isGroupBorder = (num: number) => {
    if (!isLoto) return false;
    return num % 10 === 0 && num !== maxNum;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={18} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>出目表マトリクス</h2>
        </div>
        <span className="text-muted font-mono" style={{ fontSize: '11px' }}>
          表示中: {matrixRows.length} 回分 ({isLoto ? `数字 1〜${maxNum}` : '数字 0〜9'})
        </span>
      </div>

      {/* 凡例バッジ */}
      <MatrixLegend gameConfig={gameConfig} />

      {/* 出目表スクロールコンテナ */}
      <div className="matrix-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="matrix-round-header">回号</th>
              <th className="matrix-date-header">抽せん日</th>
              {numbersList.map((num) => (
                <th
                  key={`th-${num}`}
                  onClick={() => onNumberClick && onNumberClick(num)}
                  style={{
                    minWidth: isLoto ? '26px' : '36px',
                    cursor: onNumberClick ? 'pointer' : 'default',
                    borderRight: isGroupBorder(num) ? '2px solid var(--border-color-hover)' : undefined,
                    padding: '6px 2px',
                  }}
                  title={`数字 ${num} の詳細`}
                >
                  {num}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixRows.map((row, rowIdx) => (
              <tr key={`row-${row.round}-${rowIdx}`}>
                {/* 回号 */}
                <td className="matrix-round-header font-mono" style={{ fontWeight: 600 }}>
                  第{row.round}回
                </td>
                {/* 抽せん日 */}
                <td className="matrix-date-header font-mono">{row.date}</td>

                {/* 各数字セル */}
                {numbersList.map((num) => {
                  const cell = row.cells[num];
                  if (!cell || !cell.isHit) {
                    return (
                      <td
                        key={`cell-${row.round}-${num}`}
                        style={{
                          borderRight: isGroupBorder(num) ? '2px solid var(--border-color-hover)' : undefined,
                          color: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        ・
                      </td>
                    );
                  }

                  // ボーナス数字の非表示フィルタ
                  if (cell.isBonus && !showBonus) {
                    return (
                      <td
                        key={`cell-${row.round}-${num}`}
                        style={{
                          borderRight: isGroupBorder(num) ? '2px solid var(--border-color-hover)' : undefined,
                          color: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        ・
                      </td>
                    );
                  }

                  // ハイライトフィルターの適用判定
                  let shouldDim = false;
                  if (highlightFilter === 'pull' && !cell.isPull) shouldDim = true;
                  if (highlightFilter === 'slide' && !cell.isSlide) shouldDim = true;
                  if (highlightFilter === 'normal' && !cell.isNormal) shouldDim = true;

                  // クラス決定
                  let ballType = 'normal';
                  if (cell.isBonus) ballType = 'bonus';
                  else if (cell.isPull) ballType = 'pull';
                  else if (cell.isSlide) ballType = 'slide';

                  return (
                    <td
                      key={`cell-${row.round}-${num}`}
                      style={{
                        borderRight: isGroupBorder(num) ? '2px solid var(--border-color-hover)' : undefined,
                        padding: '3px 1px',
                        opacity: shouldDim ? 0.2 : 1,
                        transition: 'opacity var(--transition-fast)',
                      }}
                    >
                      <div style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center' }}>
                        <span
                          className={`num-ball ${ballType}`}
                          onClick={() => onNumberClick && onNumberClick(num)}
                          style={{
                            width: isLoto ? '22px' : '26px',
                            height: isLoto ? '22px' : '26px',
                            fontSize: isLoto ? '10px' : '12px',
                            cursor: onNumberClick ? 'pointer' : 'default',
                          }}
                          title={`第${row.round}回: 数字 ${num} (${cell.isPull ? '引っ張り' : cell.isSlide ? 'スライド' : cell.isBonus ? 'ボーナス' : '通常'})`}
                        >
                          {num}
                        </span>

                        {/* ナンバーズの複数出現（×2, ×3 等）バッジ */}
                        {cell.count > 1 && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '-4px',
                              right: '-6px',
                              backgroundColor: 'var(--accent-rose)',
                              color: '#ffffff',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '8px',
                              fontWeight: 700,
                              padding: '0 3px',
                              lineHeight: '12px',
                              border: '1px solid var(--bg-card)',
                            }}
                            title={`同一回で ${cell.count} 回出現`}
                          >
                            ×{cell.count}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
