import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
  provider: 'google' | 'facebook' | 'line';
  role: 'free' | 'premium';
  remainingAnalyses: number;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  // 檢查用戶登入狀態
  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axios.get('/api/user/profile', {
        withCredentials: true
      });

      if (response.data.success) {
        setAuthState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: response.data.message || '驗證失敗'
        });
      }
    } catch (error: any) {
      console.error('檢查登入狀態失敗:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error.response?.data?.message || '網路錯誤'
      });
    }
  };

  // 登出
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  // 重新整理用戶資料
  const refreshUserData = async () => {
    await checkAuthStatus();
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...authState,
    checkAuthStatus,
    logout,
    refreshUserData
  };
}; 