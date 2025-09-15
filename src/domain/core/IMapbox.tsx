export interface IMapbox {
    address: string
    geo: { lat: number, lng: number }
    city?: string
    country?: string
}