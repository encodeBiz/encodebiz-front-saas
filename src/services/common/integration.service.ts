import { collection } from "@/config/collection";
import { SearchParams } from "@/domain/firebase/firestore";
import { IWebHook } from "@/domain/integration/IWebHook";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";

 

export const fetchWebHookByEntity = async (entityId: string, params: SearchParams): Promise<Array<IWebHook>> => {
    const result: IWebHook[] = await searchFirestore({
        ...params,
        collection: `${collection.ENTITIES}/${entityId}/${collection.WEBHOOK}`,
    });     
    return result;
}
 