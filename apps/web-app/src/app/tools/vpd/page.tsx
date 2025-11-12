'use client';

import { useState } from 'react';
import { Droplets, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VPDCalculatorPage() {
  const [temp, setTemp] = useState<number>(24);
  const [humidity, setHumidity] = useState<number>(60);
  const [leafOffset, setLeafOffset] = useState<number>(2);
  const [result, setResult] = useState<number | null>(null);

  const calculateVPD = () => {
    // VPD Formula
    const leafTemp = temp - leafOffset;
    const svpAir = 0.61078 * Math.exp((17.27 * temp) / (temp + 237.3));
    const svpLeaf = 0.61078 * Math.exp((17.27 * leafTemp) / (leafTemp + 237.3));
    const vpd = svpLeaf - (humidity / 100) * svpAir;
    setResult(vpd);
  };

  const getVPDStatus = (vpd: number) => {
    if (vpd < 0.4) return { text: 'Zu niedrig', color: 'text-blue-400', desc: 'Erhöhe Temperatur oder senke Luftfeuchtigkeit' };
    if (vpd < 0.8) return { text: 'Vegetativ optimal', color: 'text-green-400', desc: 'Perfekt für Wachstumsphase' };
    if (vpd < 1.2) return { text: 'Blüte optimal', color: 'text-emerald-400', desc: 'Perfekt für Blütephase' };
    if (vpd < 1.6) return { text: 'Erhöht', color: 'text-yellow-400', desc: 'Noch ok, aber an der oberen Grenze' };
    return { text: 'Zu hoch', color: 'text-red-400', desc: 'Senke Temperatur oder erhöhe Luftfeuchtigkeit' };
  };

  const status = result !== null ? getVPDStatus(result) : null;

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
          <div className="inline-block icon-emboss p-8 rounded-2xl mb-5 bg-gradient-to-br from-blue-500 to-cyan-500">
            <Droplets className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-6xl font-black text-cannabis mb-3">VPD Calculator</h1>
          <p className="text-2xl text-emerald-200 font-bold">
            Vapor Pressure Deficit - Optimale Luftfeuchtigkeit
          </p>
        </div>

        {/* Calculator */}
        <div className="neo-deep rounded-2xl p-8 mb-6">
          <div className="space-y-6">
            {/* Temperature */}
            <div>
              <label className="block text-xl text-emerald-300 mb-3 font-bold">
                Lufttemperatur (°C)
              </label>
              <input
                type="number"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full input-inset rounded-xl px-6 py-4 text-white text-xl font-medium focus:outline-none"
                step="0.1"
              />
            </div>

            {/* Humidity */}
            <div>
              <label className="block text-xl text-emerald-300 mb-3 font-bold">
                Relative Luftfeuchtigkeit (%)
              </label>
              <input
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full input-inset rounded-xl px-6 py-4 text-white text-xl font-medium focus:outline-none"
                step="1"
                min="0"
                max="100"
              />
            </div>

            {/* Leaf Offset */}
            <div>
              <label className="block text-xl text-emerald-300 mb-3 font-bold">
                Blatt-Temperatur-Offset (°C)
              </label>
              <input
                type="number"
                value={leafOffset}
                onChange={(e) => setLeafOffset(Number(e.target.value))}
                className="w-full input-inset rounded-xl px-6 py-4 text-white text-xl font-medium focus:outline-none"
                step="0.5"
              />
              <p className="text-sm text-white/60 mt-2 font-medium">
                Standard: 2°C (Blätter sind meist kühler als Luft)
              </p>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateVPD}
              className="w-full bubble-soft px-10 py-6 rounded-xl font-black text-white text-2xl"
            >
              Berechnen
            </button>
          </div>
        </div>

        {/* Result */}
        {result !== null && status && (
          <div className="neo-deep rounded-2xl p-8 mb-6">
            <h3 className="text-3xl font-black text-cannabis mb-6">Ergebnis</h3>
            <div className="strain-card-3d rounded-xl p-8 text-center">
              <div className="text-7xl font-black text-cannabis mb-4">
                {result.toFixed(2)} kPa
              </div>
              <div className={`text-3xl font-black ${status.color} mb-3`}>
                {status.text}
              </div>
              <p className="text-xl text-emerald-100 font-medium">
                {status.desc}
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="neo-deep rounded-2xl p-8">
          <h3 className="text-2xl font-black text-cannabis mb-4 flex items-center gap-3">
            <Info className="w-7 h-7" />
            Was ist VPD?
          </h3>
          <div className="text-lg text-emerald-100 font-medium space-y-4 leading-relaxed">
            <p>
              VPD (Vapor Pressure Deficit) misst den Unterschied zwischen der Feuchtigkeit in der Luft 
              und der Feuchtigkeit, die die Luft maximal aufnehmen kann. Es ist ein wichtiger Indikator 
              für die Transpiration deiner Pflanzen.
            </p>
            <div className="strain-card-3d rounded-xl p-6">
              <h4 className="font-black text-white text-xl mb-3">Optimale Werte:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">•</span>
                  <span><strong className="text-cannabis">Setzlinge:</strong> 0.4 - 0.8 kPa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">•</span>
                  <span><strong className="text-cannabis">Vegetativ:</strong> 0.8 - 1.2 kPa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">•</span>
                  <span><strong className="text-cannabis">Blüte:</strong> 1.0 - 1.5 kPa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
