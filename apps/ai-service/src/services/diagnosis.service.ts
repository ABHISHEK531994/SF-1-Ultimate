// /apps/ai-service/src/services/diagnosis.service.ts
import { openai, MODELS, SYSTEM_PROMPTS } from '../config/openai';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export interface DiagnosisInput {
  images: string[]; // Base64 or URLs
  symptoms?: string;
  growSetup?: {
    medium?: string;
    nutrients?: string;
    lights?: string;
    ph?: number;
    ec?: number;
    temperature?: number;
    humidity?: number;
  };
  stage?: 'seedling' | 'vegetative' | 'flowering';
}

export interface DiagnosisResult {
  diagnosis: string;
  cause: string;
  solution: string[];
  prevention: string[];
  confidence: 'low' | 'medium' | 'high';
  relatedProblems?: string[];
}

export class DiagnosisService {
  /**
   * Plant Problem Diagnosis via GPT-4 Vision
   */
  async diagnose(input: DiagnosisInput): Promise<DiagnosisResult> {
    try {
      logger.info('[Diagnosis] Starting analysis...');
      
      // Prompt zusammenstellen
      const userPrompt = this.buildDiagnosisPrompt(input);
      
      // GPT-4 Vision aufrufen
      const response = await openai.chat.completions.create({
        model: MODELS.GPT4_VISION,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPTS.DIAGNOSIS
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              ...input.images.map(img => ({
                type: 'image_url' as const,
                image_url: {
                  url: img,
                  detail: 'high' as const
                }
              }))
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.3 // Niedrig für präzise Diagnose
      });
      
      const content = response.choices[0].message.content || '';
      
      // Response parsen
      const result = this.parseDiagnosisResponse(content);
      
      logger.info('[Diagnosis] Completed:', result.diagnosis);
      
      return result;
      
    } catch (error) {
      logger.error('[Diagnosis] Failed:', error);
      throw error;
    }
  }
  
