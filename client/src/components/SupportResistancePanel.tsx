import React from 'react';

interface SupportResistanceLevel {
  price: number;
  touches: number;
  strength: 'strong' | 'medium' | 'weak';
  type: 'support' | 'resistance';
}

interface SupportResistanceData {
  support: SupportResistanceLevel[];
  resistance: SupportResistanceLevel[];
  currentPrice: number;
  testCount: number;
  description: string;
}

interface SupportResistancePanelProps {
  data?: SupportResistanceData;
  isAdminMode?: boolean;
  className?: string;
}

const SupportResistancePanel: React.FC<SupportResistancePanelProps> = ({ 
  data, 
  isAdminMode = false,
  className = '' 
}) => {
  // 模擬支撐壓力數據
  const mockData: SupportResistanceData = {
    support: [
      { price: 44000, touches: 3, strength: 'strong', type: 'support' },
      { price: 43500, touches: 2, strength: 'medium', type: 'support' },
      { price: 43000, touches: 1, strength: 'weak', type: 'support' }
    ],
    resistance: [
      { price: 45000, touches: 4, strength: 'strong', type: 'resistance' },
      { price: 45500, touches: 2, strength: 'medium', type: 'resistance' }
    ],
    currentPrice: 44500,
    testCount: 4,
    description: '支撐位經過多次測試，阻力位形成強勁屏障，價格在關鍵價位間震盪'
  };

  const currentData = data || mockData;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'weak':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'strong':
        return '強';
      case 'medium':
        return '中';
      case 'weak':
        return '弱';
      default:
        return '未知';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-base font-medium text-white/90">
          📍 支撐壓力區
        </h4>
        {isAdminMode && (
          <span className="text-xs text-green-400 font-medium">👑 管理員</span>
        )}
      </div>

      <div className="space-y-4">
        {/* 支撐位 */}
        <div>
          <h5 className="font-medium text-green-400 mb-3">支撐位</h5>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            {currentData.support.map((level, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-white/70">${formatPrice(level.price)}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-white/50">支撐・{level.touches}次</span>
                  <span className={`text-xs ${getStrengthColor(level.strength)}`}>
                    {getStrengthText(level.strength)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 阻力位 */}
        <div>
          <h5 className="font-medium text-red-400 mb-3">阻力位</h5>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            {currentData.resistance.map((level, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-white/70">${formatPrice(level.price)}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-white/50">阻力・{level.touches}次</span>
                  <span className={`text-xs ${getStrengthColor(level.strength)}`}>
                    {getStrengthText(level.strength)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 當前價格 */}
        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
          <div className="flex justify-between items-center">
            <span className="text-white/70">當前價格：</span>
            <span className="text-blue-400 font-medium">${formatPrice(currentData.currentPrice)}</span>
          </div>
        </div>
      </div>

      {/* 統計資訊 */}
      <div className="mt-4 text-sm text-white/70 leading-relaxed">
        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/70">測試次數：</span>
            <span className="text-white font-medium">{currentData.testCount} 次</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">支撐區數量：</span>
            <span className="text-white font-medium">{currentData.support.length} 區</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">阻力區數量：</span>
            <span className="text-white font-medium">{currentData.resistance.length} 區</span>
          </div>
        </div>
        <div className="mt-3 p-3 bg-white/5 rounded-lg">
          <p className="text-sm text-white/70 leading-relaxed">
            {currentData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportResistancePanel; 