import { Router, Request, Response } from 'express';
import multer from 'multer';
import anthropic from '../lib/anthropic.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const router = Router();

const SYSTEM_PROMPT = `You are a friendly, expert home repair assistant embedded in the "a. I can fix it" app. You help users diagnose and fix home problems.

When the user asks follow-up questions or provides additional photos:
- Give clear, practical advice
- If you can now provide a more detailed repair plan, include it
- Suggest when professional help is needed
- Be encouraging but honest about difficulty
- If you reference tools or materials, mention them by name so the user can find them

Keep responses conversational but informative. Use numbered steps when giving instructions.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

router.post('/', upload.array('media', 5), async (req: Request, res: Response) => {
  try {
    const { messages: messagesJson } = req.body;
    const messages: ChatMessage[] = messagesJson ? JSON.parse(messagesJson) : [];
    const files = req.files as Express.Multer.File[] | undefined;

    // Build the latest user message with any attached images
    const userContent: any[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        if (file.mimetype.startsWith('image/')) {
          userContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: file.mimetype as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: file.buffer.toString('base64'),
            },
          });
        }
      }
    }

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && lastUserMsg.role === 'user') {
      userContent.push({ type: 'text', text: lastUserMsg.content });
    }

    // Build conversation history for Claude
    const claudeMessages = messages.slice(0, -1).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Add the final user message with images
    claudeMessages.push({
      role: 'user' as const,
      content: userContent.length > 0 ? userContent as any : lastUserMsg?.content || 'Hello',
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    res.json({ role: 'assistant', content: text });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
});

export default router;
