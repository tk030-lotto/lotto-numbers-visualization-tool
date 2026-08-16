/**
 * アプリケーション共通フッターコンポーネント
 * データ同期ステータス・ライセンス・著作権情報を表示
 * @module components/Footer
 */

import React from 'react';
import { SyncStatus } from '../types/lottery';
import { Shield } from 'lucide-react';

interface FooterProps {
  syncStatus: SyncStatus;
  lastUpdated?: string;
  totalRounds: number;
}

export const Footer: React.FC<FooterProps> = ({
  syncStatus,
  lastUpdated,
  totalRounds,
}) => {
  const getStatusText = (status: SyncStatus) => {
    switch (status) {
      case 'synced': return '🟢 オンライン同期完了 (最新)';
      case 'offline': return '⚪ 内蔵プリロードデータ使用中';
      case 'error': return '🔴 同期エラー (フォールバック中)';
      case 'syncing': return '🟡 同期通信中...';
      default: return '⚪ 待機中';
    }
  };

  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-inset)',
        padding: '16px 20px',
        fontSize: '12px',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: Status & Dataset Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>
            {getStatusText(syncStatus)}
          </span>
          {lastUpdated && (
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
              (更新: {lastUpdated})
            </span>
          )}
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span>総蓄積回数: {totalRounds} 回</span>
        </div>

        {/* Right: Copyright & License */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} /> MIT License
          </span>
          <span>© 2026 ロト＆ナンバーズ 統合構造解析・出目表可視化システム</span>
        </div>
      </div>
    </footer>
  );
};
