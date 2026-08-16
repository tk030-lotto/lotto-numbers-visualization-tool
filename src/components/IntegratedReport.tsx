/**
 * 統合分析レポートビューコンポーネント
 * @module components/IntegratedReport
 */

import React, { useState } from 'react';
import { IntegratedAnalysisResult } from '../types/analysis';
import { GameConfig } from '../types/config';
import { MetricCard } from './MetricCard';
import { FrequencyCard } from './FrequencyCard';
import { copyReportToClipboard, generateMarkdownReport } from '../utils/reportExporter';
import { Copy, Check, Calendar, Hash } from 'lucide-react';
import { LotoRound } from '../types/lottery';

interface IntegratedReportProps {
  analysisResult: IntegratedAnalysisResult;
  gameConfig: GameConfig;
  analysisCount: number;
  onNumberClick?: (num: number) => void;
}

export const IntegratedReport: React.FC<IntegratedReportProps> = ({
  analysisResult,
  gameConfig,
  analysisCount,
  onNumberClick,
}) => {
  const [copied, setCopied] = useState(false);
  const { baseRound, latestMetrics, frequencies, hotNumbers, goldNumbers, recoveryNumbers, coldNumbers } = analysisResult;

  const isLoto = gameConfig.category === 'loto';
  const lotoBase = isLoto ? (baseRound as LotoRound) : undefined;

  // Markdownレポートのコピー実行
  const handleCopy = async () => {
    const md = generateMarkdownReport(analysisResult, gameConfig);
    const success = await copyReportToClipboard(md);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner: Base Round Winner Balls & Copy Button */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-inset) 100%)',
          borderColor: 'var(--border-color-hover)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-normal" style={{ fontSize: '12px', fontWeight: 700 }}>
                <Hash size={12} /> 第{baseRound.round}回
              </span>
              <span className="text-muted font-mono" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {baseRound.date}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {gameConfig.label} 基準回 抽せん結果
            </div>
          </div>

          {/* Numbers Balls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {baseRound.numbers.map((n, i) => {
                // 前回からの引っ張り・スライド等の判定クラス
                const isPull = latestMetrics.pullNumbers.includes(n);
                const isSlide = latestMetrics.slideNumbers.includes(n);
                const ballClass = isPull ? 'pull' : isSlide ? 'slide' : 'normal';

                return (
                  <button
                    key={`main-${i}`}
                    className={`num-ball ${ballClass}`}
                    onClick={() => onNumberClick && onNumberClick(n)}
                    style={{ cursor: onNumberClick ? 'pointer' : 'default', width: '32px', height: '32px', fontSize: '13px' }}
                    title={`数字: ${n} (${isPull ? '引っ張り' : isSlide ? 'スライド' : '通常'})`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            {/* Bonus Numbers (Loto Only) */}
            {isLoto && lotoBase?.bonus && lotoBase.bonus.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
                <span className="text-muted" style={{ fontSize: '10px' }}>B:</span>
                {lotoBase.bonus.map((b, i) => (
                  <button
                    key={`b-${i}`}
                    className="num-ball bonus"
                    onClick={() => onNumberClick && onNumberClick(b)}
                    style={{ cursor: onNumberClick ? 'pointer' : 'default', width: '28px', height: '28px', fontSize: '11px' }}
                    title={`ボーナス数字: ${b}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Copy Report Button */}
        <button
          onClick={handleCopy}
          className="btn-secondary"
          style={{
            backgroundColor: copied ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-inset)',
            borderColor: copied ? 'var(--accent-emerald)' : 'var(--border-color)',
            color: copied ? 'var(--accent-emerald)' : 'var(--text-primary)',
          }}
          title="分析結果をMarkdown形式でクリップボードにコピー"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'コピー完了' : 'Markdownレポート出力'}</span>
        </button>
      </div>

      {/* 1. Metric Breakdown Card */}
      <MetricCard metric={latestMetrics} gameConfig={gameConfig} />

      {/* 2. Frequency Breakdown Card */}
      <FrequencyCard
        frequencies={frequencies}
        hotNumbers={hotNumbers}
        goldNumbers={goldNumbers}
        recoveryNumbers={recoveryNumbers}
        coldNumbers={coldNumbers}
        analysisCount={analysisCount}
        onNumberClick={onNumberClick}
      />
    </section>
  );
};
