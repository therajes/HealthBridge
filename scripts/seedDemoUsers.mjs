import admin from 'firebase-admin';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// This script seeds demo users into Firebase Auth and Firestore.
// Prerequisites:
// 1) Create a Firebase service account key and store it as a JSON file.
// 2) Set an environment variable GOOGLE_APPLICATION_CREDENTIALS pointing to that JSON file.
//    On Windows PowerShell: $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\\path\\to\\serviceAccount.json"
// 3) Run: npm run seed:demo

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Missing GOOGLE_APPLICATION_CREDENTIALS env var. Please set it to your service account JSON path.');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const auth = admin.auth();
const db = admin.firestore();

const demoUsers = [
  {
    email: 'patient@demo.com',
    password: 'demo123',
    name: 'Krishna Yadav',
    role: 'patient',
    location: 'Village Rampur, Greater Noida',
    phone: '+91 9876543210',
  },
  {
    email: 'doctor@demo.com',
    password: 'demo123',
    name: 'Rachit Mishra',
    role: 'doctor',
    specialization: 'General Medicine',
    location: 'Greater Noida Medical Center',
    phone: '+91 9876543211',
  },
  {
    email: 'pharmacy@demo.com',
    password: 'demo123',
    name: 'Mohit Pharmaceutics',
    role: 'pharmacy',
    location: 'Surajpur District, Greater Noida',
    phone: '+91 9876543212',
  },
  {
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Rajesh Barik',
    role: 'admin',
    location: 'Telemedicine HQ',
    phone: '+91 9876543213',
  },
];

async function ensureUser({ email, password, name, role, ...profile }) {
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`[exists] ${email}`);
  } catch (e) {
    userRecord = await auth.createUser({ email, password, displayName: name });
    console.log(`[created] ${email}`);
  }

  const userRef = db.collection('users').doc(userRecord.uid);
  await userRef.set(
    {
      email,
      name,
      role,
      ...profile,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return userRecord.uid;
}

async function main() {
  for (const u of demoUsers) {
    await ensureUser(u);
  }
  console.log('Seeding complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
