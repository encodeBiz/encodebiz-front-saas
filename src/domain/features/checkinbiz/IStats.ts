import { Timestamp } from "firebase/firestore"
import { ISucursal } from "./ISucursal"

export interface IBranchPattern {
    "id": string

    branchId: string;
    entityId: string;
    timeZone: string;

    // Medias globales
    avgStartHour: number; // ej. 8.50 = 08:30
    avgEndHour: number; // ej. 17.00

    // Desviaciones iniciales (afinables luego)
    stdStartHour: number; // ej. 0.25 (~15 min)
    stdEndHour: number; // ej. 0.25
    // ej. 0.25
    startMean?: number
    startM2?: number
    startCount?: number
    endMean?: number
    endM2?: number
    avgCostHour?: number,
    avgCycleCost?: number,
    avgEffectiveCost?: number,
    avgCostEfficiency?: number,
    totalCost?: number,
    effectiveRealCost?: number,
    // Fiabilidad y conteo
    reliability: number; // 0..1
    dataPoints: number; // nº sesiones observadas

    // Perfiles por día (dom→sab)
    weeklyStartAvg: Array<number | null>;
    weeklyEndAvg: Array<number | null>;
    weeklyWorkAvg: Array<number | null>;
    costVariance?: number;
    costTrend?: "up" | "down" | "-"
    // Metadatos
    source: "init_config" | "update";
    createdAt: Date;
    updatedAt: Date;

    branch?: ISucursal
}


export interface NormalizedIndicators {
  horarios: {
    stability: number;
    weeklyHours: number; 
  };

  costes: {
    costHour: number;
    costCycle: number;
    costEffective: number;
    costEfficiency: number;
  };

  confiabilidad: {
    confidence: number;
    observations: number;
  };
}

export interface Ranges {
  minCostHour: number;
  maxCostHour: number;

  minCostCycle: number;
  maxCostCycle: number;

  minEffective: number;
  maxEffective: number;

  minEfficiency: number;
  maxEfficiency: number;
}


export interface IHeuristicInfo {
    "id": string
    "value": number,
    "name": {
        "es": string
        "en": string
    },
    "status": "error" | 'warning' | 'info',
    "label": string
    "consequence": string
    "action": string

    active: boolean
}


