/**
 * メインアプリケーションコンポーネント
 * @module App
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GameKey, LotteryRound, SyncStatus } from './types/lottery';
import { GAME_CONFIGS } from './config/games';
import { PRELOAD_DATA_MAP } from './config/preloadData';
import { fetchLotteryData } from './utils/dataFetcher';
import { runIntegratedAnalysis } from './utils/index';
import { Header } from './components/Header';
import { SidebarSettings, HighlightFilterType } from './components/SidebarSettings';
import { IntegratedReport } from './components/IntegratedReport';
import { OccurrenceMatrix } from './components/OccurrenceMatrix';
import { SlideMacroCard } from './components/SlideMacroCard';
import { DigitHeatmapCard } from './components/DigitHeatmapCard';
import { SynergyCard } from './components/SynergyCard';
import { SpanRankingCard } from './components/SpanRankingCard';
import { MacroTrendChart } from './components/MacroTrendChart';
import { RecentMetricsTable } from './components/RecentMetricsTable';
import { Footer } from './components/Footer';
import { NumberDetailModal } from './components/NumberDetailModal';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  // 1. 状態管理
  const [selectedGame, setSelectedGame] = useState<GameKey>('loto7');
  const [analysisCount, setAnalysisCount] = useState<number>(30);
  const [baseRoundIndex, setBaseRoundIndex] = useState<number>(0);
  const [showBonus, setShowBonus] = useState<boolean>(true);
  const [highlightFilter, setHighlightFilter] = useState<HighlightFilterType>('all');
  const [selectedNumberForModal, setSelectedNumberForModal] = useState<number | null>(null);

  // データ同期状態
  const [allRounds, setAllRounds] = useState<LotteryRound[]>(PRELOAD_DATA_MAP['loto7']);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentConfig = GAME_CONFIGS[selectedGame];

  // 2. データ取得処理
  const loadData = useCallback(async (gameKey: GameKey) => {
    setIsLoading(true);
    setSyncStatus('syncing');
    setErrorMsg(null);

    try {
      const resp = await fetchLotteryData(gameKey);
      if (resp && resp.data && resp.data.length > 0) {
        setAllRounds(resp.data);
        setLastUpdated(resp.updatedAt);
        setSyncStatus('synced');
      } else {
        // フォールバック
        setAllRounds(PRELOAD_DATA_MAP[gameKey]);
        setSyncStatus('offline');
      }
    } catch (err) {
      console.error('Data fetch error:', err);
      setAllRounds(PRELOAD_DATA_MAP[gameKey]);
      setSyncStatus('error');
      setErrorMsg('オンライン同期に失敗したため、内蔵データを使用しています。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // くじ種切り替え時のハンドラー
  const handleSelectGame = (game: GameKey) => {
    if (game === selectedGame) return;
    setSelectedGame(game);
    setBaseRoundIndex(0); // 基準回を最新にリセット
    setSelectedNumberForModal(null);
    loadData(game);
  };

  // 初回データ読み込み
  useEffect(() => {
    loadData(selectedGame);
  }, [loadData, selectedGame]);

  // 3. 統合構造解析の実行 (useMemoで最適化)
  const analysisResult = useMemo(() => {
    if (!allRounds || allRounds.length === 0) return null;
    try {
      return runIntegratedAnalysis(allRounds, baseRoundIndex, analysisCount, currentConfig);
    } catch (err) {
      console.error('Analysis error:', err);
      return null;
    }
  }, [allRounds, baseRoundIndex, analysisCount, currentConfig]);

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        selectedGame={selectedGame}
        onSelectGame={handleSelectGame}
        syncStatus={syncStatus}
        lastUpdated={lastUpdated}
        totalRounds={allRounds.length}
        onRefresh={() => loadData(selectedGame)}
        isLoading={isLoading}
      />

      {/* Main Layout: Sidebar + Content Area */}
      <div className="main-layout">
        {/* Left Sidebar */}
        <SidebarSettings
          gameConfig={currentConfig}
          allRounds={allRounds}
          analysisCount={analysisCount}
          onAnalysisCountChange={setAnalysisCount}
          baseRoundIndex={baseRoundIndex}
          onBaseRoundIndexChange={setBaseRoundIndex}
          showBonus={showBonus}
          onToggleShowBonus={setShowBonus}
          highlightFilter={highlightFilter}
          onHighlightFilterChange={setHighlightFilter}
        />

        {/* Right Main Content */}
        <main className="content-area">
          {/* Error / Offline Warning Notice */}
          {errorMsg && (
            <div
              className="card"
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                borderColor: 'rgba(244, 63, 94, 0.3)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--accent-rose)',
                fontSize: '12px',
              }}
            >
              <AlertTriangle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && !analysisResult && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <RefreshCw size={28} className="spin-animation" style={{ margin: '0 auto 12px', color: 'var(--accent-blue)' }} />
              <p className="text-secondary" style={{ fontSize: '13px' }}>データを解析中...</p>
            </div>
          )}

          {/* Analysis View & Matrix */}
          {analysisResult && (
            <>
              {/* 1. Integrated Analysis Report */}
              <IntegratedReport
                analysisResult={analysisResult}
                gameConfig={currentConfig}
                analysisCount={analysisCount}
                onNumberClick={(num) => setSelectedNumberForModal(num)}
              />

              {/* 2. Slide Macro (Loto) or Digit Heatmap (Numbers) */}
              {currentConfig.category === 'loto' ? (
                <SlideMacroCard
                  macroSlideFlows={analysisResult.macroSlideFlows}
                  gameConfig={currentConfig}
                  onNumberClick={(num) => setSelectedNumberForModal(num)}
                />
              ) : (
                <DigitHeatmapCard
                  digitDistributions={analysisResult.digitDistributions}
                  gameConfig={currentConfig}
                  analysisCount={analysisCount}
                />
              )}

              {/* 3. Synergy Pairs & Span Ranking Grid */}
              <div className="grid-2">
                <SynergyCard
                  synergyPairs={analysisResult.synergyPairs}
                  gameConfig={currentConfig}
                  analysisCount={analysisCount}
                  onNumberClick={(num) => setSelectedNumberForModal(num)}
                />
                <SpanRankingCard
                  spanRanking={analysisResult.spanRanking}
                  gameConfig={currentConfig}
                  analysisCount={analysisCount}
                  onNumberClick={(num) => setSelectedNumberForModal(num)}
                />
              </div>

              {/* 4. Macro Trend Line Chart */}
              <MacroTrendChart
                metricsList={analysisResult.recentMetricsList}
                gameConfig={currentConfig}
              />

              {/* 5. Occurrence Matrix Table */}
              <OccurrenceMatrix
                matrixRows={analysisResult.matrixRows}
                gameConfig={currentConfig}
                showBonus={showBonus}
                highlightFilter={highlightFilter}
                onNumberClick={(num) => setSelectedNumberForModal(num)}
              />

              {/* 6. Recent Metrics Detail Grid */}
              <RecentMetricsTable
                metricsList={analysisResult.recentMetricsList}
                gameConfig={currentConfig}
                onNumberClick={(num) => setSelectedNumberForModal(num)}
              />
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer
        syncStatus={syncStatus}
        lastUpdated={lastUpdated}
        totalRounds={allRounds.length}
      />

      {/* Number Detail Modal */}
      {analysisResult && (
        <NumberDetailModal
          targetNumber={selectedNumberForModal}
          analysisResult={analysisResult}
          gameConfig={currentConfig}
          onClose={() => setSelectedNumberForModal(null)}
          onSelectOtherNumber={(num) => setSelectedNumberForModal(num)}
        />
      )}
    </div>
  );
};

export default App;
