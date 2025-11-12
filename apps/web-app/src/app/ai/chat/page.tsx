'use client';

import { useState } from 'react';
import { ChatMessages } from '@/components/ai/chat-messages';
import { ChatInput } from '@/components/ai/chat-input';
import { ChatSessions } from '@/components/ai/chat-sessions';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Session {
  id: string;
  title: string;
  lastMessage: Date;
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey! 👋 Ich bin dein SF-1 AI Assistant. Stell mir Fragen zu Cannabis-Anbau, Strains, Problemen oder was auch immer du wissen möchtest!',
      timestamp: new Date(),
    },
  ]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call AI API
      const response = await apiClient.post('/ai/chat', {
        sessionId: currentSessionId,
        message: content,
      });

      // Add AI response
      const aiMessage: Message = {
        id: response.messageId,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(response.timestamp),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Update session
      if (!currentSessionId) {
        setCurrentSessionId(response.sessionId);
        setSessions((prev) => [
          {
            id: response.sessionId,
            title: content.slice(0, 50) + '...',
            lastMessage: new Date(),
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    setCurrentSessionId(null);
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Neue Session gestartet! Was möchtest du wissen?',
        timestamp: new Date(),
      },
    ]);
  };

  const handleLoadSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/ai/chat/sessions/${sessionId}`);
      setCurrentSessionId(sessionId);
      setMessages(
        response.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Sessions Sidebar */}
      <aside className="w-80 flex-shrink-0">
        <ChatSessions
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewSession={handleNewSession}
          onSelectSession={handleLoadSession}
        />
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col min-w-0 neo-deep rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="cannabis-gradient-dark p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="avatar-cannabis w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-gray-900">
                🌿
              </div>
              <div>
                <h1 className="text-cannabis text-3xl font-black">SF-1 AI Assistant</h1>
                <p className="text-emerald-300 text-lg font-bold flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online & Ready
                </p>
              </div>
            </div>
            <button
              onClick={handleNewSession}
              className="neo-deep px-6 py-3 rounded-xl text-white font-bold text-base hover:scale-105 transition"
            >
              New Session
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6" style={{ background: 'linear-gradient(135deg, #051510, #0a2a1f)' }}>
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>

        {/* Input */}
        <div className="cannabis-gradient-dark p-6 flex-shrink-0">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}
