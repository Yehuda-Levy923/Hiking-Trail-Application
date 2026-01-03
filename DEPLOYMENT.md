# TrailWatch Deployment Guide

This guide will help you deploy your TrailWatch application online with a public URL.

## Overview

We'll deploy:
- **Frontend**: React app on Vercel (free)
- **Backend**: Node.js API on Railway (free tier)
- **Database**: PostgreSQL on Railway (free tier)

---

## Prerequisites

Before you begin, make sure you have:
- [Git](https://git-scm.com/) installed
- A [GitHub](https://github.com/) account
- A [Vercel](https://vercel.com/) account (sign up with GitHub)
- A [Railway](https://railway.app/) account (sign up with GitHub)

---

## Part 1: Deploy Backend to Railway

### Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub (e.g., `trailwatch-app`)
2. Initialize git and push your code:

```bash
cd Hiking-Trail-Application
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/trailwatch-app.git
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to [Railway.app](https://railway.app/)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `trailwatch-app` repository
5. Railway will detect it's a monorepo and ask for the root directory
6. Set **Root Directory** to: `backend`

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will automatically provision the database

### Step 4: Configure Environment Variables

1. Click on your **backend service** in Railway
2. Go to **"Variables"** tab
3. Add these variables:

```
NODE_ENV=production
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

**Note**: We'll update `CORS_ORIGIN` after deploying the frontend.

### Step 5: Link Database to Backend

1. In Railway, the database variables should auto-populate:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`

2. If not, click **"+ New Variable"** and select **"Add Reference"**
3. Link these from your PostgreSQL database

### Step 6: Initialize Database Schema

1. In Railway, click on your **PostgreSQL database**
2. Click **"Data"** tab
3. Open the **Query** console
4. Copy and paste the contents of `database/schema.sql`
5. Run the query to create tables
6. (Optional) Run `database/seed.sql` for sample data

### Step 7: Deploy Backend

1. Railway will automatically deploy when you push to GitHub
2. Get your backend URL:
   - Click on your backend service
   - Go to **"Settings"** tab
   - Under **"Domains"**, click **"Generate Domain"**
   - Copy the URL (e.g., `https://trailwatch-backend.up.railway.app`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [Vercel.com](https://vercel.com/)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Vercel will detect it's a monorepo

### Step 2: Configure Build Settings

1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`

### Step 3: Add Environment Variables

1. In **Environment Variables** section, add:

```
REACT_APP_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api
```

**Replace** `YOUR-BACKEND-URL` with your Railway backend URL from Part 1, Step 7.

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Copy your frontend URL (e.g., `https://trailwatch.vercel.app`)

---

## Part 3: Update CORS Configuration

### Step 1: Update Backend CORS

1. Go back to Railway
2. Click on your **backend service**
3. Go to **"Variables"** tab
4. Update `CORS_ORIGIN` to your Vercel URL:

```
CORS_ORIGIN=https://your-app.vercel.app,http://localhost:3000
```

**Note**: You can have multiple origins separated by commas.

### Step 2: Redeploy Backend

1. Railway will automatically redeploy
2. Wait for deployment to complete

---

## Part 4: Test Your Deployment

### Step 1: Visit Your App

1. Go to your Vercel URL (e.g., `https://trailwatch.vercel.app`)
2. You should see the vibrant homepage with stats
3. Click **"Explore Trails"** to view trails

### Step 2: Verify Backend Connection

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. If you see errors about CORS or network issues:
   - Double-check your `REACT_APP_API_URL` in Vercel
   - Verify your `CORS_ORIGIN` in Railway
   - Redeploy if needed

### Step 3: Check Health Endpoint

Visit: `https://YOUR-BACKEND-URL.up.railway.app/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-XX...",
  "uptime": 123.45
}
```

---

## Alternative: Deploy Backend to Render

If you prefer Render over Railway:

### Step 1: Create Web Service

1. Go to [Render.com](https://render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `trailwatch-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Create PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Configure database settings
3. Copy the **Internal Database URL**

### Step 3: Add Environment Variables

In your web service, add:

```
NODE_ENV=production
PORT=4000
DATABASE_URL=<your-internal-database-url>
CORS_ORIGIN=https://your-app.vercel.app
```

### Step 4: Update Database Connection

You'll need to modify `backend/src/config/db.js` to support `DATABASE_URL` for Render.

---

## Troubleshooting

### Issue: Frontend can't connect to backend

**Solution**:
1. Check if `REACT_APP_API_URL` in Vercel has `/api` at the end
2. Verify CORS_ORIGIN in Railway matches your Vercel URL exactly
3. Make sure both URLs use HTTPS (not HTTP)

### Issue: Database connection fails

**Solution**:
1. Check if database environment variables are correctly linked in Railway
2. Verify database is running in Railway dashboard
3. Check database logs for connection errors

### Issue: Trails not showing up

**Solution**:
1. Make sure you ran `database/schema.sql` in Railway
2. Run `database/seed.sql` for sample data
3. Check API health endpoint: `/health`

### Issue: Build fails on Vercel

**Solution**:
1. Check if all dependencies are in `package.json`
2. Make sure `build` script exists in `package.json`
3. Check build logs for specific errors

---

## Updating Your Deployment

### Update Frontend

1. Make changes to frontend code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push
   ```
3. Vercel automatically redeploys

### Update Backend

1. Make changes to backend code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
3. Railway automatically redeploys

---

## Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `trailwatch.com`)
4. Follow DNS configuration instructions

### For Railway (Backend)

1. Click on your backend service
2. Go to **"Settings"** → **"Domains"**
3. Add custom domain (e.g., `api.trailwatch.com`)
4. Update DNS records

**Important**: After adding custom domains, update:
- `REACT_APP_API_URL` in Vercel to use your custom backend domain
- `CORS_ORIGIN` in Railway to include your custom frontend domain

---

## Security Checklist

Before going fully public:

- [ ] Remove or secure database seed data (remove passwords/sensitive info)
- [ ] Enable environment-specific error messages
- [ ] Set up monitoring (Railway/Vercel dashboards)
- [ ] Configure rate limiting (see main README for implementation)
- [ ] Add authentication if needed
- [ ] Review and restrict CORS origins to only your domains
- [ ] Enable HTTPS only (both platforms do this by default)

---

## Cost Estimates

### Free Tier Limits

**Vercel Free Tier**:
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Perfect for most hobby projects

**Railway Free Trial**:
- $5 free credit (no credit card required)
- ~500 hours of server runtime
- Good for testing and small projects

**Render Free Tier**:
- 750 hours/month free
- Sleeps after 15 minutes of inactivity
- Slower cold starts
- Unlimited bandwidth

### When You Need to Upgrade

- Traffic > 100GB/month (Vercel)
- Backend running 24/7 (Railway)
- Need faster database (Railway/Render)

Typical costs: $5-20/month for small production apps

---

## Need Help?

- Check [Railway Documentation](https://docs.railway.app/)
- Check [Vercel Documentation](https://vercel.com/docs)
- Review application logs in dashboards
- Open an issue on GitHub

---

## Next Steps

After successful deployment:

1. Share your URL with friends
2. Add more trails to the database
3. Implement authentication (see main README)
4. Add analytics (Google Analytics, Plausible)
5. Set up monitoring and alerts

Congratulations! Your TrailWatch app is now live!
