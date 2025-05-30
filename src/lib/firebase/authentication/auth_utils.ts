import { auth } from "../initializeAdminSDKApp";

export const verifyToken = async function (token: string): Promise<string> {
  let decodedToken = await auth!.verifyIdToken(token!);
  return decodedToken.uid;
};
