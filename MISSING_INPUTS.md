# Missing Inputs & Next Steps

This document lists assets and information still needed to complete the portfolio.

## 🚨 Critical (Needed Before Public Launch)

### Contact Information
**File**: `src/config/contact.ts`

Current status: All fields empty

Please provide:
- [ ] Phone number (include country code, e.g., +91 9876543210)
- [ ] Professional email address
- [ ] Instagram profile URL
- [ ] YouTube channel URL
- [ ] LinkedIn profile URL

**How to update**:
```typescript
// Edit src/config/contact.ts
export const CONTACT_CONFIG = {
  PHONE_NUMBER: '+91 YOUR_NUMBER',
  EMAIL_ADDRESS: 'your.email@example.com',
  INSTAGRAM_URL: 'https://instagram.com/yourusername',
  YOUTUBE_URL: 'https://youtube.com/@yourchannel',
  LINKEDIN_URL: 'https://linkedin.com/in/yourprofile',
};
```

Then run: `npm run build` and redeploy.

## 🎬 High Priority (For Complete Portfolio)

### 1. Professional Photograph
**Location**: `public/images/about-photo.jpg` (recommended)

- High-quality professional portrait
- Resolution: Minimum 800x1000px (3:4 aspect ratio)
- Format: JPG or PNG
- Style: Professional, well-lit, neutral background preferred

**How to add**:
1. Place image in `public/images/about-photo.jpg`
2. Edit `src/components/About.tsx`, line ~8, replace placeholder with:
   ```tsx
   <img src="/images/about-photo.jpg" alt="Himanshu Malviya" />
   ```

### 2. Showreel Video
**Location**: `public/videos/showreel.mp4` (recommended)

- Duration: 60-90 seconds recommended
- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 (Full HD)
- Max file size: Under 25 MB for Cloudflare Pages

**How to add**:
1. Place video in `public/videos/showreel.mp4`
2. Edit `src/components/Hero.tsx`, line ~9, update `onWatchShowreel` function
3. Or add to `src/data/projects.ts` as a featured overview project

### 3. Video Thumbnails (Better Quality)
**Location**: `public/images/`

Current status: Placeholder SVG files

**Recommended**: Extract actual frames from videos using FFmpeg:
```bash
ffmpeg -i input_video.mp4 -ss 00:00:03 -vframes 1 -q:v 2 thumbnail.jpg
```

Replace the placeholder thumbnails with actual video frames for professional appearance.

## 🎨 Medium Priority (Enhanced Features)

### 4. 3D Character Model (Optional but Featured)
**Location**: `public/models/character.glb` (recommended)

The portfolio was designed to feature an animated 3D character. If you want this feature:

**Option A**: Provide a rigged GLB/GLTF model
- Format: GLB (preferred) or GLTF
- Rigging: Basic skeleton or blend shapes
- Polycount: Under 50k triangles for web performance
- Texture size: Max 2048x2048

**Option B**: Character creation services
- ReadyPlayer.me (free): https://readyplayer.me/
- Mixamo (free): https://www.mixamo.com/
- Commission from 3D artist

**How to integrate**: Contact me or update the Hero component to load the 3D model.

### 5. Additional Portfolio Categories

The following categories exist but are empty:

#### AI Films
**Status**: No projects yet

Recommended content:
- Short AI-generated narrative films
- Experimental storytelling projects
- Concept demonstrations

#### Microdramas
**Status**: Raw footage exists (`C:/Users/PC/Videos/Raw Video/`) but not processed

Found files:
- Father bol rhe h.mp4
- First Scean.mp4
- Second scean (multiple takes)
- Parents discussing/reacting scenes

**Action needed**: Edit and export final microdrama episodes

#### Overview Videos
**Status**: No projects yet

Suggested content:
- Project overviews
- Portfolio summary reels
- Behind-the-scenes montages

#### Filmmaking Breakdowns
**Status**: No projects yet

Suggested content:
- Step-by-step creation process
- Before/after comparisons
- Technique demonstrations
- Prompt engineering walkthroughs

#### Behind the Scenes
**Status**: No projects yet

Suggested content:
- Workflow recordings
- Screen captures of generation process
- Commentary on creative decisions

#### AI Experiments
**Status**: No projects yet

Suggested content:
- Style exploration
- Tool comparisons
- Failed attempts (for educational value)
- Novel technique discoveries

### 6. Project Credits & Tools

For each portfolio piece, consider adding:
- AI tools used (e.g., "Runway Gen-2", "Midjourney", "Pika Labs")
- Collaboration credits (if any)
- Project timeline/duration
- Client name (if applicable and permitted)

**How to add**: Edit `src/data/projects.ts`, add `credits` and `tools` fields.

## 📝 Low Priority (Nice to Have)

### 7. Favicon
**Location**: `public/favicon.ico` or `public/favicon.svg`

Current: Using default Vite logo

**How to create**:
- Use online favicon generator (e.g., favicon.io)
- Or create a simple logo representing "H" for Himanshu
- Format: ICO, SVG, or PNG

### 8. Meta Image for Social Sharing
**Location**: `public/og-image.jpg`

When shared on social media, a preview image appears.

**Recommended**: Create 1200x630px image with:
- Your name "HIMANSHU"
- Tagline "AI Filmmaker"
- One strong visual from your work

**How to add**: Update `index.html` meta tags:
```html
<meta property="og:image" content="/og-image.jpg" />
```

### 9. About Section Enhancements

Consider adding (only if accurate):
- Year you started AI filmmaking
- Notable collaborations (if any)
- Press mentions or features (if any)
- Education/certifications (if relevant)

**Update location**: `src/components/About.tsx`

### 10. Journey Timeline Dates

Current timeline uses generic years. If you have specific dates for milestones:
- First AI video created
- First client project
- Notable achievements

**Update location**: `src/components/Journey.tsx`

## ✅ How to Update and Redeploy

After adding any assets or making changes:

```bash
# 1. Navigate to project
cd C:/Users/PC/himanshu-ai-filmmaker-portfolio

# 2. Test locally
npm run dev
# Visit http://localhost:3000 and verify changes

# 3. Build for production
npm run build

# 4. Deploy (if using Git)
git add .
git commit -m "Add missing assets and contact details"
git push

# 4. Deploy (if using Wrangler)
wrangler pages deploy dist --project-name=himanshu-ai-filmmaker
```

## 📞 Questions?

If you need help with any of these items:
1. Check README.md for documentation
2. Check DEPLOYMENT_GUIDE.md for deployment help
3. Refer to code comments in source files
