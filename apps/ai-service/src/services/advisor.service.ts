// /apps/ai-service/src/services/advisor.service.ts
import { openai, MODELS, SYSTEM_PROMPTS } from '../config/openai';
import { logger } from '../utils/logger';

export interface AdvisorInput {
  question: string;
  userContext?: {
    experienceLevel?: 'beginner' | 'intermediate' | 'expert';
    growType?: 'indoor' | 'outdoor' | 'greenhouse';
    budget?: 'low' | 'medium' | 'high';
    goals?: string[]; // e.g., ['high-yield', 'potency', 'fast-harvest']
    equipment?: string[];
  };
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface AdvisorResponse {
  answer: string;
  recommendations?: string[];
  links?: Array<{
    title: string;
    url: string;
  }>;
  confidence: number; // 0-1
}

export class AdvisorService {
  /**
   * Personalisierte Grow-Beratung
   */
  async getAdvice(input: AdvisorInput): Promise<AdvisorResponse> {
    try {
      logger.info('[Advisor] Processing question:', input.question);
      
      const contextPrompt = this.buildContextPrompt(input);
      
      const messages: any[] = [
        { role: 'system', content: SYSTEM_PROMPTS.ADVISOR }
      ];
      
      // Conversation History hinzufügen (falls vorhanden)
      if (input.conversationHistory) {
        messages.push(...input.conversationHistory);
      }
      
      // Aktuelle Frage
      messages.push({
        role: 'user',
        content: `${contextPrompt}\n\nFrage: ${input.question}`
      });
      
      const response = await openai.chat.completions.create({
        model: MODELS.GPT4_TURBO,
        messages,
        max_tokens: 2000,
        temperature: 0.7 // Höher für kreativere Antworten
      });
      
      const answer = response.choices[0].message.content || '';
      
      logger.info('[Advisor] Answer generated');
      
      return {
        answer,
        confidence: 0.85, // TODO: Berechnen basierend auf Response
        recommendations: this.extractRecommendations(answer)
      };
      
    } catch (error) {
      logger.error('[Advisor] Failed:', error);
      throw error;
    }
  }
  
  /**
   * Strain-Empfehlung
   */
  async recommendStrain(criteria: {
    experienceLevel: string;
    growType: string;
    goals: string[];
    budget?: string;
  }): Promise<{
    strains: Array<{
      name: string;
      reason: string;
      pros: string[];
      cons: string[];
    }>;
  }> {
    try {
      const prompt = `
        Empfiehl mir 3-5 Cannabis-Strains basierend auf:
        
        - Erfahrung: ${criteria.experienceLevel}
        - Grow-Typ: ${criteria.growType}
        - Ziele: ${criteria.goals.join(', ')}
        ${criteria.budget ? `- Budget: ${criteria.budget}` : ''}
        
        Format (JSON):
        {
          "strains": [
            {
              "name": "Strain Name",
              "reason": "Warum dieser Strain passt",
              "pros": ["Pro 1", "Pro 2"],
              "cons": ["Con 1", "Con 2"]
            }
          ]
        }
      `;
      
      const response = await openai.chat.completions.create({
        model: MODELS.GPT4_TURBO,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.ADVISOR },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1500,
        temperature: 0.8
      });
      
      const content = response.choices[0].message.content || '{}';
      const result = JSON.parse(content);
      
      return result;
      
    } catch (error) {
      logger.error('[Advisor] Strain recommendation failed:', error);
      throw error;
    }
  }
  
