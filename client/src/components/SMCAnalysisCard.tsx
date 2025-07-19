import React from 'react';

interface SMCData {
  structureType: string;
  uptrendCount: number;
  currentHigh: number;
  breakoutCount: number;
  observationInterval: string;
  lastUpdated: string;
}

interface SMCAnalysisCardProps {
  data: SMCData | null;
  isAdminMode: boolean;
  isAuthenticated: boolean;
  isLoading?: boolean;
}

const SMCAnalysisCard: React.FC<SMCAnalysisCardProps> = ({
  data,
  isAdminMode,
  isAuthenticated,
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

  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 drop-shadow-xl relative">
      {isAdminMode && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-xs px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full">
          <span>👑</span>
          <span>管理員</span>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white/90 mb-2">📊 SMC 結構分析</h3>
        <p className="text-sm text-white/60">市場結構與趨勢分析</p>
      </div>
      {showMask ? (
        <div className="relative">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-white/90 font-medium mb-1">請登入啟用分析功能</div>
              <div className="text-white/60 text-sm">登入後可查看完整 SMC 結構分析</div>
            </div>
          </div>
          <div className="opacity-30">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/70 text-sm">結構類型</span>
            <span className="text-green-400 font-medium">{data.structureType}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/70 text-sm">上升波段次數</span>
            <span className="text-blue-400 font-medium">{data.uptrendCount} 次</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/70 text-sm">當前最高高點</span>
            <span className="text-purple-400 font-medium">{formatPrice(data.currentHigh)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/70 text-sm">高點突破次數</span>
            <span className="text-orange-400 font-medium">{data.breakoutCount} 次</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/70 text-sm">觀察區間</span>
            <span className="text-cyan-400 font-medium">{data.observationInterval}</span>
          </div>
          <div className="text-xs text-white/50 text-center pt-2">
            最後更新：{formatTime(data.lastUpdated)}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-white/70 mb-1">暫無分析資料</div>
          <div className="text-white/50 text-sm">請選擇其他幣種或時間區間</div>
        </div>
      )}
    </div>
  );
};

export default SMCAnalysisCard; 