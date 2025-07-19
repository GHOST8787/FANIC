import { useState, useEffect } from 'react';
import { CurrencySymbol, TimeInterval } from '../components/CurrencySelector';
import axios from 'axios';

export interface KLineData {
  time: number; // timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BinanceKLineResponse {
  // Binance API response format
  0: number; // Open time
  1: string; // Open
  2: string; // High
  3: string; // Low
  4: string; // Close
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume 
  11: string; // Ignore
}

export function useBinanceKlines(
  symbol: CurrencySymbol,
  interval: TimeInterval = TimeInterval['1d'], // 預設日線
  limit: number = 500,
  autoUpdate: boolean = true
) {
  const [data, setData] = useState<KLineData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchKlines = async () => {
    if (!symbol || !interval) return;

    setIsLoading(true);
    setError(null);

    try {
      // 根據時間間隔調整 limit，避免 API timeout
      let adjustedLimit = limit;
      if (interval === TimeInterval['1m'] || interval === TimeInterval['5m']) {
        adjustedLimit = Math.min(limit, 300); // 1m/5m 限制在 300 根
      }

      const response = await axios.get('https://api.binance.com/api/v3/klines', {
        params: {
          symbol: symbol,
          interval: interval,
          limit: adjustedLimit
        }
      });

      console.log(response.data);
      if (!response.data || response.data.length === 0) {
        console.warn(`❗No data for ${symbol} @ ${interval}`);
      }

      // 轉換資料格式
      const klineData: KLineData[] = response.data.map((item: any[]) => ({
        time: Math.floor(item[0] / 1000), // 轉換為秒
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      }));

      setData(klineData);
      setLastUpdated(new Date().toISOString());
    } catch (err: any) {
      console.error('獲取 Binance K 線數據失敗:', err);
      
      // 更友善的錯誤訊息
      let errorMessage = '獲取數據失敗';
      if (err.response?.status === 429) {
        errorMessage = '請求過於頻繁，請稍後再試';
      } else if (err.response?.status === 400) {
        errorMessage = '請求參數錯誤，請檢查幣種代碼';
      } else if (err.response?.status === 404) {
        errorMessage = '幣種不存在或已下架';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = '網路連線失敗，請檢查網路設定';
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKlines();

    // 如果啟用自動更新，設定每分鐘自動更新
    if (autoUpdate) {
      const intervalId = setInterval(fetchKlines, 60000); // 60秒
      return () => clearInterval(intervalId);
    }
  }, [symbol, interval, limit, autoUpdate]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
  };
} 