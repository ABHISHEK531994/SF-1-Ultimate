// /apps/ai-service/src/services/chat.service.ts
import { openai, MODELS, SYSTEM_PROMPTS } from '../config/openai';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export class ChatService {
  /**
   * Chat mit AI (mit Conversation History)
   */
  async chat(userId: string, message: string, sessionId?: string): Promise<{
    response: string;
    sessionId: string;
  }> {
    try {
      // Session laden oder erstellen
      const session = await this.getOrCreateSession(userId, sessionId);
      
      // User-Message hinzufügen
      session.messages.push({
        role: 'user',
        content: message,
        timestamp: Date.now()
      });
      
      // Nur letzte 10 Messages für Context (Token-Limit)
      const contextMessages = session.messages.slice(-10);
      
      // OpenAI aufrufen
      const response = await openai.chat.completions.create({
        model: MODELS.GPT35_TURBO,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.CHAT },
          ...contextMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        ],
        max_tokens: 800,
        temperature: 0.7
      });
      
      const assistantResponse = response.choices[0].message.content || '';
      
      // Assistant-Response hinzufügen
      session.messages.push({
        role: 'assistant',
        content: assistantResponse,
        timestamp: Date.now()
      });
      
      // Session speichern
      await this.saveSession(session);
      
      logger.info(`[Chat] Session ${session.id}: ${message.substring(0, 50)}...`);
      
      return {
        response: assistantResponse,
        sessionId: session.id
      };
      
    } catch (error) {
      logger.error('[Chat] Failed:', error);
      throw error;
    }
  }
  
  /**
   * Session abrufen oder erstellen
   */
  private async getOrCreateSession(userId: string, sessionId?: string): Promise<ChatSession> {
    if (sessionId) {
      const cached = await redis.get(`chat:session:${sessionId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    }
    
    // Neue Session
    const newSessionId = `${userId}_${Date.now()}`;
    
    return {
      id: newSessionId,
      userId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
  
  /**
   * Session speichern (Redis)
   */
  private async saveSession(session: ChatSession): Promise<void> {
    session.updatedAt = Date.now();
    
    await redis.setex(
      `chat:session:${session.id}`,
      3600, // 1 Stunde TTL
      JSON.stringify(session)
    );
  }
  
  /**
   * Session-Historie abrufen
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    const cached = await redis.get(`chat:session:${sessionId}`);
    return cached ? JSON.parse(cached) : null;
  }
  
  /**
   * Session löschen
   */
  async deleteSession(sessionId: string): Promise<void> {
    await redis.del(`chat:session:${sessionId}`);
  }
  
  /**
   * Alle Sessions eines Users
   */
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    const keys = await redis.keys(`chat:session:${userId}_*`);
    
    const sessions: ChatSession[] = [];
    
    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        sessions.push(JSON.parse(data));
      }
    }
    
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

export const chatService = new ChatService();
