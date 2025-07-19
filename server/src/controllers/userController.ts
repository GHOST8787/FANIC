import { Request, Response } from 'express';
import { UserModel } from '../models/User';

export class UserController {
  // 獲取用戶資料
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未登入'
        });
      }

      const user = await UserModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用戶不存在'
        });
      }

      // 模擬用戶角色和剩餘分析次數
      const userWithRole = {
        ...user,
        role: 'free' as const, // 預設為免費用戶
        remainingAnalyses: 5 // 模擬剩餘分析次數
      };

      res.json({
        success: true,
        user: userWithRole
      });
    } catch (error) {
      console.error('獲取用戶資料失敗:', error);
      res.status(500).json({
        success: false,
        message: '伺服器錯誤'
      });
    }
  }

  // 更新用戶資料
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未登入'
        });
      }

      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: '用戶名稱不能為空'
        });
      }

      const updatedUser = await UserModel.update(userId, { name });
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: '用戶不存在'
        });
      }

      res.json({
        success: true,
        user: updatedUser,
        message: '用戶資料更新成功'
      });
    } catch (error) {
      console.error('更新用戶資料失敗:', error);
      res.status(500).json({
        success: false,
        message: '伺服器錯誤'
      });
    }
  }
} 