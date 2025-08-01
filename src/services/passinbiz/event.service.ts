import { SearchParams } from "@/domain/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { deleteDocument } from "@/lib/firebase/firestore/deleteDocument";
import { EventFromValues } from "@/app/main/passinbiz/event/form/page.controller";


/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const fetchEvent = async (entityId: string, id: string): Promise<IEvent> => {
  return await getOne(
    `${collection.ENTITIES}/${entityId}/${collection.EVENT}`,
    id);
}

/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const deleteEvent = async (entityId: string, id: string, token: string): Promise<void> => {
  await deleteDocument({
    collection: `${collection.ENTITIES}/${entityId}/${collection.EVENT}`,
    id
  });
}


/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const search = async (entityId: string, params: SearchParams): Promise<IEvent[]> => {
  const result: IEvent[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.EVENT}`,
  });

  return result;
}


export async function createEvent(data: EventFromValues, token: string) {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          token: `Bearer ${token}`,
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_CREATE_EVENT as string,
        {
          ...data,
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

export async function updateEvent(data: EventFromValues, token: string) {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          token: `Bearer ${token}`,
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_UPDATE_EVENT as string,
        {
          ...data,
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



