import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyA5yRsHiNNM51_Vq_SrC2TtkEiV-R6lD6E',
  authDomain: 'instagram-clone-429f7.firebaseapp.com',
  projectId: 'instagram-clone-429f7',
  storageBucket: 'instagram-clone-429f7.appspot.com',
  messagingSenderId: '355988748210',
  appId: '1:355988748210:web:f508799e686a81202d56ab',
  measurementId: 'G-YST1CBNQK4',
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
