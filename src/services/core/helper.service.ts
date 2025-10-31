
import { collection } from "@/config/collection";
import { ContactFromModel } from "@/domain/core/IContact";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { mapperErrorFromBack } from "@/lib/common/String";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
export interface IAddress {
  addressQuery: string
  country: string
  lat: number
  lng: number
  provider: string
  resolvedText: string

}
export interface IGeoInputAutoComplete {
  "address": string
  "country": string
  "action": "autocomplete",
  "sessionToken": string
}

export interface IGeoInputAutoDetail {
  "placeId": string
  "provider": "google",
  "sessionToken": string
  "action": "placedetails"
}

export interface IGeoAutoCompleteOutput {
  addressQuery: string
  country: string
  lat: null
  lng: null
  placeId: string
  provider: string
  resolvedText: string
  sessionToken: string
  timeZone: any
}

export interface IGeoDetailOutput {

  formattedAddress: string
  lat: number
  lng: number
  provider: string
  timeZone: string
}
export async function fetchLocation(data: IGeoInputAutoComplete | IGeoInputAutoDetail, token: string, locale: any): Promise<Array<IGeoAutoCompleteOutput> | IGeoDetailOutput>  {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          authorization: `Bearer ${token}`, locale
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_GEO as string, data);
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }

      return response;
    }
  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}


export async function fetchIndex(data: {
  "entityId": string,
  "keyword"?: string,
  type?: "entities" | "users" | "events" | "staff" | "holder" | "employee" | "branch",

}): Promise<Array<ISearchIndex>> {
  const filters = []
  if (data.type) filters.push({
    field: 'type', operator: '==', value: data.type
  })

  if (data.keyword) filters.push({
    field: 'keywords_prefix', operator: 'array-contains', value: data.keyword
  })

  if (data.entityId) filters.push({
    field: 'entityId', operator: '==', value: data.entityId
  })
  const params: any = { filters }
  const result: ISearchIndex[] = await searchFirestore({
    ...params,
    collection: `${collection.INDEX}`,
  });
  return result;
}



export async function sendFormContact(data: ContactFromModel | any, locale: string): Promise<void> {
  try {
    if (!data.token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          authorization: `Bearer ${data.token}`, locale
        },
      });
      data.mesagge = data.message
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_CONTACT as string,
        {
          to: process.env.NEXT_PUBLIC_EMAIL_CONTACT, //"receiver@sender.com"
          subject: data.subject,  //"Message title"
          type: 'CONTACT_ENCODEBIZ', //template typew
          replacements: data
        }
      );
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }
      return response;
    }
  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}




