import { useState, useEffect } from 'react';

const FREE_QUOTA = 2;
const STORAGE_KEY = 'analysis_quota';
const ADMIN_MODE_KEY = 'admin_mode';

export function useAnalysisQuota(isLoggedIn: boolean) {
  const [quota, setQuota] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : FREE_QUOTA;
  });

  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem(ADMIN_MODE_KEY) === 'true';
  });

  // 當登入狀態或管理員模式改變時，更新 quota
  useEffect(() => {
    if (isLoggedIn || isAdminMode) {
      setQuota(Infinity);
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      setQuota(saved ? Number(saved) : FREE_QUOTA);
    }
  }, [isLoggedIn, isAdminMode]);

  const useOne = () => {
    if (isLoggedIn || isAdminMode) return;
    const next = quota - 1;
    setQuota(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  const reset = () => {
    setQuota(FREE_QUOTA);
    localStorage.setItem(STORAGE_KEY, String(FREE_QUOTA));
  };

  const toggleAdminMode = () => {
    const newAdminMode = !isAdminMode;
    setIsAdminMode(newAdminMode);
    localStorage.setItem(ADMIN_MODE_KEY, String(newAdminMode));
    
    if (newAdminMode) {
      setQuota(Infinity);
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      setQuota(saved ? Number(saved) : FREE_QUOTA);
    }
  };

  // 修正 canAnalyze 邏輯：登入用戶或管理員模式或還有剩餘次數
  const canAnalyze = isLoggedIn || isAdminMode || quota > 0;

  return { 
    quota, 
    useOne, 
    reset, 
    canAnalyze,
    isUnlimited: isLoggedIn || isAdminMode,
    isAdminMode,
    toggleAdminMode
  };
} 