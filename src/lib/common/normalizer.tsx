// ======================================================================
// NormalizationService.ts — Versión Final y Blindada para Producción
// ======================================================================

import { IBranchPattern, NormalizedIndicators, Ranges } from "@/domain/features/checkinbiz/IStats";

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
export const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

// Normalización directa (valor alto = mejor)
export const normalizeDirect = (val: number, min: number, max: number) => {
  if (max <= min) return 50; // rango inválido => neutral
  const r = ((val - min) / (max - min)) * 100;
  return clamp(r, 5, 95); // evitamos 0 y 100
};

// Normalización inversa (valor bajo = mejor)
export const normalizeInverse = (val: number, min: number, max: number) => {
  if (max <= min) return 50;
  const r = 100 - ((val - min) / (max - min)) * 100;
  return clamp(r, 5, 95);
};

// ---------------------------------------------------------
// Horarios
// ---------------------------------------------------------
export function normalizeHorarioStability(stdStart: number, stdEnd: number) {
  const varMinutes = (stdStart + stdEnd) * 60;
  const maxVar = 120; // 2 horas de dispersión = 0/100

  const result = 100 - (varMinutes / maxVar) * 100;
  return clamp(result, 5, 95);
}

export function normalizeWeeklyHours(weekly: Array<number | null>) {
  const valid = weekly.filter(x => typeof x === "number") as number[];

  if (!valid.length) return 50; // neutral

  const hrs = valid.reduce((a, b) => a + b, 0);

  const IDEAL = 42.5;
  const MAX_DESV = 15;

  const result = 100 - (Math.abs(hrs - IDEAL) / MAX_DESV) * 100;
  return clamp(result, 5, 95);
}

// ---------------------------------------------------------
// Confiabilidad
// ---------------------------------------------------------
export function normalizeConfidence(rel: number) {
  return clamp(rel * 100, 5, 95);
}

export function normalizeObservations(dataPoints: number) {
  const IDEAL = 100;
  const result = (dataPoints / IDEAL) * 100;
  return clamp(result, 5, 95);
}

// ---------------------------------------------------------
// RANGOS — Blindado contra valores inválidos
// ---------------------------------------------------------
export function calculateRanges(patterns: IBranchPattern[]): Ranges {
    
    const pick = <K extends keyof IBranchPattern>(key: K) =>
        patterns
            .map(p => p?.[key])
            .filter(x =>
                typeof x === "number" &&
                !isNaN(x) &&
                x !== 0 // *** evita rangos contaminados por ceros
            ) as number[];

    const safeMinMax = (arr: number[]) => {
        if (arr.length === 0) return { min: 1, max: 1 }; // rango mínimo válido

        const min = Math.min(...arr);
        const max = Math.max(...arr);

        return {
            min,
            max: max === min ? min + 0.00001 : max // evita rango 0
        };
    };

    const r1 = safeMinMax(pick("avgCostHour"));
    const r2 = safeMinMax(pick("avgCycleCost"));
    const r3 = safeMinMax(pick("avgEffectiveCost"));
    const r4 = safeMinMax(pick("avgCostEfficiency"));

    return {
        minCostHour: r1.min, maxCostHour: r1.max,
        minCostCycle: r2.min, maxCostCycle: r2.max,
        minEffective: r3.min, maxEffective: r3.max,
        minEfficiency: r4.min, maxEfficiency: r4.max,
    };
}

// ---------------------------------------------------------
// SERVICIO PRINCIPAL
// ---------------------------------------------------------
export class NormalizationService {

  static normalize(pattern: IBranchPattern, ranges: Ranges): NormalizedIndicators {

    return {
      horarios: {
        stability: parseFloat(normalizeHorarioStability(pattern?.stdStartHour ?? 0, pattern?.stdEndHour ?? 0).toFixed(2)),
        weeklyHours: parseFloat(normalizeWeeklyHours(pattern?.weeklyWorkAvg ?? []).toFixed(2)),
      },

      costes: {
        costHour: parseFloat(normalizeInverse(pattern?.avgCostHour ?? 0, ranges.minCostHour, ranges.maxCostHour).toFixed(2)),
        costCycle: parseFloat(normalizeInverse(pattern?.avgCycleCost ?? 0, ranges.minCostCycle, ranges.maxCostCycle).toFixed(2)),
        costEffective: parseFloat(normalizeInverse(pattern?.avgEffectiveCost ?? 0, ranges.minEffective, ranges.maxEffective).toFixed(2)),
        costEfficiency: parseFloat(normalizeDirect(pattern?.avgCostEfficiency ?? 0, ranges.minEfficiency, ranges.maxEfficiency).toFixed(2)),
      },

      confiabilidad: {
        confidence: parseFloat(normalizeConfidence(pattern?.reliability ?? 0).toFixed(2)),
        observations: parseFloat(normalizeObservations(pattern?.dataPoints ?? 0).toFixed(2)),
      }
    };
  }
}

// ---------------------------------------------------------
// NORMALIZACIÓN COMPLETA DE SUCURSALES
// ---------------------------------------------------------
export function normalizeBranchDataset(patterns: IBranchPattern[]) {

    // Solo usar patrones válidos
    const cleanPatterns = patterns.filter(
        p =>
            p &&
            typeof p.avgCostHour === "number" &&
            typeof p.avgCycleCost === "number" &&
            typeof p.avgEffectiveCost === "number" &&
            typeof p.avgCostEfficiency === "number"
    );

    const ranges = calculateRanges(cleanPatterns);

    return cleanPatterns.map(p => ({
        branchId: (p as any)?.branchId ?? null,
        pattern: p,
        normalized: NormalizationService.normalize(p, ranges),
    }));
}