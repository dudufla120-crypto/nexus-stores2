import { db } from './firebase-config.js';
import { collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

function formatarTempo(dataISO) {
    const diff = Date.now() - new Date(dataISO).getTime();
    const seg = Math.floor(diff / 1000);
    if (seg < 60) return 'agora mesmo';
    const min = Math.floor(seg / 60);
    if (min < 60) return `há ${min}min`;
    const horas = Math.floor(min / 60);
    if (horas < 24) return `há ${horas}h`;
    const dias = Math.floor(horas / 24);
    return `há ${dias}d`;
}

function iniciarFeed(elementId, maxItems = 20) {
    const feedEl = document.getElementById(elementId);
    if (!feedEl) return;

    feedEl.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:20px;">Carregando...</div>';

    const q = query(
        collection(db, "compras"),
        where("status", "==", "aprovado"),
        orderBy("data", "desc")
    );

    return onSnapshot(q, (snap) => {
        let html = '';
        let count = 0;
        snap.forEach((doc) => {
            if (count >= maxItems) return;
            const compra = doc.data();
            html += `
                <div class="feed-item">
                    <div class="feed-icon">🎮</div>
                    <div class="feed-info">
                        <strong>${compra.username || 'Anônimo'}</strong> comprou <strong>${compra.produtoNome || 'um produto'}</strong>
                        <br><small>R$ ${parseFloat(compra.valor || 0).toFixed(2)}</small>
                    </div>
                    <div class="feed-time">${formatarTempo(compra.data)}</div>
                </div>
            `;
            count++;
        });

        if (!html) {
            feedEl.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:20px;">Nenhuma compra recente</div>';
        } else {
            feedEl.innerHTML = html;
        }
    });
}

export { iniciarFeed };
