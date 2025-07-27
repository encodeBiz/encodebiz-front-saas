import { SearchParams } from "@/domain/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { IStaff } from "@/domain/features/passinbiz/IStaff";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { deleteDocument } from "@/lib/firebase/firestore/deleteDocument";
import { StaffFormValues } from "@/app/main/passinbiz/staff/form/page";


/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<IStaff[]>}
   */
export const fetchStaff = async (entityId: string, id: string): Promise<IStaff> => {
  return await getOne(
    `${collection.ENTITIES}/${entityId}/${collection.STAFF}`,
    id);
}

/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<IStaff[]>}
   */
export const deleteStaff = async (entityId: string, id: string, token: string): Promise<void> => {

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
        entityId,
        staffId:id
      });
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message)
      }
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}



/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<IStaff[]>}
   */
export const search = async (entityId: string, params: SearchParams): Promise<IStaff[]> => {
  const result: IStaff[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.STAFF}`,
  });

  return result;
}


export async function createStaff(data: StaffFormValues, token: string) {
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
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_CREATE_STAFF as string,
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

export async function updateStaff(data: StaffFormValues, token: string) {
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
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_UPDATE_STAFF as string,
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



