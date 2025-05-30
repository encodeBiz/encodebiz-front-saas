
import {
    collection,
    doc,
} from "firebase/firestore";
import { db } from "../initializeApp";

export const generateUniqueId = (collectionName: string) => {
    const newDocRef = doc(collection(db, collectionName));
    return newDocRef.id; 
}
