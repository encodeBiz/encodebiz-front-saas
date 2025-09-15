export type WebhookEventType = "pass.created" | "pass.created.failed" | "pass.revoked" | "pass.sent" | "credential.created" | "credential.sent" | "credential.sent.failed" | "validation.scanned" | "validation.scanned.success" | "validation.scanned.failed" | "attendance.clock_in" | "attendance.clock_out";


export interface IWebHook {
    id: string
    subscribedEvents: Array<WebhookEventType> | any
    url: string
    enabled: boolean
    entityId: string
    version: string


    "consecutiveFailures"?: number
    "createdAt"?: any
    "updatedAt"?: any
    "secret"?: string


}