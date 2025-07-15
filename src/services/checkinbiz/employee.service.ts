import { SearchParams } from "@/domain/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { deleteDocument } from "@/lib/firebase/firestore/deleteDocument";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { EmployeeFromValues } from "@/app/main/checkinbiz/employee/add/page.controller";


/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const fetchEmployee = async (entityId: string, id: string): Promise<IEmployee> => {
  return await getOne(
    `${collection.ENTITIES}/${entityId}/${collection.EMPLOYEE}`,
    id);
}

/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const deleteEmployee = async (entityId: string, id: string, token: string): Promise<void> => {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_DELETE_EMPLOYEE as string,
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


/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const search = async (entityId: string, params: SearchParams): Promise<IEmployee[]> => {
  const result: IEmployee[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.EMPLOYEE}`,
  });

  return result;
}


export async function createEmployee(data: EmployeeFromValues, token: string) {
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
    throw new Error(error.message);
  }
}

export async function updateEmployee(data: EmployeeFromValues, token: string) {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_UPDATE_EMPLOYEE as string,
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



