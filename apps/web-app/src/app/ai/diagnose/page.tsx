'use client';

import { useState } from 'react';
import { DiagnosisForm } from '@/components/ai/diagnosis-form';
import { DiagnosisResults } from '@/components/ai/diagnosis-results';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

interface DiagnosisResult {
  problem: string;
  confidence: number;
  description: string;
  causes: string[];
  solutions: string[];
  severity: 'low' | 'medium' | 'high';
}

export default function DiagnosePage() {
  const [results, setResults] = useState<DiagnosisResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDiagnose = async (data: { images?: File[]; description?: string }) => {
    setIsLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      
      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      if (data.description) {
        formData.append('description', data.description);
      }

      const response = await apiClient.post('/ai/diagnose', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResults(response.diagnoses);
    } catch (error) {
      console.error('Diagnosis failed:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDiagnose = async (description: string) => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await apiClient.post('/ai/diagnose/quick', {
        description,
      });

      setResults(response.diagnoses);
    } catch (error) {
      console.error('Quick diagnosis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block icon-emboss p-8 rounded-2xl mb-5">
            <span className="text-7xl">🔬</span>
          </div>
          <h1 className="text-6xl font-black text-cannabis mb-3">Plant Diagnosis</h1>
          <p className="text-2xl text-emerald-200 font-bold">
            KI-gestützte Pflanzenanalyse mit GPT-4 Vision
          </p>
        </div>

        {!results ? (
          <DiagnosisForm
            onDiagnose={handleDiagnose}
            onQuickDiagnose={handleQuickDiagnose}
            isLoading={isLoading}
          />
        ) : (
          <DiagnosisResults results={results} onReset={() => setResults(null)} />
        )}

        {isLoading && (
          <div className="neo-deep rounded-2xl p-10 text-center">
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">Analysiere deine Pflanze...</h3>
            <p className="text-lg text-emerald-200 font-medium">
              Die AI untersucht die Bilder und erstellt eine Diagnose
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
