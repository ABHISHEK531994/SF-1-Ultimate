'use client';

import { useState } from 'react';
import { Calculator, Droplets, Sun, Zap, Plug, Wind } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'vpd',
    name: 'VPD Calculator',
    description: 'Vapor Pressure Deficit - Optimale Luftfeuchtigkeit berechnen',
    icon: Droplets,
    color: 'from-blue-500 to-cyan-500',
    href: '/tools/vpd',
  },
  {
    id: 'ec',
    name: 'EC Calculator',
    description: 'Electrical Conductivity - Nährstoffkonzentration berechnen',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    href: '/tools/ec',
  },
  {
    id: 'dli',
    name: 'DLI Calculator',
    description: 'Daily Light Integral - Tägliche Lichtmenge berechnen',
    icon: Sun,
    color: 'from-orange-500 to-red-500',
    href: '/tools/dli',
  },
  {
    id: 'ppfd',
    name: 'PPFD Calculator',
    description: 'Photosynthetic Photon Flux Density - Lichtintensität berechnen',
    icon: Sun,
    color: 'from-purple-500 to-pink-500',
    href: '/tools/ppfd',
  },
  {
    id: 'power',
    name: 'Power Calculator',
    description: 'Stromverbrauch und Kosten berechnen',
    icon: Plug,
    color: 'from-green-500 to-emerald-500',
    href: '/tools/power',
  },
  {
    id: 'co2',
    name: 'CO₂ Calculator',
    description: 'CO₂-Bedarf für optimales Wachstum berechnen',
    icon: Wind,
    color: 'from-teal-500 to-cyan-500',
    href: '/tools/co2',
  },
];

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block icon-emboss p-8 rounded-2xl mb-5">
            <Calculator className="w-16 h-16 text-gray-900" />
          </div>
          <h1 className="text-6xl font-black text-cannabis mb-3">Cannabis-Rechner</h1>
          <p className="text-2xl text-emerald-200 font-bold">
            Wissenschaftliche Tools für deinen perfekten Grow
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href}>
                <div className="neo-deep rounded-2xl p-8 hover:scale-105 transition cursor-pointer h-full">
                  <div className={`icon-emboss w-16 h-16 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${tool.color}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-cannabis mb-3">{tool.name}</h3>
                  <p className="text-lg text-emerald-100 font-medium leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-12 neo-deep rounded-2xl p-8">
          <h3 className="text-2xl font-black text-cannabis mb-4 flex items-center gap-3">
            <span className="text-3xl">💡</span>
            Über diese Tools
          </h3>
          <div className="text-lg text-emerald-100 font-medium space-y-3 leading-relaxed">
            <p>
              Diese wissenschaftlichen Rechner helfen dir, optimale Wachstumsbedingungen zu schaffen.
              Alle Formeln basieren auf wissenschaftlichen Standards und jahrelanger Praxis.
            </p>
            <p>
              <strong className="text-cannabis">Wichtig:</strong> Die Ergebnisse sind Richtwerte. 
              Jede Strain und jedes Setup ist unterschiedlich. Beobachte deine Pflanzen und passe 
              die Werte an ihre Bedürfnisse an.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
