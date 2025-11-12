export interface DLIInput {
  ppfd: number;
  hoursPerDay: number;
}

export interface DLIResult {
  dli: number;
  status: 'low' | 'optimal' | 'high';
  recommendation: string;
  ranges: {
    seedling: { min: number; max: number };
    vegetative: { min: number; max: number };
    flowering: { min: number; max: number };
  };
}

export class DLICalculator {
  calculate(input: DLIInput): DLIResult {
    const dli = parseFloat(
      ((input.ppfd * input.hoursPerDay * 3600) / 1000000).toFixed(1)
    );
    
    const ranges = {
      seedling: { min: 10, max: 25 },
      vegetative: { min: 25, max: 45 },
      flowering: { min: 35, max: 65 }
    };
    
    let status: 'low' | 'optimal' | 'high';
    let recommendation: string;
    
    if (dli < 20) {
      status = 'low';
      recommendation = 'DLI zu niedrig. Pflanzen wachsen langsam. Erhöhe Lichtintensität oder Beleuchtungsdauer.';
    } else if (dli >= 20 && dli <= 65) {
      status = 'optimal';
      recommendation = 'DLI im optimalen Bereich. Pflanzen erhalten ausreichend Licht für gesundes Wachstum.';
    } else {
      status = 'high';
      recommendation = 'DLI zu hoch. Risiko von Lichtstress und Bleaching. Reduziere Intensität oder Dauer.';
    }
    
    return {
      dli,
      status,
      recommendation,
      ranges
    };
  }
  
  calculateRequiredPPFD(targetDLI: number, hoursPerDay: number): number {
    const ppfd = (targetDLI * 1000000) / (hoursPerDay * 3600);
    return Math.round(ppfd);
  }
  
  calculateOptimalHours(currentPPFD: number, targetDLI: number): number {
    const hours = (targetDLI * 1000000) / (currentPPFD * 3600);
    return parseFloat(Math.min(24, Math.max(12, hours)).toFixed(1));
  }
}

export const dliCalculator = new DLICalculator();
