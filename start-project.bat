@echo off
echo ========================================
echo 虛擬貨幣技術分析平台 - 啟動腳本
echo ========================================
echo.

echo 🚀 正在啟動前端 (React + Vite)...
cd client
start cmd /k "npm install && npm run dev"
cd ..

echo.
echo 🚀 正在啟動後端 (Node.js + Express)...
cd server
start cmd /k "npm install && npm run dev"
cd ..

echo.
echo ✅ 專案啟動完成！
echo.
echo 📱 訪問地址：
echo   前端: http://localhost:3000
echo   後端: http://localhost:5000
echo   健康檢查: http://localhost:5000/api/health
echo.
echo 💡 功能特色：
echo   - React + TypeScript + Tailwind CSS
echo   - Node.js + Express + MySQL
echo   - Google/Facebook/LINE OAuth 登入
echo   - JWT 認證
echo   - 響應式設計
echo.
pause 