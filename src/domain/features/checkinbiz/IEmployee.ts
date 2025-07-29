export interface IEmployee {
    id: string
    "uid"?: string
    "entityId": string
    "fullName": string
    "email": string
    "phoneNumber": string
    "role": string
    "metadata": {
        "startDate": string
        "workingHours": string
        "contractType": string
    }
}