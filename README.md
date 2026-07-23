# Nexus Stores 🛒

Site de vendas de produtos Roblox com painel admin, pagamento via PIX e feed ao vivo de compras.

## 🚀 Como publicar no GitHub Pages

1. Crie um repositório no GitHub
2. Envie todos os arquivos para o repositório
3. Vá em Settings → Pages → selecione "main" e salve
4. Pronto! Site online em `https://SEU-USUARIO.github.io/NOME-DO-REPO`

---

## 🔥 Configuração do Firebase (passo a passo)

### O que é Firebase?
É um serviço GRÁTIS do Google que guarda dados do seu site (logins, produtos, compras). Sem precisar de servidor.

### Passo 1: Criar conta
1. Acesse https://console.firebase.google.com
2. Faça login com seu Gmail
3. Clique em **"Criar um projeto"**
4. Digite o nome: `nexus-stores`
5. Desative o **Google Analytics**
6. Clique em **"Criar projeto"**

### Passo 2: Ativar Authentication (login)
1. No menu esquerdo, clique em **"Authentication"**
2. Clique em **"Vamos começar"**
3. Aba **"Método de login"** → **"E-mail/Senha"**
4. Ative a chave **"Ativar"** → **"Salvar"**

### Passo 3: Criar Firestore Database (banco de dados)
1. No menu esquerdo, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de teste"**
4. Região: **"southamerica-east1" (São Paulo)**
5. Clique em **"Ativar"**

### Passo 4: Pegar as chaves
1. No menu esquerdo, clique em ⚙️ **"Configurações do projeto"**
2. Aba **"Geral"** → desça até **"Seus apps"**
3. Clique no botão **"Web"** (ícone `</>`)
4. Apelido: `nexus-stores-web`
5. **Desmarcar** "Firebase Hosting"
6. **"Registrar app"**
7. Copie todo o código que aparecer

### Passo 5: Colar as chaves no site
1. Abra o arquivo `js/firebase-config.js`
2. Substitua TODO o conteúdo pelo código que você copiou do Firebase

Pronto! Site funcionando 🎉

---

## 👑 Como virar Admin

- Ao criar conta com o username **eduba120**, você vira admin automaticamente
- No painel admin, você pode promover outros usuários

---

## 📋 Funcionalidades

| Página | Descrição |
|--------|-----------|
| `index.html` | Página inicial com produtos por jogo |
| `login.html` | Login com username Roblox + senha |
| `register.html` | Cadastro (username único) |
| `dashboard.html` | Perfil e histórico de compras |
| `checkout.html` | Pagamento via PIX com QR Code |
| `admin.html` | Painel admin completo |

### Painel Admin
- **Dashboard**: Estatísticas do site
- **Jogos**: Adicionar/remover categorias de jogos
- **Produtos**: Adicionar/remover produtos com imagem
- **Admins**: Promover/remover administradores
- **Logo**: Upload da logo do site
- **PIX**: Configurar chave PIX para receber pagamentos
- **Pagamentos**: Confirmar ou recusar compras

---

## 💳 Como funciona o Pagamento

1. Cliente escolhe o produto e clica em "Comprar"
2. Sistema gera um QR Code PIX
3. Cliente paga pelo app do banco (Nubank, Itaú, etc.)
4. Cliente faz upload do comprovante
5. Admin confirma o pagamento no painel
6. Compra aparece no feed ao vivo

---

## 📁 Estrutura

```
nexus-stores/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── checkout.html
├── admin.html
├── css/
│   └── style.css
├── js/
│   ├── firebase-config.js  ← COLE AQUI AS CHAVES
│   ├── auth.js
│   ├── products.js
│   ├── checkout.js
│   ├── feed.js
│   └── admin.js
├── .gitignore
└── README.md
```

## 🛠️ Tecnologias

- HTML + CSS + JavaScript
- Firebase (Authentication + Firestore)
- QR Code via API
- Tema roxo/preto com animações
