export interface ECPPMInput {
  value: number;
  unit: 'ec' | 'ppm500' | 'ppm700';
}

export interface ECPPMResult {
  ec: number;
  ppm500: number;
  ppm700: number;
  recommendation: {
    seedling: string;
    vegetative: string;
    flowering: string;
  };
}

export class ECPPMCalculator {
  convert(input: ECPPMInput): ECPPMResult {
    let ec: number;
    
    switch (input.unit) {
      case 'ec':
        ec = input.value;
        break;
      case 'ppm500':
        ec = input.value / 500;
        break;
      case 'ppm700':
        ec = input.value / 700;
        break;
    }
    
    const ppm500 = Math.round(ec * 500);
    const ppm700 = Math.round(ec * 700);
    
    const recommendation = {
      seedling: this.getRecommendation('seedling'),
      vegetative: this.getRecommendation('vegetative'),
      flowering: this.getRecommendation('flowering')
    };
    
    return {
      ec: parseFloat(ec.toFixed(2)),
      ppm500,
      ppm700,
      recommendation
    };
  }
  
  private getRecommendation(stage: string): string {
    const ranges: Record<string, { min: number; max: number }> = {
      seedling: { min: 0.4, max: 0.8 },
      vegetative: { min: 0.8, max: 1.6 },
      flowering: { min: 1.2, max: 2.0 }
    };
    
    const range = ranges[stage];
    return `EC ${range.min}-${range.max} mS/cm (${range.min * 500}-${range.max * 500} PPM)`;
  }
  
  calculateDosage(data: {
    currentEC: number;
    targetEC: number;
    waterVolume: number;
    nutrientStrength: number;
  }): { mlPerLiter: number; totalML: number } {
    const ecDifference = data.targetEC - data.currentEC;
    const mlPerLiter = ecDifference / data.nutrientStrength;
    const totalML = mlPerLiter * data.waterVolume;
    
    return {
      mlPerLiter: parseFloat(mlPerLiter.toFixed(2)),
      totalML: parseFloat(totalML.toFixed(1))
    };
  }
}

export const ecPPMCalculator = new ECPPMCalculator();
