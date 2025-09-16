import { IMapbox } from "@/domain/core/IMapbox";

export interface ISucursal {
    id?: string; // uid
    name: string
    address: string
    geo?: { lat: number, lng: number }
    city?: string
    country?: string
    entityId: string;
    ratioChecklog?: number
    metadata?: any
}