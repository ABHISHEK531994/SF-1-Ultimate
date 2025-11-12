import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { optionalAuthMiddleware } from '../middleware/auth';
import * as calculators from '../calculators';
import { calculatorService } from '../services/calculator.service';

const router = Router();

router.post('/vpd',
  optionalAuthMiddleware,
  validate(z.object({
    temperature: z.number().min(-10).max(50),
    humidity: z.number().min(0).max(100),
    leafOffset: z.number().optional()
  })),
  async (req, res, next) => {
    try {
      const result = calculators.vpdCalculator.calculate(req.body);
      
      if (req.user) {
        await calculatorService.saveCalculation({
          userId: req.user.id,
          type: 'vpd',
          input: req.body,
          result
        });
      }
      
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/ec-ppm',
  optionalAuthMiddleware,
  validate(z.object({
    value: z.number().min(0),
    unit: z.enum(['ec', 'ppm500', 'ppm700'])
  })),
  async (req, res, next) => {
    try {
      const result = calculators.ecPPMCalculator.convert(req.body);
      
      if (req.user) {
        await calculatorService.saveCalculation({
          userId: req.user.id,
          type: 'ec_ppm',
          input: req.body,
          result
        });
      }
      
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/dli',
  optionalAuthMiddleware,
  validate(z.object({
    ppfd: z.number().min(0).max(2000),
    hoursPerDay: z.number().min(0).max(24)
  })),
  async (req, res, next) => {
    try {
      const result = calculators.dliCalculator.calculate(req.body);
      
      if (req.user) {
        await calculatorService.saveCalculation({
          userId: req.user.id,
          type: 'dli',
          input: req.body,
          result
        });
      }
      
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/ppfd',
  optionalAuthMiddleware,
  validate(z.object({
    lightType: z.enum(['led', 'hps', 'mh', 'cfl', 'cmh']),
    wattage: z.number().min(1).max(5000),
    distance: z.number().min(10).max(200),
    coverage: z.number().min(0.1).max(50).optional()
  })),
  async (req, res, next) => {
    try {
      const result = calculators.ppfdCalculator.calculate(req.body);
      
      if (req.user) {
        await calculatorService.saveCalculation({
          userId: req.user.id,
          type: 'ppfd',
          input: req.body,
          result
        });
      }
      
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/power-cost',
  optionalAuthMiddleware,
  validate(z.object({
    wattage: z.number().min(1).max(10000),
    hoursPerDay: z.number().min(0).max(24),
    daysPerMonth: z.number().min(1).max(31).optional(),
    electricityRate: z.number().min(0).max(1),
    additionalDevices: z.array(z.object({
      name: z.string(),
      wattage: z.number(),
      hoursPerDay: z.number()
    })).optional()
  })),
  async (req, res, next) => {
    try {
      const result = calculators.powerCostCalculator.calculate(req.body);
      
      if (req.user) {
        await calculatorService.saveCalculation({
          userId: req.user.id,
          type: 'power_cost',
          input: req.body,
          result
        });
      }
      
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/co2',
  optionalAuthMiddleware,
  validate(z.object({
    tentWidth: z.number().min(0.1).max(10),
    tentDepth: z.number().min(0.1).max(10),
    tentHeight: z.number().min(0.1).max(5),
    targetPPM: z.number().min(400).max(2000),
    currentPPM: z.number().min(300).max(600).optional(),
    airExchangePerHour: z.number().min(0.5).max(10).optional()
  })),
  async (req, res, next) => {
    try {
      const result = calculators.co2Calculator.calculate(req.body);
      
      if (req.user) {
        await calculatorService.saveCalculation({
          userId: req.user.id,
          type: 'co2',
          input: req.body,
          result
        });
      }
      
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/presets', async (req, res) => {
  const presets = [
    {
      name: 'Small Tent (60x60x140cm)',
      vpd: { temperature: 24, humidity: 60 },
      dli: { ppfd: 600, hoursPerDay: 18 },
      powerCost: { wattage: 150, hoursPerDay: 18, electricityRate: 0.30 },
      co2: { tentWidth: 0.6, tentDepth: 0.6, tentHeight: 1.4, targetPPM: 1200 }
    },
    {
      name: 'Medium Tent (100x100x200cm)',
      vpd: { temperature: 25, humidity: 55 },
      dli: { ppfd: 700, hoursPerDay: 18 },
      powerCost: { wattage: 320, hoursPerDay: 18, electricityRate: 0.30 },
      co2: { tentWidth: 1.0, tentDepth: 1.0, tentHeight: 2.0, targetPPM: 1400 }
    },
    {
      name: 'Large Tent (150x150x200cm)',
      vpd: { temperature: 26, humidity: 50 },
      dli: { ppfd: 800, hoursPerDay: 18 },
      powerCost: { wattage: 600, hoursPerDay: 18, electricityRate: 0.30 },
      co2: { tentWidth: 1.5, tentDepth: 1.5, tentHeight: 2.0, targetPPM: 1500 }
    }
  ];
  
  res.json({ presets });
});

router.post('/compare',
  optionalAuthMiddleware,
  validate(z.object({
    setups: z.array(z.object({
      name: z.string(),
      wattage: z.number(),
      lightType: z.enum(['led', 'hps', 'mh', 'cfl', 'cmh']),
      electricityRate: z.number()
    }))
  })),
  async (req, res) => {
    const comparisons = req.body.setups.map((setup: any) => {
      const ppfd = calculators.ppfdCalculator.calculate({
        lightType: setup.lightType,
        wattage: setup.wattage,
        distance: 40,
        coverage: 1.0
      });
      
      const powerCost = calculators.powerCostCalculator.calculate({
        wattage: setup.wattage,
        hoursPerDay: 18,
        electricityRate: setup.electricityRate
      });
      
      return {
        name: setup.name,
        ppfd: ppfd.ppfd,
        monthlyKWh: powerCost.monthlyKWh,
        monthlyCost: powerCost.monthlyCost,
        efficiency: (ppfd.ppfd / setup.wattage).toFixed(2)
      };
    });
    
    res.json({ comparisons });
  }
);

export default router;
