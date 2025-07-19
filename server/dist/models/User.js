"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
class UserModel {
    // 根據 email 和 provider 查找用戶
    static async findByEmailAndProvider(email, provider) {
        try {
            const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE email = ? AND provider = ?', [email, provider]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        }
        catch (error) {
            console.error('查找用戶失敗:', error);
            throw error;
        }
    }
    // 根據 provider_id 查找用戶
    static async findByProviderId(providerId, provider) {
        try {
            const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE provider_id = ? AND provider = ?', [providerId, provider]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        }
        catch (error) {
            console.error('查找用戶失敗:', error);
            throw error;
        }
    }
    // 創建新用戶
    static async create(userData) {
        try {
            const [result] = await database_1.pool.execute('INSERT INTO users (name, email, provider, provider_id, avatar_url) VALUES (?, ?, ?, ?, ?)', [userData.name, userData.email, userData.provider, userData.provider_id, userData.avatar_url]);
            const insertResult = result;
            const userId = insertResult.insertId;
            // 獲取創建的用戶
            const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
            const users = rows;
            return users[0];
        }
        catch (error) {
            console.error('創建用戶失敗:', error);
            throw error;
        }
    }
    // 更新用戶資料
    static async update(id, userData) {
        try {
            const updateFields = [];
            const updateValues = [];
            if (userData.name) {
                updateFields.push('name = ?');
                updateValues.push(userData.name);
            }
            if (userData.email) {
                updateFields.push('email = ?');
                updateValues.push(userData.email);
            }
            if (userData.avatar_url) {
                updateFields.push('avatar_url = ?');
                updateValues.push(userData.avatar_url);
            }
            if (updateFields.length === 0) {
                return null;
            }
            updateValues.push(id);
            await database_1.pool.execute(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
            // 獲取更新後的用戶
            const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        }
        catch (error) {
            console.error('更新用戶失敗:', error);
            throw error;
        }
    }
    // 根據 ID 查找用戶
    static async findById(id) {
        try {
            const [rows] = await database_1.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
            const users = rows;
            return users.length > 0 ? users[0] : null;
        }
        catch (error) {
            console.error('查找用戶失敗:', error);
            throw error;
        }
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map