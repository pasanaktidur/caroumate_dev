# 🚀 Deployment Guide

## Quick Deploy to Netlify

### Prerequisites
- GitHub repository: `github.com/pasanaktidur/caroumate_dev`
- Netlify account
- Environment variables ready

### Step 1: Connect Repository

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select repository: `pasanaktidur/caroumate_dev`

### Step 2: Configure Build Settings

Netlify will auto-detect from `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist`

### Step 3: Add Environment Variables

**IMPORTANT**: Add these in Netlify dashboard → Site settings → Environment variables

You need 4 variables (get values from your local `.env.local` file):

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`
3. `VITE_CLERK_PUBLISHABLE_KEY`
4. `GEMINI_API_KEY` (use your real API key, not placeholder)

### Step 4: Deploy

Click "Deploy site" and wait 2-3 minutes.

### Step 5: Post-Deployment

1. **Update Clerk Dashboard**
   - Add your Netlify domain to allowed domains
   - Example: `your-app.netlify.app`

2. **Test Your Site**
   - User registration/login
   - Create carousel
   - Verify Supabase data saves

## Troubleshooting

### Secrets Scan Error

If you see "potentially exposed secrets":
- Ensure environment variables are set in Netlify dashboard (not in code)
- Clear Netlify cache: Site settings → Build & deploy → Clear cache
- Redeploy

### Build Fails

- Check Netlify deploy logs
- Verify Node.js version (18)
- Ensure all dependencies installed

### Environment Variables Not Working

- Variable names are case-sensitive
- No quotes needed in Netlify UI
- Trigger new deploy after adding variables

## Updates

To update your site:
```bash
git add .
git commit -m "Your changes"
git push
```

Netlify will auto-deploy on every push to `main` branch.

---

**Note**: Documentation files are excluded from git to prevent false positive secrets detection by Netlify scanner. All files remain available locally.
