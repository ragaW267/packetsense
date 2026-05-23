# PacketSense — Deployment Guide

Step-by-step instructions to deploy PacketSense from GitHub.

---

## Overview

| Component | Service | Directory |
|-----------|---------|-----------|
| Frontend | **Vercel** | `apps/web` |
| Backend | **Render** | `apps/api` |
| Database | **Neon** | — |

---

## Step 1: Set Up Neon PostgreSQL Database

1. Go to [https://neon.tech](https://neon.tech) and create a free account.
2. Click **"New Project"** → name it `packetsense`.
3. Select your region (choose one close to you).
4. Once created, go to your project dashboard.
5. Click **"Connection Details"** and copy the connection string. It looks like:

```
postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/packetsense?sslmode=require
```

6. **Save this connection string** — you'll need it for the backend.

---

## Step 2: Push to GitHub

1. Create a new repository on GitHub (e.g., `packetsense`).
2. Initialize and push:

```bash
cd packetsense
git init
git add .
git commit -m "Initial commit - PacketSense"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/packetsense.git
git push -u origin main
```

---

## Step 3: Deploy Backend on Render

1. Go to [https://render.com](https://render.com) and sign up (free tier available).
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository.
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `packetsense-api` |
| **Root Directory** | `apps/api` |
| **Runtime** | Python |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | Free |

5. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | *(your Neon connection string from Step 1)* |
| `JWT_SECRET_KEY` | *(generate a random string — e.g., run `openssl rand -hex 32`)* |
| `JWT_ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `FRONTEND_URL` | *(you'll update this after Vercel deploy — use `https://your-app.vercel.app`)* |
| `APP_ENV` | `production` |
| `DEBUG` | `false` |
| `PYTHON_VERSION` | `3.11.0` |

6. Click **"Create Web Service"**.
7. Wait for the build to complete (~2-5 minutes).
8. Note your Render URL (e.g., `https://packetsense-api.onrender.com`).

### Verify Backend
Visit `https://packetsense-api.onrender.com/` — you should see:
```json
{"status": "healthy", "service": "PacketSense API", "version": "1.0.0"}
```

---

## Step 4: Deploy Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub.
2. Click **"Add New..."** → **"Project"**.
3. Import your `packetsense` repository.
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` ← **IMPORTANT: Click "Edit" and set this!** |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |

5. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://packetsense-api.onrender.com` *(your Render URL from Step 3)* |
| `NEXT_PUBLIC_APP_NAME` | `PacketSense` |

6. Click **"Deploy"**.
7. Wait for the build to complete (~1-3 minutes).
8. Note your Vercel URL (e.g., `https://packetsense.vercel.app`).

---

## Step 5: Update Render CORS

Now that you have your Vercel URL, go back to Render:

1. Go to your `packetsense-api` service → **Environment**.
2. Update `FRONTEND_URL` to your Vercel URL (e.g., `https://packetsense.vercel.app`).
3. Click **"Save Changes"** — Render will auto-redeploy.

---

## Step 6: Run Database Migrations

The backend auto-creates tables on startup via `Base.metadata.create_all()`. However, for production migrations:

### Option A: Auto-create (default)
Tables are created automatically when the backend starts. This works for initial setup.

### Option B: Alembic migrations (recommended for updates)
If you need to run Alembic migrations manually:

1. Set the `DATABASE_URL` environment variable locally:
```bash
export DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/packetsense?sslmode=require"
```

2. Run migrations:
```bash
cd apps/api
alembic upgrade head
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend health: `GET https://your-api.onrender.com/`
- [ ] API docs: `https://your-api.onrender.com/docs` (dev only)
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Signup works: create an account
- [ ] Login works: sign in with your account
- [ ] Dashboard loads after login
- [ ] Protocols page shows 8 protocols
- [ ] Protocol visualizer plays animations
- [ ] Quiz categories load
- [ ] Troubleshoot issues load
- [ ] Explain topics load

---

## 🔧 Troubleshooting Deployment

### "Application error" on Render
- Check the **Logs** tab in Render for errors.
- Ensure `DATABASE_URL` is set correctly with `?sslmode=require`.
- Ensure `PYTHON_VERSION` is set to `3.11.0`.

### "Build failed" on Vercel
- Ensure **Root Directory** is set to `apps/web`.
- Check that `NEXT_PUBLIC_API_URL` is set.
- Verify Node.js version is 18+.

### CORS errors in browser
- Ensure `FRONTEND_URL` on Render matches your Vercel URL exactly.
- Don't include a trailing slash.

### Database connection errors
- Verify Neon connection string includes `?sslmode=require`.
- Check that the Neon project is not paused (free tier pauses after inactivity).

### Render free tier cold starts
- Render free tier services spin down after 15 minutes of inactivity.
- First request after idle may take 30-60 seconds.
- This is normal for the free plan.

---

## 🔄 Updating the App

After making code changes:

1. Commit and push to GitHub:
```bash
git add .
git commit -m "Your change description"
git push
```

2. Both Vercel and Render will **auto-deploy** from the `main` branch.

---

## 💰 Cost

| Service | Plan | Cost |
|---------|------|------|
| Neon | Free | $0/mo (0.5 GB storage, auto-suspend) |
| Render | Free | $0/mo (spin-down after inactivity) |
| Vercel | Hobby | $0/mo (100 GB bandwidth) |
| **Total** | | **$0/mo** |
