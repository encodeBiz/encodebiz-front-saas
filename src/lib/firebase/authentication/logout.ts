import { signOut } from "firebase/auth";
import { auth } from "../initializeApp";

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("Logout exitoso");
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
    throw new Error("Error al cerrar sesión");
  }
};