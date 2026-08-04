# Deploy Frontend (Vercel / Netlify)

Siga os passos abaixo para fazer o deploy do frontend na Vercel ou Netlify de forma integrada ao backend.

## Pré-requisitos
Certifique-se de que o backend já foi implantado (ex: no Render) e que você tem a URL pública da API, como `https://calculaeng-backend.onrender.com`.

## Passo a Passo (Vercel ou Netlify)

1. **Importar o repositório:**
   - No painel da sua conta Vercel/Netlify, escolha "Add New Project" e conecte com seu repositório no GitHub.

2. **Configurações de Build:**
   A plataforma detectará que é um projeto Vite/React automaticamente. Confirme as opções a seguir:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Variáveis de Ambiente (Environment Variables):**
   Nas configurações do projeto antes de concluir o deploy, adicione a seguinte variável:
   - **Name:** `VITE_API_URL`
   - **Value:** *[A URL pública do seu backend no Render]* (Sem barra no final, ex: `https://calculaeng-backend.onrender.com`)

4. **Deploy:**
   - Clique em "Deploy" e aguarde o término.

5. **Ajuste de CORS (Importante!):**
   - Após o frontend subir, ele receberá um domínio próprio (ex: `https://calculaeng.vercel.app`).
   - Volte ao painel do backend (Render) e configure a variável `CORS_ALLOWED_ORIGINS` para este domínio do frontend.
   - O backend pode precisar ser reiniciado para carregar a nova origem no CORS.
