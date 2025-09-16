import { SearchParams } from "@/domain/core/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
 

/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const fetchSucursal = async (entityId: string, id: string): Promise<ISucursal> => {
  return await getOne(
    `${collection.ENTITIES}/${entityId}/${collection.SUCURSAL}`,
    id);
}



/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const search = async (entityId: string, params: SearchParams): Promise<ISucursal[]> => {
  const result: ISucursal[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.SUCURSAL}`,
  });

  return result;
}

export async function createSucursal(data: Partial<ISucursal>, token: string) {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_CREATE_SUCURSAL as string,
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

export async function updateSucursal(data: Partial<ISucursal>, token: string) {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_UPDATE_SUCURSAL as string,
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


/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const deleteSucursal = async (entityId: string, id: string, token: string): Promise<void> => {
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
      const response: any = await httpClientFetchInstance.delete(
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_DELETE_SUCURSAL as string,
        {
          id, entityId
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



