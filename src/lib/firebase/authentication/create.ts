import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../initializeApp";

export async function createAnonymously() {
  signInAnonymously(auth)
    .then(() => { })
    .catch(() => {});
}

export async function createUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function updateProfileData(currentUser: User, userData: any) {
  return updateProfile(currentUser, {
    displayName: `${userData.first_name} ${userData.last_name}`,
  });
}
