import { collection } from "@/config/collection";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { IEntitySuscription, ISubscription, IUnSubscription, StripeInvoice } from "@/domain/auth/ISubscription";
import { IPlanData } from "@/domain/core/IPlan";
import { getAll, getOne } from "@/lib/firebase/firestore/readDocument";
import { IService } from "@/domain/core/IService";
import { SearchParams } from "@/domain/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";



export async function fetchAvailablePlans(productId: string): Promise<IPlanData[]> {
    try {
        const planDataList = await getAll<IPlanData>(`service/${productId}/plan`);
        return planDataList;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function fetchService(productId: string): Promise<IService> {
    try {
        const planDataList = await getOne<IService>(`service`, productId);
        return planDataList;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function fetchServiceList(): Promise<Array<IService>> {
    try {
        const planDataList = await getAll<IService>(`service`);
        return planDataList;
    } catch (error: any) {
        throw new Error(error.message);
    }
}


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
        const response: any = await httpClientFetchInstance.post(process.env.NEXT_PUBLIC_BACKEND_URI_UNSUBCRIBE as string, {
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
    "entityId": string
}, token: string) {
    try {
        let httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: '',
            headers: {
                token: `Bearer ${token}`
            },
        });
        const response: any = await httpClientFetchInstance.post(process.env.NEXT_PUBLIC_BACKEND_URI_CONFIGBILLING as string, {
            ...data
        });
        if (response.errCode && response.errCode !== 200) {
            throw new Error(response.message)
        }
        return response
    } catch (error: any) {
        throw new Error(error.message)
    }
}


export async function fetchSuscriptionByEntity(entityId: string): Promise<Array<IEntitySuscription>> {
    try {
        const planDataList = await getAll<IEntitySuscription>(`${collection.ENTITIES}/${entityId}/subscriptions`);
        return planDataList;
    } catch (error: any) {
        throw new Error(error.message);
    }
}


export const fetchInvoicesByEntity = async (entityId: string, params: SearchParams): Promise<Array<StripeInvoice>> => {
    const result: StripeInvoice[] = await searchFirestore({
        ...params,
        collection: `${collection.ENTITIES}/${entityId}/${collection.INVOICES}`,
    });

    return result;
}
