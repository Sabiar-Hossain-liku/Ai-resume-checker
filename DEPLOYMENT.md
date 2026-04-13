# PrepAI — Deployment Guide: Vercel + Azure

---

## Architecture

```
Browser
  │
  ├── Static Files ──→ Vercel (Frontend)
  │                    VITE_API_URL = https://prepai-backend.azurewebsites.net
  │
  └── API Calls ────→ Azure App Service (Backend Docker container)
                       ↓
                    MongoDB Atlas
                       ↓
                    Gemini AI API
```

---

## Part 1 — Deploy Frontend to Vercel

### Step 1: Push your code to GitHub
```bash
git add .
git commit -m "deploy: vercel + azure setup"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Set **Root Directory** to `Frontend`
4. Framework preset: **Vite**

### Step 3: Set Environment Variables in Vercel
In Vercel project settings → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend.azurewebsites.net` ← (your Azure URL, set this after step 2) |

> **Note:** You can set a placeholder for now and update it after Azure deployment.

### Step 4: Deploy
Click **Deploy**. Vercel gives you a URL like `https://prepai-abc123.vercel.app`

### Step 5: Add custom domain (optional)
Vercel dashboard → **Domains** → add your domain.

---

## Part 2 — Deploy Backend to Azure

### Option A — Azure App Service (Easiest) ⭐

#### Step 1: Create an Azure Container Registry (ACR)
```bash
# Install Azure CLI first: https://aka.ms/installazurecliwindows
az login

# Create resource group
az group create --name prepai-rg --location eastus

# Create container registry
az acr create --resource-group prepai-rg --name prepairegistry --sku Basic --admin-enabled true

# Get credentials
az acr credential show --name prepairegistry
# Note down: username and password
```

#### Step 2: Build and push Docker image to ACR
```bash
# Login to ACR
docker login prepairegistry.azurecr.io -u <username> -p <password>

# Build and push
docker build -t prepairegistry.azurecr.io/prepai-backend:latest ./Backend
docker push prepairegistry.azurecr.io/prepai-backend:latest
```

#### Step 3: Create Azure Web App for Containers
```bash
# Create App Service plan
az appservice plan create \
  --name prepai-plan \
  --resource-group prepai-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group prepai-rg \
  --plan prepai-plan \
  --name prepai-backend \
  --deployment-container-image-name prepairegistry.azurecr.io/prepai-backend:latest

# Configure ACR credentials on the web app
az webapp config container set \
  --resource-group prepai-rg \
  --name prepai-backend \
  --docker-custom-image-name prepairegistry.azurecr.io/prepai-backend:latest \
  --docker-registry-server-url https://prepairegistry.azurecr.io \
  --docker-registry-server-user <acr-username> \
  --docker-registry-server-password <acr-password>
```

#### Step 4: Set Environment Variables on Azure
```bash
az webapp config appsettings set \
  --resource-group prepai-rg \
  --name prepai-backend \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/prepai" \
    JWT_SECRET="your_long_random_jwt_secret" \
    GEMINI_API_KEY="your_gemini_api_key" \
    FRONTEND_URL="https://prepai-abc123.vercel.app"
```

#### Step 5: Configure port
```bash
az webapp config appsettings set \
  --resource-group prepai-rg \
  --name prepai-backend \
  --settings WEBSITES_PORT=3000
```

Your backend is now live at: `https://prepai-backend.azurewebsites.net`

#### Step 6: Go back and update Vercel env var
In Vercel → Environment Variables:
- Update `VITE_API_URL` = `https://prepai-backend.azurewebsites.net`
- Trigger a redeploy in Vercel

---

## Part 3 — CI/CD with GitHub Actions (Automated Deployments)

Every push to `main` will automatically deploy both frontend and backend.

### Required GitHub Secrets

Go to: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

#### For Vercel:
| Secret | How to get it |
|--------|--------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create token |
| `VERCEL_ORG_ID` | Run `vercel link` in Frontend folder → check `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | Same file → `projectId` |

```bash
# Run this in Frontend folder to get org and project IDs
cd Frontend
npx vercel link
cat .vercel/project.json
```

#### For Azure:
| Secret | How to get it |
|--------|--------------|
| `ACR_LOGIN_SERVER` | `prepairegistry.azurecr.io` |
| `ACR_USERNAME` | From `az acr credential show --name prepairegistry` |
| `ACR_PASSWORD` | From same command above |
| `AZURE_WEBAPP_NAME` | `prepai-backend` |
| `AZURE_CREDENTIALS` | See below |

```bash
# Create service principal for GitHub Actions
az ad sp create-for-rbac \
  --name "prepai-github-actions" \
  --role contributor \
  --scopes /subscriptions/<your-subscription-id>/resourceGroups/prepai-rg \
  --json-auth

# Copy the entire JSON output → paste as AZURE_CREDENTIALS secret
```

### After setting all secrets
Push to `main` → GitHub Actions automatically:
1. Builds the Vite frontend and deploys to Vercel
2. Builds the Docker image, pushes to ACR, and deploys to Azure Web App

---

## Part 4 — MongoDB Atlas (Database)

Don't use a local MongoDB — use the free Atlas cloud tier.

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user
4. Add IP `0.0.0.0/0` to the IP Access List (allows Azure backend)
5. Get connection string: `mongodb+srv://user:pass@cluster.xxx.mongodb.net/prepai`
6. Set as `MONGODB_URI` in Azure App Settings

---

## Quick Reference

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://prepai-abc123.vercel.app` |
| Backend (Azure) | `https://prepai-backend.azurewebsites.net` |
| Health check | `https://prepai-backend.azurewebsites.net/api/health` |
| Database | MongoDB Atlas (free tier) |

## Environment Variables Summary

### Backend (Azure App Settings)
| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Your Vercel URL (for CORS) |

### Frontend (Vercel Environment Variables)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your Azure backend URL |
