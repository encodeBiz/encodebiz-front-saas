 import {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  CollectionReference,
  DocumentData,
  collectionGroup,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../initializeApp";
import { SearchParams } from "@/types/firebase/firestore";


 

export const searchGroupCollectionFirestore = async <T>(
  params: SearchParams
): Promise<T[]> => {
  const {
    collection: collectionName,
    filters = [],
    orderBy: orderField,
    orderDirection = "asc",
    limit: queryLimit,
    startAfter: startAfterDoc,
  } = params;

  

  let firestoreQuery = collectionGroup(db, `${collectionName}`);

  // Agregar filtros a la consulta
  if (filters.length > 0) {
    filters.forEach((filter) => {
      firestoreQuery = query(
        firestoreQuery,
        where(filter.field, filter.operator, filter.value)
      ) as CollectionReference<DocumentData, DocumentData>;
    });
  }

  // Agregar orden a la consulta
  if (orderField) {
    firestoreQuery = query(
      firestoreQuery,
      orderBy(orderField, orderDirection)
    ) as CollectionReference<DocumentData, DocumentData>;
  }

  // Agregar limitación de resultados
  if (queryLimit) {
    firestoreQuery = query(
      firestoreQuery,
      limit(queryLimit)
    ) as CollectionReference<DocumentData, DocumentData>;
  }

  // Agregar paginación a la consulta
  if (startAfterDoc) {
    firestoreQuery = query(
      firestoreQuery,
      startAfter(startAfterDoc)
    ) as CollectionReference<DocumentData, DocumentData>;
  }

  // Ejecutar la consulta y obtener los documentos
  const querySnapshot = await getDocs(firestoreQuery);
  const results = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
  return results;
};

 
/**
 * COntador para group-collection
 * @param params 
 * @returns 
 */
export const countFirestore = async(
  params: SearchParams
): Promise<number> => {
  const {
    collection: collectionName,
    filters = [],
    orderBy: orderField,
    orderDirection = "asc",       
  } = params;

  let firestoreQuery = collectionGroup(db, `${collectionName}`);

  // Agregar filtros a la consulta
  if (filters.length > 0) {
    filters.forEach((filter) => {
      firestoreQuery = query(
        firestoreQuery,
        where(filter.field, filter.operator, filter.value)
      ) as CollectionReference<DocumentData, DocumentData>;
    });
  }

  // Agregar orden a la consulta
  if (orderField) {
    firestoreQuery = query(
      firestoreQuery,
      orderBy(orderField, orderDirection)
    ) as CollectionReference<DocumentData, DocumentData>;
  }

  //Mejorar esta forma de obtener el total de documentos!!
  const querySnapshot = await getDocs(firestoreQuery);   
  return querySnapshot.docs.length;
};



export const searchFirestoreCount = async <T>(
  params: SearchParams
): Promise<number> => {
  const {
    collection: collectionName,
    orderBy: orderField,
    filters = [],
    orderDirection = "asc",
  } = params;

  let firestoreQuery = collectionGroup(db, `${collectionName}`);

  // Agregar filtros a la consulta
  if (filters.length > 0) {
    filters.forEach((filter) => {
      firestoreQuery = query(
        firestoreQuery,
        where(filter.field, filter.operator, filter.value)
      ) as CollectionReference<DocumentData, DocumentData>;
    });
  }

  // Agregar orden a la consulta
  if (orderField) {
    firestoreQuery = query(
      firestoreQuery,
      orderBy(orderField, orderDirection)
    ) as CollectionReference<DocumentData, DocumentData>;
  }

  let count: number;
  const countSnapshot = await getCountFromServer(firestoreQuery);
  count = countSnapshot.data().count;
  return count;
};