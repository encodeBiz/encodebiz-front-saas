import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import firebaseApp from '@/config/firebase.mjs'
import { getStorage } from "firebase/storage";
import { Analytics, getAnalytics , isSupported} from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";


// Inicializar Authentication
 const auth = getAuth(firebaseApp);
 const db = getFirestore(firebaseApp);
 if(process.env.NEXT_PUBLIC_ENV == 'local'){
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  console.log('CONECTADO A LOCAL FIRESTORE')
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