/**
 * サイドバー設定パネルコンポーネント
 * @module components/SidebarSettings
 */

import React from 'react';
import { Sliders, History, Eye, Filter } from 'lucide-react';
import { LotteryRound } from '../types/lottery';
import { GameConfig } from '../types/config';

export type HighlightFilterType = 'all' | 'pull' | 'slide' | 'normal';

interface SidebarSettingsProps {
  gameConfig: GameConfig;
  allRounds: LotteryRound[];
  analysisCount: number;
  onAnalysisCountChange: (count: number) => void;
  baseRoundIndex: number;
  onBaseRoundIndexChange: (index: number) => void;
  showBonus: boolean;
  onToggleShowBonus: (show: boolean) => void;
  highlightFilter: HighlightFilterType;
  onHighlightFilterChange: (filter: HighlightFilterType) => void;
}

export const SidebarSettings: React.FC<SidebarSettingsProps> = ({
  gameConfig,
  allRounds,
  analysisCount,
  onAnalysisCountChange,
  baseRoundIndex,
  onBaseRoundIndexChange,
  showBonus,
  onToggleShowBonus,
  highlightFilter,
  onHighlightFilterChange,
}) => {
  const isLoto = gameConfig.category === 'loto';
  const maxAvailable = allRounds.length;
  const currentBaseRound = allRounds[baseRoundIndex];

  return (
    <aside
      style={{
        width: '280px',
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border-color)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        flexShrink: 0,
      }}
    >
      {/* Section 1: Analysis Target Count */}
      <div className="card-inset">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={15} color="var(--accent-blue)" />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>集計対象回数</span>
          </div>
          <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-blue)' }}>
            直近 {analysisCount} 回
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={Math.min(100, Math.max(10, maxAvailable))}
          step={5}
          value={analysisCount}
          onChange={(e) => onAnalysisCountChange(Number(e.target.value))}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>10回</span>
          <span>50回</span>
          <span>100回</span>
        </div>
      </div>

      {/* Section 2: Base Round Selector (Time Travel) */}
      <div className="card-inset">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <History size={15} color="var(--accent-gold)" />
          <span style={{ fontSize: '12px', fontWeight: 600 }}>基準回号（過去検証）</span>
        </div>

        <select
          value={baseRoundIndex}
          onChange={(e) => onBaseRoundIndexChange(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '8px' }}
        >
          {allRounds.slice(0, 50).map((r, idx) => (
            <option key={r.round} value={idx}>
              {idx === 0 ? `最新: 第${r.round}回 (${r.date})` : `第${r.round}回 (${r.date})`}
            </option>
          ))}
        </select>

        {baseRoundIndex > 0 && (
          <button
            onClick={() => onBaseRoundIndexChange(0)}
            className="btn-secondary"
            style={{ width: '100%', padding: '4px 8px', fontSize: '11px', justifyContent: 'center' }}
          >
            最新回（第{allRounds[0]?.round}回）に戻す
          </button>
        )}

        {currentBaseRound && (
          <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            基準: <strong style={{ color: 'var(--text-primary)' }}>第{currentBaseRound.round}回</strong> ({currentBaseRound.date})
          </div>
        )}
      </div>

      {/* Section 3: Display Settings */}
      {isLoto && (
        <div className="card-inset">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Eye size={15} color="var(--accent-purple)" />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>表示オプション</span>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
            <input
              type="checkbox"
              checked={showBonus}
              onChange={(e) => onToggleShowBonus(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)' }}
            />
            <span>ボーナス数字を表示</span>
          </label>
        </div>
      )}

      {/* Section 4: Matrix Highlight Filter */}
      <div className="card-inset">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Filter size={15} color="var(--accent-emerald)" />
          <span style={{ fontSize: '12px', fontWeight: 600 }}>出目表ハイライト</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { key: 'all', label: '全当選番号を表示' },
            { key: 'pull', label: '引っ張り（前回重複）のみ', color: 'var(--accent-blue)' },
            { key: 'slide', label: 'スライド（前回±1）のみ', color: 'var(--accent-emerald)' },
            { key: 'normal', label: '通常当選のみ', color: 'var(--accent-amber)' },
          ].map((item) => {
            const isSelected = highlightFilter === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onHighlightFilterChange(item.key as HighlightFilterType)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isSelected ? (item.color || 'var(--accent-blue)') : 'var(--border-subtle)'}`,
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textAlign: 'left',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
