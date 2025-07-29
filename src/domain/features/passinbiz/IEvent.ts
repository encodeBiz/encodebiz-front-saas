export interface IEvent {
    id: string
    "uid": string
    "name": string
    "description": string
    "date": string
    "location": string
    "template": string
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