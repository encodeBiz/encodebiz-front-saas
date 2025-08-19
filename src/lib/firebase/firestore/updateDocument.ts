 import {  doc, updateDoc, DocumentReference,setDoc } from "firebase/firestore";
import { db } from "../initializeApp";
import { SetDocumentParams, UpdateDocumentParams } from "@/domain/firebase/firestore";




export const updateDocument = async <T>(params: UpdateDocumentParams<T>): Promise<DocumentReference<T>> => {
  const { collection: collectionName, id, data } = params;

  try {
    const docRef = doc(db, `${collectionName}`, id);
    await updateDoc(docRef, data);
    return docRef as DocumentReference<T>;
  } catch (error) {
    throw new Error("Error updating document");
  }
};

export const setDocument = async <T>(params: SetDocumentParams): Promise<DocumentReference<T>> => {
  const { collection: collectionName, id, data, merge = true } = params;

  try {
    const docRef = doc(db, `${collectionName}`, id);
    await setDoc(docRef, data, { merge });
    return docRef as DocumentReference<T>;
  } catch (error) {
    throw new Error("Error setting document");  
  }
};