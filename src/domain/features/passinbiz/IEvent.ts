export interface IEvent {
    id: string
    "uid": string
    "name": string
    "description": string
    "date": any
    "endDate": any
    "location": string
    dateLabel: string

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


    language?: string


    address: {
        street: string,
        city: string,
        country: string,
        postalCode: string,
        region: string,
        timeZone: string,
        geo: {
            lat: number
            lng: number
        }
    },
}