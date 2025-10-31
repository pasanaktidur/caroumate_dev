# Supabase Database Setup Guide

This guide will help you set up Supabase database for the Caroumate application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Clerk authentication already configured

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Name: `caroumate` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
4. Wait for the project to be created (~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Open your `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration
6. You should see a success message

## Step 5: Verify Database Setup

After running the migration, verify that all tables were created:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `users`
   - `user_settings`
   - `user_stats`
   - `carousels`
   - `slides`

## Step 6: Configure Clerk Integration (Optional but Recommended)

To automatically sync Clerk users with Supabase:

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Enable "Custom" provider
3. The application will automatically sync users when they sign in via Clerk

## Database Schema Overview

### Tables

- **users**: Stores user profiles synced from Clerk
- **user_settings**: Stores user preferences (AI model, API keys, brand kit)
- **user_stats**: Tracks download counts and carousel counts
- **carousels**: Stores carousel metadata
- **slides**: Stores individual slide content for each carousel

### Security

The database uses Row Level Security (RLS) policies to ensure:
- Users can only access their own data
- Authentication is handled via Clerk JWT tokens
- All operations are scoped to the authenticated user

## Features Enabled

✅ **Data Persistence**: All user data is stored in the cloud
✅ **Multi-Device Sync**: Access your carousels from any device
✅ **Automatic Backups**: Supabase handles database backups
✅ **Real-time Updates**: Changes sync instantly (if implemented)
✅ **Secure Access**: Row-level security protects user data

## Troubleshooting

### "Failed to load user data" error
- Verify your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check that the migration ran successfully
- Ensure RLS policies are enabled

### Data not saving
- Check browser console for errors
- Verify you're signed in via Clerk
- Check Supabase logs in the dashboard (Logs section)

### Migration errors
- Make sure you copied the entire SQL file
- Check for syntax errors in the SQL editor
- Try running the migration in smaller chunks if needed

## Local Development vs Production

For local development, you can use the same Supabase project. For production:

1. Create a separate Supabase project for production
2. Run the same migration script
3. Update your production environment variables

## Data Migration from localStorage (Optional)

If you have existing data in localStorage that you want to migrate:

1. The application will continue to work with localStorage if Supabase is not configured
2. Once Supabase is configured, you can manually export/import data
3. A migration script can be created if needed

## Support

For issues with:
- **Supabase**: Check https://supabase.com/docs
- **Clerk Integration**: Check https://clerk.com/docs
- **Application**: Contact the development team

## Next Steps

After completing the setup:

1. Restart your development server
2. Sign in to the application via Clerk
3. Create a test carousel to verify data is being saved
4. Check the Supabase dashboard to see the data in the tables

Your Supabase database is now configured and ready to use! 🎉
