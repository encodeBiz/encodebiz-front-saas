import { IMapbox } from "@/domain/core/IMapbox";

export interface ISucursal {
    id?: string; // uid
    name: string
    address: IMapbox
    entityId: string;
    ratioChecklog?: number
    metadata?: any
}