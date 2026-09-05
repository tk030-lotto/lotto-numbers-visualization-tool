/**
 * 直近詳細メトリクス一覧テーブルコンポーネント
 * 回号ごとの詳細指標（合計/奇偶/連番/引っ張り/スライド/末尾被り/型）を一覧表示
 * @module components/RecentMetricsTable
 */

import React from 'react';
import { RoundMetric } from '../types/analysis';
import { GameConfig } from '../types/config';
import { Table } from 'lucide-react';

interface RecentMetricsTableProps {
  metricsList: RoundMetric[];
  gameConfig: GameConfig;
  onNumberClick?: (num: number) => void;
}

export const RecentMetricsTable: React.FC<RecentMetricsTableProps> = ({
  metricsList,
  gameConfig,
  onNumberClick,
}) => {
  const isLoto = gameConfig.category === 'loto';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Table size={16} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>直近詳細メトリクス一覧（過去 {metricsList.length} 回）</h3>
        </div>
        <span className="badge badge-normal" style={{ fontSize: '11px' }}>
          {metricsList.length} 件
        </span>
      </div>

      {/* Description */}
      <p className="text-secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>
        各回の当選数字および構成メトリクスの詳細履歴です。各数値をクリックして詳細を確認できます。
      </p>

      {/* Table Container */}
      <div style={{ maxHeight: '380px', overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
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
              <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '60px' }}>
                回号
              </th>
              <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '80px' }}>
                抽せん日
              </th>
              <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '160px' }}>
                当選数字
              </th>
              <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '55px' }}>
                合計
              </th>
              <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '60px' }}>
                奇:偶
              </th>
              {isLoto ? (
                <>
                  <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '45px' }}>
                    連番
                  </th>
                  <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '45px' }}>
                    引張
                  </th>
                  <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '45px' }}>
                    スライド
                  </th>
                  <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '45px' }}>
                    末尾
                  </th>
                </>
              ) : (
                <>
                  <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '70px' }}>
                    パターン型
                  </th>
                  <th style={{ padding: '8px 6px', backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5, minWidth: '45px' }}>
                    引張
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {metricsList.map((m) => (
              <tr key={`metric-row-${m.round}`} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {/* 回号 */}
                <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)', fontWeight: 600 }}>
                  第{m.round}回
                </td>

                {/* 抽せん日 */}
                <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {m.date}
                </td>

                {/* 当選数字 */}
                <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    {m.numbers.map((n, idx) => (
                      <button
                        key={`t-num-${m.round}-${idx}`}
                        className="num-ball"
                        onClick={() => onNumberClick && onNumberClick(n)}
                        style={{
                          width: '22px',
                          height: '22px',
                          fontSize: '11px',
                          cursor: onNumberClick ? 'pointer' : 'default',
                          backgroundColor: m.pullNumbers.includes(n)
                            ? 'var(--accent-blue-bg)'
                            : m.slideNumbers.includes(n)
                            ? 'var(--accent-emerald-bg)'
                            : 'var(--bg-card)',
                          color: m.pullNumbers.includes(n)
                            ? 'var(--accent-blue)'
                            : m.slideNumbers.includes(n)
                            ? 'var(--accent-emerald)'
                            : 'var(--text-primary)',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                    {isLoto && m.bonus && m.bonus.length > 0 && (
                      <>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+</span>
                        {m.bonus.map((b, bidx) => (
                          <button
                            key={`t-b-${m.round}-${bidx}`}
                            className="num-ball bonus"
                            onClick={() => onNumberClick && onNumberClick(b)}
                            style={{ width: '20px', height: '20px', fontSize: '10px', cursor: onNumberClick ? 'pointer' : 'default' }}
                          >
                            {b}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </td>

                {/* 合計 */}
                <td
                  style={{
                    padding: '6px 4px',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: 700,
                    color: m.isGoldenZone ? 'var(--accent-emerald)' : 'var(--text-primary)',
                  }}
                >
                  {m.sum}
                </td>

                {/* 奇偶比 */}
                <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  {m.oddCount}:{m.evenCount}
                </td>

                {isLoto ? (
                  <>
                    {/* 連番 */}
                    <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)', color: m.consecutiveCount > 0 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                      {m.consecutiveCount}
                    </td>

                    {/* 引っ張り */}
                    <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)', color: m.pullCount > 0 ? 'var(--accent-blue)' : 'var(--text-muted)', fontWeight: m.pullCount > 0 ? 700 : 400 }}>
                      {m.pullCount}
                    </td>

                    {/* スライド */}
                    <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)', color: m.slideCount > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: m.slideCount > 0 ? 700 : 400 }}>
                      {m.slideCount}
                    </td>

                    {/* 末尾被り */}
                    <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)', color: m.tailOverlapCount > 0 ? 'var(--accent-purple)' : 'var(--text-muted)' }}>
                      {m.tailOverlapCount}
                    </td>
                  </>
                ) : (
                  <>
                    {/* パターン型 */}
                    <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)' }}>
                      <span className="badge badge-normal" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        {m.patternType || '-'}
                      </span>
                    </td>

                    {/* 引っ張り */}
                    <td style={{ padding: '6px 4px', border: '1px solid var(--border-subtle)', color: m.pullCount > 0 ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                      {m.pullCount}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
