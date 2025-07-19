import React from 'react';

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

interface SupportResistanceCardProps {
  data: SupportResistanceData | null;
  isAuthenticated: boolean;
  isAdminMode: boolean;
  isLoading?: boolean;
}

const SupportResistanceCard: React.FC<SupportResistanceCardProps> = ({
  data,
  isAuthenticated,
  isAdminMode,
  isLoading = false
}) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const showMask = !isAdminMode && !isAuthenticated;

  const renderLevels = (levels: SupportResistanceLevel[], type: 'support' | 'resistance') => {
    if (!levels || levels.length === 0) {
      return (
        <div className="text-center py-4 text-white/50 text-sm">
          暫無{type === 'support' ? '支撐' : '壓力'}位資料
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {levels.map((level, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
              level.isCurrentLevel
                ? 'bg-blue-500/20 border-blue-400/50 text-blue-300'
                : 'bg-white/5 border-white/10 text-white/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                type === 'support' 
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                  : 'bg-red-500/20 text-red-300 border border-red-400/30'
              }`}>
                {type === 'support' ? '支撐' : '壓力'}
              </span>
              <span className={`font-medium ${
                level.isCurrentLevel ? 'text-blue-300' : 'text-white/90'
              }`}>
                {formatPrice(level.price)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/60">測試</span>
              <span className={`text-sm font-medium ${
                level.isCurrentLevel ? 'text-blue-300' : 'text-white/70'
              }`}>
                {level.testCount} 次
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 drop-shadow-xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white/90 mb-2">🎯 支撐壓力區</h3>
        <p className="text-sm text-white/60">關鍵價位與測試次數</p>
      </div>
      {showMask ? (
        <div className="relative">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-white/90 font-medium mb-1">請登入啟用分析功能</div>
              <div className="text-white/60 text-sm">登入後可查看支撐壓力區分析</div>
            </div>
          </div>
          <div className="opacity-30">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
            <span className="text-white/70 text-sm">當前價格</span>
            <span className="text-blue-400 font-medium">{formatPrice(data.currentPrice)}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
              <span>📉</span>
              支撐位
            </h4>
            {renderLevels(data.support, 'support')}
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
              <span>📈</span>
              壓力位
            </h4>
            {renderLevels(data.resistance, 'resistance')}
          </div>
          <div className="text-xs text-white/50 text-center pt-2">
            最後更新：{formatTime(data.lastUpdated)}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-white/70 mb-1">暫無支撐壓力資料</div>
          <div className="text-white/50 text-sm">請選擇其他幣種或時間區間</div>
        </div>
      )}
    </div>
  );
};

export default SupportResistanceCard; 