export interface VPDInput {
  temperature: number;
  humidity: number;
  leafOffset?: number;
}

export interface VPDResult {
  vpd: number;
  status: 'low' | 'optimal' | 'high';
  recommendation: string;
  ranges: {
    seedling: { min: number; max: number };
    vegetative: { min: number; max: number };
    flowering: { min: number; max: number };
  };
}

export class VPDCalculator {
  calculate(input: VPDInput): VPDResult {
    const leafOffset = input.leafOffset || -2;
    const leafTemp = input.temperature + leafOffset;
    
    const airSVP = this.calculateSVP(input.temperature);
    const leafSVP = this.calculateSVP(leafTemp);
    
    const avp = airSVP * (input.humidity / 100);
    
    const vpd = parseFloat((leafSVP - avp).toFixed(2));
    
    const ranges = {
      seedling: { min: 0.4, max: 0.8 },
      vegetative: { min: 0.8, max: 1.2 },
      flowering: { min: 1.0, max: 1.5 }
    };
    
    let status: 'low' | 'optimal' | 'high';
    let recommendation: string;
    
    if (vpd < 0.4) {
      status = 'low';
      recommendation = 'VPD zu niedrig. Erhöhe Temperatur oder senke Luftfeuchtigkeit. Risiko: Schimmel, Pilze.';
    } else if (vpd >= 0.4 && vpd <= 1.5) {
      status = 'optimal';
      recommendation = 'VPD im optimalen Bereich. Perfekte Bedingungen für Transpiration und Nährstoffaufnahme.';
    } else {
      status = 'high';
      recommendation = 'VPD zu hoch. Senke Temperatur oder erhöhe Luftfeuchtigkeit. Risiko: Stress, Nährstoffmangel.';
    }
    
    return {
      vpd,
      status,
      recommendation,
      ranges
    };
  }
  
  private calculateSVP(temperature: number): number {
    return 0.61078 * Math.exp((17.27 * temperature) / (temperature + 237.3));
  }
  
  calculateOptimalHumidity(temperature: number, targetVPD: number): number {
    const leafTemp = temperature - 2;
    const airSVP = this.calculateSVP(temperature);
    const leafSVP = this.calculateSVP(leafTemp);
    
    const optimalRH = ((leafSVP - targetVPD) / airSVP) * 100;
    
    return parseFloat(Math.max(0, Math.min(100, optimalRH)).toFixed(1));
  }
  
  generateVPDChart(tempRange: [number, number], humidityRange: [number, number]): any[] {
    const chart: any[] = [];
    
    for (let temp = tempRange[0]; temp <= tempRange[1]; temp += 2) {
      for (let rh = humidityRange[0]; rh <= humidityRange[1]; rh += 5) {
        const result = this.calculate({ temperature: temp, humidity: rh });
        chart.push({
          temperature: temp,
          humidity: rh,
          vpd: result.vpd,
          status: result.status
        });
      }
    }
    
    return chart;
  }
}

export const vpdCalculator = new VPDCalculator();
