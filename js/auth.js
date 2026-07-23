import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

function usuarioEmail(username) {
    return username.toLowerCase() + '@nexusstores.com';
}

async function usernameExiste(username) {
    const q = query(collection(db, "usuarios"), where("username", "==", username));
    const snap = await getDocs(q);
    return !snap.empty;
}

async function registrar(username, password) {
    const exists = await usernameExiste(username);
    if (exists) {
        throw new Error('Este username já está em uso!');
    }
    
    const userCred = await createUserWithEmailAndPassword(auth, usuarioEmail(username), password);
    
    const isAdmin = username.toLowerCase() === 'eduba120';
    
    await setDoc(doc(db, "usuarios", userCred.user.uid), {
        username: username,
        admin: isAdmin,
        dataCadastro: new Date().toISOString()
    });
    
    return { ...userCred, isAdmin };
}

async function login(username, password) {
    return await signInWithEmailAndPassword(auth, usuarioEmail(username), password);
}

function logout() {
    return signOut(auth);
}

function observarAuth(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "usuarios", user.uid));
            if (userDoc.exists()) {
                callback({ ...user, ...userDoc.data() });
            } else {
                callback(user);
            }
        } else {
            callback(null);
        }
    });
}

async function getCurrentUserData() {
    const user = auth.currentUser;
    if (!user) return null;
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    if (userDoc.exists()) {
        return { uid: user.uid, ...userDoc.data() };
    }
    return null;
}

async function listarUsuarios() {
    const q = query(collection(db, "usuarios"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

async function promoverAdmin(uid) {
    await setDoc(doc(db, "usuarios", uid), { admin: true }, { merge: true });
}

async function rebaixarAdmin(uid) {
    await setDoc(doc(db, "usuarios", uid), { admin: false }, { merge: true });
}

export { registrar, login, logout, observarAuth, getCurrentUserData, listarUsuarios, promoverAdmin, rebaixarAdmin };
