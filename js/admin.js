import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, getDoc, setDoc, deleteDoc, doc, updateDoc, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

async function getStats() {
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
        totalUsuarios: usuariosSnap.size,
        totalProdutos: produtosSnap.size,
        totalVendas: vendas,
        totalReceita: totalVendas
    };
}

async function salvarLogo(base64) {
    await setDoc(doc(db, "config", "geral"), { logoBase64: base64 }, { merge: true });
}

async function getLogo() {
    const snap = await getDoc(doc(db, "config", "geral"));
    if (snap.exists() && snap.data().logoBase64) {
        return snap.data().logoBase64;
    }
    return '';
}

async function salvarPixConfig(chavePix, nomePix) {
    await setDoc(doc(db, "config", "geral"), { chavePix, nomePix }, { merge: true });
}

async function getPixConfig() {
    const snap = await getDoc(doc(db, "config", "geral"));
    if (snap.exists()) {
        return { chavePix: snap.data().chavePix || '', nomePix: snap.data().nomePix || '' };
    }
    return { chavePix: '', nomePix: '' };
}

function observarCompras(callback) {
    return onSnapshot(
        query(collection(db, "compras"), orderBy("data", "desc")),
        (snap) => {
            callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
    );
}

async function aprovarCompra(id) {
    await updateDoc(doc(db, "compras", id), { status: 'aprovado', dataAprovacao: new Date().toISOString() });
}

async function recusarCompra(id) {
    await updateDoc(doc(db, "compras", id), { status: 'recusado', dataRecusa: new Date().toISOString() });
}

async function imagemParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                const maxW = 800;
                if (width > maxW) {
                    height = (height * maxW) / width;
                    width = maxW;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export { getStats, salvarLogo, getLogo, salvarPixConfig, getPixConfig, observarCompras, aprovarCompra, recusarCompra, imagemParaBase64 };
