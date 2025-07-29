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
  collection,
  limit,
  startAfter,
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
    const docRef = doc(db, `${collectionName}`, id);
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
  const docRef = doc(db, `${collectionName}`, id);
  const docSnap = await getDoc(docRef);
  return docSnap as T;
};

export const getAll = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    return data;
  } catch (error: any) {
    throw new Error(`Error al cargar todas las entidades: ${error.message}`);
  }
};

export const getCollectionCount = async (collectionName: string): Promise<number> => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.size;
  } catch (error) {
    console.error(`Error al obtener el total de documentos en ${collectionName}:`, error);
    return 0;
  }
};

export const getAllWithLimit = async <T>(
  collectionName: string,
  limitCount: number = 50,
  startAfterDoc?: any
): Promise<{ data: T[]; lastVisible: any }> => {
  try {
    const collectionRef = collection(db, collectionName);
    const total = await getCollectionCount(collectionName);

    let firestoreQuery = query(collectionRef, orderBy('createdAt'), limit(limitCount));

    if (startAfterDoc) {
      firestoreQuery = query(
        collectionRef,
        orderBy('createdAt'),
        startAfter(startAfterDoc),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(firestoreQuery);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      total:total,
      ...doc.data()
    })) as T[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      data,
      lastVisible,
    };
  } catch (error: any) {
    throw new Error(`Error al obtener datos con paginación: ${error.message}`);
  }
};
