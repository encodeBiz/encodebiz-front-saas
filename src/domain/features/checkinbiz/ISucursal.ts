 
export interface ISucursal {
    id?: string; // uid
    "name": string
    "entityId": string,
    nit?:string
    "address": {
      "street": string,
      "city": string,
      "country": string,
      "postalCode": string,
      "region": string,
      "geo": {
        "lat": number
        "lng": number
      }
    },
    disableRatioChecklog?:boolean
    "ratioChecklog": number
    "metadata": any,
    "status": 'active' | 'inactive'
}