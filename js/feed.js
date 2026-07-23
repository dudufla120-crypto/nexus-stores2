import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

function formatarTempo(dataISO) {
    if (!dataISO) return '';
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

    feedEl.innerHTML = '<div style="text-align:center;color:#666;padding:20px;">⏳ Carregando...</div>';

    try {
        const q = query(collection(db, "compras"), orderBy("data", "desc"));

        return onSnapshot(q, (snap) => {
            const aprovados = [];
            snap.forEach(d => {
                const c = d.data();
                if (c.status === 'aprovado') {
                    aprovados.push(c);
                }
            });

            if (aprovados.length === 0) {
                feedEl.innerHTML = '<div style="text-align:center;color:#666;padding:20px;">Nenhuma compra recente</div>';
                return;
            }

            let html = '';
            let count = 0;
            for (const c of aprovados) {
                if (count >= maxItems) break;
                html += `
                    <div class="feed-item">
                        <div class="feed-icon">🎮</div>
                        <div class="feed-info">
                            <strong>${c.username || 'Anônimo'}</strong> comprou <strong>${c.produtoNome || 'um produto'}</strong>
                            <br><small>${c.valor ? 'R$ ' + parseFloat(c.valor).toFixed(2) : ''}</small>
                        </div>
                        <div class="feed-time">${formatarTempo(c.data)}</div>
                    </div>
                `;
                count++;
            }
            feedEl.innerHTML = html;
        }, (error) => {
            console.error('Erro no feed:', error);
            feedEl.innerHTML = '<div style="text-align:center;color:#ef4444;padding:20px;">Erro ao carregar feed</div>';
        });
    } catch (err) {
        console.error('Erro ao iniciar feed:', err);
        feedEl.innerHTML = '<div style="text-align:center;color:#ef4444;padding:20px;">Erro ao carregar feed</div>';
    }
}

export { iniciarFeed };
