import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';

const router = Router();

// 檢查登入狀態
router.get('/status', AuthController.checkAuthStatus);

// 登出
router.post('/logout', AuthController.logout);

// Google OAuth 路由
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  AuthController.handleOAuthSuccess
);

// Facebook OAuth 路由
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
  AuthController.handleOAuthSuccess
);

// LINE OAuth 路由
router.get('/line', passport.authenticate('line'));

router.get('/line/callback',
  passport.authenticate('line', { failureRedirect: '/auth/failure' }),
  AuthController.handleOAuthSuccess
);

// OAuth 失敗處理
router.get('/failure', AuthController.handleOAuthFailure);

export default router; 