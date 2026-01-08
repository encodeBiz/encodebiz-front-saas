
export interface ISucursal {
  id?: string;
  name: string
  entityId: string,
  nif?: string
  address: {
    street: string,
    city: string,
    country: string,
    postalCode: string,
    region: string,
    timeZone: string,
    geo: {
      lat: number
      lng: number
    }
  },
  disableRatioChecklog?: boolean
  ratioChecklog: number
  metadata: any,
  status: 'active' | 'inactive',
  advance?: {
    enableDayTimeRange: boolean,
    startTimeWorkingDay?: { hour: number, minute: number },
    endTimeWorkingDay?: { hour: number, minute: number },


    disableBreak: boolean,
    timeBreak: number

    workScheduleEnable?: boolean;
    workSchedule?: WorkSchedule;
    notifyBeforeMinutes?:number

  }
  employeesCount?: number;
}

export interface WorkDaySchedule {
    enabled: boolean;
    start: {hour: number; minute: number};
    end: {hour: number; minute: number};
}

export interface WorkSchedule {
    monday?: WorkDaySchedule;
    tuesday?: WorkDaySchedule;
    wednesday?: WorkDaySchedule;
    thursday?: WorkDaySchedule;
    friday?: WorkDaySchedule;
    saturday?: WorkDaySchedule;
    sunday?: WorkDaySchedule;
    notifyBeforeMinutes?: number;
}
