# SIGRA - Sistema Integrado de Gestão Rodoviária de Angola

![SIGRA Logo](public/logo.svg)

## 🚗 Sobre o Projeto

O **SIGRA** (Sistema Integrado de Gestão Rodoviária de Angola) é uma plataforma completa para gestão de tráfego e infrações rodoviárias em Angola.

---

## 🚀 Deploy Rápido no Railway

### 1. Clique no botão abaixo:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/sigra-deploy)

### 2. Configure as variáveis:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | Automático (PostgreSQL) |
| `NEXTAUTH_SECRET` | Clique em **Generate** |
| `NEXTAUTH_URL` | `https://seu-app.up.railway.app` |

### 3. Acesse sua aplicação!

Após o deploy, acesse `/api/seed` para criar dados de exemplo.

---

## 📦 Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/Gitnew-ops/SIGRA.git
cd SIGRA

# Instale as dependências
bun install

# Configure o banco de dados
cp .env.example .env
bun run db:push

# Inicie o servidor
bun run dev
```

---

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | URL do PostgreSQL | ✅ Sim |
| `NEXTAUTH_SECRET` | Chave secreta para autenticação | ✅ Sim |
| `NEXTAUTH_URL` | URL da aplicação | ✅ Sim |

---

## 📁 Estrutura

```
sigra/
├── src/
│   ├── app/          # Páginas e APIs
│   ├── components/   # Componentes UI
│   └── lib/          # Utilitários
├── prisma/           # Schema do banco
└── public/           # Arquivos estáticos
```

---

## 🇦🇴 Funcionalidades

- ✅ Dashboard com KPIs
- ✅ Gestão de Veículos (18 províncias)
- ✅ Gestão de Motoristas
- ✅ Gestão de Multas
- ✅ Relatórios Analíticos
- ✅ Sistema de Notificações
- ✅ Interface Responsiva

---

© 2024 Ministério do Interior - República de Angola
