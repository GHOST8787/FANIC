"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// 檢查登入狀態
router.get('/status', authController_1.AuthController.checkAuthStatus);
// 登出
router.post('/logout', authController_1.AuthController.logout);
// Google OAuth 路由
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/auth/failure' }), authController_1.AuthController.handleOAuthSuccess);
// Facebook OAuth 路由
router.get('/facebook', passport_1.default.authenticate('facebook', {
    scope: ['email']
}));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/auth/failure' }), authController_1.AuthController.handleOAuthSuccess);
// LINE OAuth 路由
router.get('/line', passport_1.default.authenticate('line'));
router.get('/line/callback', passport_1.default.authenticate('line', { failureRedirect: '/auth/failure' }), authController_1.AuthController.handleOAuthSuccess);
// OAuth 失敗處理
router.get('/failure', authController_1.AuthController.handleOAuthFailure);
exports.default = router;
//# sourceMappingURL=auth.js.map