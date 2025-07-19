import { useState, useEffect } from 'react';

export function useAdminMode() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  // 初始化時從 localStorage 讀取狀態
  useEffect(() => {
    const adminMode = localStorage.getItem('adminMode') === 'true';
    setIsAdminMode(adminMode);
  }, []);

  // 切換管理員模式
  const toggleAdminMode = () => {
    const newMode = !isAdminMode;
    setIsAdminMode(newMode);
    localStorage.setItem('adminMode', newMode.toString());
  };

  // 設置管理員模式
  const setAdminMode = (mode: boolean) => {
    setIsAdminMode(mode);
    localStorage.setItem('adminMode', mode.toString());
  };

  return {
    isAdminMode,
    toggleAdminMode,
    setAdminMode,
  };
} 