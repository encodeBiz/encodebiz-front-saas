 
export interface ISucursal {
    id?: string; // uid
    "name": string
    "entityId": string,
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
    "ratioChecklog": number
    "metadata": any,
    "status": 'active' | 'inactive'
}