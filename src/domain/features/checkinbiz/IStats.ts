import { Timestamp } from "firebase/firestore";
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

export interface IEmployeePattern {
  "id": string
  "costTrend": "down" | "up",
  "netWorkedHours": number,
  "stdStartHour": number,
  "promotionScore": number,
  "stdEndHour": number,
  "avgStartHour": number,
  "weeklyWorkAvg": Array<number>,
  "totalExperienceYears": number,
  "weeklyStartAvg": Array<number>,
  "avgCycleCost": number,
  "weeklyEndAvg": Array<number>,
  "avgEffectiveCost": number,
  "updatedAt": any,
  "experienceByResponsibility": Array<{
    "totalHours": number,
    "years": number,
    "responsibility": string
  }>,
  "stdEndByDay": Array<{
    "m2": number,
    "count": number,
    "mean": number,
    "std": number
  }>,
  "skillLevel": number,
  "efficiencyIndex": number,
  "branchId": string,
  "source": string,
  "reliability": number,
  "costVariance": number,
  "effectiveRealCost": number,
  "dataPoints": number,
  "entityId": string,
  "avgCostEfficiency": number,
  "employeeId": string,
  "avgEndHour": number,
  "avgCostHour": number,
  "experienceByJob": Array<
    {
      "firstWorked": Timestamp,
      "nameJob": string,
      "avgPrice": number,
      "lastWorked": Timestamp,
      "totalHours": number
    }
  >,
  "avgLevel": number,
  "timeZone": string,
  "stdStartByDay": Array<{
    "m2": number,
    "count": number,
    "mean": number,
    "std": number
  }>,
  "totalCost": number,
  "totalItems": number,
  "last": string

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

export interface IRulesInfo {
  "id": string,
  "severity": "medium",
  "actions": Array<{
    "type": string,
    "label": string,
    "description": string,
    "manualDecisionRequired": boolean
  }>
  ,
  "explanation": {
    "es": string,
    "en": string
  }
}



export interface IHeuristicIndicator {

  "id": string,
  "description": {
    "es": string,
    "en": string
  },
  "thresholds": Array<{
    "action": {
      "en": string,
      "es": string
    },
    "status": "success" | 'warning' | 'error',
    "value": number,
    "consequence": {
      "es": string,
      "en": string
    },
    "operator": ">" | "<" | "=",
    "label": {
      "es": string
      "en": string
    }
  }>,
  "name": {
    "en": string,
    "es": string
  },
  "type": "differential" | "advanced" | "combined" | "simple",
  "group": {
    "id": string,
    "label": {
      "en": string,
      "es": string
    }
  },
  "version": string,
  "lastUpdated": string,
  "totalItems": number,
  "last": string

}

export type ColorBar = '#4A8AD4' | '#3A9B94' | '#7BA3C8' | '#E6F0FA'
export const colorBarDataset: Array<ColorBar> = ['#4A8AD4', '#3A9B94', '#7BA3C8', '#E6F0FA']

export const preferenceDashboardItems = (t: any): Array<{ name: string, children: Array<{ name: string, value: string }> }> => [
  {
    name: t('employeeDashboard.schedules'),
    children: [
      { name: t('employeeDashboard.avgOperatingSchedule'), value: 'avgStartHour_avgEndHour' },
      { name: t('employeeDashboard.weeklyWorkload'), value: 'stdStartHour_stdEndHour' },
    ]
  },

  {
    name: t('employeeDashboard.cost'),
    children: [
      { name: t('employeeDashboard.costPerHourWorked'), value: 'avgCostHour' },
      { name: t('employeeDashboard.costPerShift'), value: 'avgCycleCost' },
      { name: t('employeeDashboard.costByPerformance'), value: 'avgCostEfficiency' },
      { name: t('employeeDashboard.performanceOfInvestedCost'), value: 'effectiveRealCost' },
    ]
  },
  {
    name: t('employeeDashboard.dataReliability'),
    children: [
      { name: t('employeeDashboard.reliabilityLevel'), value: 'reliability' },
      { name: t('employeeDashboard.dataVolume'), value: 'dataPoints' },
    ]
  },

];

export const preferenceDashboardEmployeeItems = (t: any): Array<{ name: string, children: Array<{ name: string, value: string }> }> => [
  {
    name: t('employeeDashboard.schedules'),
    children: [
      { name: t('employeeDashboard.avgOperatingSchedule'), value: 'avgStartHour_avgEndHour' },
      { name: t('employeeDashboard.hourDispersion1'), value: 'stdStartHour_stdEndHour' },
    ]
  },

  {
    name: t('employeeDashboard.cost'),
    children: [
      { name: t('employeeDashboard.costPerHourWorked'), value: 'avgCostHour' },
      { name: t('employeeDashboard.costPerShift'), value: 'avgCycleCost' },
      { name: t('employeeDashboard.costByPerformance'), value: 'avgCostEfficiency' },
      { name: t('employeeDashboard.performanceOfInvestedCost'), value: 'effectiveRealCost' },
      { name: t('employeeDashboard.accumulatedCost'), value: 'totalCost' },
    ]
  },
  {
    name: t('employeeDashboard.dataReliability'),
    children: [
      { name: t('employeeDashboard.reliabilityLevel'), value: 'reliability' },
      { name: t('employeeDashboard.dataVolume'), value: 'dataPoints' },
    ]
  },

  {
    name: t('employeeDashboard.experience'),
    children: [
      { name: t('employeeDashboard.totalExperience'), value: 'totalExperienceYears' },
      { name: t('employeeDashboard.mainResponsibility'), value: 'experienceByResponsibility' },
      { name: t('employeeDashboard.mainOccupation'), value: 'experienceByJob' },
    ]
  },

];
