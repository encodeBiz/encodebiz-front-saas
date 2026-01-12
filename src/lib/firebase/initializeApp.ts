import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Analytics, getAnalytics , isSupported} from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,//"AIzaSyADQWsgPcrYiiVJveu8nslgpWtL-SFOZaQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,//"encodebiz-services.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,//"encodebiz-services",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,//"encodebiz-services.firebasestorage.app",
  messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,// "278727535409",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,//"1:278727535409:web:1794f5ffb57a85c23a5e10",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_APP_CODE//"G-0WD1K5Z381"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);



 const db = getFirestore(firebaseApp);
 if(process.env.NEXT_PUBLIC_ENV == 'local'){
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
 const storage = getStorage(firebaseApp);
 let analytics:Analytics | undefined;
 
 if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported && process.env.NODE_ENV === 'production') {
      analytics = getAnalytics(firebaseApp);
    }
  });
}

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export {
  googleProvider,
  auth,
  storage,
  db,
  analytics
}