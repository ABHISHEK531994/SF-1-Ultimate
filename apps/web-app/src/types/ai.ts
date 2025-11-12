export interface AIPlantDiagnosis {
  id: string;
  userId: string;
  diagnosis: {
    problem: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
    affectedArea: string[];
    possibleCauses: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  images?: string[];
  symptoms?: string;
  createdAt: string;
}

export interface AIGrowAdvice {
  id: string;
  userId: string;
  query: string;
  advice: {
    summary: string;
    details: string;
    tips: string[];
    warnings?: string[];
  };
  context?: {
    strain?: string;
    stage?: string;
    environment?: string;
  };
  createdAt: string;
}

export interface AIChatSession {
  id: string;
  userId: string;
  messages: AIChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIStrainRecommendation {
  strain: string;
  score: number;
  reasons: string[];
  matchedPreferences: string[];
}
