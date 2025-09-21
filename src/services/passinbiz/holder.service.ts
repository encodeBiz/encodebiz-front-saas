import { SearchParams } from "@/domain/core/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { Holder } from "@/domain/features/passinbiz/IHolder";
import { getOne } from "@/lib/firebase/firestore/readDocument";
  

/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const search = async (entityId: string, params: SearchParams): Promise<Holder[]> => {
  const result: Holder[] = await searchFirestore({
    ...params,
    collection: `${collection.ENTITIES}/${entityId}/${collection.HOLDER}`,
  });

  return result;
}


/**
   * Search trainer
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<ITrainer[]>}
   */
export const fetchHolder = async (entityId: string, id: string): Promise<Holder> => {
  return await getOne(
    `${collection.ENTITIES}/${entityId}/${collection.HOLDER}`,
    id);
}


export async function createHolder(data: Partial<Holder>, token: string) {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_CREATE_HOLDER as string,
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

/*
export async function updateHolder(data: Partial<Holder>, token: string) {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      await updateDocument<Partial<any>>({
        collection: `${collection.ENTITIES}/${data.entityId}/${collection.HOLDER}`,
        data: {
          ...data,
          updatedAt: new Date(),
        },
        id: data.id as string,
      });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}
*/

export async function updateHolder(data: Partial<Holder>, token: string) {
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
      const response: any = await httpClientFetchInstance.put(
        process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_UPDATE_HOLDER as string,
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

export async function importHolder(data: FormData, token: string) {
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
      const response: any = await httpClientFetchInstance.upload(
        process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_IMPORT_HOLDER as string,
        data
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



export async function fetchStats(data: any, token: string) {
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
        process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_STATS as string,
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




export async function deleteHolder(data: {
  "holderId": string,
  "entityId": string
} | any, token: string) {
  try {

    if (!token) {
      throw new Error('Error to fetch user auth token')
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: '',
        headers: {
          authorization: `Bearer ${token}`
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


export async function validateHolder(data: any, tokenValidateStaff: string) {
  try {

    const httpClientFetchInstance: HttpClient = new HttpClient({
      baseURL: "",
      headers: {
        'authorization': `Bearer ${tokenValidateStaff}`,
      },
    });
    const response: any = await httpClientFetchInstance.post(
      process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_VALIDATE_HOLDER as string,
      {
        ...data,
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


export async function validateStaff(base64: string) {
  try {

    const httpClientFetchInstance: HttpClient = new HttpClient({
      baseURL: "",
      headers: {},
    });
    const response: any = await httpClientFetchInstance.post(
      process.env.NEXT_PUBLIC_BACKEND_URI_PASSINBIZ_VALIDATE_STAFF as string,
      {
        token: base64,
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