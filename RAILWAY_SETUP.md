# Guia de Configuração do Railway

## Passo 1: Adicionar PostgreSQL ao Projeto

1. No Railway Dashboard, abra seu projeto SIGRA
2. Clique em **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. O PostgreSQL será criado automaticamente

## Passo 2: Conectar DATABASE_URL ao Web Service

1. Vá para o **Web Service** (seu app SIGRA)
2. Clique na aba **"Variables"**
3. Clique em **"New Variable"** ou **"Add Variable"**
4. Nome: `DATABASE_URL`
5. Valor: Clique em **"Add Reference"** → Selecione **PostgreSQL** → **DATABASE_URL**
   - OU digite: `${{Postgres.DATABASE_URL}}`

## Passo 3: Adicionar NEXTAUTH_SECRET

1. Ainda na aba **"Variables"**
2. Clique em **"New Variable"**
3. Nome: `NEXTAUTH_SECRET`
4. Valor: Clique em **"Generate"** para criar uma chave secreta aleatória

## Passo 4: Adicionar NEXTAUTH_URL

1. Ainda na aba **"Variables"**
2. Clique em **"New Variable"**
3. Nome: `NEXTAUTH_URL`
4. Valor: `https://sigra-production.up.railway.app` (sua URL do Railway)

## Passo 5: Fazer Redeploy

1. Vá para a aba **"Deployments"**
2. Clique em **"Redeploy"** no serviço web
3. Aguarde o build completar

## Passo 6: Inicializar o Banco de Dados

Após o deploy completar com sucesso:

1. Acesse: `https://sigra-production.up.railway.app/api/seed`
2. Isso irá criar dados de exemplo no banco de dados
3. Acesse: `https://sigra-production.up.railway.app` para ver o sistema funcionando

## Variáveis Necessárias

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| DATABASE_URL | URL de conexão PostgreSQL | ✅ Sim |
| NEXTAUTH_SECRET | Chave secreta para autenticação | ✅ Sim |
| NEXTAUTH_URL | URL base da aplicação | ✅ Sim |
| RESEND_API_KEY | API key para emails (opcional) | ❌ Não |
| TWILIO_ACCOUNT_SID | SID Twilio para SMS (opcional) | ❌ Não |
| TWILIO_AUTH_TOKEN | Token Twilio (opcional) | ❌ Não |
| TWILIO_PHONE_NUMBER | Número Twilio (opcional) | ❌ Não |

## Troubleshooting

### Erro: "Application error: a client-side exception has occurred"
- Verifique se DATABASE_URL está configurada corretamente
- Verifique se o PostgreSQL está provisionado
- Faça redeploy após configurar as variáveis

### Erro de Build
- Verifique os logs em "Deployments" → "View Logs"
- O build pode falhar se não encontrar as dependências

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está na mesma rede/volume
- Verifique se a referência `${Postgres.DATABASE_URL}` está correta
