import { SearchParams } from "@/domain/core/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { IChecklog, ICreateLog } from "@/domain/features/checkinbiz/IChecklog";


/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const fetchEmployee = async (entityId: string, id: string): Promise<IEmployee> => {
  return await getOne(
    `${collection.ENTITIES}/${entityId}/${collection.EMPLOYEE}`,
    id);
}

export const fetch2FAData = async (entityId: string, id: string): Promise<{ twoFA: boolean, trustedDevicesId: Array<string>}> => {


  const result: any[] = await searchFirestore(
    {
      limit: 2,
      collection: `${collection.ENTITIES}/${entityId}/${collection.EMPLOYEE}/${id}/security`,
    });


  return {
    twoFA: result.find(e => e.id === "twoFA"),
    trustedDevicesId: result.find(e => e.id === "trustedDevicesId")?.ids,
  }

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
    collection: `${collection.ENTITIES}/${entityId}/${collection.EMPLOYEE}`,
  });

  return result;
}

export async function createEmployee(data: Partial<IEmployee>, token: string) {
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
    throw new Error(error.message);
  }
}

export async function updateEmployee(data: Partial<IEmployee>, token: string) {
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


/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const deleteEmployee = async (entityId: string, id: string, token: string): Promise<void> => {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_DELETE_EMPLOYEE as string,
        {
          employeeId: id, entityId
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



export async function createLog(data: ICreateLog, token: string) {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_CREATE_LOG as string,
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

export const getEmplyeeLogs = async (entityId: string, employeeId: string, branchId: string, params: SearchParams): Promise<IChecklog[]> => {


  let result: IChecklog[] = []
  if (entityId) {
    result = await searchFirestore({
      ...params,
      filters: [
        ...params.filters ? params.filters : [],
        { field: 'employeeId', operator: '==', value: employeeId },
        { field: 'branchId', operator: '==', value: branchId },
      ],
      collection: `${collection.ENTITIES}/${entityId}/checklogs`,
    });
  }

  return result;
}

export const getEmplyeeLogsState = async (entityId: string, employeeId: string, params: SearchParams): Promise<IChecklog[]> => {

  const result: IChecklog[] = await searchFirestore({
    ...params,
    filters: [
      ...params.filters ? params.filters : [],
      { field: 'employeeId', operator: '==', value: employeeId },
      { field: 'status', operator: '==', value: 'valid' }
    ],
    collection: `${collection.ENTITIES}/${entityId}/checklogs`,
  });

  return result;
}


export async function validateEmployee(token: string) {
  try {

    const httpClientFetchInstance: HttpClient = new HttpClient({
      baseURL: "",
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    const response: any = await httpClientFetchInstance.post(
      process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_VALIDATE_EMPLOYEE as string,
      {
        token
      }
    );
    if (response.errCode && response.errCode !== 200) {
      throw new Error(response.message);
    }

    return response;

  } catch (error: any) {
    throw new Error(error.message);
  }
}


export async function enable2AF(token: string) {
  try {

    const httpClientFetchInstance: HttpClient = new HttpClient({
      baseURL: "",
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    const response: any = await httpClientFetchInstance.post(
      process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_ENABLE2AF_EMPLOYEE as string,
      {
        token
      }
    );
    if (response.errCode && response.errCode !== 200) {
      throw new Error(response.message);
    }

    return response;

  } catch (error: any) {
    throw new Error(error.message);
  }
}


export async function verify2AF(code: string, token: string) {
  try {

    const httpClientFetchInstance: HttpClient = new HttpClient({
      baseURL: "",
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    const response: any = await httpClientFetchInstance.post(
      process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_VERIFY2AF_EMPLOYEE as string,
      {
        code
      }
    );
    if (response.errCode && response.errCode !== 200) {
      throw new Error(response.message);
    }

    return response;

  } catch (error: any) {
    throw new Error(error.message);
  }
}


export const searchLogs = async (entityId: string, params: SearchParams): Promise<IChecklog[]> => {
  const result: IChecklog[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.CHECKLOG}`,
  });

  return result;
}