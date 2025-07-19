"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.initDatabase = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'crypto_analysis',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// 建立連線池
exports.pool = promise_1.default.createPool(dbConfig);
// 初始化資料庫表格
const initDatabase = async () => {
    try {
        const connection = await exports.pool.getConnection();
        // 建立 users 表格
        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        provider ENUM('google', 'facebook', 'line') NOT NULL,
        provider_id VARCHAR(255),
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_provider_id (provider_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
        await connection.execute(createUsersTable);
        console.log('✅ 資料庫表格初始化完成');
        connection.release();
    }
    catch (error) {
        console.error('❌ 資料庫初始化失敗:', error);
        throw error;
    }
};
exports.initDatabase = initDatabase;
// 測試資料庫連線
const testConnection = async () => {
    try {
        const connection = await exports.pool.getConnection();
        console.log('✅ 資料庫連線成功');
        connection.release();
    }
    catch (error) {
        console.error('❌ 資料庫連線失敗:', error);
        throw error;
    }
};
exports.testConnection = testConnection;
//# sourceMappingURL=database.js.map