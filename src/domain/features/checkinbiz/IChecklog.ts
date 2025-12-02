export interface IChecklog {
    id?: string; // uid
    "employeeId": string
    "entityId": string
    "branchId": string
    "type": "checkout" | "checkin" | "restin" | "restout"
    "geo": {
        "lat": number,
        "lng": number
    }
    timestamp?: any
    userAgent?: any
    status: 'valid' | "failed"
    failedCode?: string
    metadata?: any
    reason?: string
    updateId?: string
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