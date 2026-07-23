import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

function usuarioEmail(username) {
    return username.toLowerCase() + '@nexusstores.com';
}

async function usernameExiste(username) {
    try {
        const q = query(collection(db, "usuarios"), where("username", "==", username));
        const snap = await getDocs(q);
        return !snap.empty;
    } catch (err) {
        console.error('Erro usernameExiste:', err);
        return false;
    }
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
    try {
        const user = auth.currentUser;
        if (!user) return null;
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
            return { uid: user.uid, ...userDoc.data() };
        }
        return null;
    } catch (err) {
        console.error('Erro getCurrentUserData:', err);
        return null;
    }
}

async function listarUsuarios() {
    try {
        const q = query(collection(db, "usuarios"));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (err) {
        console.error('Erro listarUsuarios:', err);
        return [];
    }
}

async function promoverAdmin(uid) {
    try {
        await setDoc(doc(db, "usuarios", uid), { admin: true }, { merge: true });
    } catch (err) {
        console.error('Erro promoverAdmin:', err);
    }
}

async function rebaixarAdmin(uid) {
    try {
        await setDoc(doc(db, "usuarios", uid), { admin: false }, { merge: true });
    } catch (err) {
        console.error('Erro rebaixarAdmin:', err);
    }
}

export { registrar, login, logout, observarAuth, getCurrentUserData, listarUsuarios, promoverAdmin, rebaixarAdmin };