  /**
   * Quick Diagnosis (ohne Bild, nur Text)
   */
  async quickDiagnose(symptoms: string, setup?: any): Promise<DiagnosisResult> {
    try {
      const prompt = `
        Symptome: ${symptoms}
        ${setup ? `Setup: ${JSON.stringify(setup)}` : ''}
        
        Bitte diagnostiziere das Problem und gib Empfehlungen.
      `;
      
      const response = await openai.chat.completions.create({
        model: MODELS.GPT35_TURBO,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.DIAGNOSIS },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });
      
      const content = response.choices[0].message.content || '';
      
      return this.parseDiagnosisResponse(content);
      
    } catch (error) {
      logger.error('[Diagnosis] Quick diagnose failed:', error);
      throw error;
    }
  }
  
  /**
   * Batch Diagnosis (mehrere Pflanzen gleichzeitig)
   */
  async batchDiagnose(inputs: DiagnosisInput[]): Promise<DiagnosisResult[]> {
    const results = await Promise.all(
      inputs.map(input => this.diagnose(input))
    );
    
    return results;
  }
  
  /**
   * Prompt für Diagnose erstellen
   */
  private buildDiagnosisPrompt(input: DiagnosisInput): string {
    let prompt = 'Bitte analysiere diese Cannabis-Pflanze und diagnostiziere mögliche Probleme.\n\n';
    
    if (input.symptoms) {
      prompt += `**Symptome:** ${input.symptoms}\n\n`;
    }
    
    if (input.stage) {
      prompt += `**Wachstumsphase:** ${input.stage}\n\n`;
    }
    
    if (input.growSetup) {
      prompt += '**Grow-Setup:**\n';
      for (const [key, value] of Object.entries(input.growSetup)) {
        if (value !== undefined) {
          prompt += `- ${key}: ${value}\n`;
        }
      }
      prompt += '\n';
    }
    
    prompt += 'Bitte gib eine strukturierte Antwort mit:\n';
    prompt += '1. **Diagnose** - Was ist das Problem?\n';
    prompt += '2. **Ursache** - Warum ist es passiert?\n';
    prompt += '3. **Lösung** - Schritt-für-Schritt (nummeriert)\n';
    prompt += '4. **Prävention** - Tipps für die Zukunft\n';
    prompt += '5. **Confidence** - low/medium/high\n';
    
    return prompt;
  }
  
  /**
   * Response parsen
   */
  private parseDiagnosisResponse(content: string): DiagnosisResult {
    // Einfaches Parsing (kann verbessert werden mit strukturiertem Output)
    const sections = {
      diagnosis: this.extractSection(content, 'Diagnose', 'Ursache'),
      cause: this.extractSection(content, 'Ursache', 'Lösung'),
      solution: this.extractListSection(content, 'Lösung', 'Prävention'),
      prevention: this.extractListSection(content, 'Prävention', 'Confidence'),
      confidence: this.extractConfidence(content)
    };
    
    return {
      diagnosis: sections.diagnosis || 'Unbekanntes Problem',
      cause: sections.cause || 'Ursache konnte nicht bestimmt werden',
      solution: sections.solution,
      prevention: sections.prevention,
      confidence: sections.confidence
    };
  }
  
  private extractSection(text: string, start: string, end: string): string {
    const startRegex = new RegExp(`\\*\\*${start}\\*\\*[:\\s]*(.+?)(?=\\*\\*${end}\\*\\*|$)`, 'is');
    const match = text.match(startRegex);
    return match ? match[1].trim() : '';
  }
  
  private extractListSection(text: string, start: string, end: string): string[] {
    const section = this.extractSection(text, start, end);
    if (!section) return [];
    
    // Nummerierte Listen extrahieren
    const items = section.split('\n')
      .map(line => line.trim())
      .filter(line => /^\d+\./.test(line) || line.startsWith('-'))
      .map(line => line.replace(/^\d+\.\s*|-\s*/, ''));
    
    return items.length > 0 ? items : [section];
  }
  
  private extractConfidence(text: string): 'low' | 'medium' | 'high' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('high') || lowerText.includes('hoch')) return 'high';
    if (lowerText.includes('low') || lowerText.includes('niedrig')) return 'low';
    return 'medium';
  }
  
  /**
   * Häufige Probleme (Cached)
   */
  async getCommonProblems(): Promise<Array<{
    name: string;
    symptoms: string[];
    image?: string;
  }>> {
    const cacheKey = 'ai:common-problems';
    
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const problems = [
      {
        name: 'Nährstoffmangel (Stickstoff)',
        symptoms: ['Gelbe untere Blätter', 'Langsames Wachstum', 'Blasse Blätter']
      },
      {
        name: 'Nährstoffverbrennung',
        symptoms: ['Braune Blattspitzen', 'Gekräuselte Blätter', 'Dunkle Verfärbungen']
      },
      {
        name: 'Überwässerung',
        symptoms: ['Hängende Blätter', 'Gelbe Blätter', 'Wurzelfäule']
      },
      {
        name: 'Unterwässerung',
        symptoms: ['Trockene Erde', 'Hängende Blätter', 'Knusprige Blätter']
      },
      {
        name: 'Lichtbrand',
        symptoms: ['Gebleichte Blätter', 'Braune Flecken', 'Verbrannte Spitzen']
      },
      {
        name: 'pH-Problem',
        symptoms: ['Flecken auf Blättern', 'Nährstoffsperre', 'Verfärbungen']
      },
      {
        name: 'Schädlinge (Spinnmilben)',
        symptoms: ['Kleine Punkte auf Blättern', 'Gespinste', 'Blätter sterben ab']
      },
      {
        name: 'Pilzbefall',
        symptoms: ['Weiße Flecken', 'Schimmel', 'Faulstellen']
      }
    ];
    
    await redis.setex(cacheKey, 86400, JSON.stringify(problems)); // 1 Tag Cache
    
    return problems;
  }
}

export const diagnosisService = new DiagnosisService();
