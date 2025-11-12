'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdvisorFormProps {
  onSubmit: (data: AdvisorData) => void;
  isLoading: boolean;
}

interface AdvisorData {
  experience: 'beginner' | 'intermediate' | 'expert';
  goal: 'yield' | 'potency' | 'flavor' | 'speed';
  growType: 'indoor' | 'outdoor' | 'greenhouse';
  medium: 'soil' | 'coco' | 'hydro';
}

export function AdvisorForm({ onSubmit, isLoading }: AdvisorFormProps) {
  const [formData, setFormData] = useState<Partial<AdvisorData>>({});

  const handleSubmit = () => {
    if (!formData.experience || !formData.goal || !formData.growType || !formData.medium) {
      return;
    }
    onSubmit(formData as AdvisorData);
  };

  const isComplete =
    formData.experience && formData.goal && formData.growType && formData.medium;

  return (
    <div className="space-y-8">
      {/* Step 1: Experience */}
      <div className="neo-deep rounded-2xl p-8">
        <label className="block text-cannabis font-black mb-5 text-3xl">
          <span className="text-3xl mr-2">1️⃣</span>
          Deine Erfahrung
        </label>
        <div className="grid grid-cols-3 gap-5">
          {[
            { value: 'beginner', emoji: '🌱', label: 'Anfänger' },
            { value: 'intermediate', emoji: '🌿', label: 'Fortgeschritten' },
            { value: 'expert', emoji: '🏆', label: 'Profi' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFormData({ ...formData, experience: option.value as any })}
              disabled={isLoading}
              className={cn(
                'px-8 py-5 rounded-xl text-white font-bold text-xl hover:scale-105 transition',
                formData.experience === option.value ? 'bubble-soft' : 'tab-btn-3d'
              )}
            >
              <div className="text-3xl mb-2">{option.emoji}</div>
              <div className="text-xl">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Goal */}
      <div className="neo-deep rounded-2xl p-8">
        <label className="block text-cannabis font-black mb-5 text-3xl">
          <span className="text-3xl mr-2">2️⃣</span>
          Dein Ziel
        </label>
        <div className="grid grid-cols-2 gap-5">
          {[
            { value: 'yield', emoji: '💪', label: 'Max. Ertrag', desc: 'Große Ernte erzielen' },
            { value: 'potency', emoji: '⚡', label: 'Max. Potenz', desc: 'Hoher THC-Gehalt' },
            { value: 'flavor', emoji: '🎨', label: 'Geschmack', desc: 'Terpen-reiche Buds' },
            { value: 'speed', emoji: '⏱️', label: 'Schnell', desc: 'Kurze Blütephase' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFormData({ ...formData, goal: option.value as any })}
              disabled={isLoading}
              className={cn(
                'px-8 py-6 rounded-xl text-white font-bold hover:scale-105 transition text-left',
                formData.goal === option.value ? 'bubble-soft' : 'tab-btn-3d'
              )}
            >
              <div className="text-4xl mb-3">{option.emoji}</div>
              <div className="font-black text-2xl mb-2">{option.label}</div>
              <div className="text-lg text-white/70 font-medium">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Setup */}
      <div className="neo-deep rounded-2xl p-8">
        <label className="block text-cannabis font-black mb-5 text-3xl">
          <span className="text-3xl mr-2">3️⃣</span>
          Dein Setup
        </label>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xl text-emerald-300 mb-3 block font-bold">Grow-Typ</label>
            <select
              value={formData.growType || ''}
              onChange={(e) =>
                setFormData({ ...formData, growType: e.target.value as any })
              }
              disabled={isLoading}
              className="w-full input-inset rounded-xl px-6 py-5 text-white text-xl font-medium focus:outline-none cursor-pointer"
            >
              <option value="">Wähle...</option>
              <option value="indoor">🏠 Indoor</option>
              <option value="outdoor">🌞 Outdoor</option>
              <option value="greenhouse">🏡 Greenhouse</option>
            </select>
          </div>
          <div>
            <label className="text-xl text-emerald-300 mb-3 block font-bold">Medium</label>
            <select
              value={formData.medium || ''}
              onChange={(e) => setFormData({ ...formData, medium: e.target.value as any })}
              disabled={isLoading}
              className="w-full input-inset rounded-xl px-6 py-5 text-white text-xl font-medium focus:outline-none cursor-pointer"
            >
              <option value="">Wähle...</option>
              <option value="soil">🌱 Erde</option>
              <option value="coco">🥥 Coco</option>
              <option value="hydro">💧 Hydro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isComplete || isLoading}
        className={cn(
          'w-full px-10 py-6 rounded-xl font-black text-white text-2xl transition',
          isComplete && !isLoading ? 'bubble-soft' : 'opacity-50 cursor-not-allowed neo-deep'
        )}
      >
        🎯 Empfehlungen erhalten
      </button>
    </div>
  );
}
