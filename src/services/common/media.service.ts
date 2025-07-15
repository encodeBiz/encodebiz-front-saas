
import { getAll, getAllWithLimit } from "@/lib/firebase/firestore/readDocument";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { IUserMedia } from "@/domain/core/IUserMedia";
import { SearchParams } from "@/domain/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";


export async function uploadMedia(
  data: IUserMedia | any,
  token: string
) {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {


      let httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          token: `Bearer ${token}`,
        },
      });
      const headers = {
        headers: {
          token: `Bearer ${token}`,
        }
      }
      const response: any = await httpClientFetchInstance.upload(
        process.env.NEXT_PUBLIC_BACKEND_URI_UPLOAD_MEDIA as string,
        data,
        headers
      );
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }

      return response


    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}


/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const search = async (entityId: string, params: SearchParams): Promise<IUserMedia[]> => {
  
  
  const result: IUserMedia[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.MEDIA}`,
  });

  return result;
}

/**
 * Servicio para obtener todas las entidades
 */
export async function fetchAllMedia(entityId: string): Promise<Array<IUserMedia>> {
  try {
    const entities = await getAll<IUserMedia>(`${collection.ENTITIES}/${entityId}/${collection.MEDIA}`);
    return entities;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Servicio para obtener entidades con límite y paginación
 */
export async function fetchAllMediaPaginated(limitCount: number = 5, startAfter: any = undefined) {
  try {
    const { data, lastVisible } = await getAllWithLimit<IUserMedia>(collection.ENTITIES, limitCount, startAfter);
    return { items: data, lastVisible };
  } catch (error: any) {
    throw new Error(error.message);
  }
}


export async function deleteMedia(data: {
  "mediaId": string,
  "entityId": string
} | any, token: string) {
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
      const response: any = await httpClientFetchInstance.delete(process.env.NEXT_PUBLIC_BACKEND_URI_DELETE_MEDIA as string, {
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