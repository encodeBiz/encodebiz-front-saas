export interface IUserMedia {
    entityId: string
    uid?: string
    type: 'logo' | 'background' | 'stripImage' | 'icon' | 'eventLogo' | 'eventBackground' | 'eventStripImage' | 'custom'
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
