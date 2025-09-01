import { collection } from "@/config/collection";
import { SearchParams } from "@/domain/firebase/firestore";
import { IWebHook } from "@/domain/integration/IWebHook";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";



export const fetchWebHookByEntity = async (entityId: string, params: SearchParams): Promise<Array<IWebHook>> => {
    const result: IWebHook[] = await searchFirestore({
        ...params,
        collection: `${collection.ENTITIES}/${entityId}/${collection.WEBHOOK}`,
    });
    return result;
}


export async function createWebHook(data: Partial<IWebHook>, token: string) {
    try {
        if (!token) {
            throw new Error("Error to fetch user auth token");
        } else {
            const httpClientFetchInstance: HttpClient = new HttpClient({
                baseURL: "",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            const response: any = await httpClientFetchInstance.post(
                process.env.NEXT_PUBLIC_BACKEND_URI_CREATE_WEBHOOK as string,
                {
                    ...data
                }
            );
            if (response.errCode && response.errCode !== 200) {
                throw new Error(response.message);
            }

            return response;
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}



export async function deleteWebhook(data: {
    "endpointId": string,
    "entityId": string
} | any, token: string) {
    try {

        if (!token) {
            throw new Error('Error to fetch user auth token')
        } else {
            const httpClientFetchInstance: HttpClient = new HttpClient({
                baseURL: '',
                headers: {
                    authorization: `Bearer ${token}`
                },
            });
            const response: any = await httpClientFetchInstance.delete(process.env.NEXT_PUBLIC_BACKEND_URI_DELETE_WEBHOOK as string, {
                ...data
            });
            if (response.errCode && response.errCode !== 200) {
                throw new Error(response.message)
            }
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}