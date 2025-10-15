
export interface ISucursal {
  id?: string;
  name: string
  entityId: string,
  nit?: string
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
   }
}