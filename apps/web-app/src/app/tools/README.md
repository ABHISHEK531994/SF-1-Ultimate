# 🧮 CANNABIS-RECHNER - IMPLEMENTATION GUIDE

**Status:** VPD fertig, 5 weitere folgen gleichem Muster

---

## ✅ FERTIGE TOOLS

### 1. VPD Calculator
**Datei:** `src/app/tools/vpd/page.tsx`
**Status:** ✅ Komplett

---

## 📋 TODO: 5 WEITERE TOOLS

Alle folgen dem **gleichen Muster** wie VPD!

### 2. EC Calculator (`/tools/ec`)
**Formel:**
```typescript
// EC = (PPM / 500) oder (PPM / 700) je nach Scale
// TDS = EC * 500 (0.5 scale) oder EC * 700 (0.7 scale)
```

**Fields:**
- EC-Wert (mS/cm)
- PPM-Scale (500 oder 700)

**Optimale Werte:**
- Setzlinge: 0.8 - 1.3 mS/cm
- Vegetativ: 1.5 - 2.5 mS/cm
- Blüte: 2.0 - 3.0 mS/cm

---

### 3. DLI Calculator (`/tools/dli`)
**Formel:**
```typescript
// DLI = (PPFD × Photoperiode × 0.0036)
// PPFD in µmol/m²/s, Photoperiode in Stunden
```

**Fields:**
- PPFD (µmol/m²/s)
- Photoperiode (Stunden)

**Optimale Werte:**
- Setzlinge: 15-25 mol/m²/day
- Vegetativ: 25-40 mol/m²/day
- Blüte: 35-50 mol/m²/day

---

### 4. PPFD Calculator (`/tools/ppfd`)
**Formel:**
```typescript
// PPFD = (Watt × Effizienz × Coverage) / Fläche
// Effizienz: LED ~2.5 µmol/J, HPS ~1.7 µmol/J
```

**Fields:**
- Lampen-Watt (W)
- Lampen-Typ (LED/HPS)
- Grow-Fläche (m²)
- Abstand zur Pflanze (cm)

**Optimale Werte:**
- Vegetativ: 300-600 µmol/m²/s
- Blüte: 600-1000 µmol/m²/s

---

### 5. Power Calculator (`/tools/power`)
**Formel:**
```typescript
// Verbrauch (kWh) = Watt × Stunden × Tage / 1000
// Kosten = kWh × Strompreis
```

**Fields:**
- Lampen-Watt (W)
- Lampen-Stunden/Tag (h)
- Zusätzliche Geräte (W)
- Strompreis (€/kWh)
- Laufzeit (Tage)

**Ausgabe:**
- kWh pro Tag/Monat
- Kosten pro Tag/Monat
- Gesamt-Kosten

---

### 6. CO₂ Calculator (`/tools/co2`)
**Formel:**
```typescript
// CO₂ (kg/h) = (Raumvolumen × Ziel-PPM × Luftwechsel) / 1000000
// Raumvolumen = Länge × Breite × Höhe
```

**Fields:**
- Raum-Länge (m)
- Raum-Breite (m)
- Raum-Höhe (m)
- Ziel-PPM (Standard: 1200-1500)
- Luftwechsel/Stunde

**Optimale Werte:**
- Ambient: 400 ppm
- Vegetativ: 800-1200 ppm
- Blüte: 1200-1500 ppm

---

## 🔧 IMPLEMENTATION

### Schritt 1: Ordner erstellen
```powershell
mkdir src/app/tools/[tool-name]
```

### Schritt 2: Page erstellen
```tsx
// src/app/tools/ec/page.tsx
import { Calculator } from '@/components/tools/calculator';
import { Zap } from 'lucide-react';

export default function ECCalculatorPage() {
  return (
    <Calculator
      title="EC Calculator"
      description="Electrical Conductivity - Nährstoffkonzentration"
      icon={<Zap className="w-16 h-16 text-white" />}
      gradient="from-yellow-500 to-orange-500"
      fields={[
        {
          name: 'ppm',
          label: 'PPM-Wert',
          type: 'number',
          unit: 'ppm',
          defaultValue: 1000,
          step: 50,
        },
        {
          name: 'scale',
          label: 'PPM-Scale',
          type: 'select',
          defaultValue: '500',
          options: [
            { value: '500', label: '0.5 Scale (EU)' },
            { value: '700', label: '0.7 Scale (US)' },
          ],
        },
      ]}
      calculate={(values) => {
        const ppm = values.ppm as number;
        const scale = Number(values.scale);
        return ppm / scale;
      }}
      resultUnit="mS/cm"
      resultLabel="EC-Wert"
      getStatus={(result) => {
        const ec = result as number;
        if (ec < 0.8) return { text: 'Zu niedrig', color: 'text-blue-400', desc: 'Erhöhe Nährstoffe' };
        if (ec < 1.5) return { text: 'Setzlinge', color: 'text-green-400', desc: 'Perfekt für Setzlinge' };
        if (ec < 2.5) return { text: 'Vegetativ', color: 'text-emerald-400', desc: 'Gut für Wachstum' };
        if (ec < 3.0) return { text: 'Blüte', color: 'text-yellow-400', desc: 'Optimal für Blüte' };
        return { text: 'Zu hoch', color: 'text-red-400', desc: 'Risiko: Nährstoff-Burn' };
      }}
      info={{
        title: 'Was ist EC?',
        content: (
          <div className="space-y-4">
            <p>
              EC (Electrical Conductivity) misst die elektrische Leitfähigkeit deiner Nährlösung 
              und gibt an, wie viele Nährstoffe in der Lösung sind.
            </p>
            <div className="strain-card-3d rounded-xl p-6">
              <h4 className="font-black text-white text-xl mb-3">Optimale Werte:</h4>
              <ul className="space-y-2">
                <li>• <strong>Setzlinge:</strong> 0.8 - 1.3 mS/cm</li>
                <li>• <strong>Vegetativ:</strong> 1.5 - 2.5 mS/cm</li>
                <li>• <strong>Blüte:</strong> 2.0 - 3.0 mS/cm</li>
              </ul>
            </div>
          </div>
        ),
      }}
    />
  );
}
```

---

## 🎯 QUICK IMPLEMENTATION

**Zeit pro Tool:** ~10 Minuten
**Total für 5 Tools:** ~50 Minuten

**Reihenfolge:**
1. EC Calculator (am wichtigsten)
2. DLI Calculator
3. PPFD Calculator
4. Power Calculator
5. CO₂ Calculator

---

## 📝 NOTES

- Alle Tools verwenden die **Calculator-Komponente**
- Formeln sind in der `calculate` Function
- Status-Funktion ist optional
- Info-Content kann HTML/JSX sein
- Icons von `lucide-react`

---

**Erstellt:** 01.11.2025
**Status:** VPD ✅ | EC-CO₂ TODO
