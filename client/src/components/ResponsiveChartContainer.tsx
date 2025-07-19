import React, { useRef, useEffect, useState } from 'react';
import { IChartApi } from 'lightweight-charts';
import KLineChart from './KLineChart';
import VolumeChart from './VolumeChart';
import { KLineData } from '../hooks/useBinanceKlines';
import { ISeriesApi } from 'lightweight-charts';

interface ResponsiveChartContainerProps {
  data: KLineData[];
  klineHeight?: number;
  volumeHeight?: number;
  className?: string;
  lastUpdated?: string | null;
}

const ResponsiveChartContainer: React.FC<ResponsiveChartContainerProps> = ({
  data,
  klineHeight = 400,
  volumeHeight = 120,
  className = '',
  lastUpdated
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const klineChartRef = useRef<IChartApi | null>(null);
  const volumeChartRef = useRef<IChartApi | null>(null);

  // Overlay 標籤 state
  const [overlayLabels, setOverlayLabels] = useState<{
    type: 'BOS' | 'CHoCH';
    time: number;
    price: number;
  }[]>([]);

  // 取得 BOS/CHoCH 點位（簡單偵測，實際可優化）
  useEffect(() => {
    if (!data || data.length < 30) {
      setOverlayLabels([]);
      return;
    }
    const recent = data.slice(-500); // 或 -1000
    const labels: { type: 'BOS' | 'CHoCH'; time: number; price: number }[] = [];
    for (let i = 2; i < recent.length; i++) {
      if (recent[i].high > recent[i - 1].high && recent[i - 1].high > recent[i - 2].high) {
        labels.push({ type: 'BOS', time: recent[i].time, price: recent[i].high });
      }
      if (recent[i].low < recent[i - 1].low && recent[i - 1].low < recent[i - 2].low) {
        labels.push({ type: 'CHoCH', time: recent[i].time, price: recent[i].low });
      }
    }
    setOverlayLabels(labels);
  }, [data]);

  // 取得像素座標
  const [pixelLabels, setPixelLabels] = useState<{
    type: 'BOS' | 'CHoCH';
    x: number;
    y: number;
  }[]>([]);
  useEffect(() => {
    if (!klineChartRef.current) {
      setPixelLabels([]);
      return;
    }
    const chart = klineChartRef.current;
    // 取得主 K 線 series
    // 這裡假設只有一個主 series，若有多 series 需調整
    const series = (chart as any)._seriesesStore?._serieses[0]?.series || null;
    if (!series) {
      setPixelLabels([]);
      return;
    }
    const timeScale = chart.timeScale();
    setPixelLabels(
      overlayLabels
        .map(label => {
          const x = timeScale.timeToCoordinate(label.time as any);
          const y = series.priceToCoordinate(label.price);
          if (x == null || y == null) return null;
          return { type: label.type, x, y };
        })
        .filter(Boolean) as any[]
    );
  }, [overlayLabels, klineChartRef.current, containerWidth]);

  // 處理容器寬度變化
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // 處理十字線同步
  const handleKlineCrosshairMove = (param: any) => {
    if (volumeChartRef.current && param.time) {
      volumeChartRef.current.setCrosshairPosition(param.price, param.time, param.seriesData.get(volumeChartRef.current));
    }
  };

  const handleVolumeCrosshairMove = (param: any) => {
    if (klineChartRef.current && param.time) {
      klineChartRef.current.setCrosshairPosition(param.price, param.time, param.seriesData.get(klineChartRef.current));
    }
  };

  // 設置圖表引用
  const setKlineChartRef = (chart: IChartApi | null) => {
    klineChartRef.current = chart;
  };

  const setVolumeChartRef = (chart: IChartApi | null) => {
    volumeChartRef.current = chart;
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full relative ${className}`}
      style={{ minHeight: klineHeight + volumeHeight + 40 }}
    >
      {/* Overlay 標籤 */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {pixelLabels.map((label, i) => (
          <div
            key={i}
            className="absolute text-xs font-bold px-2 py-1 rounded shadow"
            style={{
              left: `${label.x - 20}px`,
              top: `${label.y - 20}px`,
              background: label.type === 'BOS' ? 'rgba(0,255,127,0.9)' : 'rgba(255,107,107,0.9)',
              color: '#fff',
              border: '1px solid #222',
              pointerEvents: 'none',
              textShadow: '0 1px 2px #000',
            }}
          >
            {label.type}
          </div>
        ))}
      </div>
      {/* K線圖 */}
      <div className="mb-2">
        <KLineChart
          data={data}
          height={klineHeight}
          onCrosshairMove={handleKlineCrosshairMove}
          syncChart={volumeChartRef.current}
          lastUpdated={lastUpdated}
        />
      </div>
      {/* 成交量圖 */}
      <div>
        <VolumeChart
          data={data}
          height={volumeHeight}
          onCrosshairMove={handleVolumeCrosshairMove}
          syncChart={klineChartRef.current}
        />
      </div>
    </div>
  );
};

export default ResponsiveChartContainer; 