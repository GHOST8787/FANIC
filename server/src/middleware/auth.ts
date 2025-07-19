import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 從 cookie 或 Authorization header 獲取 token
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供認證 token'
      });
    }

    // 驗證 JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // 將用戶資訊添加到 request 物件
    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      provider: decoded.provider
    };

    next();
  } catch (error) {
    console.error('Token 驗證失敗:', error);
    res.status(401).json({
      success: false,
      message: '無效的認證 token'
    });
  }
}; 