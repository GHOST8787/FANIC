import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButtons from '../components/LoginButtons';
import UserProfile from '../components/UserProfile';
import { User } from '../types/auth';
import { authService } from '../services/auth';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    checkAuthStatus();
    checkLoginStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.checkAuthStatus();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('檢查登入狀態失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLoginStatus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginParam = urlParams.get('login');
    
    if (loginParam === 'success') {
      setLoginStatus('success');
      // 清除 URL 參數
      window.history.replaceState({}, document.title, window.location.pathname);
      // 重新檢查登入狀態
      setTimeout(() => {
        checkAuthStatus();
      }, 1000);
    } else if (loginParam === 'error') {
      setLoginStatus('error');
      // 清除 URL 參數
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 標題區域 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔐 登入您的帳戶
            </h1>
            <p className="text-xl text-gray-600">
              登入後即可使用完整的技術分析功能
            </p>
          </div>

          {/* 登入狀態提示 */}
          {loginStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    登入成功！歡迎使用虛擬貨幣技術分析平台
                  </p>
                </div>
              </div>
            </div>
          )}

          {loginStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    登入失敗，請重試或選擇其他登入方式
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 主要內容區域 */}
          <div className="max-w-md mx-auto">
            {user ? (
              <div className="text-center">
                <div className="mb-6">
                  <UserProfile user={user} />
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  返回分析頁面
                </button>
              </div>
            ) : (
              <div className="card">
                <LoginButtons />
              </div>
            )}
          </div>

          {/* 頁腳 */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>© 2024 虛擬貨幣技術分析平台. 保留所有權利.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 