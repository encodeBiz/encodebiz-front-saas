import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { mapperErrorFromBack } from "@/lib/common/String";
import { IBranchPattern, IEmployeePattern, IHeuristicIndicator } from "@/domain/features/checkinbiz/IStats";
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


/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const fetchEmployeePattern = async (entityId: string, employeeId: string): Promise<Array<IEmployeePattern>> => {
  const filters = [
    {
      field: 'employeeId',
      operator: '==',
      value: employeeId,
    },

    {
      field: 'entityId',
      operator: '==',
      value: entityId,
    },
  ];
  const result: IEmployeePattern[] = await searchFirestore({
    ...[] as any,
    filters,
    collection: `${collection.EMPLOYEE_PATTER}`,
  });
  return result.filter(e => e.id === `${employeeId}_${entityId}`)
}

/**
   * Search employee
   *
   * @async
   * @param {SearchParams} params
   * @returns {Promise<Iemployee[]>}
   */
export const fetchHeuristicsIndicator = async (): Promise<Array<IHeuristicIndicator>> => {
  const filters: any = [];
  return await searchFirestore({
    ...[] as any,
    filters,
    collection: `${collection.HEURISTIC}`,
    limit: 100
  }) as Array<IHeuristicIndicator>;

}






export async function fetchHeuristic(entityId: string, branchId: string | null, employeeId: string | null, token: string, locale: any = 'es') {
  try {
    if (!token) {
      throw new Error("Error to fetch user auth token");
    } else {
      const body = {
        entityId, lang: locale
      }
      if (employeeId) Object.assign(body, { employeeId })
      if (branchId) Object.assign(body, { branchId })
      const httpClientFetchInstance: HttpClient = new HttpClient({
        baseURL: "",
        headers: {
          authorization: `Bearer ${token}`, locale
        },
      });
      const response: any = await httpClientFetchInstance.post(
        process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_STATS as string,
        {
          ...body
        }
      );
      if (response.errCode && response.errCode !== 200) {
        throw new Error(response.message);
      }

      return response?.results as Array<any> ?? [];
    }
  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, true) as string);
  }



}