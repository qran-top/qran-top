// This tells TypeScript that a global 'firebase' object exists.
// It is loaded via the <script> tags in index.html.
declare const firebase: any;

const firebaseConfig = {
  apiKey: "AIzaSyC_coJB6vzCzkoimQ151vcC_w_PcRy3Zg8",
  authDomain: "quranic-explorer-otmfz.firebaseapp.com",
  projectId: "quranic-explorer-otmfz",
  storageBucket: "quranic-explorer-otmfz.appspot.com",
  messagingSenderId: "121250194550",
  appId: "1:121250194550:web:a82719674555d015d92b57"
};


// Initialize Firebase only if it hasn't been initialized yet to avoid errors.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the firestore instance and FieldValue for use in other components.
// We are using the v8 namespaced API.
const db = firebase.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const FieldValue = firebase.firestore.FieldValue;

export { db, FieldValue, auth, googleProvider };