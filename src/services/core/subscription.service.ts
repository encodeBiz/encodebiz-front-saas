import { collection } from "@/config/collection";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { IEntitySuscription, ISubscription, IUnSubscription, StripeInvoice } from "@/domain/core/auth/ISubscription";
import { IPlan, IPlanData } from "@/domain/core/IPlan";
import { getAll, getOne } from "@/lib/firebase/firestore/readDocument";
import { IService } from "@/domain/core/IService";
import { SearchParams } from "@/domain/core/firebase/firestore";
import { onSnapshotCollection, searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { Unsubscribe } from "firebase/firestore";
import { createDocumentWithId } from "@/lib/firebase/firestore/addDocument";



export async function fetchAvailablePlans(productId: string): Promise<IPlan[]> {
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


export async function updateModulePlan() {
    try {

        const plans = await fetchAvailablePlans('passinbiz')

        plans.forEach(async element => {
            await createDocumentWithId<IPlan>({
                collection: `/service/checkinbiz/plan`,
                data: {
                    ...element
                },
                id: element.id
            });
        });



    } catch (error: any) {
        throw new Error(error.message);
    }
}


export async function subscribeInSassProduct(data: ISubscription, token: string) {
    try {
        const httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: '',
            headers: {
                authorization: `Bearer ${token}`
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



export async function unSubscribeInSassProduct(data: IUnSubscription, token: string) {
    try {
        const httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: '',
            headers: {
                authorization: `Bearer ${token}`
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
        const httpClientFetchInstance: HttpClient = new HttpClient({
            baseURL: '',
            headers: {
                authorization: `Bearer ${token}`
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




export function watchSubscrptionEntityChange(entityId: string, callback: (type: 'added' | 'removed' | 'modified', doc: any) => void): Unsubscribe {
    return onSnapshotCollection(`${collection.ENTITIES}/${entityId}/subscriptions`, callback)
}