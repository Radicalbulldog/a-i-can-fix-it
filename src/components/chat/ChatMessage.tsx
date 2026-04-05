import type { ChatMessage as ChatMessageType } from '../../types/chat';

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}
      >
        {message.images && message.images.length > 0 && (
          <div className="flex gap-2 mb-2">
            {message.images.map((url, i) => (
              <img key={i} src={url} alt="" className="w-16 h-16 rounded-lg object-cover" />
            ))}
          </div>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
