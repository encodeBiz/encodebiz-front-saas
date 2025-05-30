import { initializeApp } from "firebase/app";

//PROD


const firebaseConfig = {
  apiKey: "AIzaSyADQWsgPcrYiiVJveu8nslgpWtL-SFOZaQ",
  authDomain: "encodebiz-services.firebaseapp.com",
  projectId: "encodebiz-services",
  storageBucket: "encodebiz-services.firebasestorage.app",
  messagingSenderId: "278727535409",
  appId: "1:278727535409:web:1794f5ffb57a85c23a5e10",
  measurementId: "G-0WD1K5Z381"
};


 

export const DEV_PREFIX = "";
// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;

