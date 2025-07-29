import { collection } from "@/config/collection";
import { getAll, getOne } from "@/lib/firebase/firestore/readDocument";
import IUser from "@/domain/auth/IUser";


/**
 * Fetch all users
 */
export async function fetchUsers(): Promise<IUser[]> {
  try {
    const entities = await getAll<IUser>(collection.USER);
    return entities;
  } catch (error: any) {
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
}