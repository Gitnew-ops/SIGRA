# 🔐 Criar Personal Access Token no GitHub

## Passo a Passo Rápido:

### 1. Acesse o link direto:
👉 **https://github.com/settings/tokens/new**

### 2. Preencha:
- **Note**: `SIGRA Deploy`
- **Expiration**: `No expiration` (ou 90 days)
- **Select scopes**: Marque ✅ `repo` (todas as opções dentro de repo)

### 3. Clique em **"Generate token"**

### 4. **⚠️ COPIE O TOKEN** (começa com `ghp_`)

---

## Depois de copiar o token, me envie aqui ou execute:

```bash
cd /home/z/my-project
git remote set-url origin https://SEU_TOKEN@github.com/Gitnew-ops/SIGRA---Sistema-Integrado-de-Gest-o-Rodovi-ria-de-Angola.git
git push -u origin main
```

---

## 🔗 Links Úteis:
- Criar token: https://github.com/settings/tokens/new
- Ver tokens: https://github.com/settings/tokens
