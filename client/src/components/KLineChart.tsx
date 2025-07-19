import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData, Time } from 'lightweight-charts';
import { KLineData } from '../hooks/useBinanceKlines';
import { drawSMCMarkers, drawSNRLines, drawSNRZones, drawHarmonicPattern, drawSMCZones } from '../utils/analysisTools';
import { askAiAboutChart } from '../utils/aiAnalysis';

interface KLineChartProps {
  data: KLineData[];
  height?: number;
  className?: string;
  onCrosshairMove?: (param: any) => void;
  syncChart?: IChartApi | null;
  lastUpdated?: string | null;
}

const KLineChart: React.FC<KLineChartProps> = ({
  data,
  height = 300,
  className = '',
  onCrosshairMove,
  syncChart,
  lastUpdated
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [analysisHint, setAnalysisHint] = useState<string>('');

  // 計算 SMA
  const calculateSMA = (data: KLineData[], period: number): LineData[] => {
    if (data.length < period) return [];
    
    const sma: LineData[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
      sma.push({
        time: data[i].time as Time,
        value: sum / period
      });
    }
    return sma;
  };

  // 計算 EMA
  const calculateEMA = (data: KLineData[], period: number): LineData[] => {
    if (data.length < period) return [];
    
    const ema: LineData[] = [];
    const multiplier = 2 / (period + 1);
    
    // 初始值使用 SMA
    let emaValue = data.slice(0, period).reduce((acc, val) => acc + val.close, 0) / period;
    ema.push({ time: data[period - 1].time as Time, value: emaValue });
    
    for (let i = period; i < data.length; i++) {
      emaValue = (data[i].close * multiplier) + (emaValue * (1 - multiplier));
      ema.push({ time: data[i].time as Time, value: emaValue });
    }
    return ema;
  };

  // 初始化圖表
  useEffect(() => {
    const chartContainer = chartContainerRef.current;
    if (!chartContainer) return;

    // 清空容器
    chartContainer.innerHTML = '';

    // 建立圖表
    const chart = createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#FFFFFF',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#4B5563',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#4B5563',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
        barSpacing: 3,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        visible: true,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString();
        },
      },
    });

    chartRef.current = chart;

    // 建立 K 線圖
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4ADE80',
      downColor: '#f87171',
      borderVisible: false,
      wickUpColor: '#4ADE80',
      wickDownColor: '#f87171',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // 建立 SMA(20) 線
    const smaSeries = chart.addLineSeries({
      color: '#F59E0B',
      lineWidth: 2,
      title: 'SMA(20)',
      priceLineVisible: false,
    });
    smaSeriesRef.current = smaSeries;

    // 建立 EMA(50) 線
    const emaSeries = chart.addLineSeries({
      color: '#8B5CF6',
      lineWidth: 2,
      title: 'EMA(50)',
      priceLineVisible: false,
    });
    emaSeriesRef.current = emaSeries;

    // 同步圖表
    if (syncChart) {
      chart.timeScale().subscribeVisibleTimeRangeChange(() => {
        const timeRange = chart.timeScale().getVisibleRange();
        if (timeRange) {
          syncChart.timeScale().setVisibleRange(timeRange);
        }
      });
    }

    // 響應式調整
    const handleResize = () => {
      if (chartContainer) {
        chart.applyOptions({
          width: chartContainer.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height, syncChart]);

  // 設置數據
  useEffect(() => {
    try {
      if (!data || data.length === 0) return;

      // 轉換 K 線數據格式
      const candlestickData: CandlestickData[] = data.map((item) => ({
        time: item.time as Time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      // 設置 K 線數據
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(candlestickData);
      }

      // 計算並設置 SMA(20)
      const smaData = calculateSMA(data, 20);
      if (smaSeriesRef.current && smaData.length > 0) {
        smaSeriesRef.current.setData(smaData);
      }

      // 計算並設置 EMA(50)
      const emaData = calculateEMA(data, 50);
      if (emaSeriesRef.current && emaData.length > 0) {
        emaSeriesRef.current.setData(emaData);
      }

      // 清除舊有自訂圖層（如需）
      // TODO: 若有自訂圖層需記錄並移除，請於此處補充

      // 若資料筆數足夠，繪製技術分析圖層
      if (data.length >= 30 && chartRef.current) {
        // 1️⃣ SMC 結構識別
        drawSMCMarkers(chartRef.current, data); // TODO: 實作 SMC 結構標註
        // 2️⃣ SNR 支撐與壓力線
        drawSNRLines(chartRef.current, data, interval, setAnalysisHint);   // TODO: 實作支撐壓力線
        // 3️⃣ 支撐壓力反應帶
        drawSNRZones(chartRef.current, data, interval, setAnalysisHint);   // TODO: 實作支撐壓力區域
        // 4️⃣ 和諧指標
        drawHarmonicPattern(chartRef.current, data, interval, setAnalysisHint); // TODO: 實作和諧型態
        // FIXME: interval 未定義，需從 props 或其他來源取得 interval 參數
        // 例如：drawSMCZones(chartRef.current, data, props.interval);
      }
    } catch (err) {
      console.error('❗KLineChart render error', err);
    }
  }, [data]);
  // 處理十字線移動
  useEffect(() => {
    if (!chartRef.current || !onCrosshairMove) return;

    const unsubscribe = chartRef.current.subscribeCrosshairMove(onCrosshairMove);
    return unsubscribe;
  }, [onCrosshairMove]);

  return (
    <div className={`w-full ${className}`}>
      {analysisHint && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2 text-center text-sm">
          {analysisHint}
        </div>
      )}
      <div className="relative">
        <div 
          ref={chartContainerRef} 
          className="w-full rounded-2xl overflow-hidden"
          style={{ height: `${height}px` }}
        />
        
        {/* 更新時間顯示 */}
        {lastUpdated && (
          <div className="absolute top-2 right-2 text-xs text-white/50 bg-black/50 px-2 py-1 rounded">
            更新時間：{new Date(lastUpdated).toLocaleTimeString('zh-TW')}
          </div>
        )}
      </div>
    </div>
  );
};

export default KLineChart; 