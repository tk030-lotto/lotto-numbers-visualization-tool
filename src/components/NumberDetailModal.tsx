/**
 * 数字個別詳細モーダルコンポーネント
 * 数字ボールやカードをクリックした際に表示される深掘り分析モーダル
 * @module components/NumberDetailModal
 */

import React, { useEffect, useCallback } from 'react';
import { IntegratedAnalysisResult } from '../types/analysis';
import { GameConfig } from '../types/config';
import { X, Users, Clock, Flame } from 'lucide-react';

interface NumberDetailModalProps {
  targetNumber: number | null;
  analysisResult: IntegratedAnalysisResult;
  gameConfig: GameConfig;
  onClose: () => void;
  onSelectOtherNumber?: (num: number) => void;
}

export const NumberDetailModal: React.FC<NumberDetailModalProps> = ({
  targetNumber,
  analysisResult,
  gameConfig,
  onClose,
  onSelectOtherNumber,
}) => {
  // ESCキーで閉じる
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (targetNumber !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetNumber, handleKeyDown]);

  if (targetNumber === null) return null;

  // 1. 対象数字の頻度情報
  const freq = analysisResult.frequencies.find((f) => f.num === targetNumber) || {
    num: targetNumber,
    count: 0,
    rate: 0,
    rank: 'COLD',
    lastSeenRoundAgo: 0,
  };

  // 2. スパン情報
  const span = analysisResult.spanRanking.find((s) => s.num === targetNumber) || {
    num: targetNumber,
    currentSpan: freq.lastSeenRoundAgo,
    maxSpan: 0,
  };

  // 3. 共起相性（対象数字を含むペア）上位5件
  const relatedSynergy = analysisResult.synergyPairs
    .filter((p) => p.pair[0] === targetNumber || p.pair[1] === targetNumber)
    .slice(0, 5);

  // ランクバッジクラス
  const getRankBadge = (rank: string) => {
    switch (rank) {
      case 'HOT': return 'badge-hot';
      case 'GOLD': return 'badge-gold';
      case 'RECOVERY': return 'badge-recovery';
      default: return 'badge-cold';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color-hover)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'fadeIn 0.15s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className={`num-ball normal`}
              style={{ width: '38px', height: '38px', fontSize: '18px', fontWeight: 700 }}
            >
              {targetNumber}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>数字「{targetNumber}」詳細分析</h3>
                <span className={`badge ${getRankBadge(freq.rank)}`} style={{ fontSize: '11px' }}>
                  {freq.rank}
                </span>
              </div>
              <p className="text-secondary" style={{ fontSize: '11px' }}>{gameConfig.label} 集計サマリー</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '6px', borderRadius: '50%', width: '32px', height: '32px', justifyContent: 'center' }}
            title="閉じる (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Basic Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div className="card-inset" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={12} style={{ color: 'var(--accent-amber)' }} /> 出現回数 / 出現率
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{freq.count}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>回 ({freq.rate.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="card-inset" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} style={{ color: 'var(--accent-rose)' }} /> 未出現スパン
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: span.currentSpan >= 10 ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
                {span.currentSpan}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>回前 (最大 {span.maxSpan} 回)</span>
            </div>
          </div>
        </div>

        {/* 2. 相性の良い数字 (Top Synergy Pairs) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
            <Users size={14} style={{ color: 'var(--accent-purple)' }} />
            <span>相性の良い数字（共起上位）</span>
          </div>

          {relatedSynergy.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {relatedSynergy.map((p) => {
                const partner = p.pair[0] === targetNumber ? p.pair[1] : p.pair[0];
                return (
                  <div
                    key={`partner-${partner}`}
                    className="card-inset"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="num-ball"
                        onClick={() => onSelectOtherNumber && onSelectOtherNumber(partner)}
                        style={{
                          width: '26px',
                          height: '26px',
                          fontSize: '11px',
                          cursor: onSelectOtherNumber ? 'pointer' : 'default',
                          backgroundColor: 'var(--bg-card)',
                        }}
                        title={`数字 ${partner} の詳細を見る`}
                      >
                        {partner}
                      </button>
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>数字 {partner}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px' }}>
                      <span className="font-mono" style={{ fontWeight: 600 }}>同時出現 {p.count} 回</span>
                      <span className="text-muted font-mono">({p.rate.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card-inset" style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)', fontSize: '11px' }}>
              共起データがありません
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={onClose} className="btn-secondary" style={{ fontSize: '12px' }}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
