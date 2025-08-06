import { signInWithCustomToken,  UserCredential } from "firebase/auth";
import { auth } from "../initializeAdminSDKApp";

export const verifyToken = async function (token: string): Promise<string> {
  try {
    const decodedToken = await auth!.verifyIdToken(token!);
    return decodedToken.uid;
  } catch (error: any) {
    return error
  }


};


export const signInWithToken = async (token: string): Promise<UserCredential> => {
  try {
    return await signInWithCustomToken(auth as any, token);
  } catch (error) {
    throw error;
  }
};
 