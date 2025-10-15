
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
    startTime: string,
    endTime: string

    disableBreak: boolean,
    timeBreak: number
    timeZone:string
  }
}