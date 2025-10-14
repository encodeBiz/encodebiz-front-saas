import { SearchParams } from "@/domain/core/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { IReport } from "@/domain/features/checkinbiz/IReport";
import { mapperErrorFromBack } from "@/lib/common/String";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
 

/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const fetchChecklog = async (entityId: string, id: string): Promise<IChecklog> => {
  return await getOne(
    `${collection.ENTITIES}/${entityId}/${collection.CHECKLOG}`,
    id);
}



/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const search = async (entityId: string, params: SearchParams): Promise<IEmployee[]> => {
  const result: IEmployee[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.CHECKBIZ_REPORT}`,
  });

  return result;
}

export async function createReport(data: Partial<IReport>, token: string) {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_CREATE_EMPLOYEE as string,
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
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
 
  
  
}

export async function updateChecklog(data: Partial<IChecklog>, token: string) {
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
          process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_UPDATE_LOG as string,
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
      throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
    }
  }
 