import { useState, useEffect } from 'react';
import { useBinanceKlines } from './useBinanceKlines';
import { CurrencySymbol, TimeInterval } from '../components/CurrencySelector';
import { calculateAllIndicators } from '../utils/technicalIndicators';

interface SMCData {
  structureType: string;
  uptrendCount: number;
  currentHigh: number;
  breakoutCount: number;
  observationInterval: string;
  lastUpdated: string;
}

interface SupportResistanceLevel {
  price: number;
  testCount: number;
  isCurrentLevel: boolean;
  type: 'support' | 'resistance';
}

interface SupportResistanceData {
  support: SupportResistanceLevel[];
  resistance: SupportResistanceLevel[];
  currentPrice: number;
  lastUpdated: string;
}

interface ChartSummaryData {
  latestPrice: number;
  sma20: number;
  ema50: number;
  volumeAvg: number;
  open: number;
  close: number;
  high: number;
  low: number;
  changePercent: number;
  lastUpdated: string;
  indicators: {
    rsi: number;
    volumeMA: number;
    amplitude24h: number;
    sma20: number;
    ema50: number;
    sma20Change: number;
    ema50Change: number;
    rsiChange: number;
    volumeMAChange: number;
  };
}

interface AnalysisData {
  smc: SMCData;
  supportResistance: SupportResistanceData;
  chartSummary?: ChartSummaryData;
}

export function useAnalysisData(symbol: CurrencySymbol, interval: TimeInterval) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 Binance 圖表數據
  const { data: chartData, isLoading: chartLoading, error: chartError, lastUpdated } = useBinanceKlines(symbol, interval);

  useEffect(() => {
    if (!symbol || !interval) return;

    setIsLoading(true);
    setError(null);

    // 模擬 API 調用
    const fetchAnalysisData = async () => {
      try {
        // 模擬網路延遲
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 計算技術指標
        let indicators = {
          rsi: 50,
          volumeMA: 0,
          amplitude24h: 0,
          sma20: 0,
          ema50: 0,
          sma20Change: 0,
          ema50Change: 0,
          rsiChange: 0,
          volumeMAChange: 0
        };

        if (chartData && chartData.length > 0) {
          indicators = calculateAllIndicators(chartData);
        }

        // 根據幣種和時間間隔生成不同的分析數據
        const mockData: AnalysisData = {
          smc: {
            structureType: symbol === 'BTCUSDT' 
              ? 'HH → HL (Higher High to Higher Low)'
              : symbol === 'ETHUSDT'
              ? 'LH → LL (Lower High to Lower Low)'
              : 'LL → LH (Lower Low to Lower High)',
            uptrendCount: symbol === 'BTCUSDT' ? 3 : symbol === 'ETHUSDT' ? 2 : 1,
            currentHigh: symbol === 'BTCUSDT' ? 119000 : symbol === 'ETHUSDT' ? 3500 : 150,
            breakoutCount: symbol === 'BTCUSDT' ? 2 : symbol === 'ETHUSDT' ? 1 : 0,
            observationInterval: interval === '1d' ? '日線' : interval === '4h' ? '4小時' : interval === '1h' ? '1小時' : '15分鐘',
            lastUpdated: new Date().toISOString()
          },
          supportResistance: {
            support: symbol === 'BTCUSDT' 
              ? [
                  { price: 44000, testCount: 3, isCurrentLevel: false, type: 'support' as const },
                  { price: 43500, testCount: 2, isCurrentLevel: false, type: 'support' as const },
                  { price: 43000, testCount: 1, isCurrentLevel: false, type: 'support' as const }
                ]
              : symbol === 'ETHUSDT'
              ? [
                  { price: 3200, testCount: 2, isCurrentLevel: false, type: 'support' as const },
                  { price: 3100, testCount: 1, isCurrentLevel: false, type: 'support' as const }
                ]
              : [
                  { price: 140, testCount: 1, isCurrentLevel: false, type: 'support' as const }
                ],
            resistance: symbol === 'BTCUSDT'
              ? [
                  { price: 45000, testCount: 4, isCurrentLevel: false, type: 'resistance' as const },
                  { price: 45500, testCount: 2, isCurrentLevel: false, type: 'resistance' as const }
                ]
              : symbol === 'ETHUSDT'
              ? [
                  { price: 3400, testCount: 3, isCurrentLevel: false, type: 'resistance' as const }
                ]
              : [
                  { price: 160, testCount: 2, isCurrentLevel: false, type: 'resistance' as const }
                ],
            currentPrice: symbol === 'BTCUSDT' ? 44500 : symbol === 'ETHUSDT' ? 3300 : 150,
            lastUpdated: new Date().toISOString()
          },
          chartSummary: chartData && chartData.length > 0 ? {
            latestPrice: chartData[chartData.length - 1].close,
            sma20: indicators.sma20,
            ema50: indicators.ema50,
            volumeAvg: indicators.volumeMA,
            open: chartData[chartData.length - 1].open,
            close: chartData[chartData.length - 1].close,
            high: chartData[chartData.length - 1].high,
            low: chartData[chartData.length - 1].low,
            changePercent: ((chartData[chartData.length - 1].close - chartData[chartData.length - 1].open) / chartData[chartData.length - 1].open) * 100,
            lastUpdated: lastUpdated || new Date().toISOString(),
            indicators
          } : {
            latestPrice: symbol === 'BTCUSDT' ? 44500 : symbol === 'ETHUSDT' ? 3300 : 150,
            sma20: indicators.sma20,
            ema50: indicators.ema50,
            volumeAvg: indicators.volumeMA,
            open: symbol === 'BTCUSDT' ? 44000 : symbol === 'ETHUSDT' ? 3280 : 145,
            close: symbol === 'BTCUSDT' ? 44500 : symbol === 'ETHUSDT' ? 3300 : 150,
            high: symbol === 'BTCUSDT' ? 44800 : symbol === 'ETHUSDT' ? 3350 : 155,
            low: symbol === 'BTCUSDT' ? 43800 : symbol === 'ETHUSDT' ? 3250 : 140,
            changePercent: symbol === 'BTCUSDT' ? 1.14 : symbol === 'ETHUSDT' ? 0.61 : 3.45,
            lastUpdated: lastUpdated || new Date().toISOString(),
            indicators
          }
        };

        setAnalysisData(mockData);
      } catch (err) {
        setError('分析數據載入失敗');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisData();
  }, [symbol, interval, chartData, lastUpdated]);

  // 合併圖表錯誤
  const combinedError = error || chartError;
  const combinedLoading = isLoading || chartLoading;

  return {
    analysisData,
    isLoading: combinedLoading,
    error: combinedError
  };
} 