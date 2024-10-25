import { FirebaseApp } from 'firebase/app';
import { Auth, User as FirebaseUser } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Storage } from 'firebase/storage';

declare global {
  interface Window {
    firebase?: {
      app: FirebaseApp;
      auth: Auth;
      firestore: Firestore;
      storage: Storage;
    };
  }
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseContext {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: Storage;
}

export interface AuthUser extends FirebaseUser {
  role?: 'admin' | 'manager' | 'agent';
}