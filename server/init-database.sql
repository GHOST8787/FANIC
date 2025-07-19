-- 虛擬貨幣技術分析平台資料庫初始化腳本

-- 建立資料庫
CREATE DATABASE IF NOT EXISTS crypto_analysis 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用資料庫
USE crypto_analysis;

-- 建立用戶表格
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
  INDEX idx_provider_id (provider_id),
  INDEX idx_provider (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 建立分析記錄表格 (未來擴展用)
CREATE TABLE IF NOT EXISTS analysis_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  analysis_type VARCHAR(50) NOT NULL,
  result_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_symbol (symbol),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 建立用戶偏好設定表格 (未來擴展用)
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'zh-TW',
  timezone VARCHAR(50) DEFAULT 'Asia/Taipei',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入測試資料 (可選)
INSERT INTO users (name, email, provider, provider_id) VALUES 
('測試用戶', 'test@example.com', 'google', 'test-provider-id')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 顯示表格結構
DESCRIBE users;
DESCRIBE analysis_records;
DESCRIBE user_preferences;

-- 顯示建立的表格
SHOW TABLES;

-- 顯示資料庫資訊
SELECT 
  DATABASE() as current_database,
  @@character_set_database as character_set,
  @@collation_database as collation; 