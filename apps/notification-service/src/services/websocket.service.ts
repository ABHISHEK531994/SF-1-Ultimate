import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class WebSocketService {
  private io: SocketServer;
  
  constructor(httpServer: HttpServer) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'https://seedfinderpro.de',
        credentials: true
      },
      path: '/ws/notifications'
    });
    
    this.initialize();
  }
  
  /**
   * Initialize WebSocket server
   */
  private initialize(): void {
    this.io.on('connection', (socket) => {
      logger.debug(`[WS] Client connected: ${socket.id}`);
      
      // Auth
      socket.on('auth', async (data: { userId: string; token: string }) => {
        // Verify token via Auth Service or Redis
        const isValid = await this.verifyToken(data.userId, data.token);
        
        if (isValid) {
          // Join user room
          socket.join(`user:${data.userId}`);
          socket.data.userId = data.userId;
          
          logger.info(`[WS] User ${data.userId} authenticated`);
          
          socket.emit('auth:success');
        } else {
          socket.emit('auth:failed');
          socket.disconnect();
        }
      });
      
      socket.on('disconnect', () => {
        logger.debug(`[WS] Client disconnected: ${socket.id}`);
      });
    });
    
    logger.info('[WS] WebSocket server initialized');
  }
  
  /**
   * Verify token
   */
  private async verifyToken(userId: string, token: string): Promise<boolean> {
    // Check Redis session
    const session = await redis.get(`session:${token}`);
    
    if (!session) return false;
    
    const sessionData = JSON.parse(session);
    
    return sessionData.userId === userId;
  }
  
  /**
   * Send to user
   */
  async sendToUser(userId: string, event: string, data: any): Promise<void> {
    this.io.to(`user:${userId}`).emit(event, data);
    logger.debug(`[WS] Sent ${event} to user ${userId}`);
  }
  
  /**
   * Send to multiple users
   */
  async sendToUsers(userIds: string[], event: string, data: any): Promise<void> {
    for (const userId of userIds) {
      this.io.to(`user:${userId}`).emit(event, data);
    }
    logger.debug(`[WS] Sent ${event} to ${userIds.length} users`);
  }
  
  /**
   * Broadcast to all
   */
  async broadcast(event: string, data: any): Promise<void> {
    this.io.emit(event, data);
    logger.debug(`[WS] Broadcasted ${event}`);
  }
}

export let websocketService: WebSocketService;

export function initWebSocket(httpServer: HttpServer): void {
  websocketService = new WebSocketService(httpServer);
}