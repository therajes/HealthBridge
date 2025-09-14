import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCIr7rtjf8vEFhWAwlUZvGy_FqDNE8sJ6I",
  authDomain: "telemed-healthbridge.firebaseapp.com",
  projectId: "telemed-healthbridge",
  storageBucket: "telemed-healthbridge.firebasestorage.app",
  messagingSenderId: "619059230883",
  appId: "1:619059230883:web:bc8d86ba16ff69be69a716"
};

// Initialize Firebase (client)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
