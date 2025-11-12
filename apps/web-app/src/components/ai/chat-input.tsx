'use client';

import { useState, KeyboardEvent } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3">
      <button
        className="neo-deep p-4 rounded-xl text-white hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        <Paperclip className="w-6 h-6" />
      </button>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Stelle eine Frage an SF-1 AI..."
        disabled={disabled}
        className={cn(
          'flex-1 input-inset rounded-xl px-6 py-4 text-white text-lg placeholder-white/50 font-medium focus:outline-none resize-none min-h-[60px] max-h-[200px]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        rows={1}
        style={{
          height: 'auto',
          minHeight: '60px',
        }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = Math.min(target.scrollHeight, 200) + 'px';
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={!message.trim() || disabled}
        className={cn(
          'bubble-soft px-10 py-4 rounded-xl font-black text-white text-xl transition',
          (!message.trim() || disabled) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Send className="w-6 h-6" />
      </button>
    </div>
  );
}
