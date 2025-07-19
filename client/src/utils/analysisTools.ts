// analysisTools.ts
// 提供 K 線圖技術分析圖層繪製與偵測工具
import { IChartApi, LineData, Time, SeriesMarker, LineStyle } from 'lightweight-charts';
import { KLineData } from '../hooks/useBinanceKlines';

// 🔶 支撐/壓力線
export function drawSNRLines(chart: IChartApi, data: KLineData[], interval: string, setAnalysisHint: (msg: string) => void) {
  if (interval !== '1d') {
    setAnalysisHint('僅支援日線技術分析');
    return;
  }
  const recent = data.slice(-500);
  if (recent.length < 30) {
    setAnalysisHint('尚未偵測到可信的技術分析點位');
    return;
  }
  const highs = recent.map(d => d.high);
  const lows = recent.map(d => d.low);
  // 壓力線：最高點眾數或分位數
  const resistance = Math.max(...highs);
  // 支撐線：最低點眾數或分位數
  const support = Math.min(...lows);
  const from = recent[0].time;
  const to = recent[recent.length - 1].time;
  // 畫壓力線（紅）
  const resistanceSeries = chart.addLineSeries({
    color: 'rgba(239,68,68,0.9)',
    lineWidth: 2,
    priceLineVisible: true,
    lastValueVisible: true,
    title: 'Resistance',
  });
  resistanceSeries.setData([
    { time: from as Time, value: resistance },
    { time: to as Time, value: resistance },
  ]);
  // 畫支撐線（綠）
  const supportSeries = chart.addLineSeries({
    color: 'rgba(34,197,94,0.9)',
    lineWidth: 2,
    priceLineVisible: true,
    lastValueVisible: true,
    title: 'Support',
  });
  supportSeries.setData([
    { time: from as Time, value: support },
    { time: to as Time, value: support },
  ]);
}

// 🔷 支撐/壓力區塊
export function drawSNRZones(chart: IChartApi, data: KLineData[], interval: string, setAnalysisHint: (msg: string) => void) {
  if (interval !== '1d') {
    setAnalysisHint('僅支援日線技術分析');
    return;
  }
  const recent = data.slice(-1000);
  if (recent.length < 30) {
    setAnalysisHint('尚未偵測到可信的技術分析點位');
    return;
  }
  const highs = recent.map(d => d.high);
  const lows = recent.map(d => d.low);
  // 盤整區：高低點差異小於2%（可調整）
  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);
  if ((maxHigh - minLow) / minLow > 0.02) return; // 非盤整不畫
  const from = recent[0].time;
  const to = recent[recent.length - 1].time;
  // 畫區塊（綠紅半透明）
  const areaSeries = chart.addAreaSeries({
    topColor: 'rgba(34,197,94,0.2)',
    bottomColor: 'rgba(239,68,68,0.2)',
    lineColor: 'rgba(34,197,94,0.5)',
    lineWidth: 1,
  });
  areaSeries.setData([
    { time: from as Time, value: maxHigh },
    { time: to as Time, value: maxHigh },
    { time: from as Time, value: minLow },
    { time: to as Time, value: minLow },
  ]);
}

// 🟡 SMC 結構分析（BOS / CHoCH）
export function drawSMCMarkers(chart: IChartApi, data: KLineData[]) {
  // 偵測 BOS（高點突破）/CHoCH（低點反轉）
  const recent = data.slice(-30);
  for (let i = 2; i < recent.length; i++) {
    // BOS: 當前高點 > 前一高點且前一高點 > 再前一高點
    if (recent[i].high > recent[i - 1].high && recent[i - 1].high > recent[i - 2].high) {
      // BOS 藍色箭頭
      chart.addShape && chart.addShape({
        time: recent[i].time,
        price: recent[i].high,
        shape: 'arrowUp',
        color: 'rgba(59,130,246,1)',
        text: `BOS\n${recent[i].high}`,
        size: 2,
      });
    }
    // CHoCH: 當前低點 < 前一低點且前一低點 < 再前一低點
    if (recent[i].low < recent[i - 1].low && recent[i - 1].low < recent[i - 2].low) {
      // CHoCH 黃色箭頭
      chart.addShape && chart.addShape({
        time: recent[i].time,
        price: recent[i].low,
        shape: 'arrowDown',
        color: 'rgba(250,204,21,1)',
        text: `CHoCH\n${recent[i].low}`,
        size: 2,
      });
    }
  }
}

