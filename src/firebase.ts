import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import type { FamilyMember, FamilyInvestment } from './types';

// Default config from active project with environment variable support for Vercel deployment
export const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || 'AIzaSyCfm96MtPHERhre3B9bipQdy2vB_wX0XrY',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0796075706.firebaseapp.com',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0796075706',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0796075706.firebasestorage.app',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '624329780534',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '1:624329780534:web:51d3156b6fa0c088911797',
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID || 'ai-studio-bondhonobiniyogb-4e3fc049-ee0f-4157-be34-2b204e3b601c',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const COLLECTIONS = {
  FAMILY_MEMBERS: 'family_members',
  INVESTMENTS: 'investments',
  LANDS: 'lands',
  SETTINGS: 'settings',
};

// --- Family Members CRUD ---

export async function fetchFamilyMembers(): Promise<FamilyMember[]> {
  try {
    const colRef = collection(db, COLLECTIONS.FAMILY_MEMBERS);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FamilyMember));
  } catch (error) {
    console.error('Error fetching family members from Firestore:', error);
    throw error;
  }
}

export function subscribeFamilyMembers(callback: (members: FamilyMember[]) => void) {
  const colRef = collection(db, COLLECTIONS.FAMILY_MEMBERS);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FamilyMember));
      callback(list);
    },
    (error) => {
      console.error('Firestore Realtime error for family members:', error);
    }
  );
}

export async function addFamilyMember(memberData: Partial<FamilyMember>): Promise<FamilyMember> {
  try {
    const colRef = collection(db, COLLECTIONS.FAMILY_MEMBERS);
    const docData = {
      ...memberData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (memberData.id) {
      const docRef = doc(db, COLLECTIONS.FAMILY_MEMBERS, memberData.id);
      await setDoc(docRef, docData);
      return { id: memberData.id, ...docData } as FamilyMember;
    } else {
      const docRef = await addDoc(colRef, docData);
      return { id: docRef.id, ...docData } as FamilyMember;
    }
  } catch (error) {
    console.error('Error adding family member to Firestore:', error);
    throw error;
  }
}

export async function updateFamilyMember(
  id: string,
  memberData: Partial<FamilyMember>
): Promise<Partial<FamilyMember>> {
  try {
    const docRef = doc(db, COLLECTIONS.FAMILY_MEMBERS, id);
    const updatePayload = {
      ...memberData,
      updated_at: new Date().toISOString(),
    };
    await updateDoc(docRef, updatePayload);
    return { id, ...updatePayload };
  } catch (error) {
    console.error('Error updating family member in Firestore:', error);
    throw error;
  }
}

export async function deleteFamilyMember(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.FAMILY_MEMBERS, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting family member from Firestore:', error);
    throw error;
  }
}

// --- Bondhon O Biniyog Investments CRUD ---

export async function fetchInvestments(): Promise<FamilyInvestment[]> {
  try {
    const colRef = collection(db, COLLECTIONS.INVESTMENTS);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FamilyInvestment));
  } catch (error) {
    console.error('Error fetching investments from Firestore:', error);
    throw error;
  }
}

export function subscribeInvestments(callback: (investments: FamilyInvestment[]) => void) {
  const colRef = collection(db, COLLECTIONS.INVESTMENTS);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FamilyInvestment));
      callback(list);
    },
    (error) => {
      console.error('Firestore Realtime error for investments:', error);
    }
  );
}

export async function addInvestment(invData: Partial<FamilyInvestment>): Promise<FamilyInvestment> {
  try {
    const colRef = collection(db, COLLECTIONS.INVESTMENTS);
    const docData = {
      ...invData,
      created_at: new Date().toISOString(),
    };
    const docRef = await addDoc(colRef, docData);
    return { id: docRef.id, ...docData } as FamilyInvestment;
  } catch (error) {
    console.error('Error adding investment to Firestore:', error);
    throw error;
  }
}

export async function updateInvestment(
  id: string,
  invData: Partial<FamilyInvestment>
): Promise<Partial<FamilyInvestment>> {
  try {
    const docRef = doc(db, COLLECTIONS.INVESTMENTS, id);
    await updateDoc(docRef, invData);
    return { id, ...invData };
  } catch (error) {
    console.error('Error updating investment in Firestore:', error);
    throw error;
  }
}

export async function deleteInvestment(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.INVESTMENTS, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting investment from Firestore:', error);
    throw error;
  }
}
