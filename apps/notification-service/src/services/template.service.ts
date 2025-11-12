import handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';

export class TemplateService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
  
  constructor() {
    this.loadTemplates();
    this.registerHelpers();
  }
  
  /**
   * Load all templates
   */
  private loadTemplates(): void {
    const templateDir = join(__dirname, '../templates/email');
    
    const templates = [
      'welcome',
      'comment-reply',
      'price-alert',
      'milestone',
      'badge',
      'digest',
      'generic'
    ];
    
    for (const name of templates) {
      try {
        const source = readFileSync(join(templateDir, `${name}.hbs`), 'utf-8');
        this.templates.set(name, handlebars.compile(source));
        logger.debug(`[Template] Loaded ${name}.hbs`);
      } catch (error) {
        logger.error(`[Template] Failed to load ${name}.hbs:`, error);
      }
    }
  }
  
  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    handlebars.registerHelper('formatDate', (date: Date) => {
      return new Date(date).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });
    
    handlebars.registerHelper('eq', (a: any, b: any) => {
      return a === b;
    });
    
    handlebars.registerHelper('truncate', (str: string, len: number) => {
      if (!str) return '';
      return str.length > len ? str.substring(0, len) + '...' : str;
    });
  }
  
  /**
   * Render template
   */
  render(name: string, data: any): string {
    const template = this.templates.get(name);
    
    if (!template) {
      logger.warn(`[Template] Template ${name} not found, using generic`);
      return this.templates.get('generic')!(data);
    }
    
    return template(data);
  }
  
  /**
   * Get template for notification type
   */
  getTemplateForType(type: string): string {
    const map: Record<string, string> = {
      comment: 'comment-reply',
      reply: 'comment-reply',
      mention: 'comment-reply',
      price_alert: 'price-alert',
      milestone: 'milestone',
      badge: 'badge'
    };
    
    return map[type] || 'generic';
  }
}

export const templateService = new TemplateService();