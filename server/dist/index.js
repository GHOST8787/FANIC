"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("./config/passport"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const analysis_1 = __importDefault(require("./routes/analysis"));
const database_1 = require("./config/database");
// 載入環境變數
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// 安全中間件
app.use((0, helmet_1.default)());
// CORS 配置
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
// 速率限制
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100 // 限制每個 IP 15 分鐘內最多 100 個請求
});
app.use('/api/', limiter);
// 解析 JSON
app.use(express_1.default.json());
// Session 配置
app.use((0, express_session_1.default)({
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
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// 路由
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/analysis', analysis_1.default);
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
app.use((err, req, res, next) => {
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
        await (0, database_1.testConnection)();
        // 初始化資料庫表格
        await (0, database_1.initDatabase)();
        // 啟動伺服器
        app.listen(PORT, () => {
            console.log(`🚀 伺服器已啟動在 http://localhost:${PORT}`);
            console.log(`📊 健康檢查: http://localhost:${PORT}/api/health`);
            console.log(`🔐 認證端點: http://localhost:${PORT}/api/auth`);
        });
    }
    catch (error) {
        console.error('❌ 伺服器啟動失敗:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map