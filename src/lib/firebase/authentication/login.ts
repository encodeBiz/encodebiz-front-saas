import {
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../initializeApp";
import { codeError } from "@/lib/http/httpClientFetchNext";

export const login = async (params: LoginParams): Promise<UserCredential> => {
  const { email, password } = params;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error: any) {
    const message = codeError[error.code];
    throw new Error(message ? message : error?.message);
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    return result;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const loginWithToken = async (token: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithCustomToken(
      auth,
      token
    );
    return userCredential;
  } catch (error: any) {
    const message = codeError[error.code];
    throw new Error(message ? message : error?.message);
  }
};

export const getUser = async (): Promise<User | null> => {
  return auth.currentUser;
};

export const changePassword = async function (
  user: User,
  password: string
): Promise<void> {
  await updatePassword(user, password);
};

export const deleteAccount = async function (user: User): Promise<void> {
  await deleteUser(user);
};

export const recovery = async function ({ email }: any): Promise<void> { };
