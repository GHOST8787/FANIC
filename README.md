# 🚀 虛擬貨幣技術分析平台

一個全端虛擬貨幣技術分析平台，整合 CoinGecko API 和專業的圖表分析工具。

## ✨ 主要功能

### 🔌 Binance API 串接
- 使用 `https://api.binance.com/api/v3/klines`
- 支援多種時間間隔：1d、4h、1h、15m
- 自動轉換數據格式以配合 lightweight-charts K 線圖

### 📊 即時 K 線圖表
- 使用 [lightweight-charts](https://github.com/tradingview/lightweight-charts)
- 專業的 K 線圖顯示（Candlestick Chart）
- 響應式設計，支援桌面和行動裝置
- 即時價格顯示

### 🎛️ 幣種與時間間隔選擇器
- 支援 BTCUSDT、ETHUSDT、SOLUSDT 三種主要幣種
- 時間間隔選擇：日線、4小時、1小時、15分鐘
- 每次選擇後自動重新獲取數據並更新圖表

### 🧠 技術分析結果面板
- SMC 結構分析
- 支撐壓力區偵測
- 和諧型態識別
- 登入狀態檢查與次數限制

### 🔐 OAuth 登入系統
- 支援 Google、Facebook、LINE 登入
- 用戶資料管理
- 分析次數限制與升級功能

## 🏗️ 技術架構

### 前端 (React + TypeScript)
```
client/
├── src/
│   ├── components/
│   │   ├── ChartArea.tsx          # 圖表顯示元件
│   │   ├── CurrencySelector.tsx   # 幣種選擇器
│   │   ├── AnalysisPanel.tsx      # 分析結果面板
│   │   └── ...
│   ├── hooks/
│   │   ├── useBinanceChart.ts     # Binance API Hook
│   │   └── useAuth.ts             # 認證 Hook
│   └── pages/
│       └── AnalysisPage.tsx       # 主要分析頁面
```

### 後端 (Node.js + Express)
```
server/
├── controllers/
├── middleware/
├── models/
├── routes/
└── services/
```

## 🚀 快速開始

### 方法一：使用批次檔 (推薦)
```bash
# Windows
start-demo.bat

# 或手動執行
./start-demo.bat
```

### 方法二：手動啟動
```bash
# 1. 安裝依賴
cd client && npm install
cd ../server && npm install

# 2. 啟動後端
cd server && npm run dev

# 3. 啟動前端 (新終端)
cd client && npm run dev
```

## 📍 訪問網址

- **前端**: http://localhost:5173
- **後端**: http://localhost:3000

## 🔧 環境設定

### 前端環境變數
```env
# client/.env
VITE_API_BASE_URL=http://localhost:3000
```

### 後端環境變數
```env
# server/.env
PORT=3000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crypto_analysis
```

## 📦 主要依賴

### 前端
- `react`: ^18.2.0
- `typescript`: ^4.9.3
- `axios`: ^1.3.4
- `lightweight-charts`: ^4.1.3
- `react-router-dom`: ^6.8.1
- `tailwindcss`: ^3.2.7

### 後端
- `express`: ^4.18.2
- `passport`: ^0.6.0
- `mysql2`: ^3.2.0
- `jsonwebtoken`: ^9.0.0
- `cors`: ^2.8.5

## 🎯 功能特色

### 1. 即時數據串接
- 直接從 Binance API 獲取最新 K 線數據
- 支援多種時間間隔
- 自動數據格式轉換

### 2. 專業圖表顯示
- 使用 TradingView 的 lightweight-charts
- 高品質的 K 線圖（Candlestick Chart）
- 專業的技術分析圖表

### 3. 智能分析面板
- 根據登入狀態顯示不同內容
- 模擬專業技術分析結果
- 為未來 AI 整合預留接口

### 4. 響應式設計
- 支援桌面和行動裝置
- 現代化的 UI/UX 設計
- 流暢的用戶體驗

## 🔮 未來規劃

- [ ] AI 技術分析整合
- [ ] 更多幣種支援
- [ ] 歷史分析記錄
- [ ] 用戶自定義設定
- [ ] 即時通知功能
- [ ] 社交分享功能

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License 