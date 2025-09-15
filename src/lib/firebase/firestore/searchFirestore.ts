import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  CollectionReference,
  DocumentData,
  doc,
  getCountFromServer,
  collectionGroup,
  Query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../initializeApp";
import { SearchParams } from "@/domain/core/firebase/firestore";
import { getRefByPath } from "./readDocument";


export const searchFirestore = async <T>(
  params: SearchParams,
  group: boolean = false
): Promise<T[]> => {


  const {
    collection: collectionName,
    filters = [],
    orderBy: orderField,
    orderDirection = "asc",
    limit: queryLimit,
    startAfter: startAfterDoc,
    includeCount = true,
  } = params;



  let firestoreQuery:
    | CollectionReference<DocumentData, DocumentData>
    | Query<DocumentData, DocumentData>;
  if (group)
    firestoreQuery = collectionGroup(db, `${collectionName}`);
  else firestoreQuery = collection(db, `${collectionName}`);
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


  let count: number | undefined;
  if (includeCount) {
    const firestoreQuery1 = query(
      firestoreQuery,
      limit(10000000)
    ) as CollectionReference<DocumentData, DocumentData>;
    count = (await getCountFromServer(firestoreQuery1)).data().count;
  }


  // Agregar paginación a la consulta
  
  if (startAfterDoc) {
 
    firestoreQuery = query(
      firestoreQuery,
      startAfter(await getRefByPath(startAfterDoc))
    ) as CollectionReference<DocumentData, DocumentData>;
  }

  // Ejecutar la consulta y obtener los documentos
  const querySnapshot = await getDocs(firestoreQuery);
  const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
  const results = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    totalItems: count,
    last: lastDocument.ref.path,
  })) as T[];
 
  return results;
};



export const countFirestore = async (params: SearchParams): Promise<number> => {
  const {
    collection: collectionName,
    filters = [],
    orderBy: orderField,
    orderDirection = "asc",
  } = params;

  let firestoreQuery = collection(db, `${collectionName}`);

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
  const querySnapshot = await getCountFromServer(firestoreQuery);
  return querySnapshot.data().count;
};

export const searchFirestoreCount = async (
  params: SearchParams
): Promise<number> => {
  const {
    collection: collectionName,
    orderBy: orderField,
    filters = [],
    orderDirection = "asc",
  } = params;

  let firestoreQuery = collection(db, `${collectionName}`);

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


  const countSnapshot = await getCountFromServer(firestoreQuery);
  const count = countSnapshot.data().count;
  return count;
};

export const onSnapshotFirestore = (
  collectionName: string,
  onEnd: (data: any) => void
) => {
  const docRef = doc(db, `${collectionName}`);
  return onSnapshot(docRef, { includeMetadataChanges: true }, (doc) => {

    onEnd(doc.data());
  });
};


export const onSnapshotCollection = (
  collectionName: string,
  handleSnapshot: (type: 'added' | 'removed' | 'modified', doc: any) => void
) => {
  return onSnapshot(collection(db, `${collectionName}`), (snapshot) => {
    snapshot.docChanges().forEach(state => {
      handleSnapshot(state.type, doc)
    });
  });
};
