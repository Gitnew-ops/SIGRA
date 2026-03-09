# 🚀 Guia de Deploy - SIGRA

## Passo 1: Criar Personal Access Token no GitHub

1. Acesse: **https://github.com/settings/tokens**
2. Clique em **"Generate new token (classic)"**
3. Dê um nome: `SIGRA Deploy`
4. Selecione as permissões:
   - ✅ repo (todas)
   - ✅ workflow
5. Clique em **"Generate token"**
6. **⚠️ COPIE O TOKEN AGORA** (só aparece uma vez!)

---

## Passo 2: Enviar para o GitHub

Execute no terminal:

```bash
cd /home/z/my-project

# Adicionar remote (já configurado)
git remote -v

# Fazer push
git push -u origin main
```

Quando solicitado:
- **Username**: seu-username-do-github
- **Password**: cole-o-token-gerado (NÃO sua senha)

---

## Passo 3: Deploy no Railway

### 3.1 Acesse o Railway
🔗 **https://railway.app**

### 3.2 Login com GitHub
1. Clique em **"Start a New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Autorize o Railway a acessar seu GitHub
4. Selecione: **SIGRA---Sistema-Integrado-de-Gest-o-Rodovi-ria-de-Angola**

### 3.3 Configurar Variáveis
Clique em **"Variables"** e adicione:

| Variável | Valor |
|----------|-------|
| `NEXTAUTH_SECRET` | (clique em Generate) |
| `NEXTAUTH_URL` | https://seu-app.up.railway.app |

### 3.4 Adicionar PostgreSQL
1. Clique em **"+ New"**
2. Selecione **"Database"**
3. Selecione **"PostgreSQL"**
4. O `DATABASE_URL` será configurado automaticamente

### 3.5 Atualizar Schema do Prisma
Após criar o PostgreSQL, atualize a variável de ambiente do app principal:
1. Vá nas configurações do PostgreSQL
2. Copie a variável `DATABASE_URL`
3. Adicione ao seu app web

### 3.6 Fazer Deploy
1. Clique em **"Deploy"**
2. Aguarde o build completar
3. Acesse sua aplicação!

---

## Passo 4: Gerar Dados de Exemplo

Após o deploy, acesse:
```
https://seu-app.up.railway.app/api/seed
```

Isso criará:
- 3 usuários
- 100 veículos
- 100 motoristas
- 200 multas
- Notificações de exemplo

---

## 🎉 Pronto!

Sua aplicação SIGRA estará disponível em:
```
https://seu-app.up.railway.app
```

---

## Credenciais Padrão

| Email | Role |
|-------|------|
| admin@sigra.ao | Administrador |
| manager@luanda.ao | Gestor |
| agent@dnvt.ao | Agente |

---

## Problemas Comuns

### Build falhou
- Verifique se todas as variáveis estão configuradas
- Verifique os logs no Railway

### Database error
- Verifique se o PostgreSQL está conectado
- Verifique a variável DATABASE_URL

### 404 Error
- Acesse /api/seed primeiro para criar dados
- Verifique se o build completou
