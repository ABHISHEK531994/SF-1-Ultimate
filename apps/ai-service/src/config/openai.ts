// /apps/ai-service/src/config/openai.ts
import OpenAI from 'openai';
import { logger } from '../utils/logger';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

if (!OPENAI_API_KEY) {
  logger.warn('[OpenAI] API Key not configured!');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

/**
 * AI-Modelle
 */
export const MODELS = {
  GPT4_TURBO: 'gpt-4-turbo-preview',
  GPT4_VISION: 'gpt-4-vision-preview',
  GPT35_TURBO: 'gpt-3.5-turbo',
  DALL_E_3: 'dall-e-3'
} as const;

/**
 * System-Prompts
 */
export const SYSTEM_PROMPTS = {
  DIAGNOSIS: `Du bist ein Cannabis-Anbau-Experte mit 20+ Jahren Erfahrung.
    Deine Aufgabe ist es, Pflanzenprobleme zu diagnostizieren basierend auf:
    - Fotos der Pflanze
    - Beschreibung der Symptome
    - Grow-Setup (Medium, Nährstoffe, Licht, etc.)
    
    Antworte immer strukturiert:
    1. **Diagnose** - Was ist das Problem?
    2. **Ursache** - Warum ist es passiert?
    3. **Lösung** - Schritt-für-Schritt Anleitung zur Behebung
    4. **Prävention** - Wie kann man es verhindern?
    
    Sei präzise, aber verständlich für Anfänger.`,
  
  ADVISOR: `Du bist ein erfahrener Cannabis-Growing-Berater.
    Deine Aufgabe ist es, personalisierte Empfehlungen zu geben für:
    - Strain-Auswahl basierend auf Erfahrung, Setup, Zielen
    - Optimierung des Grows (VPD, Licht, Nährstoffe)
    - Problemlösung und Troubleshooting
    - Best Practices für verschiedene Phasen
    
    Berücksichtige immer:
    - Das Erfahrungslevel des Growers
    - Das verfügbare Setup (Indoor/Outdoor, Equipment)
    - Die Ziele (Yield, Potenz, Speed, etc.)
    
    Sei praktisch, ehrlich und motivierend.`,
  
  CHAT: `Du bist ein freundlicher Cannabis-Growing-Assistent.
    Beantworte Fragen zu:
    - Allgemeines Growing-Wissen
    - Strain-Informationen
    - Setup-Empfehlungen
    - Problemlösung
    
    Sei hilfsbereit, präzise und verständlich.
    Wenn du etwas nicht weißt, gib es zu und empfehle weitere Recherche.`
};

/**
 * Token-Limits
 */
export const TOKEN_LIMITS = {
  GPT4_TURBO: 128000,
  GPT4_VISION: 128000,
  GPT35_TURBO: 16000
};

/**
 * Cost Tracking (USD pro 1k Tokens)
 */
export const COSTS = {
  GPT4_TURBO: { input: 0.01, output: 0.03 },
  GPT4_VISION: { input: 0.01, output: 0.03 },
  GPT35_TURBO: { input: 0.0005, output: 0.0015 }
};
