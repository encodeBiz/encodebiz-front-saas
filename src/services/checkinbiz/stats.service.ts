 import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { mapperErrorFromBack } from "@/lib/common/String";
import { IBranchPattern } from "@/domain/features/checkinbiz/IStats";
import { fetchSucursal } from "./sucursal.service";



/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const fetchBranchPattern = async (entityId: string, branchId: string): Promise<IBranchPattern | null> => {
  const filters = [
    {
      field: 'branchId',
      operator: '==',
      value: branchId,
    },

    {
      field: 'entityId',
      operator: '==',
      value: entityId,
    },
  ];
  const result: IBranchPattern[] = await searchFirestore({
    ...[] as any,
    filters,
    collection: `${collection.BRANCH_PATTER}`,
  });
  if (result.length > 0)
    return {
      ...result[0],
      branch: await fetchSucursal(result[0].entityId, result[0].branchId)
    };
  return null
}


export async function analiziHeuristic(entityId: string, branchId: string, token: string, locale: any = 'es') {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          authorization: `Bearer ${token}`,locale
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_STATS as string,
        {
          entityId, branchId
        }
      );
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }

      return response?.results as Array<any>??[];
    }
  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, true) as string);
  }



}