import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { initializeApp } from '@firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyA5yRsHiNNM51_Vq_SrC2TtkEiV-R6lD6E',
  authDomain: 'instagram-clone-429f7.firebaseapp.com',
  projectId: 'instagram-clone-429f7',
  storageBucket: 'instagram-clone-429f7.appspot.com',
  messagingSenderId: '355988748210',
  appId: '1:355988748210:web:f508799e686a81202d56ab',
  measurementId: 'G-YST1CBNQK4',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth(firebaseApp);
// export const storage = firebase.storage();
