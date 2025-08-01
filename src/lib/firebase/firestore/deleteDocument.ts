 import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../initializeApp";
import { DeleteDocumentParams } from "@/domain/firebase/firestore";



export const deleteDocument = async (params: DeleteDocumentParams): Promise<void> => {
  const { collection: collectionName, id } = params;

  try {
    const docRef = doc(db, `${collectionName}`, id);
    await deleteDoc(docRef);
    console.log(`Document with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw new Error("Error deleting document");
  }
};