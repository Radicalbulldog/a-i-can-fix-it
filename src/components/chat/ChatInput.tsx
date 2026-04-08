import { useState, useRef } from 'react';

interface ChatInputProps {
  onSend: (text: string, images?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder = 'Ask a follow-up question...' }: ChatInputProps) {
  const [text, setText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && pendingFiles.length === 0) return;
    onSend(text.trim(), pendingFiles.length > 0 ? pendingFiles : undefined);
    setText('');
    setPendingFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
        setPendingFiles(Array.from(e.target.files || []));
        e.target.value = '';
      }} />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 transition-colors"
        disabled={disabled}
      >
        📎
      </button>

      <div className="flex-1 relative">
        {pendingFiles.length > 0 && (
          <div className="absolute bottom-full left-0 mb-1 flex gap-1">
            {pendingFiles.map((f, i) => (
              <span key={i} className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{f.name}</span>
            ))}
          </div>
        )}
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2.5 rounded-full border border-gray-300 dark:border-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={disabled || (!text.trim() && pendingFiles.length === 0)}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m-7 7l7-7 7 7" />
        </svg>
      </button>
    </form>
  );
}
