import React from 'react';

interface SummaryData {
  marketTrend: 'bullish' | 'bearish' | 'sideways';
  supportZones: number;
  resistanceZones: number;
  supportRange: { min: number; max: number };
  resistanceRange: { min: number; max: number };
  volatility: number;
  timeFrame: string;
  symbol: string;
}

interface SummaryPanelProps {
  data?: SummaryData;
  isAdminMode?: boolean;
  className?: string;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  data, 
  isAdminMode = false,
  className = '' 
}) => {
  // 模擬摘要數據
  const mockData: SummaryData = {
    marketTrend: 'bullish',
    supportZones: 2,
    resistanceZones: 1,
    supportRange: { min: 43000, max: 44500 },
    resistanceRange: { min: 45000, max: 45500 },
    volatility: 8.3,
    timeFrame: '日線',
    symbol: 'BTC/USDT'
  };

  const currentData = data || mockData;

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return '多頭';
      case 'bearish':
        return '空頭';
      case 'sideways':
        return '中性';
      default:
        return '未知';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-400';
      case 'bearish':
        return 'text-red-400';
      case 'sideways':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className={`bg-blue-200/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4 ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-base font-medium text-blue-300">
          📊 分析摘要
        </h4>
        {isAdminMode && (
          <span className="text-xs text-green-400 font-medium">👑 管理員</span>
        )}
      </div>

      <div className="space-y-3 text-sm text-blue-200 leading-relaxed">
        {/* 市場趨勢 */}
        <div className="flex justify-between items-center">
          <span className="text-blue-200">市場趨勢：</span>
          <span className={`font-medium ${getTrendColor(currentData.marketTrend)}`}>
            {getTrendText(currentData.marketTrend)}
          </span>
        </div>

        {/* 支撐區數量 */}
        <div className="flex justify-between items-center">
          <span className="text-blue-200">支撐區數量：</span>
          <span className="text-blue-200 font-medium">
            {currentData.supportZones} 區
          </span>
        </div>

        {/* 支撐區價格範圍 */}
        <div className="flex justify-between items-center">
          <span className="text-blue-200">支撐區範圍：</span>
          <span className="text-blue-200 font-medium">
            ${formatPrice(currentData.supportRange.min)} ~ ${formatPrice(currentData.supportRange.max)}
          </span>
        </div>

        {/* 阻力區數量 */}
        <div className="flex justify-between items-center">
          <span className="text-blue-200">阻力區數量：</span>
          <span className="text-blue-200 font-medium">
            {currentData.resistanceZones} 區
          </span>
        </div>

        {/* 阻力區價格範圍 */}
        <div className="flex justify-between items-center">
          <span className="text-blue-200">阻力區範圍：</span>
          <span className="text-blue-200 font-medium">
            ${formatPrice(currentData.resistanceRange.min)} ~ ${formatPrice(currentData.resistanceRange.max)}
          </span>
        </div>

        {/* 波動性 */}
        <div className="flex justify-between items-center">
          <span className="text-blue-200">波動性：</span>
          <span className="text-blue-200 font-medium">
            近七日區間振幅 {currentData.volatility}%
          </span>
        </div>

        {/* 時間框架 */}
        <div className="flex justify-between items-center">
          <span className="text-blue-200">時間框架：</span>
          <span className="text-blue-200 font-medium">
            {currentData.timeFrame}
          </span>
        </div>

        {/* 幣種 */}
        <div className="flex justify-between items-center">
          <span className="text-blue-200">分析幣種：</span>
          <span className="text-blue-200 font-medium">
            {currentData.symbol}
          </span>
        </div>
      </div>

      {/* 建議 */}
      <div className="mt-4 p-3 bg-blue-300/10 rounded-lg border border-blue-400/20">
        <h5 className="text-sm font-medium text-blue-300 mb-2">💡 交易建議</h5>
        <p className="text-xs text-blue-200 leading-relaxed">
          {currentData.marketTrend === 'bullish' 
            ? '建議在支撐位附近買入，注意風險管理，設置止損位'
            : currentData.marketTrend === 'bearish'
            ? '建議在阻力位附近賣出，注意風險管理，設置止盈位'
            : '建議觀望，等待明確趨勢形成後再進場'
          }
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel; 