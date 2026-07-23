import { db } from './firebase-config.js';
import { collection, getDocs, getDoc, setDoc, deleteDoc, doc, updateDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { mostrarNotificacao } from './helper.js';

async function getStats() {
    try {
        const usuariosSnap = await getDocs(collection(db, "usuarios"));
        const produtosSnap = await getDocs(collection(db, "produtos"));
        const comprasSnap = await getDocs(collection(db, "compras"));

        let vendas = 0;
        let totalVendas = 0;
        comprasSnap.forEach(d => {
            const data = d.data();
            if (data.status === 'aprovado') {
                vendas++;
                totalVendas += parseFloat(data.valor || 0);
            }
        });

        return {
            totalUsuarios: usuariosSnap.size || 0,
            totalProdutos: produtosSnap.size || 0,
            totalVendas: vendas,
            totalReceita: totalVendas
        };
    } catch (err) {
        console.error('Erro stats:', err);
        return { totalUsuarios: 0, totalProdutos: 0, totalVendas: 0, totalReceita: 0 };
    }
}

async function salvarLogo(base64) {
    try {
        await setDoc(doc(db, "config", "geral"), { logoBase64: base64 }, { merge: true });
        mostrarNotificacao('Logo salva com sucesso!', 'sucesso');
        return true;
    } catch (err) {
        console.error('Erro ao salvar logo:', err);
        mostrarNotificacao('Erro ao salvar logo', 'erro');
        return false;
    }
}

async function getLogo() {
    try {
        const snap = await getDoc(doc(db, "config", "geral"));
        if (snap.exists() && snap.data().logoBase64) {
            return snap.data().logoBase64;
        }
    } catch (err) {
        console.error('Erro ao carregar logo:', err);
    }
    return '';
}

async function salvarPixConfig(chavePix, nomePix) {
    try {
        await setDoc(doc(db, "config", "geral"), { chavePix, nomePix }, { merge: true });
        mostrarNotificacao('Configuração PIX salva!', 'sucesso');
        return true;
    } catch (err) {
        console.error('Erro ao salvar PIX:', err);
        mostrarNotificacao('Erro ao salvar PIX', 'erro');
        return false;
    }
}

async function getPixConfig() {
    try {
        const snap = await getDoc(doc(db, "config", "geral"));
        if (snap.exists()) {
            return {
                chavePix: snap.data().chavePix || '',
                nomePix: snap.data().nomePix || ''
            };
        }
    } catch (err) {
        console.error('Erro ao carregar PIX:', err);
    }
    return { chavePix: '', nomePix: '' };
}

function observarCompras(callback) {
    try {
        return onSnapshot(
            query(collection(db, "compras"), orderBy("data", "desc")),
            (snap) => {
                callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            },
            (error) => {
                console.error('Erro ao observar compras:', error);
                callback([]);
            }
        );
    } catch (err) {
        console.error('Erro ao criar observer:', err);
        return () => {};
    }
}

async function aprovarCompra(id) {
    try {
        await updateDoc(doc(db, "compras", id), { status: 'aprovado', dataAprovacao: new Date().toISOString() });
        mostrarNotificacao('Pagamento aprovado!', 'sucesso');
        return true;
    } catch (err) {
        console.error('Erro ao aprovar:', err);
        mostrarNotificacao('Erro ao aprovar pagamento', 'erro');
        return false;
    }
}

async function recusarCompra(id) {
    try {
        await updateDoc(doc(db, "compras", id), { status: 'recusado', dataRecusa: new Date().toISOString() });
        mostrarNotificacao('Pagamento recusado', 'aviso');
        return true;
    } catch (err) {
        console.error('Erro ao recusar:', err);
        mostrarNotificacao('Erro ao recusar pagamento', 'erro');
        return false;
    }
}

export { getStats, salvarLogo, getLogo, salvarPixConfig, getPixConfig, observarCompras, aprovarCompra, recusarCompra };
