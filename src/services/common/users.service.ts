import { collection } from "@/config/collection";
import { getAll } from "@/lib/firebase/firestore/readDocument";
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