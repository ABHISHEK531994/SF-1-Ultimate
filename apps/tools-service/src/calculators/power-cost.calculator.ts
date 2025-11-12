export interface PowerCostInput {
  wattage: number;
  hoursPerDay: number;
  daysPerMonth?: number;
  electricityRate: number;
  additionalDevices?: Array<{
    name: string;
    wattage: number;
    hoursPerDay: number;
  }>;
}

export interface PowerCostResult {
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  dailyKWh: number;
  monthlyKWh: number;
  yearlyKWh: number;
  breakdown: Array<{
    device: string;
    dailyCost: number;
    monthlyCost: number;
    percentage: number;
  }>;
  co2Emissions: number;
}

export class PowerCostCalculator {
  calculate(input: PowerCostInput): PowerCostResult {
    const daysPerMonth = input.daysPerMonth || 30;
    
    const mainDevice = {
      name: 'Grow Light',
      wattage: input.wattage,
      hoursPerDay: input.hoursPerDay
    };
    
    const allDevices = [
      mainDevice,
      ...(input.additionalDevices || [])
    ];
    
    const breakdown = allDevices.map(device => {
      const dailyKWh = (device.wattage * device.hoursPerDay) / 1000;
      const dailyCost = dailyKWh * input.electricityRate;
      const monthlyCost = dailyCost * daysPerMonth;
      
      return {
        device: device.name,
        dailyCost: parseFloat(dailyCost.toFixed(2)),
        monthlyCost: parseFloat(monthlyCost.toFixed(2)),
        percentage: 0
      };
    });
    
    const dailyCost = breakdown.reduce((sum, d) => sum + d.dailyCost, 0);
    const monthlyCost = breakdown.reduce((sum, d) => sum + d.monthlyCost, 0);
    const yearlyCost = monthlyCost * 12;
    
    breakdown.forEach(item => {
      item.percentage = parseFloat(((item.monthlyCost / monthlyCost) * 100).toFixed(1));
    });
    
    const dailyKWh = dailyCost / input.electricityRate;
    const monthlyKWh = dailyKWh * daysPerMonth;
    const yearlyKWh = monthlyKWh * 12;
    
    const co2Emissions = Math.round(yearlyKWh * 0.47);
    
    return {
      dailyCost: parseFloat(dailyCost.toFixed(2)),
      monthlyCost: parseFloat(monthlyCost.toFixed(2)),
      yearlyCost: parseFloat(yearlyCost.toFixed(2)),
      dailyKWh: parseFloat(dailyKWh.toFixed(2)),
      monthlyKWh: parseFloat(monthlyKWh.toFixed(2)),
      yearlyKWh: parseFloat(yearlyKWh.toFixed(2)),
      breakdown,
      co2Emissions
    };
  }
  
  calculateROI(data: {
    powerCost: PowerCostResult;
    growDurationDays: number;
    expectedYield: number;
    sellPrice: number;
    seedCost: number;
    nutrientCost: number;
  }): {
    totalCost: number;
    revenue: number;
    profit: number;
    roi: number;
    costPerGram: number;
  } {
    const powerCostTotal = data.powerCost.dailyCost * data.growDurationDays;
    const totalCost = powerCostTotal + data.seedCost + data.nutrientCost;
    const revenue = data.expectedYield * data.sellPrice;
    const profit = revenue - totalCost;
    const roi = (profit / totalCost) * 100;
    const costPerGram = totalCost / data.expectedYield;
    
    return {
      totalCost: parseFloat(totalCost.toFixed(2)),
      revenue: parseFloat(revenue.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      roi: parseFloat(roi.toFixed(1)),
      costPerGram: parseFloat(costPerGram.toFixed(2))
    };
  }
}

export const powerCostCalculator = new PowerCostCalculator();
