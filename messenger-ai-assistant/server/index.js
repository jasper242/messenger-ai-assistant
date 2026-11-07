import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/reply', async (req, res) => {
  const { message, context = '', tone = 'Friendly' } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Enter the incoming message.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'Add OPENAI_API_KEY to server/.env.' });
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: 'Draft a natural helpful reply. Return only the reply text. Do not claim to have sent it. Be cautious with emergencies and medical, legal, or financial topics.',
      input: `Tone: ${tone}\nContext: ${String(context).slice(0,3000)}\nIncoming message: ${message.slice(0,6000)}`
    });
    res.json({ reply: result.output_text?.trim() || 'No reply generated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Reply generation failed. Check your API key, model access, and server terminal.' });
  }
});
const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`API running at http://localhost:${port}`));
