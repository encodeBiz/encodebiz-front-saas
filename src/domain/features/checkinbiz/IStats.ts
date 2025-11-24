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
    name: 'Horarios',
    children: [
      { name: 'Horario operativo medio', value: 'avgStartHour_avgEndHour' },
      { name: 'Carga horaria semanal', value: 'stdStartHour_stdEndHour' },
    ]
  },

  {
    name: 'Costes',
    children: [
      { name: 'Coste por hora trabajada', value: 'avgCostHour' },
      { name: 'Coste por jornada', value: 'avgCycleCost' },
      { name: 'Coste por rendimiento', value: 'avgCostEfficiency' },
      { name: 'Rendimiento del coste invertido', value: 'effectiveRealCost' },

    ]
  },
  {
    name: 'Confiabilidad del dato',
    children: [
      { name: 'Nivel de confiabilidad ', value: 'reliability' },
      { name: 'Volumen de datos', value: 'dataPoints' },
    ]
  },

];
