 import {
  collection,
  addDoc,
  DocumentReference,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../initializeApp";
import { AddDocumentParams } from "@/domain/core/firebase/firestore";
 
export const addDocument = async <T>(
  params: AddDocumentParams
): Promise<DocumentReference<T>> => {
  const { collection: collectionName, data } = params;
  try {
    const docRef = await addDoc(
      collection(db, `${collectionName}`),
      data
    );
    await setDoc(docRef, { id: docRef.id }, { merge: true });
    return docRef as DocumentReference<T>;
  } catch (error) { 
    throw new Error("Error adding document" + error);
  }
};

export const createDocumentWithId = async <T>(
  params: AddDocumentParams
): Promise<DocumentReference<T>> => {
  const { collection: collectionName, id, data } = params;

  try {
    const docRef = doc(db, `${`${collectionName}`}/${id}`);
    await setDoc(docRef, data);
    return docRef as DocumentReference<T>;
  } catch (error) {
    throw new Error("Error creating document with ID"+error);
  }
};
