import { Router } from 'express';
import { AnalysisController } from '../controllers/analysisController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 開始技術分析 (需要登入)
router.post('/start', authMiddleware, AnalysisController.startAnalysis);

// 獲取分析歷史 (需要登入)
router.get('/history', authMiddleware, AnalysisController.getHistory);

export default router; 