import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1IFV10wUyzo_gX2hnvXCgARyXanN_5Zg",
  authDomain: "nexus-stores.firebaseapp.com",
  projectId: "nexus-stores",
  storageBucket: "nexus-stores.firebasestorage.app",
  messagingSenderId: "68773888286",
  appId: "1:68773888286:web:2f72c4debc72bf2576c90f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
