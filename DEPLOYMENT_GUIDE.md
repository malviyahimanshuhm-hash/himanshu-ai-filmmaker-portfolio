# Deployment Guide - Cloudflare Pages

## Prerequisites

- A Cloudflare account (free tier is sufficient)
- Git installed locally
- GitHub account (or GitLab/Bitbucket)

## Method 1: Git Integration (Recommended)

This is the recommended approach as it enables automatic deployments on every code push.

### Step 1: Initialize Git Repository

```bash
cd C:/Users/PC/himanshu-ai-filmmaker-portfolio
git init
git add .
git commit -m "Initial commit - Himanshu AI Filmmaker Portfolio"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `himanshu-ai-filmmaker-portfolio`
3. Do NOT initialize with README (we already have one)
4. Copy the repository URL

### Step 3: Push to GitHub

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Step 4: Deploy on Cloudflare Pages

1. Log in to Cloudflare Dashboard: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Click **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select the `himanshu-ai-filmmaker-portfolio` repository
6. Configure build settings:
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave blank)
7. Click **Save and Deploy**

Cloudflare will build and deploy your site. The first build takes 2-3 minutes.

### Step 5: Get Your Live URL

After deployment completes, you'll receive a URL like:
- `himanshu-ai-filmmaker-portfolio.pages.dev`

You can customize the subdomain in Project Settings.

## Method 2: Direct Upload via Wrangler CLI

If you prefer not to use Git integration:

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens a browser window for authentication.

### Step 3: Deploy

```bash
cd C:/Users/PC/himanshu-ai-filmmaker-portfolio
npm run build
wrangler pages deploy dist --project-name=himanshu-ai-filmmaker
```

Your site will be deployed to `himanshu-ai-filmmaker.pages.dev`

## Method 3: Dashboard Direct Upload

1. Build the project locally:
   ```bash
   cd C:/Users/PC/himanshu-ai-filmmaker-portfolio
   npm run build
   ```

2. Log in to Cloudflare Dashboard
3. Navigate to **Workers & Pages** → **Create application** → **Pages**
4. Click **Upload assets**
5. Name your project: `himanshu-ai-filmmaker`
6. Drag and drop the entire `dist` folder or click to browse
7. Click **Deploy site**

**Note**: This method requires manual upload for every update.

## Post-Deployment Checklist

### 1. Verify Contact Details

Before sharing the site publicly, update `src/config/contact.ts` with your actual contact information:

```typescript
export const CONTACT_CONFIG = {
  PHONE_NUMBER: '+91 XXXXXXXXXX',
  EMAIL_ADDRESS: 'your.email@example.com',
  INSTAGRAM_URL: 'https://instagram.com/yourusername',
  YOUTUBE_URL: 'https://youtube.com/@yourchannel',
  LINKEDIN_URL: 'https://linkedin.com/in/yourprofile',
};
```

Then rebuild and redeploy.

### 2. Test All Functionality

- [ ] Hero section loads correctly
- [ ] Navigation works on mobile and desktop
- [ ] All portfolio videos play correctly
- [ ] Category filtering functions properly
- [ ] Contact links work (once configured)
- [ ] Page is responsive on mobile devices
- [ ] Scroll animations work smoothly

### 3. Performance Optimization

Once live, check performance:
- Visit https://pagespeed.web.dev/
- Enter your Cloudflare Pages URL
- Review suggestions and implement improvements

### 4. Custom Domain (Optional)

To use a custom domain like `himanshu.com`:

1. In Cloudflare Pages project settings
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Follow the DNS configuration instructions
5. SSL certificate is automatically provisioned

## Video Hosting Recommendations

For production, consider moving videos to external hosting:

### Option A: YouTube (Free)
- Upload videos as unlisted
- Embed using YouTube player
- Bandwidth: Unlimited
- Drawback: YouTube branding

### Option B: Cloudflare Stream (Paid)
- $1 per 1,000 minutes stored
- $1 per 1,000 minutes delivered
- No branding, custom player
- URL: https://dash.cloudflare.com/?to=/:account/stream

### Option C: Vimeo (Free/Paid)
- Free tier: 500 MB/week upload
- Pro tier: $20/month for more storage
- Clean, professional player

## Build Errors & Troubleshooting

### Build fails with "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Videos not loading
- Check file paths in `src/data/projects.ts`
- Ensure videos are in `public/videos/` directory
- Verify video format is MP4 (most compatible)

### Contact section shows setup note
- This is expected if contact details are not configured
- Update `src/config/contact.ts` and rebuild

### Site loads blank page
- Check browser console for errors
- Verify all components are properly exported
- Ensure build completed successfully

## Updating the Site

### With Git Integration
```bash
# Make your changes
git add .
git commit -m "Describe your changes"
git push
```
Cloudflare automatically rebuilds and deploys.

### With Wrangler CLI
```bash
npm run build
wrangler pages deploy dist --project-name=himanshu-ai-filmmaker
```

### With Dashboard Upload
Rebuild locally and re-upload the `dist` folder.

## Environment Variables

If you need environment variables (API keys, etc.):

1. In Cloudflare Pages project settings
2. Go to **Settings** → **Environment variables**
3. Add variables for Production and Preview environments

## Cloudflare Analytics

Cloudflare provides free analytics:
1. Go to your Pages project
2. Click **Analytics** tab
3. View page views, visitor counts, and bandwidth usage

## Cost Estimation

Cloudflare Pages free tier includes:
- **Builds**: 500 builds/month
- **Bandwidth**: Unlimited
- **Requests**: Unlimited
- **Custom domains**: Yes
- **SSL**: Automatic

Your current site (~32 MB videos) is well within free tier limits.

## Support

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Community Forum: https://community.cloudflare.com/
- Vite Docs: https://vitejs.dev/
- React Docs: https://react.dev/

## Security Notes

- Never commit sensitive data (API keys, passwords) to Git
- Use environment variables for secrets
- Keep dependencies updated: `npm outdated` and `npm update`
- Review `npm audit` warnings periodically
