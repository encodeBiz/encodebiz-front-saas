import { EntityFormValues } from "@/app/main/entity/create/page.controller";
import { createUser } from "@/lib/firebase/authentication/create";
import { HttpClient } from "@/lib/http/httpClientFetchNext";


export async function createEntity(data: EntityFormValues, token: string) {
    try {

        if (!token) {
            throw new Error('Error to fetch user auth token')
        } else {
            let httpClientFetchInstance: HttpClient = new HttpClient({
                baseURL: '',
                headers: {
                    token: `Bearer ${token}`
                },
            });
            const response: any = await httpClientFetchInstance.post(process.env.NEXT_PUBLIC_BACKEND_URI_CREATE_ENTITY as string, {
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


export async function updateEntity(data: EntityFormValues, token: string) {
    try {

        if (!token) {
            throw new Error('Error to fetch user auth token')
        } else {
            let httpClientFetchInstance: HttpClient = new HttpClient({
                baseURL: '',
                headers: {
                    token: `Bearer ${token}`
                },
            });
            const response: any = await httpClientFetchInstance.post(process.env.NEXT_PUBLIC_BACKEND_URI_UPDATE_ENTITY as string, {
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
