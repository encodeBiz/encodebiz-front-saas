
import { ContactFromModel } from "@/domain/core/IContact";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
export interface IAddress {
  addressQuery: string
  country: string
  lat: number
  lng: number
  provider: string
  resolvedText: string

}

export async function fetchLocation(data: {
  "address": string,
  "country"?: string
}, token: string): Promise<Array<IAddress>> {
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
        process.env.NEXT_PUBLIC_BACKEND_HELPER_MAPBOX as string, data);
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }

      return response;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}




export async function sendFormContact(data: ContactFromModel): Promise<void> {
  try {
    if (!data.token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          authorization: `Bearer ${data.token}`,
        },
      });
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
    throw new Error(error.message);
  }
}




