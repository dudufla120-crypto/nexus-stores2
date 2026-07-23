import { db } from './firebase-config.js';
import { collection, addDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

function calcularCRC16(payload) {
    let crc = 0xFFFF;
    const polinomio = 0x1021;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ polinomio;
            } else {
                crc = crc << 1;
            }
            crc &= 0xFFFF;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function adicionarCampoEMV(id, valor) {
    return id + String(valor.length).padStart(2, '0') + valor;
}

function gerarPixPayload(chavePix, nomeTitular, cidade, valor) {
    const valorStr = valor.toFixed(2);
    const nomeStr = nomeTitular.substring(0, 25).toUpperCase();
    const cidadeStr = (cidade || "Sao Paulo").substring(0, 15).toUpperCase();
    const txidStr = "***";

    const gui = "0014br.gov.bcb.pix";
    const pixKeyField = "01" + String(chavePix.length).padStart(2, '0') + chavePix;
    const pixKeyFieldFull = gui + pixKeyField;
    const merchantInfo = "26" + String(pixKeyFieldFull.length).padStart(2, '0') + pixKeyFieldFull;

    const payloadFormat = "000201";
    const mcc = "52040000";
    const currency = "5303986";
    const amount = "54" + String(valorStr.length).padStart(2, '0') + valorStr;
    const country = "5802BR";
    const nameField = "59" + String(nomeStr.length).padStart(2, '0') + nomeStr;
    const cityField = "60" + String(cidadeStr.length).padStart(2, '0') + cidadeStr;
    const txidField = "05" + String(txidStr.length).padStart(2, '0') + txidStr;
    const additionalData = "62" + String(txidField.length).padStart(2, '0') + txidField;

    const payload = payloadFormat + merchantInfo + mcc + currency + amount + country + nameField + cityField + additionalData;
    const crc = calcularCRC16(payload + "6304");

    return payload + "6304" + crc;
}

function gerarQRCode(payload, elementId) {
    const qrcodeEl = document.getElementById(elementId);
    if (!qrcodeEl) return;

    qrcodeEl.innerHTML = '';

    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payload)}`;
    const img = document.createElement('img');
    img.src = apiUrl;
    img.alt = 'QR Code PIX';
    img.style.width = '250px';
    img.style.height = '250px';
    img.style.borderRadius = '12px';
    img.onerror = function() {
        qrcodeEl.innerHTML = '<p style="color: var(--text-secondary);">Erro ao gerar QR Code. Copie a chave PIX manualmente.</p>';
    };
    qrcodeEl.appendChild(img);
}

async function getConfigPix() {
    const snap = await getDoc(doc(db, "config", "geral"));
    if (snap.exists()) {
        return snap.data();
    }
    return { chavePix: '', nomePix: '' };
}

async finalizarCompra(usuarioId, username, produto, comprovanteBase64) {
    const config = await getConfigPix();
    return await addDoc(collection(db, "compras"), {
        usuario: usuarioId,
        username: username,
        produtoId: produto.id,
        produtoNome: produto.nome,
        valor: produto.preco,
        data: new Date().toISOString(),
        status: 'pendente',
        comprovante: comprovanteBase64 || '',
        metodoPagamento: 'PIX',
        chavePix: config.chavePix || '',
        nomePix: config.nomePix || ''
    });
}

export { gerarPixPayload, gerarQRCode, getConfigPix, finalizarCompra };
