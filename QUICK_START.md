# Quick Start - Mockup Hosting

## TL;DR Setup (Do This Now)

### 1. Create GitHub Repo
- Go to https://github.com/new
- Name: `mockup-hosting`
- Create repository

### 2. Push Code to GitHub
```bash
cd ~/mockup-hosting

# Set your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/mockup-hosting.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel (When You're Home)
```bash
# Install Vercel CLI
npm install -g vercel

# Login (opens browser)
vercel login

# Deploy
vercel --prod
```

Vercel will ask:
- Link to GitHub repo? → Yes
- Set as production? → Yes
- Automatically deploy on push? → Yes

You'll get a URL like: `https://mockup-hosting.vercel.app/`

## How It Works

### Generate a Mockup
```bash
cd ~/business-prospector
python -c "from business_prospector.mockup_sender import generate_mockup_for_business; generate_mockup_for_business(123)"
```
Creates: `~/business-prospector/data/mockups/123_business-name.html`

### Deploy to Web
```bash
cd ~/mockup-hosting
git add .
git commit -m "Add new mockup"
git push
```

Vercel automatically:
1. Runs `npm run build`
2. Copies mockups from business-prospector
3. Deploys to edge

### View Live Mockup
```
https://mockup-hosting.vercel.app/m/business-name/
```

## Directory Structure

```
~/mockup-hosting/
├── public/m/                  ← Mockups go here
│   ├── joes-pizza/
│   │   └── index.html        ← Auto-copied from business-prospector
│   └── manifest.json         ← Auto-generated index
├── scripts/
│   └── build-mockups.js      ← Runs during build
└── vercel.json               ← Deployment config
```

## Common Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# View build output
npm run start

# Test mockup copy script
npm run build:mockups

# Check manifest
cat public/m/manifest.json
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No mockups deployed | Ensure mockups exist in `~/business-prospector/data/mockups/` |
| Build fails | Check Vercel logs: Vercel Dashboard → Deployments |
| Can't push to GitHub | Run `git remote add origin https://github.com/USERNAME/mockup-hosting.git` |
| Mockups showing 404 | Run `npm run build:mockups` locally, then push |

## Next: Production Features

Once deployed, you can:

1. **Custom Domain**
   - Vercel Dashboard → Domains
   - Point `mockups.yourdomain.com` → Vercel

2. **Environment Variables** (if needed)
   - Vercel Dashboard → Settings → Environment Variables

3. **Analytics**
   - Check `public/m/manifest.json` to see deployed mockups
   - Vercel provides traffic analytics

4. **Auto-Screenshots**
   - Integrate mockup generator to also upload PNG thumbnails
   - Store in `public/m/{slug}/preview.png`

## File Locations

| What | Where |
|------|-------|
| Source mockups | `~/business-prospector/data/mockups/` |
| Deployed mockups | `~/mockup-hosting/public/m/` |
| Build script | `~/mockup-hosting/scripts/build-mockups.js` |
| Deployment config | `~/mockup-hosting/vercel.json` |
| GitHub repo | https://github.com/USERNAME/mockup-hosting |
| Live site | https://mockup-hosting.vercel.app |

---

**Status:** ✅ Ready to push to GitHub and deploy to Vercel
