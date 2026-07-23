import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

async function adicionarJogo(nome) {
    return await addDoc(collection(db, "jogos"), {
        nome: nome,
        dataCriacao: new Date().toISOString()
    });
}

async function listarJogos() {
    const snap = await getDocs(query(collection(db, "jogos"), orderBy("nome")));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function removerJogo(id) {
    await deleteDoc(doc(db, "jogos", id));
}

async function adicionarProduto(produto) {
    return await addDoc(collection(db, "produtos"), {
        ...produto,
        dataCriacao: new Date().toISOString()
    });
}

async function listarProdutosPorJogo(jogoId) {
    if (jogoId === 'todos') {
        const snap = await getDocs(query(collection(db, "produtos"), orderBy("dataCriacao", "desc")));
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    const snap = await getDocs(query(collection(db, "produtos"), where("jogoId", "==", jogoId), orderBy("dataCriacao", "desc")));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

function observarProdutos(jogoId, callback) {
    let q;
    if (jogoId === 'todos') {
        q = query(collection(db, "produtos"), orderBy("dataCriacao", "desc"));
    } else {
        q = query(collection(db, "produtos"), where("jogoId", "==", jogoId), orderBy("dataCriacao", "desc"));
    }
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
}

async function removerProduto(id) {
    await deleteDoc(doc(db, "produtos", id));
}

async function atualizarProduto(id, dados) {
    await updateDoc(doc(db, "produtos", id), dados);
}

async function getProduto(id) {
    const snap = await getDoc(doc(db, "produtos", id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
}

export { adicionarJogo, listarJogos, removerJogo, adicionarProduto, listarProdutosPorJogo, observarProdutos, removerProduto, atualizarProduto, getProduto };
