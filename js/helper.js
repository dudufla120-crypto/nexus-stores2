export function mostrarModal(titulo, conteudo, botoes = []) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.85);z-index:2000;
        display:flex;align-items:center;justify-content:center;
        animation:fadeIn 0.2s;
    `;
    const box = document.createElement('div');
    box.style.cssText = `
        background:#111;border:1px solid #222;border-radius:12px;
        padding:30px;max-width:450px;width:90%;
        animation:slideUp 0.3s;
    `;
    let html = `<h2 style="color:#8b5cf6;margin-bottom:16px;">${titulo}</h2>`;
    html += `<div style="color:#aaa;margin-bottom:20px;line-height:1.6;">${conteudo}</div>`;
    if (botoes.length > 0) {
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;">';
        botoes.forEach(b => {
            html += `<button class="btn ${b.classe || 'btn-secondary'} btn-small" data-acao="${b.acao}">${b.texto}</button>`;
        });
        html += '</div>';
    } else {
        html += `<button class="btn btn-primary btn-small" data-acao="fechar" style="width:100%;justify-content:center;">OK</button>`;
    }
    box.innerHTML = html;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    return new Promise((resolve) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (botoes.length === 0) {
                    document.body.removeChild(overlay);
                    resolve('fechar');
                }
            }
        });
        box.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-acao]');
            if (btn) {
                const acao = btn.dataset.acao;
                document.body.removeChild(overlay);
                resolve(acao);
            }
        });
    });
}

export function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const cores = {
        sucesso: '#10b981',
        erro: '#ef4444',
        aviso: '#f59e0b',
        info: '#8b5cf6'
    };
    const icones = {
        sucesso: '✅',
        erro: '❌',
        aviso: '⚠️',
        info: 'ℹ️'
    };
    const notif = document.createElement('div');
    notif.style.cssText = `
        position:fixed;top:20px;right:20px;z-index:3000;
        background:#111;border:1px solid ${cores[tipo] || '#8b5cf6'};
        border-radius:12px;padding:16px 20px;
        color:#fff;font-size:14px;font-weight:500;
        box-shadow:0 4px 20px rgba(0,0,0,0.5);
        display:flex;align-items:center;gap:10px;
        animation:slideUp 0.3s;max-width:400px;
    `;
    notif.innerHTML = `<span style="font-size:18px;">${icones[tipo] || 'ℹ️'}</span> ${mensagem}`;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.transition = 'opacity 0.3s';
        notif.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notif), 300);
    }, 3000);
}

export function mostrarLoading(mostrar, elementoId) {
    const el = document.getElementById(elementoId);
    if (!el) return;
    if (mostrar) {
        el.innerHTML = '<div style="text-align:center;padding:40px;color:#666;">⏳ Carregando...</div>';
    }
}

export function formatarData(dataISO) {
    return new Date(dataISO).toLocaleString('pt-BR');
}

export function formatarPreco(valor) {
    return 'R$ ' + parseFloat(valor).toFixed(2);
}

export async function imagemParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                const maxW = 600;
                if (width > maxW) {
                    height = (height * maxW) / width;
                    width = maxW;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = () => resolve(reader.result);
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
