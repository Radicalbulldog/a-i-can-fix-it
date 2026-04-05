import { useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types/chat';
import ChatMessageComp from './ChatMessage';
import ChatInput from './ChatInput';
import Spinner from '../ui/Spinner';

interface ChatWindowProps {
  messages: ChatMessageType[];
  onSend: (text: string, images?: File[]) => void;
  isLoading: boolean;
  followUpQuestion?: string | null;
}

export default function ChatWindow({ messages, onSend, isLoading, followUpQuestion }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>💬</span> Chat with AI Assistant
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96 hide-scrollbar">
        {messages.length === 0 && followUpQuestion && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
            <strong>More info needed:</strong> {followUpQuestion}
          </div>
        )}

        {messages.map(msg => (
          <ChatMessageComp key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <Spinner size="sm" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
