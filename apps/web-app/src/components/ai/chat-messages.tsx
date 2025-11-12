'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && <TypingIndicator />}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-4 animate-in', isUser ? 'justify-end' : '')}>
      {!isUser && (
        <div className="avatar-cannabis w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black text-gray-900 flex-shrink-0">
          🌿
        </div>
      )}

      <div className={cn('flex-1 max-w-3xl', isUser && 'flex justify-end')}>
        <div
          className={cn(
            'msg-bubble rounded-2xl px-6 py-4',
            isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'
          )}
        >
          <div className="text-white text-lg font-medium prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-cannabis text-2xl font-black mb-3" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-cannabis text-xl font-black mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-cannabis text-lg font-black mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code className="bg-black/30 px-2 py-1 rounded text-emerald-300" {...props} />
                  ) : (
                    <code className="block bg-black/30 p-4 rounded-lg overflow-x-auto" {...props} />
                  ),
                strong: ({ node, ...props }) => <strong className="text-cannabis font-black" {...props} />,
                a: ({ node, ...props }) => (
                  <a className="text-emerald-400 hover:text-emerald-300 underline" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <p className="text-xs text-white/40 mt-2 font-medium">
          {new Date(message.timestamp).toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {isUser && (
        <div className="icon-emboss w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-gray-900 flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="avatar-cannabis w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black text-gray-900 flex-shrink-0 opacity-70">
        🌿
      </div>
      <div className="msg-bubble rounded-2xl rounded-tl-sm px-6 py-4">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
