import { pool } from '../config/database';

export interface User {
  id: number;
  name: string;
  email: string;
  provider: 'google' | 'facebook' | 'line';
  provider_id?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  provider: 'google' | 'facebook' | 'line';
  provider_id?: string;
  avatar_url?: string;
}

export class UserModel {
  // 根據 email 和 provider 查找用戶
  static async findByEmailAndProvider(email: string, provider: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ? AND provider = ?',
        [email, provider]
      );
      
      const users = rows as User[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('查找用戶失敗:', error);
      throw error;
    }
  }

  // 根據 provider_id 查找用戶
  static async findByProviderId(providerId: string, provider: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE provider_id = ? AND provider = ?',
        [providerId, provider]
      );
      
      const users = rows as User[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('查找用戶失敗:', error);
      throw error;
    }
  }

  // 創建新用戶
  static async create(userData: CreateUserData): Promise<User> {
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, provider, provider_id, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [userData.name, userData.email, userData.provider, userData.provider_id, userData.avatar_url]
      );
      
      const insertResult = result as any;
      const userId = insertResult.insertId;
      
      // 獲取創建的用戶
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      
      const users = rows as User[];
      return users[0];
    } catch (error) {
      console.error('創建用戶失敗:', error);
      throw error;
    }
  }

  // 更新用戶資料
  static async update(id: number, userData: Partial<CreateUserData>): Promise<User | null> {
    try {
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      
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
      
      await pool.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
      
      // 獲取更新後的用戶
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      const users = rows as User[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('更新用戶失敗:', error);
      throw error;
    }
  }

  // 根據 ID 查找用戶
  static async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      const users = rows as User[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('查找用戶失敗:', error);
      throw error;
    }
  }
} 