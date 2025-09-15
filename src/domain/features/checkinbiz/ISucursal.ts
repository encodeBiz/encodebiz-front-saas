import { IMapbox } from "@/domain/core/IMapbox";

export interface ISucursal {
    id?: string; // uid
    name: string
    address: IMapbox   

    ratioChecklog?: number
    metadata?: any
}