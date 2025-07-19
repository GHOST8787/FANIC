import express from 'express';
import cors from 'cors';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { config } from 'dotenv';
import passport from './config/passport';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import analysisRoutes from './routes/analysis';
import aiRoutes from './routes/ai';
import { initDatabase, testConnection } from './config/database';



// 載入環境變數
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 安全中間件
app.use(helmet());

// CORS 配置
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 限制每個 IP 15 分鐘內最多 100 個請求
});
app.use('/api/', limiter);

// 解析 JSON
app.use(express.json());

// Session 配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 小時
  }
}));

// Passport 初始化
app.use(passport.initialize());
app.use(passport.session());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/ai', aiRoutes);

// 健康檢查端點
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '伺服器運行正常',
    timestamp: new Date().toISOString()
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '路由不存在'
  });
});

// 錯誤處理中間件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('伺服器錯誤:', err);
  res.status(500).json({
    success: false,
    message: '伺服器內部錯誤'
  });
});

// 啟動伺服器
const startServer = async () => {
  try {
    // 測試資料庫連線
    await testConnection();
    
    // 初始化資料庫表格
    await initDatabase();
    
    // 啟動伺服器
    app.listen(PORT, () => {
      console.log(`🚀 伺服器已啟動在 http://localhost:${PORT}`);
      console.log(`📊 健康檢查: http://localhost:${PORT}/api/health`);
      console.log(`🔐 認證端點: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('❌ 伺服器啟動失敗:', error);
    process.exit(1);
  }
};

startServer(); 