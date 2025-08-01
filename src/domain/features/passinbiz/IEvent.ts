export interface IEvent {
    id: string
    "uid": string
    "name": string
    "description": string
    "date": string
    "endDate": string
    "location": string
    "template": "default" | "vip" | "expo" | "festival"
    "logoUrl": string
    "imageUrl": string
    "colorPrimary": string
    "colorAccent": string
    "createdBy": string
    "entityId": string
    "metadata": {
        "ticketCapacity": number
        "sponsor": string
    }
}