import { SearchParams } from "@/domain/core/firebase/firestore";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { collection } from "@/config/collection";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { IReport } from "@/domain/features/checkinbiz/IReport";
import { mapperErrorFromBack } from "@/lib/common/String";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { updateDocument } from "@/lib/firebase/firestore/updateDocument";
import { IBranchPattern } from "@/domain/features/checkinbiz/IStats";



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
    return result[0];
  return null
}
