'use client';

import { MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  title: string;
  lastMessage: Date;
}

interface ChatSessionsProps {
  sessions: Session[];
  currentSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
}

export function ChatSessions({
  sessions,
  currentSessionId,
  onNewSession,
  onSelectSession,
}: ChatSessionsProps) {
  return (
    <div className="neo-deep rounded-3xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <button
          onClick={onNewSession}
          className="w-full bubble-soft px-6 py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Neue Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scroll">
        <h3 className="text-cannabis font-black text-xl mb-4">Sessions</h3>
        
        {sessions.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/50 text-sm font-medium">Noch keine Sessions</p>
          </div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl transition',
                currentSessionId === session.id
                  ? 'neo-deep border-2 border-emerald-500/50'
                  : 'neo-deep hover:scale-105'
              )}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm line-clamp-2 mb-1">
                    {session.title}
                  </p>
                  <p className="text-white/50 text-xs font-medium">
                    {new Date(session.lastMessage).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
