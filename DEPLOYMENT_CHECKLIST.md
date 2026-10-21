# Cloudflare Pages Deployment Checklist

## Current Status
- ✅ Production build: `npm run build` succeeds
- ✅ GitHub repository: pushed to `main` branch
- ✅ dist/ folder: ready for deployment (2.0 KB index.html + assets)
- ✅ Wrangler CLI: installed globally

## Deployment Steps (One-Time Manual Setup)

### Step 1: Navigate to Cloudflare Dashboard
Visit: https://dash.cloudflare.com/

### Step 2: Create Pages Project
1. Click **Workers & Pages**
2. Click **Create application**
3. Click **Pages** tab
4. Click **Connect to Git**
5. Authorize GitHub (if prompted)
6. Find and select: `malviyahimanshuhm-hash/himanshu-ai-filmmaker-portfolio`

### Step 3: Configure Build Settings
1. **Production branch**: `main`
2. **Build command**: `npm run build`
3. **Build output directory**: `dist`
4. **Root directory**: `/` (leave blank)
5. Click **Save and Deploy**

### Step 4: Wait for Deployment
- First build takes 2-3 minutes
- Check build logs for errors
- Expected URL: `himanshu-ai-filmmaker.pages.dev` or similar

### Step 5: Verify Live URL
- Open deployed URL in browser
- Test on desktop and mobile
- Check console for errors
- Verify media loads

## Environment Variables (If Needed Later)
If you configure Supabase or Cloudinary:
1. In Pages project settings
2. Go to **Settings** → **Environment variables**
3. Add for Production:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

## Post-Deployment Testing
- [ ] Homepage loads
- [ ] Hero section visible
- [ ] Navigation works
- [ ] Videos play (or show thumbnails)
- [ ] Mobile responsive
- [ ] No 404 errors
- [ ] Console clear of errors

---

**Status:** Ready for deployment. Awaiting Cloudflare Pages setup.
