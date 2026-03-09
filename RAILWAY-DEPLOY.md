# 🚀 DEPLOY SIGRA NO RAILWAY - PASSO A PASSO

## ✅ Status Atual
- **GitHub**: ✅ Código enviado com sucesso!
- **Repositório**: Gitnew-ops/SIGRA---Sistema-Integrado-de-Gest-o-Rodovi-ria-de-Angola

---

## 🔑 PASSO 1: Acesse o Railway

👉 **Clique aqui**: https://railway.app

1. Clique em **"Login"** (canto superior direito)
2. Selecione **"Login with GitHub"**
3. Autorize o Railway a acessar sua conta GitHub

---

## 🆕 PASSO 2: Criar Novo Projeto

1. Clique em **"+ New Project"** (botão grande)
2. Selecione **"Deploy from GitHub repo"**
3. Clique em **"Configure GitHub App"** se for a primeira vez
4. Autorize o acesso ao repositório
5. Selecione: **SIGRA---Sistema-Integrado-de-Gest-o-Rodovi-ria-de-Angola**
6. Clique em **"Deploy Now"**

---

## 🗄️ PASSO 3: Adicionar PostgreSQL (GRÁTIS!)

1. No seu projeto, clique em **"+ New"** (ou no botão de adicionar)
2. Selecione **"Database"**
3. Escolha **"PostgreSQL"**
4. Aguarde a criação (alguns segundos)

---

## ⚙️ PASSO 4: Configurar Variáveis

### 4.1 Obter DATABASE_URL
1. Clique no serviço **PostgreSQL** que você criou
2. Vá na aba **"Variables"**
3. Copie o valor de **DATABASE_URL**

### 4.2 Configurar o Web Service
1. Volte ao serviço web (seu app principal)
2. Vá na aba **"Variables"**
3. Adicione as seguintes variáveis:

| Variável | Valor | Como obter |
|----------|-------|------------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Digite exatamente assim para conectar ao PostgreSQL |
| `NEXTAUTH_SECRET` | (clique em Generate) | Clique no botão "Generate" |
| `NEXTAUTH_URL` | `https://SEU-DOMINIO.up.railway.app` | Substitua pelo seu domínio real |

### 4.3 Configurar Domínio
1. Vá na aba **"Settings"** do seu web service
2. Role até **"Domains"**
3. Clique em **"Generate Domain"**
4. Copie o domínio gerado (ex: `sigra-production.up.railway.app`)
5. Volte nas Variables e atualize `NEXTAUTH_URL` com esse domínio

---

## 🚀 PASSO 5: Fazer Deploy

1. Clique em **"Redeploy"** no seu web service
2. Acompanhe os logs em tempo real
3. Aguarde a mensagem "SUCCESS" (~2-3 minutos)

---

## 🎉 PASSO 6: Gerar Dados de Exemplo

Após o deploy completar, acesse:

```
https://SEU-DOMINIO.up.railway.app/api/seed
```

Isso criará automaticamente:
- ✅ 3 usuários
- ✅ 100 veículos
- ✅ 100 motoristas
- ✅ 200 multas
- ✅ 139 pagamentos
- ✅ 4 notificações

---

## 🔗 PASSO 7: Acessar sua Aplicação!

```
https://SEU-DOMINIO.up.railway.app
```

### Credenciais de Acesso:

| Email | Função |
|-------|--------|
| admin@sigra.ao | Administrador |
| manager@luanda.ao | Gestor |
| agent@dnvt.ao | Agente |

---

## 📊 Resumo dos Custos (Railway Free Tier)

| Serviço | Custo |
|---------|-------|
| Web Service | ~$5/mês (coberto pelo free tier) |
| PostgreSQL | ~$5/mês (coberto pelo free tier) |
| **TOTAL** | **GRÁTIS** (até $5 de crédito/mês) |

---

## ❌ Problemas Comuns

### Build falhou
- Verifique se DATABASE_URL está configurado
- Verifique os logs em "Deployments"

### Database connection error
- Verifique se PostgreSQL está rodando
- Verifique se DATABASE_URL está correto

### 404 na página
- Acesse `/api/seed` primeiro para criar dados
- Verifique se o deploy completou

---

## 📞 Precisa de ajuda?

Se encontrar qualquer problema, me avise com:
1. A mensagem de erro
2. Os logs do Railway
3. Screenshot se possível

Boa sorte! 🍀
