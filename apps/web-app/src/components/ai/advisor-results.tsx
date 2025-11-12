'use client';

import { RefreshCw, Calendar } from 'lucide-react';

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

interface AdvisorResultsProps {
  results: AdvisorResult;
  onReset: () => void;
}

export function AdvisorResults({ results, onReset }: AdvisorResultsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="neo-deep rounded-2xl p-8 text-center">
        <h2 className="text-4xl font-black text-cannabis mb-3">Dein Grow-Plan</h2>
        <p className="text-xl text-emerald-200 font-bold">
          Personalisierte Empfehlungen basierend auf deinen Angaben
        </p>
      </div>

      {/* Strain Recommendations */}
      <div className="neo-deep rounded-2xl p-8">
        <h3 className="text-3xl font-black text-cannabis mb-6 flex items-center gap-3">
          <span className="text-4xl">🌿</span>
          Empfohlene Strains
        </h3>
        <div className="space-y-5">
          {results.strainRecommendations.map((strain, index) => (
            <div key={index} className="strain-card-3d rounded-xl p-6">
              <div className="flex items-start gap-5">
                <div className="icon-emboss w-16 h-16 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-black text-cannabis mb-2">{strain.name}</h4>
                  <p className="text-lg text-emerald-100 font-medium mb-4 leading-relaxed">
                    {strain.reason}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="badge-3d px-4 py-2 text-base text-white font-bold rounded-full">
                      {strain.genetics}
                    </span>
                    <span className="neo-deep px-4 py-2 text-emerald-300 font-bold rounded-lg text-base">
                      THC: {strain.thc}
                    </span>
                    <span className="neo-deep px-4 py-2 text-blue-300 font-bold rounded-lg text-base">
                      {strain.flowering}
                    </span>
                    <span className="neo-deep px-4 py-2 text-purple-300 font-bold rounded-lg text-base">
                      {strain.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Advice */}
      {results.setupAdvice.length > 0 && (
        <div className="neo-deep rounded-2xl p-8">
          <h3 className="text-3xl font-black text-cannabis mb-6 flex items-center gap-3">
            <span className="text-4xl">⚙️</span>
            Setup-Empfehlungen
          </h3>
          <div className="space-y-4">
            {results.setupAdvice.map((advice, index) => (
              <div key={index} className="strain-card-3d rounded-xl p-5 flex items-start gap-4">
                <span className="badge-3d w-10 h-10 flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-white text-lg font-medium flex-1 pt-2">{advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {results.timeline.length > 0 && (
        <div className="neo-deep rounded-2xl p-8">
          <h3 className="text-3xl font-black text-cannabis mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            Grow-Timeline
          </h3>
          <div className="space-y-5">
            {results.timeline.map((week, index) => (
              <div key={index} className="strain-card-3d rounded-xl p-6">
                <div className="flex items-start gap-5">
                  <div className="icon-emboss w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-black text-gray-900 flex-shrink-0">
                    W{week.week}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black text-cannabis mb-3">{week.phase}</h4>
                    <ul className="space-y-2">
                      {week.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-emerald-400 text-xl mt-1">✓</span>
                          <span className="text-white text-lg font-medium flex-1">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tips */}
      {results.tips.length > 0 && (
        <div className="neo-deep rounded-2xl p-8">
          <h3 className="text-3xl font-black text-cannabis mb-6 flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Pro-Tipps
          </h3>
          <div className="space-y-4">
            {results.tips.map((tip, index) => (
              <div
                key={index}
                className="strain-card-3d rounded-xl p-5 flex items-start gap-4"
              >
                <span className="text-2xl flex-shrink-0">💡</span>
                <p className="text-white text-lg font-medium flex-1">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex-1 bubble-soft px-10 py-6 rounded-xl font-black text-white text-xl flex items-center justify-center gap-3"
        >
          <RefreshCw className="w-6 h-6" />
          Neue Beratung
        </button>
      </div>
    </div>
  );
}
