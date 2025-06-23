import { RegisterFormValues } from "@/app/auth/register/page.controller";
import { collection } from "@/config/collection";
import { createUser } from "@/lib/firebase/authentication/create";
import { login, loginWithGoogle, loginWithToken } from "@/lib/firebase/authentication/login";
import { logout } from "@/lib/firebase/authentication/logout";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import httpClientFetchInstance, { HttpClient } from "@/lib/http/httpClientFetchNext";
import IUser from "@/domain/auth/IUser";
import { UserCredential } from "firebase/auth";
import { ISubscription, IUnSubscription } from "@/domain/auth/ISubscription";





export async function subscribeInSassProduct(data: ISubscription, token: string) {
    try {
        let httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: '',
            headers: {
                token: `Bearer ${token}`
            },
        });
        const response: any = await httpClientFetchInstance.post(process.env.NEXT_PUBLIC_BACKEND_URI_SUBCRIBE as string, {
            ...data
        });
        if (response.errCode && response.errCode !== 200) {
            throw new Error(response.message)
        }

    } catch (error: any) { 
        console.log(error);
        
        throw new Error(error.message)
    }
}



export async function unSubscribeInSassProduct(data: IUnSubscription, token: string) {
    try {
        let httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: '',
            headers: {
                token: `Bearer ${token}`
            },
        });
        const response: any = await httpClientFetchInstance.post(process.env.NEXT_PUBLIC_BACKEND_URI_SUBCRIBE as string, {
            ...data
        });
        if (response.errCode && response.errCode !== 200) {
            throw new Error(response.message)
        }

    } catch (error: any) {
        throw new Error(error.message)
    }
}


export async function configBilling(data: {
    "entityId": string,
    "uid": string
}, token: string) {
    try {
        let httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: '',
            headers: {
                token: `Bearer ${token}`
            },
        });
        const response: any = await httpClientFetchInstance.post(process.env.NEXT_PUBLIC_BACKEND_URI_SUBCRIBE as string, {
            ...data
        });
        if (response.errCode && response.errCode !== 200) {
            throw new Error(response.message)
        }

    } catch (error: any) {
        throw new Error(error.message)
    }
}

