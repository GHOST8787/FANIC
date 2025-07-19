@echo off
echo 🚀 啟動虛擬貨幣技術分析平台...
echo.

echo 📦 安裝前端依賴...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ 前端依賴安裝失敗
    pause
    exit /b 1
)

echo.
echo 📦 安裝後端依賴...
cd ..\server
call npm install
if %errorlevel% neq 0 (
    echo ❌ 後端依賴安裝失敗
    pause
    exit /b 1
)

echo.
echo 🔧 啟動後端伺服器...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo ⏳ 等待後端啟動...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 啟動前端開發伺服器...
start "Frontend Dev Server" cmd /k "cd client && npm run dev"

echo.
echo ✅ 應用程式啟動完成！
echo.
echo 📍 前端網址: http://localhost:5173
echo 📍 後端網址: http://localhost:3000
echo.
echo 💡 功能特色:
echo    • CoinGecko API 串接
echo    • 即時價格圖表 (lightweight-charts)
echo    • 幣種與時間區間選擇器
echo    • 技術分析結果面板
echo    • OAuth 登入系統
echo.
pause 