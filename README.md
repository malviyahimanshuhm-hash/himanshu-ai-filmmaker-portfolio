# Himanshu - AI Filmmaker Portfolio

A premium cinematic portfolio website for Himanshu Malviya — AI Filmmaker & Creative Director.

**Tagline:** My Frames. My Stories. My Direction.  
**Mission:** Building the Future of Indian Cinema with AI.

## ✨ Features

- **Cinematic 3D Hero** — Stylized 3D filmmaker character with GSAP scroll animations
- **Video Showreel** — Auto-playing, paused video previews with manual controls
- **Project Management** — Admin dashboard with CRUD operations
- **Responsive Design** — Mobile-first with reduced-motion support
- **Dark Theme** — Film-inspired cinematic aesthetic with amber rim lighting

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **3D:** Three.js + React Three Fiber
- **Animation:** GSAP + ScrollTrigger
- **UI:** Tailwind CSS
- **Database/Auth:** Supabase
- **Media:** Cloudinary
- **Routing:** React Router v6

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

## ⚙️ Configuration

### Local Demo Mode (No credentials required)

The project runs in **mock mode** locally with demo data:

- Site works immediately without any external credentials
- Admin login accepts any email/password
- All projects use placeholder assets

### Production Setup

To use real services, create a `.env` file from `.env.example`:

```bash
# Database & Auth
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Media Upload (Cloudinary)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## 🔐 Environment Variables

See `.env.example` for all available configuration options.

## 🏗️ Project Structure

```
src/
├── App.tsx                    # Main router
├── main.tsx                   # React entry point
├── components/                # Reusable UI components
│   ├── Hero3D.tsx             # 3D cinematic character
│   ├── Showreel.tsx           # Video preview grid
│   ├── VideoModal.tsx         # Video player modal
│   ├── Work.tsx               # Project listing
│   └── Navigation.tsx         # Sticky navigation
├── pages/                     # Route pages
│   ├── HomePage.tsx           # Public portfolio
│   ├── AdminDashboardPage.tsx # Admin panel
│   ├── AdminLoginPage.tsx     # Auth screen
│   └── ProjectDetailPage.tsx  # Single project view
├── lib/                       # External service clients
│   ├── supabase.ts            # Supabase client + mock mode
│   ├── cloudinary.ts          # Cloudinary upload helpers
│   └── mockData.ts            # Demo project data
├── types/                     # TypeScript definitions
│   └── project.ts             # Project type + categories
└── styles/                    # Global styles
    └── globals.css            # Tailwind + cinematic theme
```

## 📊 Database Schema

See `supabase/migrations/001_create_projects_table.sql` for the complete schema.

Table: `projects`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Project identifier |
| title | text | Display title |
| slug | text | URL slug |
| category | text | ai-films, microdramas, etc. |
| description | text | Full description |
| thumbnail | text | Cloudinary thumbnail URL |
| video | text | Preview video URL |
| year | integer | Release year |
| role | text | Your contribution |
| credits | json | Cast/Crew details |
| featured | boolean | Show in hero |
| publish_status | text | draft/published |

## 🌐 Admin Dashboard

Protected routes:
- `/admin` → `/admin/login` (authentication)
- `/admin/dashboard` (project management)
- `/admin/projects/[slug]/edit` (edit project)

**Local Mock Mode:** Any email/password works.

## 📦 Build Commands

```bash
npm run build      # Production build
npm run preview    # Preview build locally
npm run type-check # TypeScript type check
```

## 🚀 Deployment (Free Tiers)

### Cloudflare Pages

1. Push code to GitHub
2. Create new Cloudflare Pages project
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables in Pages settings
6. Configure redirect for `/admin/*` routes (SPA fallback)

### Supabase Edge Functions

For Cloudinary uploads, deploy the edge function:

```bash
supabase functions deploy cloudinary-upload
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🎨 Design Notes

- Dark cinematic theme with `#0a0a0a` background
- Warm amber highlights (`#d4af37`)
- Film grain overlays
- Letterbox framing on hero
- Subtle parallax and scroll animations
- Reduced-motion accessible

## 📸 3D Character Placeholder

The hero features a simple geometric filmmaker character. To replace with your own model:

1. Export your GLB model
2. Upload to Cloudinary or your CDN
3. Replace the `<FilmmakerCharacter />` component in `Hero3D.tsx`:

```tsx
// Replace geometry with GLB model
const FilmmakerCharacter = () => {
  const { scene } = useGLTF('/path/to/your/model.glb');
  return <primitive object={scene} />;
};
```

## 🧪 Testing Status

| Test | Status |
|------|--------|
| TypeScript | ✓ No errors |
| Build | ✓ Successful |
| Dev Server | ✓ Running |
| Navigation | ✓ Working |
| Admin Login | ✓ Mock mode works |
| Routes | ✓ All sections render |

## ⚠️ Missing Configuration

Before production, you need:

- [ ] Supabase project created
- [ ] Supabase URL & anon key
- [ ] Cloudinary cloud name
- [ ] Cloudinary upload preset
- [ ] Real project media (videos/thumbnails)
- [ ] Updated 3D character model

## 📄 Files Included

- `README.md` — This file
- `.env.example` — Environment variables template
- `supabase/migrations/001_create_projects_table.sql` — Database schema
- `supabase/functions/cloudinary-upload/` — Upload authorization function
- `DEPLOYMENT_GUIDE.md` — Detailed deployment instructions
- `ASSET_INVENTORY.md` — Asset tracking
- `MISSING_INPUTS.md` — Content that needs to be added

## 👤 Author

**Himanshu Malviya**  
AI Filmmaker & Creative Director  
Building the Future of Indian Cinema with AI

---

*Built with ❤️ using React, Three.js, and GSAP*
