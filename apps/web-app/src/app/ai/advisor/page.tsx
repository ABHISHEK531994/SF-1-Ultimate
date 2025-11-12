'use client';

import { useState } from 'react';
import { AdvisorForm } from '@/components/ai/advisor-form';
import { AdvisorResults } from '@/components/ai/advisor-results';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

interface AdvisorData {
  experience: 'beginner' | 'intermediate' | 'expert';
  goal: 'yield' | 'potency' | 'flavor' | 'speed';
  growType: 'indoor' | 'outdoor' | 'greenhouse';
  medium: 'soil' | 'coco' | 'hydro';
}

interface AdvisorResult {
  strainRecommendations: Array<{
    name: string;
    genetics: string;
    thc: string;
    flowering: string;
    difficulty: string;
    reason: string;
  }>;
  setupAdvice: string[];
  timeline: Array<{
    week: number;
    phase: string;
    tasks: string[];
  }>;
  tips: string[];
}

export default function AdvisorPage() {
  const [results, setResults] = useState<AdvisorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: AdvisorData) => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await apiClient.post('/ai/advice', data);
      setResults(response);
    } catch (error) {
      console.error('Advisor request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block icon-emboss p-8 rounded-2xl mb-5">
            <span className="text-7xl">🎯</span>
          </div>
          <h1 className="text-6xl font-black text-cannabis mb-3">Grow Advisor</h1>
          <p className="text-2xl text-emerald-200 font-bold">
            Personalisierte Empfehlungen für deinen perfekten Grow
          </p>
        </div>

        {!results ? (
          <AdvisorForm onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <AdvisorResults results={results} onReset={() => setResults(null)} />
        )}

        {isLoading && (
          <div className="neo-deep rounded-2xl p-10 text-center">
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">Erstelle deinen Plan...</h3>
            <p className="text-lg text-emerald-200 font-medium">
              Die AI analysiert deine Angaben und erstellt personalisierte Empfehlungen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
