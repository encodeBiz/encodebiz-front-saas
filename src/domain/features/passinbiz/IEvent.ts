export interface IEvent {
    id: string
    "uid": string
    "name": string
    "description": string
    "date": any
    "endDate": any
    "location": string
    dateLabel: string
    address: string
    "template": "default" | "vip" | "expo" | "festival"
    status?: "draft" | "published" | "archived";
    "logoUrl": string
    "imageUrl": string
    "colorPrimary": string
    "colorAccent": string
    "createdBy": string
    "entityId": string
    assignedStaff: string[]
    "isPublished": boolean
    "metadata": any
    geo: { lat: number, lng: number }
    "city"?: string
    "timeZone"?: string
    "country"?: string
    language?: string
}