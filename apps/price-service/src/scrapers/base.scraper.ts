// Price Service - Base Scraper Class
import { BrowserContext, Page } from 'playwright';
import { createStealthContext } from '../config/playwright';
import { canScrape } from '../utils/robots';
import { logger } from '../utils/logger';

export interface ScrapedProduct {
  name: string;
  breeder?: string;
  type: 'feminized' | 'autoflower' | 'regular';
  
  price: number;
  currency: string;
  originalPrice?: number;
  discount?: number;
  
  inStock: boolean;
  stockLevel?: 'low' | 'medium' | 'high';
  
  packSize: string;
  seedCount: number;
  
  url: string;
  
  // Optional
  thc?: number;
  cbd?: number;
  floweringTime?: number;
  genetics?: string;
  imageUrl?: string;
}

export abstract class BaseScraper {
  protected abstract baseUrl: string;
  protected abstract seedbankName: string;
  protected abstract seedbankSlug: string;
  
  protected context: BrowserContext | null = null;
  protected rateLimitMs: number = 2000; // 2 seconds between requests
  private lastRequestTime: number = 0;
  
  /**
   * Initialize scraper (setup browser context)
   */
  async initialize(): Promise<void> {
    this.context = await createStealthContext();
    logger.info(`[${this.seedbankName}] Scraper initialized`);
  }
  
  /**
   * Cleanup (close browser context)
   */
  async cleanup(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
      logger.info(`[${this.seedbankName}] Scraper cleaned up`);
    }
  }
  
  /**
   * Rate limiting
   */
  protected async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitMs) {
      const waitTime = this.rateLimitMs - timeSinceLastRequest;
      await this.sleep(waitTime);
    }
    
    this.lastRequestTime = Date.now();
  }
  
  /**
   * Sleep helper
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Check robots.txt before scraping
   */
  protected async checkRobots(path: string): Promise<boolean> {
    return canScrape(this.baseUrl, path);
  }
  
  /**
   * Create a new page with anti-detection
   */
  protected async createPage(): Promise<Page> {
    if (!this.context) {
      throw new Error('Scraper not initialized. Call initialize() first.');
    }
    
    const page = await this.context.newPage();
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
    });
    
    return page;
  }
  
  /**
   * Navigate to URL with retry logic
   */
  protected async navigateWithRetry(
    page: Page, 
    url: string, 
    retries: number = 3
  ): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
        return;
      } catch (error) {
        logger.warn(`[${this.seedbankName}] Navigation attempt ${i + 1} failed:`, error);
        
        if (i === retries - 1) {
          throw error;
        }
        
        await this.sleep(3000 * (i + 1)); // Exponential backoff
      }
    }
  }
  
  /**
   * Handle CAPTCHA detection
   */
  protected async detectCaptcha(page: Page): Promise<boolean> {
    const captchaSelectors = [
      'iframe[src*="recaptcha"]',
      'iframe[src*="hcaptcha"]',
      '#captcha',
      '.g-recaptcha',
      '.h-captcha'
    ];
    
    for (const selector of captchaSelectors) {
      const element = await page.$(selector);
      if (element) {
        logger.warn(`[${this.seedbankName}] CAPTCHA detected: ${selector}`);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Extract text safely
   */
  protected async extractText(
    page: Page, 
    selector: string, 
    defaultValue: string = ''
  ): Promise<string> {
    try {
      const element = await page.$(selector);
      if (element) {
        const text = await element.textContent();
        return text?.trim() || defaultValue;
      }
    } catch (error) {
      logger.debug(`[${this.seedbankName}] Failed to extract text from ${selector}`);
    }
    return defaultValue;
  }
  
  /**
   * Extract attribute safely
   */
  protected async extractAttribute(
    page: Page,
    selector: string,
    attribute: string,
    defaultValue: string = ''
  ): Promise<string> {
    try {
      const element = await page.$(selector);
      if (element) {
        const attr = await element.getAttribute(attribute);
        return attr || defaultValue;
      }
    } catch (error) {
      logger.debug(`[${this.seedbankName}] Failed to extract ${attribute} from ${selector}`);
    }
    return defaultValue;
  }
  
  /**
   * Abstract methods to be implemented by adapters
   */
  abstract scrapeAll(): Promise<ScrapedProduct[]>;
  abstract scrapeProduct(url: string): Promise<ScrapedProduct | null>;
  abstract getProductUrls(): Promise<string[]>;
}
