# 📋 Supabase Setup Checklist

Use this checklist to set up Supabase for your Caroumate application.

## ⚡ Quick Setup (15 minutes)

### □ Step 1: Create Supabase Project (5 min)

- [ ] Go to https://supabase.com
- [ ] Sign up or log in
- [ ] Click "New Project"
- [ ] Enter project details:
  - [ ] Name: `caroumate` (or your choice)
  - [ ] Database Password: (save this securely!)
  - [ ] Region: (choose closest to you)
- [ ] Click "Create Project"
- [ ] ⏰ Wait ~2 minutes for initialization

### □ Step 2: Get API Credentials (2 min)

- [ ] In Supabase dashboard, go to **Settings** → **API**
- [ ] Copy **Project URL** (format: `https://xxxxx.supabase.co`)
- [ ] Copy **anon public** key (under "Project API keys")

### □ Step 3: Configure Environment (2 min)

- [ ] Open `.env.local` in your project root
- [ ] Replace these lines:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- [ ] Paste your actual credentials
- [ ] Save the file

### □ Step 4: Run Database Migration (3 min)

- [ ] In Supabase dashboard, go to **SQL Editor**
- [ ] Click **New Query**
- [ ] Open `supabase/migrations/001_initial_schema.sql` from your project
- [ ] Copy the entire file contents
- [ ] Paste into Supabase SQL Editor
- [ ] Click **Run** (or press Ctrl/Cmd + Enter)
- [ ] ✅ Verify "Success" message appears

### □ Step 5: Verify Database (1 min)

- [ ] In Supabase dashboard, go to **Table Editor**
- [ ] Check that these tables exist:
  - [ ] `users`
  - [ ] `user_settings`
  - [ ] `user_stats`
  - [ ] `carousels`
  - [ ] `slides`

### □ Step 6: Test Your App (2 min)

- [ ] Restart your dev server: `npm run dev`
- [ ] Sign in via Clerk
- [ ] Check for green banner: "Connected to Supabase"
- [ ] Create a test carousel
- [ ] In Supabase dashboard → **Table Editor** → **carousels**
  - [ ] ✅ Verify your carousel appears

## 🎉 Done!

Your Supabase integration is complete and working!

---

## 📚 Next Steps

Now that setup is complete:

- [ ] Read `QUICK_REFERENCE.md` for common operations
- [ ] Review `IMPLEMENTATION_GUIDE.md` for integration strategies
- [ ] Check `App.supabase.example.tsx` for implementation examples

## 🆘 Troubleshooting

### ❌ "Failed to load user data"
- Check environment variables are correct
- Verify Supabase project is active (not paused)
- Look at browser console for detailed errors

### ❌ Migration errors
- Make sure you copied the ENTIRE SQL file
- Check for any error messages in SQL Editor
- Try running migration in smaller chunks

### ❌ No data showing
- Verify you're signed in via Clerk
- Check Supabase dashboard → **Table Editor** for data
- Look at browser Network tab for failed requests

### ❌ TypeScript errors
- Run `npm install` to ensure packages are installed
- Restart your IDE/editor
- Run `npx tsc --noEmit` to check for errors

---

## 🔗 Quick Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [Full Setup Guide](./SUPABASE_SETUP.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)

---

**Estimated Time**: 15 minutes  
**Difficulty**: Easy  
**Prerequisites**: Supabase account, Clerk configured

Good luck! 🚀
