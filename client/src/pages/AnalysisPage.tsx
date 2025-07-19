import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBinanceKlines } from '../hooks/useBinanceKlines';
import { useAdminMode } from '../hooks/useAdminMode';
import { useAnalysisData } from '../hooks/useAnalysisData';
import CurrencySelector, { CurrencySymbol, TimeInterval } from '../components/CurrencySelector';
import ResponsiveChartContainer from '../components/ResponsiveChartContainer';
import AnalysisPanel from '../components/AnalysisPanel';
import AnalysisSummary from '../components/AnalysisSummary';

const AnalysisPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isAdminMode, toggleAdminMode } = useAdminMode();
  
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencySymbol>(CurrencySymbol.BTCUSDT);
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>(TimeInterval['1d']);

  // 使用 Binance K線 API hook
  const { data: klineData, isLoading, error, lastUpdated } = useBinanceKlines(selectedCurrency, selectedInterval);
  
  // 使用分析數據 hook
  const { analysisData, isLoading: analysisLoading, error: analysisError } = useAnalysisData(selectedCurrency, selectedInterval);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* 標題與管理員按鈕 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-shadow-sm">
            虛擬貨幣技術分析平台
          </h1>
          <button
            onClick={toggleAdminMode}
            className="rounded-full text-xs px-2 py-1 bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30 transition-colors"
          >
            {isAdminMode ? '退出管理員' : '管理員模式'}
          </button>
        </div>

        {/* 主要內容區塊 */}
<div className="flex flex-col gap-8">
  {/* 圖表區塊 */}
  <div className="w-full">
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 drop-shadow-xl">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-white/70">載入中...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-red-400">載入失敗: {error}</div>
        </div>
      ) : klineData && klineData.length > 0 ? ( 
        <ResponsiveChartContainer 
          data={klineData}
          klineHeight={400}
          volumeHeight={120}
          lastUpdated={lastUpdated}
        />
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-white/70">無資料</div>
        </div>
      )}
    </div>
  </div>

  {/* 控制區塊（上下） */}
  <div className="w-full space-y-4">
    {/* 幣種選擇器 */}
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 drop-shadow-xl">
      <CurrencySelector
        selectedCurrency={selectedCurrency}
        selectedInterval={selectedInterval}
        onCurrencyChange={setSelectedCurrency}
        onIntervalChange={setSelectedInterval}
      />
    </div>

    {/* 分析面板 */}
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 drop-shadow-xl">
      <AnalysisPanel 
        analysisData={analysisData}
        isLoading={analysisLoading}
        error={analysisError}
      />
    </div>
  </div>
</div>
        {/* AnalysisSummary 插入於 AnalysisPanel 下方 */}
        <AnalysisSummary
          strategies={
            analysisData && Array.isArray(analysisData.strategies)
              ? analysisData.strategies.filter(s => s.winRate > 0.6)
              : []
          }
          isLoading={analysisLoading}
        />
      </div>
    </div>
  );  
};

export default AnalysisPage;