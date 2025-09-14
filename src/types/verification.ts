import { UserRole } from './auth';

export interface VerificationDocument {
  type: 'medical_license' | 'pharmacy_license' | 'government_id';
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  comments?: string;
}

export interface UserVerification {
  userId: string;
  role: UserRole;
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected';
  email: string;
  name: string;
  submittedAt: Date;
  updatedAt: Date;
}
