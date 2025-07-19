"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        // 將用戶資訊添加到 request 物件
        req.user = {
            id: decoded.id,
            email: decoded.email,
            provider: decoded.provider
        };
        next();
    }
    catch (error) {
        console.error('Token 驗證失敗:', error);
        res.status(401).json({
            success: false,
            message: '無效的認證 token'
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map