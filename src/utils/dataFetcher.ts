/**
 * データ取得・キャッシュ・フォールバック管理ユーティリティ
 * @module utils/dataFetcher
 */

import { GAME_CONFIGS } from '../config/games';
import { PRELOAD_DATA_MAP } from '../config/preloadData';
import { DataHubResponse, GameKey, LotteryRound, SyncStatus } from '../types/lottery';

/** メモリキャッシュ */
const memoryCache: Partial<Record<GameKey, { data: LotteryRound[]; updatedAt: string; fetchedAt: number }>> = {};

/** キャッシュ有効期限 (1時間) */
const CACHE_TTL_MS = 60 * 60 * 1000;

export interface FetchResult {
  data: LotteryRound[];
  status: SyncStatus;
  updatedAt: string;
  errorMessage?: string;
}

/**
 * くじ種データを取得する
 * 1. メモリキャッシュ確認
 * 2. ネットワーク経由 (lotto-data-hub) で fetch
 * 3. 失敗時は内蔵プリロードデータへフォールバック
 */
export async function fetchLotteryData(gameKey: GameKey): Promise<FetchResult> {
  const config = GAME_CONFIGS[gameKey];
  const now = Date.now();

  // 1. メモリキャッシュの有効性確認
  const cached = memoryCache[gameKey];
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      data: cached.data,
      status: 'synced',
      updatedAt: cached.updatedAt,
    };
  }

  // 2. ネットワーク経由でデータ取得
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6秒タイムアウト

    const response = await fetch(config.dataUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const json: DataHubResponse = await response.json();

    if (!json || !Array.isArray(json.data) || json.data.length === 0) {
      throw new Error('Invalid data format received from data hub');
    }

    // メモリキャッシュに保存
    memoryCache[gameKey] = {
      data: json.data,
      updatedAt: json.updatedAt || new Date().toISOString().split('T')[0],
      fetchedAt: now,
    };

    return {
      data: json.data,
      status: 'synced',
      updatedAt: json.updatedAt || new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    // 3. ネットワーク取得失敗時は内蔵プリロードデータへフォールバック
    const fallbackData = PRELOAD_DATA_MAP[gameKey];
    const fallbackUpdatedAt = fallbackData.length > 0 ? fallbackData[0].date : '2026-08-16';

    const message = error instanceof Error ? error.message : 'Unknown network error';
    console.warn(`[DataFetcher] Failed to fetch data for ${gameKey} from remote. Using fallback preload data. Reason: ${message}`);

    return {
      data: fallbackData,
      status: fallbackData.length > 0 ? 'offline' : 'error',
      updatedAt: `${fallbackUpdatedAt} (内蔵データ)`,
      errorMessage: message,
    };
  }
}
