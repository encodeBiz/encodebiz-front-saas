export interface IUserMedia {
    entityId: string
    uid?: string
    type: IUserMediaType
    file?: File
    id:string
    filename: string
    height: number
    mimeType: string
    sizeKB: number
    storagePath: string
    uploadedBy: string
    url: string
    width: number
}

export type IUserMediaType =  'avatar' | 'logo' | 'background' | 'stripImage' | 'icon' | 'eventLogo' | 'eventBackground' | 'eventStripImage' | 'custom'
