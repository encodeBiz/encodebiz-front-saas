import { SearchParams } from "@/domain/core/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { EmployeeEntityResponsibility, IEmployee, Job } from "@/domain/features/checkinbiz/IEmployee";
import { IChecklog, ICreateLog } from "@/domain/features/checkinbiz/IChecklog";
import { mapperErrorFromBack, normalizarString } from "@/lib/common/String";
import { addDocument } from "@/lib/firebase/firestore/addDocument";
import { updateDocument } from "@/lib/firebase/firestore/updateDocument";
import { deleteDocument } from "@/lib/firebase/firestore/deleteDocument";
import { IIssue, IIssueResponse } from "@/domain/features/checkinbiz/IIssue";


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

export const fetch2FAData = async (entityId: string, id: string): Promise<{ twoFA: boolean, trustedDevicesId: Array<string> }> => {
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


  return result
}

export const emptyEmployee = async (entityId: string): Promise<boolean> => {
  const data: IEmployee[] = await searchFirestore({
    ...{ limit: 1 } as any,
    collection: `${collection.ENTITIES}/${entityId}/${collection.EMPLOYEE}`,
  });

  return data.length === 0
}

/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const searchJobs = async (entityId: string): Promise<Job[]> => {
  const result: Job[] = await searchFirestore({
    ...{ limit: 10000 } as any,
    collection: `${collection.ENTITIES}/${entityId}/${collection.JOBS}`,
  });

  return result;
}


/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const searchResponsabilityByBranch = async (entityId: string, branchId: string, params: SearchParams): Promise<EmployeeEntityResponsibility[]> => {



  const result: EmployeeEntityResponsibility[] = await searchFirestore({
    ...params,

    filters: [...(params.filters ?? []), {
      field: 'scope.branchId', operator: '==', value: branchId
    }],
    collection: `${collection.ENTITIES}/${entityId}/${collection.RESPONSABILITY}`,
  });

  return result;
}

export const searchResponsability = async (entityId: string, employeeId: string, limit: number, filters: Array<{ field: string, operator: string, value: any }> = []): Promise<EmployeeEntityResponsibility[]> => {


  const result: EmployeeEntityResponsibility[] = await searchFirestore({
    ...{
      limit: limit,
      orderBy: 'active',
      orderDirection: "asc",
      filters: [...filters, {
        field: 'employeeId', operator: '==', value: employeeId
      }]
    } as any,
    collection: `${collection.ENTITIES}/${entityId}/${collection.RESPONSABILITY}`,
  });

  return result;
}

/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const addJobs = async (entityId: string, jobName: string, price: number): Promise<void> => {
  try {
    const result: Job[] = await searchFirestore({
      ...{ limit: 10000 } as any,
      collection: `${collection.ENTITIES}/${entityId}/${collection.JOBS}`,
    });

    const normalizeJobName = jobName.trim().toLocaleLowerCase()
    const item = result.find(e => normalizarString(e.job) === normalizarString(normalizeJobName))
    if (item) {
      await updateDocument<Job>({
        collection: `${collection.ENTITIES}/${entityId}/${collection.JOBS}`,
        data: {
          job: normalizeJobName,
          price: parseFloat(`${price}`)
        },
        id: item.id as string
      });
    } else {
      await addDocument<Job>({
        collection: `${collection.ENTITIES}/${entityId}/${collection.JOBS}`,
        data: {
          job: normalizeJobName,
          price: parseFloat(`${price}`)
        }
      });
    }


  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }

}


export const deleteJobs = async (entityId: string, jobName: string): Promise<void> => {
  try {
    const result: Job[] = await searchFirestore({
      ...{ limit: 10000 } as any,
      collection: `${collection.ENTITIES}/${entityId}/${collection.JOBS}`,
    });

    const item: Job = result.find(e => e.job.toLocaleLowerCase().trim() === jobName.toLocaleLowerCase().trim()) as Job
    if (item) {
      await deleteDocument({
        collection: `${collection.ENTITIES}/${entityId}/${collection.JOBS}`,
        id: item.id as string
      });
    }
  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }

}

export async function createEmployee(data: Partial<IEmployee>, token: string, locale: any = 'es') {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          authorization: `Bearer ${token}`,
          locale
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

export async function updateEmployee(data: Partial<IEmployee>, token: string, locale: any = 'es') {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          authorization: `Bearer ${token}`,
          locale
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
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}

export async function handleRespnsability(data: Partial<EmployeeEntityResponsibility>, token: string, locale: any = 'es', operation: 'post' | 'patch' | 'delete') {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          authorization: `Bearer ${token}`,
          locale
        },
      });
      const response: any = await httpClientFetchInstance[operation](
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_RESPONSABILITY_HANDLER as string,
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
/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const deleteEmployee = async (entityId: string, id: string, token: string, locale: any = 'es'): Promise<void> => {
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
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}



export async function createLog(data: ICreateLog, token: string, locale: any = 'es') {
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

    throw new Error(mapperErrorFromBack(error?.message as string, true) as string);
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


export async function validateEmployee(token: string, locale: any = 'es') {
  try {

    const httpClientFetchInstance: HttpClient = new HttpClient({
      baseURL: "",
      headers: {
        'authorization': `Bearer ${token}`, locale
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
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}


export async function enable2AF(token: string, locale: any = 'es') {
  try {

    const httpClientFetchInstance: HttpClient = new HttpClient({
      baseURL: "",
      headers: {
        'authorization': `Bearer ${token}`, locale
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
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}


export async function verify2AF(code: string, token: string, locale: any = 'es') {
  try {

    const httpClientFetchInstance: HttpClient = new HttpClient({
      baseURL: "",
      headers: {
        'authorization': `Bearer ${token}`, locale
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
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}


export const searchLogs = async (entityId: string, params: SearchParams): Promise<IChecklog[]> => {
  const result: IChecklog[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.CHECKLOG}`,
  });

  return result;
}


export const getIssues = async (entityId: string, params: SearchParams): Promise<IIssue[]> => {



  const result: IIssue[] = await searchFirestore({
    ...params,
    filters: [
      ...params.filters ? params.filters : [],
      { field: 'entityId', operator: '==', value: entityId }
    ],
    collection: `${collection.ISSUES}`,
  });

  return result;
}

export const fetchIssue = async (id: string): Promise<IIssue> => {
  return await getOne(
    `${collection.ISSUES}`,
    id);
}


export const getIssuesResponsesLists = async (issuesId: string, params: SearchParams): Promise<IIssueResponse[]> => {

  const result: IIssueResponse[] = await searchFirestore({
    ...params,
    filters: [
      ...params.filters ? params.filters : [],
    ],
    collection: `${collection.ISSUES}/${issuesId}/responses`,
    orderBy:'',
    orderDirection:'desc'
  });

  return result;
}