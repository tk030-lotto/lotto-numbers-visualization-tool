import React, { useState } from 'react';
import { GameKey } from './types/lottery';
import { GAME_CONFIGS } from './config/games';
import { PRELOAD_DATA_MAP } from './config/preloadData';
import { Activity, BarChart3, Database, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameKey>('loto7');
  const currentConfig = GAME_CONFIGS[selectedGame];
  const currentData = PRELOAD_DATA_MAP[selectedGame];

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-blue-bg)',
            color: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              ロト＆ナンバーズ 統合構造解析・出目表可視化システム
            </h1>
            <p className="text-muted" style={{ fontSize: '11px' }}>
              React 18 + Vite 5 + TypeScript / 高精度データ可視化
            </p>
          </div>
        </div>

        {/* Sync Badge */}
        <div className="badge badge-normal" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={13} />
          <span>内蔵プリロードモード (Phase 1 初期化完了)</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="content-area" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Game Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(Object.keys(GAME_CONFIGS) as GameKey[]).map((key) => {
            const cfg = GAME_CONFIGS[key];
            const isSelected = selectedGame === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedGame(key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                  backgroundColor: isSelected ? 'var(--accent-blue-bg)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Status Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Activity size={18} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '14px', fontWeight: 600 }}>
              Phase 1 基盤構成・型システム検証
            </h2>
          </div>
          <div className="grid-3" style={{ marginTop: '12px' }}>
            <div className="card-inset">
              <span className="text-muted" style={{ fontSize: '11px' }}>対象くじ種</span>
              <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '4px' }}>{currentConfig.label}</div>
            </div>
            <div className="card-inset">
              <span className="text-muted" style={{ fontSize: '11px' }}>数字範囲 / 球数</span>
              <div className="font-mono" style={{ fontSize: '14px', marginTop: '4px' }}>
                {currentConfig.minNumber} 〜 {currentConfig.maxNumber} ({currentConfig.mainCount}球)
              </div>
            </div>
            <div className="card-inset">
              <span className="text-muted" style={{ fontSize: '11px' }}>黄金 / 期待値ゾーン</span>
              <div className="font-mono" style={{ fontSize: '14px', marginTop: '4px' }}>
                合計 {currentConfig.sumThresholds.expectedMin} 〜 {currentConfig.sumThresholds.expectedMax}
              </div>
            </div>
          </div>
        </div>

        {/* Preload Data Preview Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color="var(--accent-gold)" />
            <h2 style={{ fontSize: '14px', fontWeight: 600 }}>
              プリロードデータ確認（直近 {currentData.length} 回）
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentData.slice(0, 5).map((item) => (
              <div key={item.round} className="card-inset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="font-mono text-secondary" style={{ fontWeight: 600 }}>第{item.round}回</span>
                  <span className="text-muted font-mono" style={{ fontSize: '12px' }}>{item.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {item.numbers.map((n, i) => (
                    <span key={i} className="num-ball normal">{n}</span>
                  ))}
                  {'bonus' in item && item.bonus && item.bonus.map((b, i) => (
                    <span key={`b-${i}`} className="num-ball bonus">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
