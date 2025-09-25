export interface IChecklog {
    id?: string; // uid

}


export interface ICreateLog {
    "employeeId": string
    "entityId": string
    "branchId": string
    "type": "checkout" | "checkin" | "restin" | "restout"
    "geo": {
        "lat": number,
        "lng": number
    }
}