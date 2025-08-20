import { signOut } from "firebase/auth";
import { auth } from "../initializeApp";

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error:unknown) {
    throw new Error("Error al cerrar sesión"+error);
  }
};