# SIGRA - Sistema Integrado de Gestão Rodoviária de Angola

![SIGRA Logo](public/images/logo.bmp)

## 🚗 Sobre o Projeto

O **SIGRA** (Sistema Integrado de Gestão Rodoviária de Angola) é uma plataforma completa para gestão de tráfego e infrações rodoviárias em Angola, desenvolvida para o Ministério do Interior - DNVT.

### Funcionalidades Principais

- 📊 **Dashboard Analítico** - Visão geral com KPIs e gráficos interativos
- 🚗 **Gestão de Veículos** - Registo e controle de viaturas por província
- 👤 **Gestão de Motoristas** - Cadastro de condutores com controle de pontos
- 📋 **Gestão de Multas** - Aplicação e acompanhamento de infrações
- 📈 **Relatórios Analíticos** - Estatísticas detalhadas por período e região
- 🔔 **Sistema de Notificações** - Alertas em tempo real (in-app, email, SMS, WhatsApp)
- 📱 **QR Code** - Consulta rápida de veículos e motoristas

### Características Técnicas

- ✅ Formatação angolana (DD/MM/AAAA, Kz)
- ✅ 18 províncias e municípios de Angola
- ✅ Tipos de infrações conforme legislação angolana
- ✅ Interface responsiva (desktop, tablet, mobile)
- ✅ Modo escuro/claro
- ✅ Sistema de notificações gratuito

---

## 🛠️ Tecnologias

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript 5
- **Base de Dados**: SQLite com Prisma ORM
- **UI**: shadcn/ui + Tailwind CSS
- **Gráficos**: Recharts
- **Autenticação**: NextAuth.js

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ou Bun
- Git

### Passos

```bash
# Clonar o repositório
git clone https://github.com/Gitnew-ops/SIGRA---Sistema-Integrado-de-Gest-o-Rodovi-ria-de-Angola.git
cd SIGRA---Sistema-Integrado-de-Gest-o-Rodovi-ria-de-Angola

# Instalar dependências
bun install

# Configurar variáveis de ambiente
cp .env.example .env

# Sincronizar base de dados
bun run db:push

# Gerar dados de exemplo
# Acesse http://localhost:3000/api/seed após iniciar

# Iniciar servidor de desenvolvimento
bun run dev
```

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Base de Dados
DATABASE_URL="file:./db/sigra.db"

# NextAuth (opcional para produção)
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Notificações Email (Resend - opcional)
RESEND_API_KEY="re_xxxxxxxx"

# Notificações SMS/WhatsApp (Twilio - opcional)
TWILIO_ACCOUNT_SID="ACxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxx"
TWILIO_PHONE_NUMBER="+1234567890"
```

---

## 🚀 Deploy no Railway

### Opção 1: Deploy Rápido

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/sigra)

### Opção 2: Deploy Manual

1. Crie uma conta no [Railway](https://railway.app)
2. Conecte seu repositório GitHub
3. Selecione o repositório SIGRA
4. Configure as variáveis de ambiente
5. Deploy automático!

### Configuração do Railway

```yaml
# Variáveis necessárias no Railway
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_SECRET=<gerar-aleatório>
NEXTAUTH_URL=https://seu-app.railway.app
```

---

## 📁 Estrutura do Projeto

```
sigra/
├── prisma/
│   └── schema.prisma      # Modelos da base de dados
├── public/
│   └── images/            # Logótipo e imagens
├── src/
│   ├── app/
│   │   ├── api/           # APIs REST
│   │   ├── drivers/       # Página de motoristas
│   │   ├── fines/         # Página de multas
│   │   ├── reports/       # Página de relatórios
│   │   ├── vehicles/      # Página de veículos
│   │   └── page.tsx       # Dashboard
│   ├── components/
│   │   ├── layout/        # Layout principal
│   │   ├── notifications/ # Sistema de notificações
│   │   └── ui/            # Componentes shadcn
│   ├── lib/
│   │   ├── db.ts          # Cliente Prisma
│   │   ├── formatters.ts  # Formatação angolana
│   │   └── notifications.ts # Serviço de notificações
│   └── types/
│       └── index.ts       # Tipos TypeScript
├── package.json
└── README.md
```

---

## 🇦🇴 Províncias de Angola

O sistema suporta todas as 18 províncias:

- Bengo, Benguela, Bié, Cabinda, Cuando Cubango
- Cuanza Norte, Cuanza Sul, Cunene, Huambo, Huíla
- Luanda, Lunda Norte, Lunda Sul, Malanje, Moxico
- Namibe, Uíge, Zaire

---

## 📋 Tipos de Infrações

| Código | Descrição | Valor (Kz) | Pontos |
|--------|-----------|------------|--------|
| ART-001 | Excesso de velocidade até 20 km/h | 15.000 | 2 |
| ART-002 | Excesso de velocidade acima de 20 km/h | 30.000 | 4 |
| ART-003 | Passagem de sinal vermelho | 25.000 | 3 |
| ART-004 | Condução sob influência de álcool | 100.000 | 6 |
| ART-005 | Não uso do cinto de segurança | 7.500 | 1 |
| ART-006 | Estacionamento em local proibido | 5.000 | 1 |
| ART-007 | Ultrapassagem em local proibido | 20.000 | 3 |
| ART-008 | Condução sem carta de condução | 50.000 | 5 |
| ART-009 | Veículo sem seguro válido | 35.000 | 3 |
| ART-010 | Uso de telemóvel durante condução | 10.000 | 2 |

---

## 📞 Suporte

Para suporte técnico, contacte:
- Email: suporte@sigra.ao
- Telefone: +244 923 456 789

---

## 📄 Licença

Este projeto é propriedade do Ministério do Interior - República de Angola.

---

<p align="center">
  <strong>SIGRA</strong> - Sistema Integrado de Gestão Rodoviária de Angola<br>
  © 2024 Ministério do Interior - DNVT
</p>
