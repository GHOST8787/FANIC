import axios from 'axios';
import { User, LoginResponse } from '../types/auth';

const API_BASE_URL = '/api';

export const authService = {
  // 檢查用戶登入狀態
  async checkAuthStatus(): Promise<LoginResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/status`);
      return response.data;
    } catch (error) {
      return { success: false, message: '無法檢查登入狀態' };
    }
  },

  // Google 登入
  async loginWithGoogle(): Promise<void> {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Facebook 登入
  async loginWithFacebook(): Promise<void> {
    window.location.href = `${API_BASE_URL}/auth/facebook`;
  },

  // LINE 登入
  async loginWithLine(): Promise<void> {
    window.location.href = `${API_BASE_URL}/auth/line`;
  },

  // 登出
  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      window.location.href = '/';
    } catch (error) {
      console.error('登出失敗:', error);
    }
  },

  // 處理 OAuth 回調
  async handleCallback(provider: string, code: string): Promise<LoginResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/${provider}/callback?code=${code}`);
      return response.data;
    } catch (error) {
      return { success: false, message: '登入失敗' };
    }
  }
}; 