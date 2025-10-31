# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Google Login / Clerk Authentication Not Working

#### Symptoms:
- Clicking login button does nothing
- No popup appears
- Console shows Clerk errors

#### Solution:
✅ **FIXED** - ClerkProvider was added to wrap the App component.

**Verification:**
1. Open browser console (F12)
2. Look for error: "Missing Clerk Publishable Key"
3. Check `.env.local` has `VITE_CLERK_PUBLISHABLE_KEY`

**For Netlify deployment:**
- Ensure `VITE_CLERK_PUBLISHABLE_KEY` is set in Netlify environment variables
- Check Clerk dashboard → Your app → API Keys
- Add Netlify domain to Clerk allowed domains

---

### 2. Netlify Secrets Scan Error

#### Symptoms:
- Build fails with "potentially exposed secrets"
- Error mentions API_KEY or GEMINI_API_KEY

#### Solution:
✅ **FIXED** - Documentation files with example keys removed from git.

**If still occurring:**
1. Clear Netlify cache: Site settings → Build & deploy → Clear cache
2. Verify no hardcoded API keys in source code
3. Check environment variables are set in Netlify (not in code)

---

### 3. Environment Variables Not Loading

#### Symptoms:
- App shows "API key not configured"
- Features don't work
- Console errors about missing env vars

#### Solution:

**Local Development:**
1. Check `.env.local` file exists in project root
2. Verify format:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   GEMINI_API_KEY=your-api-key
   ```
3. Restart dev server: `npm run dev`

**Netlify Deployment:**
1. Go to Site settings → Environment variables
2. Add all 4 required variables
3. Trigger new deploy

**Important**: Only `VITE_*` prefixed variables are exposed to client!

---

### 4. Blank Page After Deployment

#### Symptoms:
- Site loads but shows blank white page
- No error messages visible

#### Solution:
1. Open browser console (F12)
2. Check for errors
3. Common causes:
   - Missing environment variables
   - Build failed but deployed anyway
   - JavaScript errors

**Fix:**
```bash
# Rebuild locally first
npm run build
npm run preview

# If works locally but not on Netlify:
# - Clear Netlify cache
# - Check deploy logs
# - Verify environment variables
```

---

### 5. Supabase Connection Errors

#### Symptoms:
- "Failed to load user data"
- Carousel doesn't save
- Console shows Supabase errors

#### Solution:
1. Check Supabase project is active (not paused)
2. Verify credentials in `.env.local` or Netlify env vars
3. Run database migration:
   - Supabase dashboard → SQL Editor
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Execute

---

### 6. Build Fails Locally

#### Symptoms:
- `npm run build` fails
- TypeScript errors
- Module not found errors

#### Solution:
```bash
# Clean install
rm -rf node_modules package-lock.json dist
npm install

# Try build again
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

---

### 7. Clerk Domain Not Configured

#### Symptoms:
- Login works locally but not on deployed site
- CORS errors in console
- "Invalid origin" error

#### Solution:
1. Go to https://dashboard.clerk.com
2. Navigate to your application
3. Go to **Domains** section
4. Add your Netlify domain:
   - Format: `https://your-app.netlify.app`
   - Or custom domain if you have one
5. Save changes
6. Wait 1-2 minutes for propagation

---

### 8. Carousel Generation Fails

#### Symptoms:
- "AI returned invalid content"
- Generation hangs
- API errors

#### Solution:
1. **Check Gemini API Key:**
   - Verify not using "PLACEHOLDER_API_KEY"
   - Get real key from https://makersuite.google.com/app/apikey
   - Check key has quota remaining

2. **For Netlify:**
   - Ensure `GEMINI_API_KEY` is set (no VITE_ prefix)
   - Redeploy after adding

3. **Test API key locally:**
   ```bash
   # Open browser console
   # Try generating a carousel
   # Check Network tab for API response
   ```

---

### 9. Images/Videos Not Generating

#### Symptoms:
- Visual generation button doesn't work
- Timeout errors
- Empty image slots

#### Solution:
1. Check Gemini API key is valid
2. Verify internet connection
3. Try with simpler prompts
4. Check browser console for specific errors

**Known limitation**: Video generation requires special API access.

---

### 10. Download Feature Not Working

#### Symptoms:
- Download button does nothing
- Error: "Failed to download carousel"

#### Solution:
1. Check browser allows downloads
2. Disable popup blockers for your site
3. Check console for specific errors
4. Try different browser

---

## Development Tips

### Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check TypeScript
npx tsc --noEmit

# Clear cache and reinstall
rm -rf node_modules dist .vite
npm install
```

### Check Environment Variables

**Local:**
```bash
# View current env vars (Windows)
type .env.local

# View current env vars (Mac/Linux)
cat .env.local
```

**Netlify:**
- Dashboard → Site settings → Environment variables
- Click "Edit" to view/modify

### Useful Browser DevTools Shortcuts

- **F12** - Open DevTools
- **Ctrl/Cmd + Shift + C** - Inspect element
- **Ctrl/Cmd + Shift + J** - Open Console
- **Ctrl/Cmd + Shift + M** - Toggle mobile view

---

## Still Having Issues?

### Debug Checklist

- [ ] Check browser console (F12) for errors
- [ ] Verify all environment variables are set
- [ ] Try in incognito/private window
- [ ] Test in different browser
- [ ] Check Netlify deploy logs
- [ ] Verify Supabase project is active
- [ ] Check Clerk dashboard for auth logs
- [ ] Clear browser cache and cookies
- [ ] Restart dev server

### Where to Look

1. **Browser Console** - Client-side errors
2. **Netlify Deploy Logs** - Build/deployment errors
3. **Supabase Dashboard** - Database errors
4. **Clerk Dashboard** - Authentication logs
5. **Network Tab** - API call failures

---

## Getting Help

When reporting an issue, include:
1. What you were trying to do
2. What happened (error message, screenshot)
3. Browser console errors (F12 → Console tab)
4. Environment (local dev or Netlify)
5. Steps to reproduce

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0
