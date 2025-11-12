'use client';

import { AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosisResult {
  problem: string;
  confidence: number;
  description: string;
  causes: string[];
  solutions: string[];
  severity: 'low' | 'medium' | 'high';
}

interface DiagnosisResultsProps {
  results: DiagnosisResult[];
  onReset: () => void;
}

export function DiagnosisResults({ results, onReset }: DiagnosisResultsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-8 h-8" />;
      case 'medium':
        return <Info className="w-8 h-8" />;
      case 'low':
        return <CheckCircle className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neo-deep rounded-2xl p-8 text-center">
        <h2 className="text-4xl font-black text-cannabis mb-3">Diagnose-Ergebnis</h2>
        <p className="text-xl text-emerald-200 font-bold">
          {results.length} {results.length === 1 ? 'Problem' : 'Probleme'} erkannt
        </p>
      </div>

      {/* Results */}
      {results.map((result, index) => (
        <div key={index} className="neo-deep rounded-2xl p-8 space-y-6">
          {/* Problem Header */}
          <div className="flex items-start gap-6">
            <div className={cn('icon-emboss p-6 rounded-xl', getSeverityColor(result.severity))}>
              {getSeverityIcon(result.severity)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-3xl font-black text-cannabis">{result.problem}</h3>
                <span className="badge-3d px-4 py-1 text-base text-white font-bold rounded-full">
                  {Math.round(result.confidence * 100)}% sicher
                </span>
              </div>
              <p className="text-xl text-emerald-100 font-medium leading-relaxed">
                {result.description}
              </p>
            </div>
          </div>

          {/* Causes */}
          {result.causes.length > 0 && (
            <div className="strain-card-3d rounded-xl p-6">
              <h4 className="font-black text-white text-2xl mb-4 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Mögliche Ursachen
              </h4>
              <ul className="space-y-3">
                {result.causes.map((cause, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-400 text-xl mt-1">•</span>
                    <span className="text-white text-lg font-medium flex-1">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Solutions */}
          {result.solutions.length > 0 && (
            <div className="strain-card-3d rounded-xl p-6">
              <h4 className="font-black text-white text-2xl mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Lösungen
              </h4>
              <ol className="space-y-4">
                {result.solutions.map((solution, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="badge-3d w-8 h-8 flex items-center justify-center font-black text-white flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-white text-lg font-medium flex-1 pt-1">{solution}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex-1 bubble-soft px-10 py-6 rounded-xl font-black text-white text-xl flex items-center justify-center gap-3"
        >
          <RefreshCw className="w-6 h-6" />
          Neue Diagnose
        </button>
      </div>
    </div>
  );
}
