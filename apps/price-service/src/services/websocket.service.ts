// Price Service - WebSocket Service
import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class WebSocketService {
  private io: SocketServer | null = null;
  private subscribedSeeds = new Map<string, Set<string>>(); // seedSlug -> Set of socketIds
  
  /**
   * Initialize WebSocket server
   */
  initialize(httpServer: HttpServer): void {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST']
      },
      path: '/socket.io'
    });
    
    this.io.on('connection', (socket) => {
      logger.info(`[WebSocket] Client connected: ${socket.id}`);
      
      // Subscribe to seed price updates
      socket.on('subscribe:seed', (seedSlug: string) => {
        if (!this.subscribedSeeds.has(seedSlug)) {
          this.subscribedSeeds.set(seedSlug, new Set());
        }
        
        this.subscribedSeeds.get(seedSlug)!.add(socket.id);
        
        socket.join(`seed:${seedSlug}`);
        
        logger.debug(`[WebSocket] ${socket.id} subscribed to ${seedSlug}`);
      });
      
      // Unsubscribe
      socket.on('unsubscribe:seed', (seedSlug: string) => {
        if (this.subscribedSeeds.has(seedSlug)) {
          this.subscribedSeeds.get(seedSlug)!.delete(socket.id);
        }
        
        socket.leave(`seed:${seedSlug}`);
        
        logger.debug(`[WebSocket] ${socket.id} unsubscribed from ${seedSlug}`);
      });
      
      // Disconnect
      socket.on('disconnect', () => {
        // Clean up subscriptions
        for (const [seedSlug, sockets] of this.subscribedSeeds.entries()) {
          sockets.delete(socket.id);
          
          if (sockets.size === 0) {
            this.subscribedSeeds.delete(seedSlug);
          }
        }
        
        logger.info(`[WebSocket] Client disconnected: ${socket.id}`);
      });
    });
    
    logger.info('[WebSocket] Server initialized');
    
    // Start listening for price updates from Redis
    this.listenForPriceUpdates();
  }
  
  /**
   * Listen for price update events from Redis pub/sub
   */
  private async listenForPriceUpdates(): Promise<void> {
    const subscriber = redis.duplicate();
    await subscriber.connect();
    
    await subscriber.subscribe('price:updated', (message) => {
      try {
        const data = JSON.parse(message);
        this.broadcastPriceUpdate(data);
      } catch (error) {
        logger.error('[WebSocket] Error handling price update:', error);
      }
    });
    
    logger.info('[WebSocket] Listening for price updates');
  }
  
  /**
   * Broadcast price update to subscribed clients
   */
  private broadcastPriceUpdate(data: {
    seedSlug: string;
    price: any;
  }): void {
    if (!this.io) return;
    
    const room = `seed:${data.seedSlug}`;
    
    this.io.to(room).emit('price:changed', {
      seedSlug: data.seedSlug,
      price: data.price,
      timestamp: Date.now()
    });
    
    logger.debug(`[WebSocket] Broadcasted price update for ${data.seedSlug} to ${this.subscribedSeeds.get(data.seedSlug)?.size || 0} clients`);
  }
  
  /**
   * Publish price update (called by scraper)
   */
  async publishPriceUpdate(seedSlug: string, price: any): Promise<void> {
    await redis.publish('price:updated', JSON.stringify({
      seedSlug,
      price
    }));
  }
  
  /**
   * Get active connections count
   */
  getConnectionsCount(): number {
    return this.io?.sockets.sockets.size || 0;
  }
  
  /**
   * Get subscribed seeds count
   */
  getSubscribedSeedsCount(): number {
    return this.subscribedSeeds.size;
  }
  
  /**
   * Broadcast scraping status
   */
  broadcastScrapingStatus(data: {
    seedbank: string;
    status: 'started' | 'progress' | 'completed' | 'error';
    progress?: number;
    productsScraped?: number;
    error?: string;
  }): void {
    if (!this.io) return;
    
    this.io.emit('scraping:status', {
      ...data,
      timestamp: Date.now()
    });
  }
}

export const websocketService = new WebSocketService();
