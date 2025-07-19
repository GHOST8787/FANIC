import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, CreateUserData } from '../models/User';

export class AuthController {
  // 生成 JWT Token
  private static generateToken(user: any): string {
    const payload = { id: user.id, email: user.email, provider: user.provider };
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' };
    // @ts-ignore
    return jwt.sign(payload, secret, options);
  }

  // 處理 OAuth 登入成功
  static async handleOAuthSuccess(req: Request, res: Response) {
    try {
      const profile = req.user as any;
      const provider = req.params.provider || 'google';

      if (!profile || !profile.emails || !profile.emails[0]) {
        return res.status(400).json({
          success: false,
          message: '無法獲取用戶資料'
        });
      }

      const email = profile.emails[0].value;
      const name = profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName || 'Unknown User';
      const providerId = profile.id;
      const avatarUrl = profile.photos?.[0]?.value;

      // 查找現有用戶
      let user = await UserModel.findByEmailAndProvider(email, provider);

      if (!user) {
        // 創建新用戶
        const userData: CreateUserData = {
          name,
          email,
          provider: provider as 'google' | 'facebook' | 'line',
          provider_id: providerId,
          avatar_url: avatarUrl
        };

        user = await UserModel.create(userData);
      } else {
        // 更新現有用戶資料
        user = await UserModel.update(user.id, {
          name,
          avatar_url: avatarUrl
        }) || user;
      }

      // 生成 JWT Token
      const token = AuthController.generateToken(user);

      // 設定 Cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // 重定向到前端
      res.redirect('http://localhost:3000/?login=success');
    } catch (error) {
      console.error('OAuth 登入處理失敗:', error);
      res.redirect('http://localhost:3000/?login=error');
    }
  }

  // 處理 OAuth 登入失敗
  static handleOAuthFailure(req: Request, res: Response) {
    console.error('OAuth 登入失敗:', req.query.error);
    res.redirect('http://localhost:3000/?login=error');
  }

  // 檢查登入狀態
  static async checkAuthStatus(req: Request, res: Response) {
    try {
      const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.json({
          success: false,
          message: '未登入'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        return res.json({
          success: false,
          message: '用戶不存在'
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('檢查登入狀態失敗:', error);
      res.json({
        success: false,
        message: '登入狀態檢查失敗'
      });
    }
  }

  // 登出
  static logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.json({
      success: true,
      message: '登出成功'
    });
  }
} 