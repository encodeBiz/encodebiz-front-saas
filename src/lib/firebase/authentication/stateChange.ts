import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../initializeApp";

export const subscribeToAuthChanges = (callback: (user: any ) => void) => {
    return onAuthStateChanged(auth, callback);
};