import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCIr7rtjf8vEFhWAwlUZvGy_FqDNE8sJ6I",
  authDomain: "telemed-healthbridge.firebaseapp.com",
  projectId: "telemed-healthbridge",
  storageBucket: "telemed-healthbridge.firebasestorage.app",
  messagingSenderId: "619059230883",
  appId: "1:619059230883:web:bc8d86ba16ff69be69a716"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize admin account if it doesn't exist
const initializeAdmin = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "rajesh.kumar.barik@icloud.com", "Rajesh09#");
    
    // Set admin role in Firestore
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      email: "rajesh.kumar.barik@icloud.com",
      name: "Rajesh Kumar",
      role: "admin",
      verified: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    // If the account already exists, that's fine
    if (error.code !== 'auth/email-already-in-use') {
      console.error('Error creating admin account:', error);
    }
  }
};

// Call initializeAdmin when the app starts
initializeAdmin();
