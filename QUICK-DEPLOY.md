# Quick Deploy Guide - Get Your App Online in 15 Minutes! 🚀

Follow these steps to get your TrailWatch app online with a permanent URL.

---

## Step 1: Push to GitHub (5 minutes)

### A. Commit your changes

Open your terminal in the project folder and run:

```bash
git add .
git commit -m "Add vibrant UI and deployment configs"
git push
```

If you haven't created a GitHub repository yet:
1. Go to https://github.com/new
2. Create a new repository (name it "trailwatch-app")
3. Copy the commands GitHub shows you and run them

---

## Step 2: Deploy Backend on Railway (5 minutes)

### A. Sign up for Railway
1. Go to https://railway.app
2. Click **"Login"** → Sign in with GitHub
3. Authorize Railway to access your GitHub

### B. Create new project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `trailwatch-app` repository
4. Railway will ask for the root directory
5. Set **Root Directory** to: `backend`
6. Click **"Deploy"**

### C. Add PostgreSQL database
1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Wait for it to provision (30 seconds)

### D. Configure environment variables
1. Click on your **backend service** (not the database)
2. Click **"Variables"** tab
3. Click **"+ New Variable"** and add:
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `http://localhost:3000` (we'll update this later)

The database variables (DB_HOST, DB_PORT, etc.) should auto-populate. If not:
4. Click **"+ New Variable"** → **"Add Reference"**
5. Select your PostgreSQL database
6. Add all DB variables

### E. Initialize the database
1. Click on your **PostgreSQL database** service
2. Click **"Data"** tab
3. Click **"Query"** or connect tab
4. Open your local file: `database/schema.sql`
5. Copy ALL the contents and paste into Railway query
6. Click **"Run"** or **"Execute"**
7. (Optional) Do the same with `database/seed.sql` for sample data

### F. Get your backend URL
1. Click on your **backend service**
2. Click **"Settings"** tab
3. Scroll to **"Domains"**
4. Click **"Generate Domain"**
5. **COPY THIS URL** - you'll need it! (e.g., `https://trailwatch-backend-production.up.railway.app`)

---

## Step 3: Deploy Frontend on Vercel (5 minutes)

### A. Sign up for Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"** → Sign in with GitHub
3. Authorize Vercel

### B. Import your project
1. Click **"Add New..."** → **"Project"**
2. Find and select your `trailwatch-app` repository
3. Click **"Import"**

### C. Configure the project
In the configuration screen:

**Framework Preset**: Create React App (should auto-detect)

**Root Directory**:
- Click **"Edit"**
- Enter: `frontend`

**Build Settings** (should auto-fill):
- Build Command: `npm run build`
- Output Directory: `build`

**Environment Variables**:
- Click **"Add"**
- Name: `REACT_APP_API_URL`
- Value: `https://YOUR-RAILWAY-URL/api`
  *(Replace with the Railway URL from Step 2F - don't forget the `/api` at the end!)*

### D. Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. **COPY YOUR VERCEL URL** (e.g., `https://trailwatch-app.vercel.app`)

---

## Step 4: Update CORS (2 minutes)

Now we need to tell the backend to accept requests from your new Vercel URL.

### A. Update Railway environment variable
1. Go back to **Railway**
2. Click on your **backend service**
3. Click **"Variables"** tab
4. Find `CORS_ORIGIN` and click to edit
5. Change to: `https://YOUR-VERCEL-URL,http://localhost:3000`
   *(Replace with your actual Vercel URL from Step 3D)*
   *(Keep the comma - this allows both production and local development)*

### B. Redeploy
- Railway will automatically redeploy (wait 1-2 minutes)

---

## Step 5: Test Your App! 🎉

1. Open your **Vercel URL** in a browser (e.g., `https://trailwatch-app.vercel.app`)
2. You should see your vibrant homepage!
3. Click **"Explore Trails"** to see the trails
4. Everything should work!

### If you see errors:
- Open browser DevTools (press F12)
- Check the Console for errors
- Common fixes:
  - Make sure `REACT_APP_API_URL` has `/api` at the end
  - Verify CORS_ORIGIN matches your Vercel URL exactly
  - Wait a minute and refresh (deployments take time)

---

## Your Permanent URLs

After completing all steps, you'll have:

✅ **Frontend**: `https://your-app.vercel.app` (your main website)
✅ **Backend**: `https://your-backend.up.railway.app` (your API)
✅ **Database**: Hosted on Railway (PostgreSQL)

**These URLs are permanent and free!**

---

## Updating Your App Later

Whenever you make changes:

```bash
git add .
git commit -m "Your update description"
git push
```

Both Vercel and Railway will **automatically redeploy**! No extra steps needed.

---

## Free Tier Limits

**Vercel**:
- Unlimited deployments
- 100GB bandwidth/month
- Free forever for personal projects

**Railway**:
- $5 free credit (no credit card needed initially)
- About 500 hours of runtime
- Perfect for hobby projects

When you run out of Railway credits, you can:
- Add a credit card (charges start at ~$5/month)
- Or switch to Render.com (has a permanent free tier, see DEPLOYMENT.md)

---

## Need Help?

- Check the detailed `DEPLOYMENT.md` file
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs

---

## Summary Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created with backend
- [ ] PostgreSQL database added to Railway
- [ ] Database schema initialized (ran schema.sql)
- [ ] Backend URL copied from Railway
- [ ] Vercel project created with frontend
- [ ] REACT_APP_API_URL set in Vercel (with /api at end)
- [ ] Frontend URL copied from Vercel
- [ ] CORS_ORIGIN updated in Railway with Vercel URL
- [ ] App tested and working!

Good luck! 🚀
