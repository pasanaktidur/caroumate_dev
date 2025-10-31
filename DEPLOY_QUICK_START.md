# 🚀 Quick Deploy to Netlify

Super quick guide to get your app live in 10 minutes!

## ⚡ Option 1: Netlify Dashboard (Easiest - 10 minutes)

### Step 1: Build Your App ✓
Already done! Your `dist` folder is ready.

### Step 2: Go to Netlify
1. Open https://app.netlify.com
2. Sign in (or create free account)

### Step 3: Deploy
**Drag & Drop Method:**
1. Drag the entire `dist` folder to Netlify
2. Wait 30 seconds
3. Your site is live! 🎉

**OR Git Method:**
1. Click "Add new site" → "Import an existing project"
2. Connect your Git repository
3. Netlify auto-detects settings from `netlify.toml`
4. Click "Deploy site"

### Step 4: Add Environment Variables
In Netlify dashboard → Site settings → Environment variables → Add variables:

**Copy these exactly:**

```
VITE_SUPABASE_URL
[Your Supabase project URL from Dashboard]

VITE_SUPABASE_ANON_KEY
[Your Supabase anon/public key from Dashboard]

VITE_CLERK_PUBLISHABLE_KEY
[Your Clerk publishable key from Dashboard]

GEMINI_API_KEY
[Replace with your actual Gemini API key - NOT the placeholder]
```

### Step 5: Redeploy (If using Git)
- Trigger redeploy in Netlify dashboard
- Or push new commit to trigger auto-deploy

### Step 6: Test Your Site ✓
- Click your Netlify URL
- Test login with Clerk
- Create a carousel
- Verify it saves to Supabase

## ⚡ Option 2: Netlify CLI (Advanced - 5 minutes)

### Prerequisites
```bash
npm install -g netlify-cli
```

### Deploy Commands

```bash
# 1. Login
netlify login

# 2. Deploy (first time)
netlify deploy --prod

# Follow prompts:
# - Create new site
# - Choose dist folder
# - Confirm

# 3. Set environment variables
netlify env:set VITE_SUPABASE_URL "your-supabase-project-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-supabase-anon-key"
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "your-clerk-publishable-key"
netlify env:set GEMINI_API_KEY "your-actual-api-key"

# 4. Redeploy with env vars
netlify deploy --prod
```

## 🔄 Continuous Deployment

### Setup Git (if not done)
```bash
git init
git add .
git commit -m "Ready for deployment"
```

### Push to GitHub
```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/yourusername/caroumate.git
git branch -M main
git push -u origin main
```

### Connect to Netlify
- Netlify dashboard → Import project
- Auto-deploys on every push!

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Site loads without errors
- [ ] Login with Clerk works
- [ ] Create test carousel
- [ ] Check Supabase dashboard for data
- [ ] Test on mobile device
- [ ] Update Clerk dashboard with production domain
- [ ] Share your live URL! 🎉

## 🐛 Quick Troubleshooting

**Blank page?**
- Check browser console (F12)
- Verify environment variables in Netlify

**Login doesn't work?**
- Add Netlify domain to Clerk dashboard
- Check VITE_CLERK_PUBLISHABLE_KEY

**Data not saving?**
- Verify Supabase credentials
- Check database migration was run

## 📱 Update Clerk for Production

1. Go to https://dashboard.clerk.com
2. Navigate to your application
3. Go to **Domains** section
4. Add your Netlify domain (e.g., `your-app.netlify.app`)
5. Save changes

## 🎯 Your Site is Live!

**Default URL format:**
```
https://random-name-123456.netlify.app
```

**Custom domain (optional):**
- Netlify dashboard → Domain settings
- Add your domain
- Follow DNS instructions

## 📊 Monitor Your Deployment

- **Build logs**: Netlify dashboard → Deploys
- **Analytics**: Netlify dashboard → Analytics
- **Errors**: Browser console + Supabase logs

## 💡 Pro Tips

1. **Preview Deploys**: Every Git branch gets a preview URL
2. **Rollback**: Click any previous deploy to restore
3. **Environment**: Separate env vars for preview vs production
4. **Performance**: Use Netlify Analytics to monitor

---

**Need more details?** Check `NETLIFY_DEPLOYMENT.md` for comprehensive guide.

**Ready to deploy?** Let's go! 🚀
