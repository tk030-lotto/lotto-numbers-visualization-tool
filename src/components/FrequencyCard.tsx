/**
 * F式出現頻度分類カードコンポーネント
 * @module components/FrequencyCard
 */

import React from 'react';
import { NumberFrequency } from '../types/analysis';
import { Flame, Award, RefreshCcw, Snowflake, BarChart2 } from 'lucide-react';

interface FrequencyCardProps {
  frequencies: NumberFrequency[];
  hotNumbers: number[];
  goldNumbers: number[];
  recoveryNumbers: number[];
  coldNumbers: number[];
  analysisCount: number;
  onNumberClick?: (num: number) => void;
}

export const FrequencyCard: React.FC<FrequencyCardProps> = ({
  frequencies,
  hotNumbers,
  goldNumbers,
  recoveryNumbers,
  coldNumbers,
  analysisCount,
  onNumberClick,
}) => {
  // 数字ごとの詳細頻度マップを作成
  const freqMap = new Map<number, NumberFrequency>();
  frequencies.forEach((f) => freqMap.set(f.num, f));

  // カテゴリグループ定義
  const groups = [
    {
      key: 'hot',
      label: 'HOT (超高頻度)',
      sub: '5回以上出現',
      numbers: hotNumbers,
      badgeClass: 'badge-hot',
      accentColor: 'var(--accent-hot)',
      icon: <Flame size={14} color="var(--accent-hot)" />,
    },
    {
      key: 'gold',
      label: 'GOLD (高頻度・軸候補)',
      sub: '3〜4回出現',
      numbers: goldNumbers,
      badgeClass: 'badge-gold',
      accentColor: 'var(--accent-gold)',
      icon: <Award size={14} color="var(--accent-gold)" />,
    },
    {
      key: 'recovery',
      label: 'RECOVERY (復活傾向)',
      sub: '2回出現',
      badgeClass: 'badge-recovery',
      numbers: recoveryNumbers,
      accentColor: 'var(--accent-recovery)',
      icon: <RefreshCcw size={14} color="var(--accent-recovery)" />,
    },
    {
      key: 'cold',
      label: 'COLD (低頻度・ハマり)',
      sub: '0〜1回出現',
      badgeClass: 'badge-cold',
      numbers: coldNumbers,
      accentColor: 'var(--accent-rose)',
      icon: <Snowflake size={14} color="var(--accent-rose)" />,
    },
  ];

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={18} color="var(--accent-gold)" />
          <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>出現頻度分類</h2>
        </div>
        <span className="text-muted font-mono" style={{ fontSize: '11px' }}>
          集計期間: 直近 {analysisCount} 回
        </span>
      </div>

      <div className="grid-4">
        {groups.map((g) => (
          <div key={g.key} className="card-inset" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {g.icon}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{g.label}</div>
                  <div className="text-muted" style={{ fontSize: '10px' }}>{g.sub}</div>
                </div>
              </div>
              <span className={`badge ${g.badgeClass}`} style={{ fontSize: '11px' }}>
                {g.numbers.length} 個
              </span>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '4px',
              minHeight: '40px',
              alignContent: 'flex-start',
            }}>
              {g.numbers.length > 0 ? (
                g.numbers.map((num) => {
                  const item = freqMap.get(num);
                  return (
                    <button
                      key={num}
                      onClick={() => onNumberClick && onNumberClick(num)}
                      title={item ? `数字: ${num} / 出現数: ${item.count}回 (${item.rate.toFixed(1)}%) / 未出現スパン: ${item.lastSeenRoundAgo}回` : `数字: ${num}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        cursor: onNumberClick ? 'pointer' : 'default',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <strong style={{ color: g.accentColor }}>{num}</strong>
                      {item && (
                        <span className="text-muted" style={{ fontSize: '9px' }}>
                          ({item.count})
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <span className="text-muted" style={{ fontSize: '11px', alignSelf: 'center' }}>
                  該当なし
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
