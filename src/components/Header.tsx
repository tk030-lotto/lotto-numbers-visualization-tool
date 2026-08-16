/**
 * アプリケーションヘッダーコンポーネント
 * @module components/Header
 */

import React from 'react';
import { GameKey, SyncStatus } from '../types/lottery';
import { GAME_CONFIGS } from '../config/games';
import { BarChart3, CheckCircle2, AlertCircle, RefreshCw, Database, Monitor, Smartphone } from 'lucide-react';
import { MatrixDisplayMode } from '../types/config';

interface HeaderProps {
  selectedGame: GameKey;
  onSelectGame: (game: GameKey) => void;
  syncStatus: SyncStatus;
  lastUpdated?: string;
  totalRounds?: number;
  onRefresh?: () => void;
  isLoading?: boolean;
  displayMode: MatrixDisplayMode;
  onToggleDisplayMode: (mode: MatrixDisplayMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedGame,
  onSelectGame,
  syncStatus,
  lastUpdated,
  totalRounds,
  onRefresh,
  isLoading = false,
  displayMode,
  onToggleDisplayMode,
}) => {
  const gameKeys: GameKey[] = ['loto7', 'loto6', 'miniloto', 'numbers4', 'numbers3'];

  // 同期ステータスバッジの描画
  const renderSyncBadge = () => {
    switch (syncStatus) {
      case 'synced':
        return (
          <div
            className="badge"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
            }}
            title={lastUpdated ? `最終同期: ${lastUpdated} (全${totalRounds ?? 0}回)` : '最新データ取得済'}
          >
            <CheckCircle2 size={13} />
            <span>最新同期済 {totalRounds ? `(${totalRounds}回)` : ''}</span>
          </div>
        );
      case 'syncing':
        return (
          <div
            className="badge"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--accent-blue)',
              borderColor: 'rgba(59, 130, 246, 0.3)',
            }}
          >
            <RefreshCw size={13} className="spin-animation" />
            <span>同期中...</span>
          </div>
        );
      case 'offline':
        return (
          <div
            className="badge"
            style={{
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              color: 'var(--accent-gold)',
              borderColor: 'rgba(234, 179, 8, 0.3)',
            }}
            title="内蔵プリロードデータで動作中"
          >
            <Database size={13} />
            <span>内蔵プリロード</span>
          </div>
        );
      case 'error':
        return (
          <div
            className="badge badge-cold"
            title="最新データの取得に失敗しました。内蔵データを使用します。"
          >
            <AlertCircle size={13} />
            <span>取得エラー（内蔵フォールバック）</span>
          </div>
        );
    }
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Title & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-blue-bg)',
            color: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <BarChart3 size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            ロト＆ナンバーズ 統合構造解析・出目表可視化システム
          </h1>
          <p className="text-muted" style={{ fontSize: '11px', margin: 0 }}>
            構造解析・パターン分析・出目表マトリクス
          </p>
        </div>
      </div>

      {/* Lottery Game Selector Tabs */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        {gameKeys.map((key) => {
          const cfg = GAME_CONFIGS[key];
          const isSelected = selectedGame === key;
          return (
            <button
              key={key}
              onClick={() => onSelectGame(key)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                backgroundColor: isSelected ? 'var(--accent-blue-bg)' : 'var(--bg-inset)',
                color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontWeight: isSelected ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Display Mode Toggle + Sync Status & Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Display Mode Toggle */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-inset)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2px',
            gap: '2px',
          }}
          title="PC表示 / スマホ表示モード切替"
        >
          <button
            onClick={() => onToggleDisplayMode('desktop')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: displayMode === 'desktop' ? 600 : 400,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: displayMode === 'desktop' ? 'var(--accent-blue-bg)' : 'transparent',
              color: displayMode === 'desktop' ? 'var(--accent-blue)' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Monitor size={13} />
            <span>PC</span>
          </button>
          <button
            onClick={() => onToggleDisplayMode('mobile')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: displayMode === 'mobile' ? 600 : 400,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: displayMode === 'mobile' ? 'var(--accent-blue-bg)' : 'transparent',
              color: displayMode === 'mobile' ? 'var(--accent-blue)' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Smartphone size={13} />
            <span>スマホ</span>
          </button>
        </div>

        {renderSyncBadge()}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="最新データを再取得"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-inset)',
              color: 'var(--text-secondary)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'spin-animation' : ''} />
          </button>
        )}
      </div>
    </header>
  );
};
