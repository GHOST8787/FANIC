"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 獲取用戶資料 (需要登入)
router.get('/profile', auth_1.authMiddleware, userController_1.UserController.getProfile);
// 更新用戶資料 (需要登入)
router.put('/profile', auth_1.authMiddleware, userController_1.UserController.updateProfile);
exports.default = router;
//# sourceMappingURL=user.js.map