// 🟣 和諧型態分析（如 AB=CD）
export function drawHarmonicPattern(chart: IChartApi, data: KLineData[], interval: string, setAnalysisHint: (msg: string) => void) {
  if (interval !== '1d') {
    setAnalysisHint('僅支援日線技術分析');
    return;
  }
  const recent = data.slice(-1000);
  if (recent.length < 30) {
    setAnalysisHint('尚未偵測到可信的技術分析點位');
    return;
  }
  // 簡單偵測 AB=CD 型態（四點間距近似）
  for (let i = 0; i < recent.length - 3; i++) {
    const A = recent[i];
    const B = recent[i + 1];
    const C = recent[i + 2];
    const D = recent[i + 3];
    // AB 與 CD 長度接近，且 BC 為修正
    const ab = Math.abs(B.high - A.low);
    const cd = Math.abs(D.high - C.low);
    const bc = Math.abs(C.low - B.high);
    if (ab > 0 && cd > 0 && Math.abs(ab - cd) / ab < 0.15 && bc / ab < 0.7) {
      // 畫折線
      const lineSeries = chart.addLineSeries({
        color: 'rgba(168,85,247,1)',
        lineWidth: 2,
        priceLineVisible: false,
      });
      lineSeries.setData([
        { time: A.time as Time, value: A.low },
        { time: B.time as Time, value: B.high },
        { time: C.time as Time, value: C.low },
        { time: D.time as Time, value: D.high },
      ]);
      // 標註型態名稱
      chart.addShape && chart.addShape({
        time: D.time,
        price: D.high,
        shape: 'circle',
        color: 'rgba(168,85,247,1)',
        text: 'AB=CD',
        size: 2,
      });
      break; // 只畫一組
    }
  }
}

interface SMCZone {
  from: number; // 起始 time
  to: number;   // 結束 time
  type: 'BOS' | 'CHoCH';
  price: number; // 起點價格
}

// 儲存 SMC 區塊 series 以便清除
let smcZoneSeries: any[] = [];
let smcDotSeries: any[] = [];

export function drawSMCZones(chart: IChartApi, data: KLineData[], interval: string, setAnalysisHint: (msg: string) => void) {
  if (interval !== '1d') {
    setAnalysisHint('僅支援日線技術分析');
    return;
  }
  const recent = data.slice(-1000);
  if (recent.length < 30) {
    setAnalysisHint('尚未偵測到可信的技術分析點位');
    return;
  }

  smcZoneSeries.forEach(s => chart.removeSeries(s));
  smcZoneSeries = [];
  smcDotSeries.forEach(s => chart.removeSeries(s));
  smcDotSeries = [];

  const zones: SMCZone[] = [];
  let lastEventIndex = 0;
  let lastEventType: 'BOS' | 'CHoCH' | null = null;

  for (let i = 2; i < recent.length; i++) {
    if (recent[i].high > recent[i - 1].high && recent[i - 1].high > recent[i - 2].high) {
      if (lastEventType === 'BOS' && i - lastEventIndex < 3) {
        zones[zones.length - 1].to = recent[i].time;
      } else {
        zones.push({ from: recent[lastEventIndex].time, to: recent[i].time, type: 'BOS', price: recent[lastEventIndex].low });
      }
      lastEventIndex = i;
      lastEventType = 'BOS';
    }
    if (recent[i].low < recent[i - 1].low && recent[i - 1].low < recent[i - 2].low) {
      if (lastEventType === 'CHoCH' && i - lastEventIndex < 3) {
        zones[zones.length - 1].to = recent[i].time;
      } else {
        zones.push({ from: recent[lastEventIndex].time, to: recent[i].time, type: 'CHoCH', price: recent[lastEventIndex].high });
      }
      lastEventIndex = i;
      lastEventType = 'CHoCH';
    }
  }

  zones.forEach(zone => {
    const fromBar = recent.find(d => d.time === zone.from);
    const toBar = recent.find(d => d.time === zone.to);
    if (!fromBar || !toBar) return;
    const areaSeries = chart.addAreaSeries({
      topColor: zone.type === 'BOS' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
      bottomColor: zone.type === 'BOS' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
      lineColor: zone.type === 'BOS' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
      lineWidth: 1,
    });
    areaSeries.setData([
      { time: zone.from as Time, value: zone.type === 'BOS' ? fromBar.low : fromBar.high },
      { time: zone.to as Time, value: zone.type === 'BOS' ? toBar.high : toBar.low },
    ]);
    smcZoneSeries.push(areaSeries);

    // 用 setMarkers 畫圓點與 Tooltip
    const dotSeries = chart.addLineSeries({
      color: zone.type === 'BOS' ? 'rgba(34,197,94,1)' : 'rgba(239,68,68,1)',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    dotSeries.setData([
      {
        time: zone.from as Time,
        value: zone.price,
      },
    ]);
    dotSeries.setMarkers([
      {
        time: zone.from as Time,
        position: 'below',
        color: zone.type === 'BOS' ? 'rgba(34,197,94,1)' : 'rgba(239,68,68,1)',
        shape: 'circle',
        text: `${zone.type === 'BOS' ? '多方突破' : '空方反轉'}\n${new Date(zone.from * 1000).toISOString()}\n${zone.price}`,
      } as SeriesMarker,
    ]);
    smcDotSeries.push(dotSeries);
    // TODO: Add text label here (e.g., BOS/CHoCH)
  });
} 