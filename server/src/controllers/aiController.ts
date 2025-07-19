import { Request, Response } from 'express';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const askAiAboutChart = async (req: Request, res: Response) => {
  const { summary } = req.body;
  if (!summary) {
    return res.status(400).json({ error: 'Missing summary' });
  }
  try {
    const prompt = `你是一位專業加密貨幣分析師，請根據以下分析結果給出簡單解釋與建議：\n${summary}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '你是加密貨幣技術分析助理。' },
        { role: 'user', content: prompt },
      ],
    });
    const result = response.choices[0].message.content || '無回應';
    res.json({ result });
  } catch (err: any) {
    res.status(500).json({ error: 'AI 分析失敗', detail: err.message });
  }
}; 