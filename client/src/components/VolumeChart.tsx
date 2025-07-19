import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, HistogramData, Time } from 'lightweight-charts';
import { KLineData } from '../hooks/useBinanceKlines';

interface VolumeChartProps {
  data: KLineData[];
  height?: number;
  className?: string;
  onCrosshairMove?: (param: any) => void;
  syncChart?: IChartApi | null;
}

const VolumeChart: React.FC<VolumeChartProps> = ({
  data,
  height = 100,
  className = '',
  onCrosshairMove,
  syncChart
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  // 初始化圖表
  useEffect(() => {
    const chartContainer = chartContainerRef.current;
    if (!chartContainer) return;

    // 清空容器
    chartContainer.innerHTML = '';

    // 建立成交量圖表
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

    // 建立成交量圖
    const volumeSeries = chart.addHistogramSeries({
      color: '#3B82F6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });
    volumeSeriesRef.current = volumeSeries;

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
    if (!data || data.length === 0) return;

    // 轉換成交量數據格式
    const volumeData: HistogramData[] = data.map((item) => ({
      time: item.time as Time,
      value: item.volume,
      color: item.close > item.open ? '#4ADE80' : '#f87171', // 根據漲跌設定顏色
    }));

    // 設置成交量數據
    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(volumeData);
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
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-2xl overflow-hidden"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default VolumeChart; 