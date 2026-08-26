/**
 * ロト＆ナンバーズ 統合出目表（Occurrence Matrix）コンポーネント
 * @module components/OccurrenceMatrix
 */

import React, { useState } from 'react';
import { MatrixRow } from '../types/analysis';
import { GameConfig, MatrixDisplayMode } from '../types/config';
import { MatrixLegend } from './MatrixLegend';
import { HighlightFilterType } from './SidebarSettings';
import { Grid, Smartphone, Monitor } from 'lucide-react';

interface OccurrenceMatrixProps {
  matrixRows: MatrixRow[];
  gameConfig: GameConfig;
  showBonus: boolean;
  highlightFilter?: HighlightFilterType;
  onNumberClick?: (num: number) => void;
  displayMode?: MatrixDisplayMode;
  onToggleDisplayMode?: (mode: MatrixDisplayMode) => void;
}

export const OccurrenceMatrix: React.FC<OccurrenceMatrixProps> = ({
  matrixRows,
  gameConfig,
  showBonus,
  highlightFilter = 'all',
  onNumberClick,
  displayMode = 'desktop',
  onToggleDisplayMode,
}) => {
  const isLoto = gameConfig.category === 'loto';
  const minNum = gameConfig.minNumber;
  const maxNum = gameConfig.maxNumber;

  // スマホ表示時の数字帯（ゾーン）選択ステート
  const [selectedZone, setSelectedZone] = useState<string>('all');

  // 数字帯の定義リスト
  const zoneOptions = [
    { key: 'all', label: '全数字' },
    { key: '1-10', label: '1〜10', min: 1, max: 10 },
    { key: '11-20', label: '11〜20', min: 11, max: 20 },
    { key: '21-30', label: '21〜30', min: 21, max: 30 },
    { key: '31+', label: `31〜${maxNum}`, min: 31, max: maxNum },
  ].filter((z) => z.key === 'all' || (z.min !== undefined && z.min <= maxNum));

  // 表示対象数字リストの生成（ロト系のみゾーンフィルター適用）
  const numbersList: number[] = [];
  const activeZone = isLoto ? zoneOptions.find((z) => z.key === selectedZone) : undefined;

  for (let n = minNum; n <= maxNum; n++) {
    if (activeZone && activeZone.min !== undefined && activeZone.max !== undefined) {
      if (n >= activeZone.min && n <= activeZone.max) {
        numbersList.push(n);
      }
    } else {
      numbersList.push(n);
    }
  }

  // 10区切りのボーダー判定
  const isGroupBorder = (num: number) => {
    if (!isLoto || selectedZone !== 'all') return false;
    return num % 10 === 0 && num !== maxNum;
  };

  const isMobileView = displayMode === 'mobile';

  return (
    <div className={`card ${isMobileView ? 'matrix-card-mobile' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={18} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>出目表マトリクス</h2>
          {isMobileView && (
            <span className="badge badge-slide" style={{ fontSize: '10px', padding: '1px 6px' }}>
              スマホ最適化中
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onToggleDisplayMode && (
            <div className="card-inset" style={{ display: 'inline-flex', padding: '2px', gap: '2px' }}>
              <button
                onClick={() => onToggleDisplayMode('desktop')}
                className="btn-secondary"
                style={{
                  padding: '2px 6px',
                  fontSize: '10px',
                  border: 'none',
                  backgroundColor: !isMobileView ? 'var(--accent-blue-bg)' : 'transparent',
                  color: !isMobileView ? 'var(--accent-blue)' : 'var(--text-muted)',
                }}
              >
                <Monitor size={11} /> PC
              </button>
              <button
                onClick={() => onToggleDisplayMode('mobile')}
                className="btn-secondary"
                style={{
                  padding: '2px 6px',
                  fontSize: '10px',
                  border: 'none',
                  backgroundColor: isMobileView ? 'var(--accent-blue-bg)' : 'transparent',
                  color: isMobileView ? 'var(--accent-blue)' : 'var(--text-muted)',
                }}
              >
                <Smartphone size={11} /> スマホ
              </button>
            </div>
          )}

          <span className="text-muted font-mono" style={{ fontSize: '11px' }}>
            表示: {matrixRows.length}回 ({numbersList.length}数字)
          </span>
        </div>
      </div>

      {/* ロト系用 数字帯（ゾーン）絞り込みタブ */}
      {isLoto && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>数字帯:</span>
          {zoneOptions.map((opt) => {
            const isSel = selectedZone === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSelectedZone(opt.key)}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isSel ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                  backgroundColor: isSel ? 'var(--accent-blue-bg)' : 'var(--bg-inset)',
                  color: isSel ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isSel ? 600 : 400,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 凡例バッジ */}
      <MatrixLegend gameConfig={gameConfig} />

      {/* 出目表スクロールコンテナ */}
      <div className={`matrix-container ${isMobileView ? 'matrix-container-mobile' : ''}`} style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="matrix-round-header">回号</th>
              <th className="matrix-date-header">抽せん日</th>
              {numbersList.map((num) => (
                <th
                  key={`th-${num}`}
                  onClick={() => onNumberClick && onNumberClick(num)}
                  onKeyDown={(e) => {
                    if (onNumberClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onNumberClick(num);
                    }
                  }}
                  tabIndex={onNumberClick ? 0 : undefined}
                  role={onNumberClick ? 'button' : undefined}
                  style={{
                    minWidth: isLoto ? '26px' : '36px',
                    cursor: onNumberClick ? 'pointer' : 'default',
                    borderRight: isGroupBorder(num) ? '2px solid var(--border-color-hover)' : undefined,
                    padding: '6px 2px',
                    outline: 'none',
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
                          onKeyDown={(e) => {
                            if (onNumberClick && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault();
                              onNumberClick(num);
                            }
                          }}
                          tabIndex={onNumberClick ? 0 : undefined}
                          role={onNumberClick ? 'button' : undefined}
                          style={{
                            width: isLoto ? '22px' : '26px',
                            height: isLoto ? '22px' : '26px',
                            fontSize: isLoto ? '10px' : '12px',
                            cursor: onNumberClick ? 'pointer' : 'default',
                            outline: 'none',
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
