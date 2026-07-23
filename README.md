# Nexus Stores 🛒

Site de vendas de produtos Roblox com painel admin, pagamento via PIX e feed ao vivo de compras.

## 🚀 Como publicar no GitHub Pages

1. Crie um repositório no GitHub (`https://github.com/new`)
2. Faça upload dos arquivos (Add file → Upload files)
3. Vá em **Settings → Pages** → Branch: `main` → / (root) → Save
4. Espere 2 minutos e acesse o link que aparecer

---

## 🔥 Configuração do Firebase

### 1. Criar projeto
- Acesse `https://console.firebase.google.com`
- "Criar projeto" → nome: `nexus-stores` → Desative Analytics → Criar

### 2. Ativar Authentication (login)
- Menu esquerdo → "Authentication" → "Vamos começar"
- Aba "Método de login" → "E-mail/Senha" → Ativar → Salvar

### 3. Criar Firestore Database
- Menu esquerdo → "Firestore Database" → "Criar banco de dados"
- "Iniciar no modo de teste" → Região: "southamerica-east1" → Ativar

### 4. Regras do Firestore (IMPORTANTE!)
- No Firestore Database, vá em **"Regras"** (Rules)
- Cole o código abaixo e clique em **"Publicar"**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Pegar chaves do Firebase
- ⚙️ Configurações do projeto → Seus apps → Web (</>)
- Apelido: `nexus-stores-web` → Desmarcar Hosting → Registrar
- Copie o código que aparecer

### 6. Colar no site
- Abra `js/firebase-config.js` e substitua pelo código copiado

---

## 👑 Admin automático

- Cadastre com username **eduba120** → vira admin automaticamente
- No painel admin, promova outros usuários

---

## 📋 Funcionalidades

| Página | Descrição |
|--------|-----------|
| `index.html` | Produtos por jogo com navegação |
| `login.html` | Login com username Roblox + senha |
| `register.html` | Cadastro com username único |
| `dashboard.html` | Perfil e histórico de compras |
| `checkout.html` | Pagamento PIX com QR Code |
| `admin.html` | Painel admin completo |

### Painel Admin
- **Dashboard**: Estatísticas (usuários, produtos, vendas)
- **Jogos**: Adicionar/editar/excluir com imagem
- **Produtos**: Adicionar/excluir com imagem
- **Admins**: Promover ou remover admins
- **Logo**: Upload da logo do site
- **PIX**: Configurar chave PIX e nome
- **Pagamentos**: Ver comprovantes, aprovar ou recusar

---

## 💳 Pagamento

1. Cliente compra → vê QR Code PIX
2. Paga no app do banco → envia comprovante
3. Admin aprova no painel → compra aparece no feed ao vivo

---

## 🛠️ Tecnologias
- HTML + CSS + JavaScript (ES Modules)
- Firebase (Authentication + Firestore)
- Tema roxo/preto com animações
