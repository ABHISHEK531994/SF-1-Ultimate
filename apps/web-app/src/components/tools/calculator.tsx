'use client';

import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CalculatorField {
  name: string;
  label: string;
  type: 'number' | 'select';
  unit?: string;
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  help?: string;
}

interface CalculatorProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  fields: CalculatorField[];
  calculate: (values: Record<string, number | string>) => number | string;
  resultUnit: string;
  resultLabel: string;
  getStatus?: (result: number | string) => {
    text: string;
    color: string;
    desc: string;
  };
  info: {
    title: string;
    content: React.ReactNode;
  };
}

export function Calculator({
  title,
  description,
  icon,
  gradient,
  fields,
  calculate,
  resultUnit,
  resultLabel,
  getStatus,
  info,
}: CalculatorProps) {
  const [values, setValues] = useState<Record<string, number | string>>(() => {
    const initial: Record<string, number | string> = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue;
    });
    return initial;
  });
  const [result, setResult] = useState<number | string | null>(null);

  const handleCalculate = () => {
    const calculated = calculate(values);
    setResult(calculated);
  };

  const status = result !== null && getStatus ? getStatus(result as any) : null;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/tools">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu Tools
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-block icon-emboss p-8 rounded-2xl mb-5 bg-gradient-to-br ${gradient}`}>
            {icon}
          </div>
          <h1 className="text-6xl font-black text-cannabis mb-3">{title}</h1>
          <p className="text-2xl text-emerald-200 font-bold">{description}</p>
        </div>

        {/* Calculator */}
        <div className="neo-deep rounded-2xl p-8 mb-6">
          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-xl text-emerald-300 mb-3 font-bold">
                  {field.label} {field.unit && `(${field.unit})`}
                </label>
                {field.type === 'number' ? (
                  <input
                    type="number"
                    value={values[field.name]}
                    onChange={(e) =>
                      setValues({ ...values, [field.name]: Number(e.target.value) })
                    }
                    className="w-full input-inset rounded-xl px-6 py-4 text-white text-xl font-medium focus:outline-none"
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                  />
                ) : (
                  <select
                    value={values[field.name]}
                    onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                    className="w-full input-inset rounded-xl px-6 py-4 text-white text-xl font-medium focus:outline-none cursor-pointer"
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {field.help && (
                  <p className="text-sm text-white/60 mt-2 font-medium">{field.help}</p>
                )}
              </div>
            ))}

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full bubble-soft px-10 py-6 rounded-xl font-black text-white text-2xl"
            >
              Berechnen
            </button>
          </div>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="neo-deep rounded-2xl p-8 mb-6">
            <h3 className="text-3xl font-black text-cannabis mb-6">Ergebnis</h3>
            <div className="strain-card-3d rounded-xl p-8 text-center">
              <div className="text-7xl font-black text-cannabis mb-4">
                {typeof result === 'number' ? result.toFixed(2) : result} {resultUnit}
              </div>
              <div className="text-2xl font-black text-emerald-300 mb-2">
                {resultLabel}
              </div>
              {status && (
                <>
                  <div className={`text-3xl font-black ${status.color} mb-3 mt-6`}>
                    {status.text}
                  </div>
                  <p className="text-xl text-emerald-100 font-medium">{status.desc}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="neo-deep rounded-2xl p-8">
          <h3 className="text-2xl font-black text-cannabis mb-4 flex items-center gap-3">
            <Info className="w-7 h-7" />
            {info.title}
          </h3>
          <div className="text-lg text-emerald-100 font-medium leading-relaxed">
            {info.content}
          </div>
        </div>
      </div>
    </div>
  );
}
