export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  volumeMA: number;
  amplitude24h: number;
  sma20: number;
  ema50: number;
  sma20Change: number;
  ema50Change: number;
  rsiChange: number;
  volumeMAChange: number;
}

// 計算 RSI
export const calculateRSI = (data: CandlestickData[], period: number = 14): number => {
  if (data.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  // 計算初始的漲跌幅
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // 計算後續的 RSI
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    let currentGain = 0;
    let currentLoss = 0;

    if (change > 0) {
      currentGain = change;
    } else {
      currentLoss = Math.abs(change);
    }

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
  }

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return Math.round(rsi * 100) / 100;
};

// 計算移動平均
export const calculateMA = (data: CandlestickData[], period: number): number => {
  if (data.length < period) return 0;
  
  const recentData = data.slice(-period);
  const sum = recentData.reduce((acc, item) => acc + item.close, 0);
  return sum / period;
};

// 計算成交量移動平均
export const calculateVolumeMA = (data: CandlestickData[], period: number = 20): number => {
  if (data.length < period) return 0;
  
  const recentData = data.slice(-period);
  const sum = recentData.reduce((acc, item) => acc + item.volume, 0);
  return sum / period;
};

// 計算 EMA
export const calculateEMA = (data: CandlestickData[], period: number): number => {
  if (data.length < period) return 0;
  
  const multiplier = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((acc, item) => acc + item.close, 0) / period;
  
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close * multiplier) + (ema * (1 - multiplier));
  }
  
  return ema;
};

// 計算 24 小時振幅
export const calculateAmplitude24h = (data: CandlestickData[]): number => {
  if (data.length < 24) return 0;
  
  const last24h = data.slice(-24);
  const high = Math.max(...last24h.map(item => item.high));
  const low = Math.min(...last24h.map(item => item.low));
  
  return ((high - low) / low) * 100;
};

// 計算變化率
export const calculateChangePercent = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// 計算所有技術指標
export const calculateAllIndicators = (data: CandlestickData[]): TechnicalIndicators => {
  if (data.length < 50) {
    return {
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
  }

  const currentData = data;
  const previousData = data.slice(0, -1);

  const rsi = calculateRSI(currentData);
  const volumeMA = calculateVolumeMA(currentData);
  const amplitude24h = calculateAmplitude24h(currentData);
  const sma20 = calculateMA(currentData, 20);
  const ema50 = calculateEMA(currentData, 50);

  // 計算變化率
  const previousRsi = previousData.length >= 14 ? calculateRSI(previousData) : 50;
  const previousVolumeMA = previousData.length >= 20 ? calculateVolumeMA(previousData) : 0;
  const previousSma20 = previousData.length >= 20 ? calculateMA(previousData, 20) : 0;
  const previousEma50 = previousData.length >= 50 ? calculateEMA(previousData, 50) : 0;

  return {
    rsi,
    volumeMA,
    amplitude24h,
    sma20,
    ema50,
    sma20Change: calculateChangePercent(sma20, previousSma20),
    ema50Change: calculateChangePercent(ema50, previousEma50),
    rsiChange: rsi - previousRsi,
    volumeMAChange: calculateChangePercent(volumeMA, previousVolumeMA)
  };
};

// 格式化價格
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// 格式化成交量
export const formatVolume = (volume: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(volume);
};

// 格式化百分比
export const formatPercent = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  const icon = percent >= 0 ? '🔺' : '🔻';
  return `${sign}${percent.toFixed(2)}% ${icon}`;
};

// 獲取顏色類別
export const getColorClass = (value: number, isPositive: boolean = true): string => {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-white/70';
}; 