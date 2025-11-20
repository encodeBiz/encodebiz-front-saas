import { IBranchPattern, NormalizedIndicators, Ranges } from "@/domain/features/checkinbiz/IStats";

export const clamp = (value: number, min = 0, max = 100) =>
    Math.max(min, Math.min(max, value));

export const normalizeInverse = (val: number, min: number, max: number) =>
    clamp(100 - ((val - min) / (max - min)) * 100);

export const normalizeDirect = (val: number, min: number, max: number) =>
    clamp(((val - min) / (max - min)) * 100);
// ======================================================================
//  NormalizationService.ts
//  Servicio completo de normalización 0–100 para BranchPattern
// ======================================================================

// ========================================================
// 1. TIPOS
// ========================================================




// ========================================================
// 3. NORMALIZADORES
// ========================================================
export function normalizeHorarioStability(stdStart: number, stdEnd: number) {
    // std en horas → convertir a minutos
    const varMinutes = (stdStart + stdEnd) * 60;
    const maxVar = 120; // 2h dispersión = 0/100

    return clamp(100 - (varMinutes / maxVar) * 100);
}

export function normalizeWeeklyHours(weekly: Array<number | null>) {
    const valid = weekly.filter(x => typeof x === "number") as number[];

    if (!valid.length) return 0;

    const hrs = valid.reduce((a, b) => a + b, 0);

    const IDEAL = 42.5;
    const MAX_DESV = 15;

    return clamp(100 - (Math.abs(hrs - IDEAL) / MAX_DESV) * 100);
}

export function normalizeConfidence(rel: number) {
    return clamp(rel * 100);
}

export function normalizeObservations(dataPoints: number) {
    const IDEAL = 50;
    return clamp((dataPoints / IDEAL) * 100);
}



// ========================================================
// 4. CÁLCULO DE RANGOS DESDE LA DB
// ========================================================
export function calculateRanges(patterns: IBranchPattern[]): Ranges {
    const pick = <K extends keyof IBranchPattern>(k: K) =>
        patterns.map(p => p[k]).filter(x => typeof x === "number") as number[];

    const minMax = (arr: number[]) => ({
        min: Math.min(...arr),
        max: Math.max(...arr),
    });

    const r1 = minMax(pick("avgCostHour"));
    const r2 = minMax(pick("avgCycleCost"));
    const r3 = minMax(pick("avgEffectiveCost"));
    const r4 = minMax(pick("avgCostEfficiency"));

    return {
        minCostHour: r1.min, maxCostHour: r1.max,
        minCostCycle: r2.min, maxCostCycle: r2.max,
        minEffective: r3.min, maxEffective: r3.max,
        minEfficiency: r4.min, maxEfficiency: r4.max,
    };
}



// ========================================================
// 5. SERVICIO PRINCIPAL DE NORMALIZACIÓN
// ========================================================
export class NormalizationService {

    static normalize(pattern: IBranchPattern, ranges: Ranges): NormalizedIndicators {

        return {
            horarios: {
                stability: normalizeHorarioStability(pattern.stdStartHour, pattern.stdEndHour),
                weeklyHours: normalizeWeeklyHours(pattern.weeklyWorkAvg),
            },

            costes: {
                costHour: normalizeInverse(pattern.avgCostHour as number, ranges.minCostHour, ranges.maxCostHour),
                costCycle: normalizeInverse(pattern.avgCycleCost as number, ranges.minCostCycle, ranges.maxCostCycle),
                costEffective: normalizeInverse(pattern.avgEffectiveCost as number, ranges.minEffective, ranges.maxEffective),
                costEfficiency: normalizeDirect(pattern.avgCostEfficiency as number, ranges.minEfficiency, ranges.maxEfficiency),
            },

            confiabilidad: {
                confidence: normalizeConfidence(pattern.reliability),
                observations: normalizeObservations(pattern.dataPoints),
            }
        };
    }
}



// ========================================================
// 6. EJEMPLO DE USO COMPLETO
// ========================================================

// patterns: todos los BranchPattern de Firestore
export function normalizeBranchDataset(patterns: IBranchPattern[]) {
    const ranges = calculateRanges(patterns);

    return patterns.map(p => ({
        branchId: (p as any).branchId ?? null,
        normalized: NormalizationService.normalize(p, ranges),
    }));
}