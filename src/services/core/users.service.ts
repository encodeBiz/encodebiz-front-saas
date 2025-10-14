import { collection } from "@/config/collection";
import { getAll, getOne } from "@/lib/firebase/firestore/readDocument";
import IUser from "@/domain/core/auth/IUser";
import { mapperErrorFromBack } from "@/lib/common/String";


/**
 * Fetch all users
 */
export async function fetchUsers(): Promise<IUser[]> {
  try {
    const entities = await getAll<IUser>(collection.USER);
    return entities;
  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}


/**
 * Fetch all users
 */
export async function fetchUser(userId: string): Promise<IUser> {
  try {
    const entities = await getOne<IUser>(collection.USER, userId);
    return entities;
  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, false) as string);
  }
}