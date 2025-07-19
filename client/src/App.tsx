import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AnalysisPage from './pages/AnalysisPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <div className="App min-h-screen bg-dark-background">
      <Routes>
        <Route path="/" element={<AnalysisPage />} />
        <Route path="/login" element={<Home />} />
        <Route path="/callback" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<div className="min-h-screen bg-dark-background flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4 text-white">定價頁面</h1><p className="text-dark-text-secondary">此頁面正在開發中...</p></div></div>} />
      </Routes>
    </div>
  );
};

export default App; 