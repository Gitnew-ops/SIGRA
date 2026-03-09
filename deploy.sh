#!/bin/bash

# ============================================
# SIGRA - Script de Deploy para GitHub + Railway
# ============================================

echo "🚀 SIGRA - Configurando deploy..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Passo 1: Verificar se o git está configurado
echo -e "${YELLOW}Passo 1: Verificando configuração do Git...${NC}"
if ! git config user.name > /dev/null 2>&1; then
    echo "Configurando Git..."
    git config user.name "SIGRA Deploy"
    git config user.email "deploy@sigra.ao"
fi
echo -e "${GREEN}✓ Git configurado${NC}"

# Passo 2: Verificar remote
echo ""
echo -e "${YELLOW}Passo 2: Verificando remote do GitHub...${NC}"
git remote -v
echo ""

# Passo 3: Fazer push
echo -e "${YELLOW}Passo 3: Enviando para GitHub...${NC}"
echo ""
echo -e "${RED}IMPORTANTE: Você precisa ter um Personal Access Token do GitHub${NC}"
echo ""
echo "Para criar um token:"
echo "1. Acesse: https://github.com/settings/tokens"
echo "2. Clique em 'Generate new token (classic)'"
echo "3. Selecione 'repo' e 'workflow'"
echo "4. Copie o token gerado"
echo ""
echo "Execute o comando abaixo para fazer push:"
echo ""
echo "  git push -u origin main"
echo ""
echo "Quando solicitado:"
echo "  Username: seu-username-do-github"
echo "  Password: cole-seu-personal-access-token"
echo ""

# Passo 4: Instruções para Railway
echo -e "${YELLOW}Passo 4: Deploy no Railway${NC}"
echo ""
echo "📋 INSTRUÇÕES PARA DEPLOY NO RAILWAY:"
echo ""
echo "1. Acesse: https://railway.app"
echo "2. Clique em 'Start a New Project'"
echo "3. Selecione 'Deploy from GitHub repo'"
echo "4. Autorize o Railway a acessar seu GitHub"
echo "5. Selecione o repositório: SIGRA---Sistema-Integrado-de-Gest-o-Rodovi-ria-de-Angola"
echo "6. Clique em 'Deploy Now'"
echo ""
echo "7. Configure as variáveis de ambiente:"
echo "   - Clique em 'Variables' no Railway"
echo "   - Adicione:"
echo "     DATABASE_URL = (será auto-gerado ao adicionar PostgreSQL)"
echo "     NEXTAUTH_SECRET = (clique em Generate para criar)"
echo "     NEXTAUTH_URL = https://seu-app.up.railway.app"
echo ""
echo "8. Adicione PostgreSQL:"
echo "   - Clique em '+ New'"
echo "   - Selecione 'Database' > 'PostgreSQL'"
echo "   - O DATABASE_URL será configurado automaticamente"
echo ""
echo "9. Faça redeploy após configurar as variáveis"
echo ""
echo -e "${GREEN}✅ Projeto pronto para deploy!${NC}"
echo ""
echo "🔗 Links úteis:"
echo "   GitHub: https://github.com/Gitnew-ops/SIGRA---Sistema-Integrado-de-Gest-o-Rodovi-ria-de-Angola"
echo "   Railway: https://railway.app"
echo ""
