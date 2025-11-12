export interface CO2Input {
  tentWidth: number;
  tentDepth: number;
  tentHeight: number;
  targetPPM: number;
  currentPPM?: number;
  airExchangePerHour?: number;
}

export interface CO2Result {
  volumeM3: number;
  requiredCO2PerHour: number;
  requiredCO2PerDay: number;
  bottleSize: number;
  daysPerBottle: number;
  costPerDay: number;
  recommendation: string;
}

export class CO2Calculator {
  private readonly CO2_DENSITY = 1.98;
  private readonly COST_PER_KG = 2.5;
  
  calculate(input: CO2Input): CO2Result {
    const currentPPM = input.currentPPM || 400;
    const airExchange = input.airExchangePerHour || 1;
    
    const volumeM3 = input.tentWidth * input.tentDepth * input.tentHeight;
    
    const ppmDiff = input.targetPPM - currentPPM;
    
    const co2ToInject = (volumeM3 * ppmDiff) / 1000;
    
    const requiredCO2PerHour = co2ToInject * airExchange;
    
    const lightHours = 18;
    const requiredCO2PerDay = requiredCO2PerHour * lightHours;
    
    const bottleSize = 10;
    const bottleVolumeL = (bottleSize / this.CO2_DENSITY) * 1000;
    
    const daysPerBottle = bottleVolumeL / requiredCO2PerDay;
    
    const costPerDay = (requiredCO2PerDay / bottleVolumeL) * bottleSize * this.COST_PER_KG;
    
    let recommendation: string;
    if (input.targetPPM > 1500) {
      recommendation = 'CO2-Wert sehr hoch. Sinnvoll nur bei hoher Lichtintensität (>800 PPFD) und perfekten Bedingungen.';
    } else if (input.targetPPM >= 1200) {
      recommendation = 'CO2-Supplementierung lohnt sich bei optimalen Bedingungen. Ertragssteigerung von 20-30% möglich.';
    } else {
      recommendation = 'Ambient CO2 (400 PPM) ist ausreichend für normale Grows. Supplementierung optional.';
    }
    
    return {
      volumeM3: parseFloat(volumeM3.toFixed(2)),
      requiredCO2PerHour: parseFloat(requiredCO2PerHour.toFixed(2)),
      requiredCO2PerDay: parseFloat(requiredCO2PerDay.toFixed(2)),
      bottleSize,
      daysPerBottle: parseFloat(daysPerBottle.toFixed(1)),
      costPerDay: parseFloat(costPerDay.toFixed(2)),
      recommendation
    };
  }
}

export const co2Calculator = new CO2Calculator();
