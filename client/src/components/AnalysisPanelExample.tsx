import React from 'react';
import AnalysisPanel from './AnalysisPanel';

const AnalysisPanelExample: React.FC = () => {
  // 模擬分析結果資料
  const mockAnalysisData = {
    smc: {
      structureType: 'LL → LH (Lower Low to Lower High)',
      uptrendCount: 2,
      currentHigh: 125000,
      breakoutCount: 1,
      observationInterval: '日線',
      lastUpdated: new Date().toISOString()
    },
    supportResistance: {
      support: [
        { price: 11500, testCount: 2, isCurrentLevel: false, type: 'support' as const },
        { price: 11800, testCount: 1, isCurrentLevel: false, type: 'support' as const }
      ],
      resistance: [
        { price: 12500, testCount: 3, isCurrentLevel: false, type: 'resistance' as const },
        { price: 12800, testCount: 2, isCurrentLevel: false, type: 'resistance' as const }
      ],
      currentPrice: 12000,
      lastUpdated: new Date().toISOString()
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          AnalysisPanel 使用範例
        </h1>
        
        <AnalysisPanel 
          analysisData={mockAnalysisData}
          isLoading={false}
          error={null}
        />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📝 使用說明
          </h2>
          <div className="text-sm text-blue-700 space-y-1">
            <div>• 傳入包含 SMC 結構、支撐壓力區和分析摘要的數據</div>
            <div>• 元件會自動格式化並顯示可讀的分析報告</div>
            <div>• 支援不同趨勢顏色（看漲/看跌/中性）</div>
            <div>• 自動格式化價格和百分比顯示</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanelExample; 