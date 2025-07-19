import React, { useState } from 'react';

interface SMCData {
  trend: 'bullish' | 'bearish' | 'sideways';
  structure: string;
  description: string;
  waveCount: number;
  maxHigh: number;
  breakCount: number;
  timeFrame: string;
}

interface SMCPanelProps {
  data?: SMCData;
  isAdminMode?: boolean;
  className?: string;
}

const SMCPanel: React.FC<SMCPanelProps> = ({ 
  data, 
  isAdminMode = false,
  className = '' 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // 模擬 SMC 數據
  const mockSMCData: SMCData = {
    trend: 'bullish',
    structure: 'HH → HL (Higher High to Higher Low)',
    description: '市場處於上升趨勢，形成較高的高點和較高的低點，顯示多頭主導市場',
    waveCount: 3,
    maxHigh: 119000,
    breakCount: 2,
    timeFrame: '日線'
  };

  const currentData = data || mockSMCData;

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-400 bg-green-500/10 border-green-400/20';
      case 'bearish':
        return 'text-red-400 bg-red-500/10 border-red-400/20';
      case 'sideways':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-400/20';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return '多頭趨勢';
      case 'bearish':
        return '空頭趨勢';
      case 'sideways':
        return '橫盤整理';
      default:
        return '未知趨勢';
    }
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-base font-medium text-white/90">
          🏗️ SMC 結構分析
        </h4>
        {isAdminMode && (
          <span className="text-xs text-green-400 font-medium">👑 管理員</span>
        )}
      </div>

      {/* SMC 說明 Tooltip */}
      <div className="relative mb-3">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          ℹ️ 什麼是 SMC？
        </button>
        {showTooltip && (
          <div className="absolute top-6 left-0 z-10 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg border border-gray-600 max-w-xs">
            <p className="mb-2">
              <strong>SMC (Smart Money Concepts)</strong> 是分析市場結構的方法：
            </p>
            <ul className="space-y-1 text-gray-300">
              <li>• HH = Higher High (更高高點)</li>
              <li>• HL = Higher Low (更高低點)</li>
              <li>• LH = Lower High (更低高點)</li>
              <li>• LL = Lower Low (更低低點)</li>
            </ul>
          </div>
        )}
      </div>

      {/* 趨勢標籤 */}
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTrendColor(currentData.trend)}`}>
        {getTrendText(currentData.trend)}
      </div>

      {/* 結構資訊 */}
      <div className="mt-3 text-sm text-white/70 leading-relaxed">
        <div className="font-medium text-white mb-2">
          結構：{currentData.structure}
        </div>
        <div className="mb-3">
          {currentData.description}
        </div>

        {/* 詳細指標 */}
        <div className="space-y-2 bg-white/5 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70">上升波段次數：</span>
            <span className="text-white font-medium">{currentData.waveCount} 次</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">當前區間最大高點：</span>
            <span className="text-white font-medium">${currentData.maxHigh.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">前高突破次數：</span>
            <span className="text-white font-medium">{currentData.breakCount} 次</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">時間框架：</span>
            <span className="text-white font-medium">{currentData.timeFrame}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMCPanel; 