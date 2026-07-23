import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { mostrarNotificacao } from './helper.js';

async function adicionarJogo(nome, imagemBase64 = '') {
    return await addDoc(collection(db, "jogos"), {
        nome,
        imagem: imagemBase64,
        dataCriacao: new Date().toISOString()
    });
}

async function listarJogos() {
    try {
        const snap = await getDocs(query(collection(db, "jogos"), orderBy("nome")));
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error('Erro ao listar jogos:', err);
        mostrarNotificacao('Erro ao carregar jogos: ' + err.message, 'erro');
        return [];
    }
}

async function getJogo(id) {
    try {
        const snap = await getDoc(doc(db, "jogos", id));
        if (snap.exists()) return { id: snap.id, ...snap.data() };
        return null;
    } catch (err) {
        console.error('Erro ao buscar jogo:', err);
        return null;
    }
}

async function atualizarJogo(id, dados) {
    try {
        await updateDoc(doc(db, "jogos", id), dados);
        return true;
    } catch (err) {
        console.error('Erro ao atualizar jogo:', err);
        mostrarNotificacao('Erro ao atualizar jogo: ' + err.message, 'erro');
        return false;
    }
}

async function removerJogo(id) {
    try {
        await deleteDoc(doc(db, "jogos", id));
        return true;
    } catch (err) {
        console.error('Erro ao remover jogo:', err);
        mostrarNotificacao('Erro ao remover jogo: ' + err.message, 'erro');
        return false;
    }
}

async function adicionarProduto(produto) {
    try {
        return await addDoc(collection(db, "produtos"), {
            ...produto,
            dataCriacao: new Date().toISOString()
        });
    } catch (err) {
        console.error('Erro ao adicionar produto:', err);
        mostrarNotificacao('Erro ao adicionar produto: ' + err.message, 'erro');
        return null;
    }
}

async function listarProdutosPorJogo(jogoId) {
    try {
        let q;
        if (jogoId === 'todos') {
            q = query(collection(db, "produtos"), orderBy("dataCriacao", "desc"));
        } else {
            const whereFilter = where("jogoId", "==", jogoId);
            q = query(collection(db, "produtos"), whereFilter, orderBy("dataCriacao", "desc"));
        }
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error('Erro ao listar produtos:', err);
        mostrarNotificacao('Erro ao carregar produtos', 'erro');
        return [];
    }
}

function observarProdutos(jogoId, callback, errorCallback) {
    try {
        let q;
        if (jogoId === 'todos') {
            q = query(collection(db, "produtos"), orderBy("dataCriacao", "desc"));
        } else {
            q = query(collection(db, "produtos"), where("jogoId", "==", jogoId), orderBy("dataCriacao", "desc"));
        }
        return onSnapshot(q,
            (snap) => {
                callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.error('Erro no snapshot produtos:', error);
                if (errorCallback) errorCallback(error);
                mostrarNotificacao('Erro ao carregar produtos: ' + error.message, 'erro');
            }
        );
    } catch (err) {
        console.error('Erro ao criar observer:', err);
        if (errorCallback) errorCallback(err);
        return () => {};
    }
}

function observarJogos(callback, errorCallback) {
    try {
        return onSnapshot(
            query(collection(db, "jogos"), orderBy("nome")),
            (snap) => {
                callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.error('Erro ao observar jogos:', error);
                if (errorCallback) errorCallback(error);
            }
        );
    } catch (err) {
        console.error('Erro ao criar observer jogos:', err);
        return () => {};
    }
}

async function removerProduto(id) {
    try {
        await deleteDoc(doc(db, "produtos", id));
        mostrarNotificacao('Produto removido!', 'sucesso');
        return true;
    } catch (err) {
        console.error('Erro ao remover produto:', err);
        mostrarNotificacao('Erro ao remover produto', 'erro');
        return false;
    }
}

export { adicionarJogo, listarJogos, getJogo, atualizarJogo, removerJogo, adicionarProduto, listarProdutosPorJogo, observarProdutos, observarJogos, removerProduto };
