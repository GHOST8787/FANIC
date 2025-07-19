import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import AnalysisPanel from '../components/AnalysisPanel';

interface AnalysisResult {
  success: boolean;
  data?: {
    timestamp: string;
    symbol: string;
    smc: {
      trend: 'bullish' | 'bearish' | 'sideways';
      structure: string;
      description: string;
    };
    supportResistance: {
      support: number[];
      resistance: number[];
      tests: number;
      description: string;
    };
    harmonics: Array<{
      name: string;
      type: 'bullish' | 'bearish';
      confidence: number;
      completion: number;
    }>;
  };
  message?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, error, logout } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 檢查登入狀態，未登入則重定向
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // 進行技術分析
  const handleStartAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      setShowResult(false);

      const response = await axios.post('/api/analysis/start', {}, {
        withCredentials: true
      });

      setAnalysisResult(response.data);
      setShowResult(true);
    } catch (error: any) {
      console.error('技術分析失敗:', error);
      setAnalysisResult({
        success: false,
        message: error.response?.data?.message || '分析失敗，請稍後再試'
      });
      setShowResult(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 升級為付費帳號
  const handleUpgrade = () => {
    navigate('/pricing');
  };

  // 登出
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ 載入失敗</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  // 未登入狀態
  if (!isAuthenticated || !user) {
    return null; // 會被 useEffect 重定向
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📊 虛擬貨幣技術分析儀表板
            </h1>
            <p className="text-xl text-gray-600">
              歡迎回來，{user.name}！
            </p>
          </div>

          {/* 用戶資訊卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  👤 帳戶資訊
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">電子郵件：</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">帳戶類型：</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-sm ${
                      user.role === 'premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'premium' ? '付費用戶' : '免費用戶'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">登入方式：</span>
                    <span className="font-medium capitalize">{user.provider}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  📈 分析配額
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">剩餘分析次數：</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-sm ${
                      user.remainingAnalyses > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.remainingAnalyses} 次
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.role === 'free' 
                      ? '每週重置免費分析次數' 
                      : '付費用戶無限制分析'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 功能按鈕區域 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 技術分析按鈕 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🔍 技術分析
              </h3>
              <p className="text-gray-600 mb-4">
                進行專業的加密貨幣技術分析，包含多種技術指標
              </p>
              <button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing || (user.role === 'free' && user.remainingAnalyses <= 0)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  isAnalyzing || (user.role === 'free' && user.remainingAnalyses <= 0)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    分析中...
                  </div>
                ) : (
                  '進行技術分析'
                )}
              </button>
              {user.role === 'free' && user.remainingAnalyses <= 0 && (
                <p className="text-red-500 text-sm mt-2">
                  ⚠️ 免費分析次數已用完，請升級為付費帳號
                </p>
              )}
            </div>

            {/* 升級按鈕 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ⭐ 升級帳號
              </h3>
              <p className="text-gray-600 mb-4">
                升級為付費帳號，享受無限制的技術分析功能
              </p>
              <button
                onClick={handleUpgrade}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                升級為付費帳號
              </button>
            </div>
          </div>

          {/* 分析結果顯示 */}
          {showResult && analysisResult && (
            <div className="mb-8">
              {analysisResult.success && analysisResult.data ? (
                <AnalysisPanel 
                  analysisData={{
                    smc: {
                      structureType: analysisResult.data.smc.structure,
                      uptrendCount: 3,
                      currentHigh: 45000,
                      breakoutCount: 2,
                      observationInterval: '日線',
                      lastUpdated: analysisResult.data.timestamp
                    },
                    supportResistance: {
                      support: analysisResult.data.supportResistance.support.map((price, index) => ({
                        price,
                        testCount: analysisResult.data.supportResistance.tests,
                        isCurrentLevel: false,
                        type: 'support' as const
                      })),
                      resistance: analysisResult.data.supportResistance.resistance.map((price, index) => ({
                        price,
                        testCount: analysisResult.data.supportResistance.tests,
                        isCurrentLevel: false,
                        type: 'resistance' as const
                      })),
                      currentPrice: 44500,
                      lastUpdated: analysisResult.data.timestamp
                    }
                  }}
                  isLoading={false}
                  error={null}
                />
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="text-red-500 mr-2">❌</div>
                    <span className="text-red-800 font-medium">分析失敗</span>
                  </div>
                  <p className="text-red-700">{analysisResult.message}</p>
                </div>
              )}
            </div>
          )}

          {/* 登出按鈕 */}
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 