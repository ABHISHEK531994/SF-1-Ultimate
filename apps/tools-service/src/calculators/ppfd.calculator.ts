export interface PPFDInput {
  lightType: 'led' | 'hps' | 'mh' | 'cfl' | 'cmh';
  wattage: number;
  distance: number;
  coverage?: number;
}

export interface PPFDResult {
  ppfd: number;
  ppfdRange: { min: number; max: number };
  recommendation: string;
  optimalDistance: number;
}

export class PPFDCalculator {
  private readonly efficiency: Record<string, number> = {
    led: 2.5,
    hps: 1.7,
    mh: 1.3,
    cmh: 1.6,
    cfl: 0.9
  };
  
  calculate(input: PPFDInput): PPFDResult {
    const efficiency = this.efficiency[input.lightType] || 2.0;
    
    const ppf = input.wattage * efficiency;
    
    const distanceFactor = this.calculateDistanceFactor(input.distance);
    
    const coverage = input.coverage || this.estimateCoverage(input.wattage, input.lightType);
    
    const ppfd = Math.round((ppf * distanceFactor) / coverage);
    
    const ppfdRange = {
      min: Math.round(ppfd * 0.85),
      max: Math.round(ppfd * 1.15)
    };
    
    let recommendation: string;
    if (ppfd < 400) {
      recommendation = 'PPFD zu niedrig für optimales Wachstum. Lampe näher positionieren oder stärkere Lampe verwenden.';
    } else if (ppfd >= 400 && ppfd <= 1000) {
      recommendation = 'PPFD im optimalen Bereich. Perfekt für gesundes Wachstum.';
    } else {
      recommendation = 'PPFD sehr hoch. Achte auf Lichtstress. Lampe höher hängen oder dimmen.';
    }
    
    const optimalDistance = this.calculateOptimalDistance(
      ppf,
      700,
      coverage
    );
    
    return {
      ppfd,
      ppfdRange,
      recommendation,
      optimalDistance: Math.round(optimalDistance)
    };
  }
  
  private calculateDistanceFactor(distance: number): number {
    const referenceDist = 30;
    const factor = Math.pow(referenceDist / distance, 1.5);
    return Math.min(1.2, Math.max(0.3, factor));
  }
  
  private estimateCoverage(wattage: number, lightType: string): number {
    const coveragePerWatt: Record<string, number> = {
      led: 0.01,
      hps: 0.007,
      mh: 0.006,
      cmh: 0.008,
      cfl: 0.005
    };
    
    const rate = coveragePerWatt[lightType] || 0.01;
    return parseFloat((wattage * rate).toFixed(2));
  }
  
  private calculateOptimalDistance(
    ppf: number,
    targetPPFD: number,
    coverage: number
  ): number {
    const baseDist = 30;
    const currentPPFD = (ppf * 1.0) / coverage;
    const ratio = currentPPFD / targetPPFD;
    
    return baseDist * Math.sqrt(ratio);
  }
  
  compareLights(lights: PPFDInput[]): Array<PPFDResult & { lightType: string }> {
    return lights.map(light => ({
      ...this.calculate(light),
      lightType: light.lightType
    }));
  }
}

export const ppfdCalculator = new PPFDCalculator();
