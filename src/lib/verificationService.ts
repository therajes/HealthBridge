import { storage, db, auth } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { sendEmailVerification, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserRole } from '@/types/auth';
import { UserVerification, VerificationDocument } from '@/types/verification';

export const verificationService = {
  async registerUser(email: string, password: string, role: UserRole, userData: any) {
    try {
      // Create authentication account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      const userDoc = {
        email,
        role,
        verified: role === 'patient', // Patients are auto-verified after email confirmation
        emailVerified: false,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);

      // If not a patient, create verification document
      if (role !== 'patient') {
        const verificationDoc: UserVerification = {
          userId: user.uid,
          role,
          documents: [],
          status: 'pending',
          email,
          name: userData.name,
          submittedAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(doc(db, 'verifications', user.uid), verificationDoc);
      }

      return { success: true, userId: user.uid };
    } catch (error) {
      console.error('Error in registration:', error);
      throw error;
    }
  },

  async uploadVerificationDocument(
    userId: string,
    file: File,
    type: VerificationDocument['type']
  ) {
    try {
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `verifications/${userId}/${type}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      // Create verification document
      const verificationRef = doc(db, 'verifications', userId);
      const verificationDoc = await getDoc(verificationRef);

      if (!verificationDoc.exists()) {
        throw new Error('Verification record not found');
      }

      const verification = verificationDoc.data() as UserVerification;
      const newDocument: VerificationDocument = {
        type,
        fileUrl,
        status: 'pending',
        submittedAt: new Date()
      };

      verification.documents.push(newDocument);
      verification.updatedAt = new Date();

      await updateDoc(verificationRef, verification);

      return { success: true, fileUrl };
    } catch (error) {
      console.error('Error uploading verification document:', error);
      throw error;
    }
  },

  async checkVerificationStatus(userId: string): Promise<{
    isVerified: boolean;
    verificationStatus: string;
    documents: VerificationDocument[];
  }> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      
      if (userData.role === 'patient') {
        return {
          isVerified: userData.emailVerified,
          verificationStatus: userData.emailVerified ? 'approved' : 'pending',
          documents: []
        };
      }

      const verificationRef = doc(db, 'verifications', userId);
      const verificationDoc = await getDoc(verificationRef);

      if (!verificationDoc.exists()) {
        return {
          isVerified: false,
          verificationStatus: 'pending',
          documents: []
        };
      }

      const verification = verificationDoc.data() as UserVerification;
      return {
        isVerified: verification.status === 'approved',
        verificationStatus: verification.status,
        documents: verification.documents
      };
    } catch (error) {
      console.error('Error checking verification status:', error);
      throw error;
    }
  },

  async getRequiredDocuments(role: UserRole): Promise<{ type: VerificationDocument['type']; label: string }[]> {
    switch (role) {
      case 'doctor':
        return [
          { type: 'medical_license', label: 'Medical License' },
          { type: 'government_id', label: 'Government ID' }
        ];
      case 'pharmacy':
        return [
          { type: 'pharmacy_license', label: 'Pharmacy License' },
          { type: 'government_id', label: 'Government ID' }
        ];
      default:
        return [];
    }
  }
};
