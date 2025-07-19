import React from 'react';
import { TechnicalIndicators, formatPrice, formatVolume, formatPercent, getColorClass } from '../utils/technicalIndicators';

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
  indicators: TechnicalIndicators;
}

interface ChartSummaryCardProps {
  data: ChartSummaryData | null;
  isLoading?: boolean;
}

const ChartSummaryCard: React.FC<ChartSummaryCardProps> = ({
  data,
  isLoading = false
}) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const formatVolume = (volume: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(volume);

  const formatPercent = (percent: number) =>
    `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;

  // 技術指標說明
  const getIndicatorDescription = (indicator: string) => {
    const descriptions: { [key: string]: string } = {
      rsi: 'RSI = 100 - (100 / (1 + RS))\nRS = 平均漲幅 / 平均跌幅（14 根K棒為預設）',
      volumeMA: '成交量移動平均 = 過去20根K棒成交量總和 / 20',
      amplitude24h: '24小時振幅 = ((最高價 - 最低價) / 最低價) × 100%',
      sma20: '簡單移動平均 = 過去20根K棒收盤價總和 / 20',
      ema50: '指數移動平均 = 當前價格 × 權重 + 前一日EMA × (1 - 權重)',
    };
    return descriptions[indicator] || '';
  };

  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 drop-shadow-xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white/90 mb-2">📈 圖表技術指標摘要</h3>
        <p className="text-sm text-white/60">即時價格與技術指標</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* 最新價格 */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
            <span className="text-white/70 text-sm">最新價格</span>
            <div className="text-right">
              <div className="text-blue-400 font-bold text-lg">{formatPrice(data.latestPrice)}</div>
              <div className={`text-xs ${data.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(data.changePercent)}
              </div>
            </div>
          </div>

          {/* RSI(14) */}
          <div className="group relative">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-help">
              <span className="text-white/70 text-sm">RSI(14)</span>
              <div className="text-right">
                <span className={`font-medium ${getColorClass(data.indicators.rsi)}`}>
                  {data.indicators.rsi.toFixed(2)}
                </span>
                <div className={`text-xs ${getColorClass(data.indicators.rsiChange)}`}>
                  {formatPercent(data.indicators.rsiChange)}
                </div>
              </div>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black/90 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-xs">
              <div className="font-medium mb-1">RSI (相對強弱指標)</div>
              <div className="whitespace-pre-line">{getIndicatorDescription('rsi')}</div>
            </div>
          </div>

          {/* 成交量移動平均 */}
          <div className="group relative">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-help">
              <span className="text-white/70 text-sm">成交量 MA(20)</span>
              <div className="text-right">
                <span className="text-cyan-400 font-medium">{formatVolume(data.indicators.volumeMA)}</span>
                <div className={`text-xs ${getColorClass(data.indicators.volumeMAChange)}`}>
                  {formatPercent(data.indicators.volumeMAChange)}
                </div>
              </div>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black/90 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-xs">
              <div className="font-medium mb-1">成交量移動平均</div>
              <div className="whitespace-pre-line">{getIndicatorDescription('volumeMA')}</div>
            </div>
          </div>

          {/* 24小時振幅 */}
          <div className="group relative">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-help">
              <span className="text-white/70 text-sm">24小時振幅</span>
              <div className="text-right">
                <span className="text-orange-400 font-medium">{data.indicators.amplitude24h.toFixed(2)}%</span>
              </div>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black/90 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-xs">
              <div className="font-medium mb-1">24小時振幅</div>
              <div className="whitespace-pre-line">{getIndicatorDescription('amplitude24h')}</div>
            </div>
          </div>

          {/* SMA(20) */}
          <div className="group relative">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-help">
              <span className="text-white/70 text-sm">SMA(20)</span>
              <div className="text-right">
                <span className="text-yellow-400 font-medium">{formatPrice(data.indicators.sma20)}</span>
                <div className={`text-xs ${getColorClass(data.indicators.sma20Change)}`}>
                  {formatPercent(data.indicators.sma20Change)}
                </div>
              </div>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black/90 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-xs">
              <div className="font-medium mb-1">簡單移動平均 (SMA)</div>
              <div className="whitespace-pre-line">{getIndicatorDescription('sma20')}</div>
            </div>
          </div>

          {/* EMA(50) */}
          <div className="group relative">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-help">
              <span className="text-white/70 text-sm">EMA(50)</span>
              <div className="text-right">
                <span className="text-purple-400 font-medium">{formatPrice(data.indicators.ema50)}</span>
                <div className={`text-xs ${getColorClass(data.indicators.ema50Change)}`}>
                  {formatPercent(data.indicators.ema50Change)}
                </div>
              </div>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black/90 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-xs">
              <div className="font-medium mb-1">指數移動平均 (EMA)</div>
              <div className="whitespace-pre-line">{getIndicatorDescription('ema50')}</div>
            </div>
          </div>

          {/* 當日價格範圍 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/70 text-xs">開盤</span>
              <span className="text-white/90 text-sm font-medium">{formatPrice(data.open)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/70 text-xs">收盤</span>
              <span className="text-white/90 text-sm font-medium">{formatPrice(data.close)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/70 text-xs">最高</span>
              <span className="text-green-400 text-sm font-medium">{formatPrice(data.high)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/70 text-xs">最低</span>
              <span className="text-red-400 text-sm font-medium">{formatPrice(data.low)}</span>
            </div>
          </div>

          {/* 更新時間 */}
          <div className="text-xs text-white/50 text-center pt-2">
            最後更新：{new Date(data.lastUpdated).toLocaleTimeString('zh-TW')}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📈</div>
          <div className="text-white/70 mb-1">暫無圖表資料</div>
          <div className="text-white/50 text-sm">請選擇幣種與時間區間</div>
        </div>
      )}
    </div>
  );
};

export default ChartSummaryCard; 