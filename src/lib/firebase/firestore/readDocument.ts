import {
  getDoc,
  doc,
  collectionGroup,
  query,
  where,
  CollectionReference,
  DocumentData,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../initializeApp";


/**
 * Fetch one docs by id as data
 *
 * @async
 * @template T
 * @param {string} collectionName
 * @param {string} id
 * @returns {Promise<T>}
 */
export const getOne = async <T>(
  collectionName: string,
  id: string,
  group: boolean = false
): Promise<T> => {
  if (group) {
    let firestoreQuery = collectionGroup(db, `${collectionName}`);
    firestoreQuery = query(
      firestoreQuery,
      where("id", "==", id)
    ) as CollectionReference<DocumentData, DocumentData>;

    firestoreQuery = query(
      firestoreQuery,
      orderBy("createdAt", "asc")
    ) as CollectionReference<DocumentData, DocumentData>;

    const querySnapshot = await getDocs(firestoreQuery);
    return {
      ...querySnapshot.docs[0].data(),
      id: querySnapshot.docs[0].id,
    } as T;
  } else {
    let docRef = doc(db, `${collectionName}`, id);
    const docSnap = await getDoc(docRef);
    return { ...docSnap.data(), id: docSnap.id } as T;
  }
};

/**
 * Fetch one docs by id
 *
 * @async
 * @template T
 * @param {string} collectionName
 * @param {string} id
 * @returns {Promise<T>}
 */
export const getIndex = async <T>(
  collectionName: string,
  id: string
): Promise<T> => {
  let docRef = doc(db, `${collectionName}`, id);
  const docSnap = await getDoc(docRef);
  return docSnap as T;
};
