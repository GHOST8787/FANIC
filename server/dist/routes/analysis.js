"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analysisController_1 = require("../controllers/analysisController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 開始技術分析 (需要登入)
router.post('/start', auth_1.authMiddleware, analysisController_1.AnalysisController.startAnalysis);
// 獲取分析歷史 (需要登入)
router.get('/history', auth_1.authMiddleware, analysisController_1.AnalysisController.getHistory);
exports.default = router;
//# sourceMappingURL=analysis.js.map