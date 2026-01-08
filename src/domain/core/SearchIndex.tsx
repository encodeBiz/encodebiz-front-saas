export interface ISearchIndex {
    id?:string
    keywords_prefix: string[],
    keywords: string[],
    fields: Record<string, string>,
    type: "entities" | "users" | "events" | "staff" | "holder",
    updatedAt: Date,
    metadata?: Record<string, string>,
    index: string
    entityId: string
}