export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[]; // base64 preview URLs
  timestamp: number;
}
