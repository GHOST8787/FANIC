import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 獲取用戶資料 (需要登入)
router.get('/profile', authMiddleware, UserController.getProfile);

// 更新用戶資料 (需要登入)
router.put('/profile', authMiddleware, UserController.updateProfile);

export default router; 