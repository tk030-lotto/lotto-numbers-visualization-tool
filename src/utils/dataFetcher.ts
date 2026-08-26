/**
 * データ取得・キャッシュ・フォールバック管理ユーティリティ
 * @module utils/dataFetcher
 */

import { GAME_CONFIGS } from '../config/games';
import { PRELOAD_DATA_MAP } from '../config/preloadData';
import { DataHubObjectResponse, GameKey, LotteryRound, SyncStatus } from '../types/lottery';

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
 * 抽選データの1行が有効な構造を持っているかを検証するバリデーション関数
 */
function isValidLotteryRound(item: unknown): item is LotteryRound {
  if (!item || typeof item !== 'object') return false;
  const row = item as Record<string, unknown>;
  return (
    typeof row.round === 'number' &&
    !isNaN(row.round) &&
    typeof row.date === 'string' &&
    row.date.trim().length > 0 &&
    Array.isArray(row.numbers) &&
    row.numbers.length > 0 &&
    row.numbers.every((n) => typeof n === 'number' && !isNaN(n))
  );
}

/**
 * くじ種データを取得する
 * 1. メモリキャッシュ確認 (TTL内)
 * 2. ネットワーク経由 (lotto-data-hub) で fetch
 * 3. 失敗時は Stale Cache (期限切れメモリキャッシュ) または 内蔵プリロードデータへフォールバック
 */
export async function fetchLotteryData(gameKey: GameKey): Promise<FetchResult> {
  const config = GAME_CONFIGS[gameKey];
  const now = Date.now();

  // 1. メモリキャッシュの有効性確認 (TTL内)
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

    const payload: unknown = await response.json();

    // トップレベルが配列の場合とオブジェクト形式 ({ data: [...] }) の両方に対応
    let rawRows: unknown[] = [];
    let payloadUpdatedAt: string | undefined;

    if (Array.isArray(payload)) {
      rawRows = payload;
    } else if (payload && typeof payload === 'object') {
      const obj = payload as DataHubObjectResponse;
      if (Array.isArray(obj.data)) {
        rawRows = obj.data;
      }
      if (typeof obj.updatedAt === 'string') {
        payloadUpdatedAt = obj.updatedAt;
      }
    }

    // 行単位バリデーション
    const validRows: LotteryRound[] = rawRows.filter(isValidLotteryRound);

    if (validRows.length === 0) {
      throw new Error('Invalid or empty data format received from data hub');
    }

    // 最新更新日付の導出（API指定のupdatedAt または 先頭要素の抽せん日）
    const derivedUpdatedAt = payloadUpdatedAt || validRows[0].date || new Date().toISOString().split('T')[0];

    // メモリキャッシュに保存
    memoryCache[gameKey] = {
      data: validRows,
      updatedAt: derivedUpdatedAt,
      fetchedAt: now,
    };

    return {
      data: validRows,
      status: 'synced',
      updatedAt: derivedUpdatedAt,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';

    // 3. Stale Cache (期限切れだが過去に取得成功したメモリキャッシュ) の優先活用
    if (cached && cached.data && cached.data.length > 0) {
      console.warn(`[DataFetcher] Network fetch failed for ${gameKey}. Using stale memory cache. Reason: ${message}`);
      return {
        data: cached.data,
        status: 'offline',
        updatedAt: `${cached.updatedAt} (オフラインキャッシュ)`,
        errorMessage: message,
      };
    }

    // 4. 内蔵プリロードデータへフォールバック
    const fallbackData = PRELOAD_DATA_MAP[gameKey] || [];
    const fallbackUpdatedAt = fallbackData.length > 0 ? fallbackData[0].date : new Date().toISOString().split('T')[0];

    console.warn(`[DataFetcher] Failed to fetch data for ${gameKey} from remote. Using fallback preload data. Reason: ${message}`);

    return {
      data: fallbackData,
      status: fallbackData.length > 0 ? 'offline' : 'error',
      updatedAt: `${fallbackUpdatedAt} (内蔵データ)`,
      errorMessage: message,
    };
  }
}