  /**
   * Setup-Optimierung
   */
  async optimizeSetup(currentSetup: {
    space: string;
    lights: string;
    ventilation: string;
    medium: string;
    nutrients: string;
  }): Promise<{
    analysis: string;
    improvements: Array<{
      category: string;
      suggestion: string;
      priority: 'low' | 'medium' | 'high';
      estimatedCost?: string;
    }>;
    score: number; // 0-100
  }> {
    try {
      const prompt = `
        Analysiere dieses Grow-Setup und gib Verbesserungsvorschläge:
        
        ${Object.entries(currentSetup).map(([k, v]) => `- ${k}: ${v}`).join('\n')}
        
        Bitte bewerte das Setup (0-100 Punkte) und gib konkrete Verbesserungsvorschläge
        nach Priorität (low/medium/high).
      `;
      
      const response = await openai.chat.completions.create({
        model: MODELS.GPT4_TURBO,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.ADVISOR },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.6
      });
      
      const content = response.choices[0].message.content || '';
      
      // Parse response (simplified)
      return {
        analysis: content,
        improvements: this.extractImprovements(content),
        score: this.extractScore(content)
      };
      
    } catch (error) {
      logger.error('[Advisor] Setup optimization failed:', error);
      throw error;
    }
  }
  
  /**
   * Harvest-Timing-Advice
   */
  async harvestAdvice(input: {
    strain: string;
    weekInFlower: number;
    trichomeColor?: string;
    pistilColor?: string;
    images?: string[];
  }): Promise<{
    readyToHarvest: boolean;
    recommendation: string;
    estimatedDaysRemaining?: number;
    trichomeAnalysis?: string;
  }> {
    try {
      let prompt = `
        Beurteile die Erntereife dieser Cannabis-Pflanze:
        
        - Strain: ${input.strain}
        - Woche in Blüte: ${input.weekInFlower}
        ${input.trichomeColor ? `- Trichome-Farbe: ${input.trichomeColor}` : ''}
        ${input.pistilColor ? `- Pistil-Farbe: ${input.pistilColor}` : ''}
        
        Ist die Pflanze bereit zur Ernte? Wenn nein, wie viele Tage noch?
      `;
      
      const messages: any[] = [
        { role: 'system', content: SYSTEM_PROMPTS.ADVISOR },
        {
          role: 'user',
          content: input.images ? [
            { type: 'text', text: prompt },
            ...input.images.map(img => ({
              type: 'image_url',
              image_url: { url: img, detail: 'high' }
            }))
          ] : prompt
        }
      ];
      
      const response = await openai.chat.completions.create({
        model: input.images ? MODELS.GPT4_VISION : MODELS.GPT4_TURBO,
        messages,
        max_tokens: 1000,
        temperature: 0.4
      });
      
      const content = response.choices[0].message.content || '';
      
      return {
        readyToHarvest: content.toLowerCase().includes('bereit') || content.toLowerCase().includes('ernten'),
        recommendation: content,
        estimatedDaysRemaining: this.extractDaysRemaining(content)
      };
      
    } catch (error) {
      logger.error('[Advisor] Harvest advice failed:', error);
      throw error;
    }
  }
  
  /**
   * Context-Prompt erstellen
   */
  private buildContextPrompt(input: AdvisorInput): string {
    if (!input.userContext) return '';
    
    let context = 'User-Kontext:\n';
    const ctx = input.userContext;
    
    if (ctx.experienceLevel) {
      context += `- Erfahrung: ${ctx.experienceLevel}\n`;
    }
    if (ctx.growType) {
      context += `- Grow-Typ: ${ctx.growType}\n`;
    }
    if (ctx.budget) {
      context += `- Budget: ${ctx.budget}\n`;
    }
    if (ctx.goals && ctx.goals.length > 0) {
      context += `- Ziele: ${ctx.goals.join(', ')}\n`;
    }
    if (ctx.equipment && ctx.equipment.length > 0) {
      context += `- Equipment: ${ctx.equipment.join(', ')}\n`;
    }
    
    return context;
  }
  
  private extractRecommendations(text: string): string[] {
    const lines = text.split('\n');
    const recommendations: string[] = [];
    
    for (const line of lines) {
      if (line.match(/^[-•]\s+/) || line.match(/^\d+\.\s+/)) {
        recommendations.push(line.replace(/^[-•]\s+|\d+\.\s+/, '').trim());
      }
    }
    
    return recommendations.slice(0, 5); // Max 5
  }
  
  private extractImprovements(text: string): Array<any> {
    // Simplified extraction
    return [];
  }
  
  private extractScore(text: string): number {
    const match = text.match(/(\d+)\s*(\/100|punkte|points)/i);
    return match ? parseInt(match[1]) : 75;
  }
  
  private extractDaysRemaining(text: string): number | undefined {
    const match = text.match(/(\d+)\s*(tage|days|wochen|weeks)/i);
    if (!match) return undefined;
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit.includes('woche') || unit.includes('week')) {
      return value * 7;
    }
    return value;
  }
}

export const advisorService = new AdvisorService();
