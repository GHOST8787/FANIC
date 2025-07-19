import express from 'express';
import { askAiAboutChart } from '../controllers/aiController';

const router = express.Router();

router.post('/analysis', askAiAboutChart);

export default router; 