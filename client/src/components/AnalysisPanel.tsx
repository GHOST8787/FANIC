import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdminMode } from '../hooks/useAdminMode';
import SMCAnalysisCard from './SMCAnalysisCard';
import SupportResistanceCard from './SupportResistanceCard';
import ChartSummaryCard from './ChartSummaryCard';
import LoginPromptCard from './LoginPromptCard';
import ErrorAlert from './ErrorAlert';

interface AnalysisData {
  smc: {
    structureType: string;
    uptrendCount: number;
    currentHigh: number;
    breakoutCount: number;
    observationInterval: string;
    lastUpdated: string;
  };
  supportResistance: {
    support: Array<{
      price: number;
      testCount: number;
      isCurrentLevel: boolean;
      type: 'support' | 'resistance';
    }>;
    resistance: Array<{
      price: number;
      testCount: number;
      isCurrentLevel: boolean;
      type: 'support' | 'resistance';
    }>;
    currentPrice: number;
    lastUpdated: string;
  };
  chartSummary?: {
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
    indicators: {
      rsi: number;
      volumeMA: number;
      amplitude24h: number;
      sma20: number;
      ema50: number;
      sma20Change: number;
      ema50Change: number;
      rsiChange: number;
      volumeMAChange: number;
    };
  };
}

interface AnalysisPanelProps {
  analysisData: AnalysisData | null;
  isLoading?: boolean;
  error?: string | null;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  analysisData,
  isLoading = false,
  error = null
}) => {
  const { isAuthenticated } = useAuth();
  const { isAdminMode } = useAdminMode();
  const [showError, setShowError] = useState(!!error);

  const handleLogin = () => {
    // 這裡可以導向登入頁面或開啟登入模態框
    window.location.href = '/login';
  };

  return (
    <>
      {/* 錯誤提示框 */}
      <ErrorAlert
        message={error || ''}
        show={showError}
        onClose={() => setShowError(false)}
      />

      <div className="space-y-6">
        {/* 區塊一：K線圖區 */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-6 drop-shadow-xl">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white/90 mb-2">📈 K線圖表</h3>
            <p className="text-sm text-white/60">技術分析圖表區域</p>
          </div>
          
          {/* 自製圖表容器 */}
          <div className="h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <div className="text-white/70 mb-2 text-lg">自製 K線圖</div>
              <div className="text-white/50 text-sm">整合 LightweightCharts + Binance API</div>
              <div className="text-white/40 text-xs mt-2">支援同步滾動與技術指標</div>
            </div>
          </div>
        </div>

        {/* 圖表技術指標摘要 */}
        <ChartSummaryCard
          data={analysisData?.chartSummary || null}
          isLoading={isLoading}
        />

        {/* 權限判斷：管理員模式優先 */}
        {isAdminMode ? (
          // 管理員模式：顯示完整分析
          <>
            <SMCAnalysisCard
              data={analysisData?.smc || null}
              isAdminMode={isAdminMode}
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
            />
            <SupportResistanceCard
              data={analysisData?.supportResistance || null}
              isAuthenticated={isAuthenticated}
              isAdminMode={isAdminMode}
              isLoading={isLoading}
            />
          </>
        ) : !isAuthenticated ? (
          // 非管理員且未登入：顯示登入提示
          <>
            <LoginPromptCard
              title="🔐 SMC 結構分析"
              description="SMC 結構分析提供趨勢波段轉折點判斷，幫助識別市場結構變化與關鍵支撐阻力位。"
              icon="📊"
              onLogin={handleLogin}
            />
            <LoginPromptCard
              title="🔐 支撐壓力區"
              description="支撐壓力區分析識別關鍵價位，顯示多次測試的支撐阻力位，協助判斷進出場時機。"
              icon="🎯"
              onLogin={handleLogin}
            />
          </>
        ) : (
          // 已登入：顯示分析內容
          <>
            <SMCAnalysisCard
              data={analysisData?.smc || null}
              isAdminMode={isAdminMode}
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
            />
            <SupportResistanceCard
              data={analysisData?.supportResistance || null}
              isAuthenticated={isAuthenticated}
              isAdminMode={isAdminMode}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </>
  );
};

export default AnalysisPanel; 